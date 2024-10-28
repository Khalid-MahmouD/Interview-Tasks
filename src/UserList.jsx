import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const LIST_USERS_QUERY = gql`
  query ListUsers($active: Boolean!) {
    listUsers(input: { active: $active }) {
      paginatorInfo {
        total
      }
      data {
        id
        username
        account {
          __typename
        }
      }
    }
  }
`;

const LIST_ROLES_DROPDOWN_QUERY = gql`
  query ListRolesDropdown {
    listRolesDropdown {
      id
      code
      name
    }
  }
`;

const LIST_CUSTOMERS_DROPDOWN_QUERY = gql`
  query ListCustomersDropdown {
    listCustomersDropdown {
      id
      code
      name
    }
  }
`;

const LIST_DELIVERY_AGENTS_DROPDOWN_QUERY = gql`
  query ListDeliveryAgentsDropdown {
    listDeliveryAgentsDropdown {
      id
      code
      name
    }
  }
`;

const SAVE_USER_MUTATION = gql`
  mutation SaveUser($input: UserInput!) {
    saveUser(input: $input) {
      id
      username
    }
  }
`;

const UserList = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    roles: [],
    accountId: 110,
    active: true,
    branches: [],
    account: '',
    deliveryAgent: '', // Added deliveryAgent to state
  });
  const [selectedRole, setSelectedRole] = useState(null);

  const { loading: usersLoading, error: usersError, data, refetch } = useQuery(LIST_USERS_QUERY, {
    variables: { active: true },
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const { loading: rolesLoading, error: rolesError, data: rolesData } = useQuery(LIST_ROLES_DROPDOWN_QUERY, {
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const { loading: accountsLoading, error: accountsError, data: accountsData } = useQuery(LIST_CUSTOMERS_DROPDOWN_QUERY, {
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    skip: selectedRole !== 'CSTMR', // Only fetch if "Customer" role is selected
  });

  const { loading: deliveryLoading, error: deliveryError, data: deliveryData } = useQuery(LIST_DELIVERY_AGENTS_DROPDOWN_QUERY, {
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    skip: selectedRole !== 'DLVRY', // Only fetch if "Delivery" role is selected
  });

  const [saveUser] = useMutation(SAVE_USER_MUTATION, {
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      refetch();
      setShowForm(false);
      setNewUser({
        username: '',
        password: '',
        roles: [],
        accountId: 110,
        active: true,
        branches: [],
        account: '',
        deliveryAgent: '', // Reset deliveryAgent
      });
    },
    onError: (error) => {
      console.error("Error creating user:", error);
    },
  });

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    saveUser({ variables: { input: newUser } });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleRoleChange = (e) => {
    const selectedRoleId = parseInt(e.target.value);
    const role = rolesData.listRolesDropdown.find((role) => role.id === selectedRoleId);

    setSelectedRole(role ? role.code : null);

    setNewUser((prevUser) => {
        const newRoles = prevUser.roles.includes(selectedRoleId)
            ? prevUser.roles // Retain existing roles if the selected one is already included
            : [...prevUser.roles, selectedRoleId]; // Add new role

        return {
            ...prevUser,
            roles: newRoles,
            account: role?.code === 'CSTMR' ? '' : prevUser.account, // Reset account if not a customer
            deliveryAgent: role?.code === 'DLVRY' ? '' : prevUser.deliveryAgent, // Reset delivery agent if not a delivery role
        };
    });
};


  const handleAccountChange = (e) => {
    const selectedAccountId = e.target.value;
    setNewUser((prevUser) => ({
      ...prevUser,
      account: selectedAccountId,
    }));
  };

  const handleDeliveryAgentChange = (e) => {
    const selectedDeliveryAgentId = e.target.value;
    setNewUser((prevUser) => ({
      ...prevUser,
      deliveryAgent: selectedDeliveryAgentId,
    }));
  };

  if (usersLoading || rolesLoading || (selectedRole === 'CSTMR' && accountsLoading) || (selectedRole === 'DLVRY' && deliveryLoading)) {
    return <p>Loading...</p>;
  }

  if (usersError || rolesError || accountsError || deliveryError) {
    return <p>Error fetching data: {usersError?.message || rolesError?.message || accountsError?.message || deliveryError?.message}</p>;
  }

  return (
    <div>
      <h2>Active Users</h2>
      <p>Total Users: {data.listUsers.paginatorInfo.total}</p>

      <button onClick={() => setShowForm((prev) => !prev)}>
        {showForm ? 'Cancel' : 'Add New User'}
      </button>

      {showForm && (
        <form onSubmit={handleFormSubmit} style={{ marginTop: '20px' }}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={newUser.username}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={newUser.password}
            onChange={handleInputChange}
            required
          />
          <br />

          {/* Role Dropdown */}
          <label htmlFor="roleSelect">Role:</label>
          <select
            id="roleSelect"
            name="roles"
            value={newUser.roles[0] || ''}
            onChange={handleRoleChange}
            required
          >
            <option value="">Choose a role...</option>
            {rolesData.listRolesDropdown.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>

          {/* Account Dropdown - Only show if "Customer" role is selected */}
          {selectedRole === 'CSTMR' && (
            <>
              <label htmlFor="accountSelect">Account:</label>
              <select
                id="accountSelect"
                name="account"
                value={newUser.account}
                onChange={handleAccountChange}
                required
              >
                <option value="">Choose an account...</option>
                {accountsData.listCustomersDropdown.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* Delivery Agent Dropdown - Only show if "Delivery" role is selected */}
          {selectedRole === 'DLVRY' && (
            <>
              <label htmlFor="deliveryAgentSelect">Delivery Agent:</label>
              <select
                id="deliveryAgentSelect"
                name="deliveryAgent"
                value={newUser.deliveryAgent}
                onChange={handleDeliveryAgentChange}
                required
              >
                <option value="">Choose a delivery agent...</option>
                {deliveryData.listDeliveryAgentsDropdown.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </>
          )}

          <button type="submit" style={{ marginTop: '10px' }}>Save User</button>
        </form>
      )}

      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {data.listUsers.data.map((user) => (
          <li key={user.id} style={{ margin: '10px 0' }}>
            <strong>Username:</strong> {user.username} <br />
            <strong>Account Type:</strong> {user.account.__typename}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
