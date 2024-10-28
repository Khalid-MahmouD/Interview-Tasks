import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import RoleSelect from './RoleSelect';

const LIST_ROLES_DROPDOWN_QUERY = gql`
  query ListRolesDropdown {
    listRolesDropdown {
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

const UserForm = ({ refetch }) => {
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
    deliveryAgent: '',
  });

  const [saveUser] = useMutation(SAVE_USER_MUTATION, {
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      refetch();
      resetForm();
    },
    onError: (error) => {
      console.error("Error creating user:", error);
    },
  });

  const resetForm = () => {
    setNewUser({
      username: '',
      password: '',
      roles: [],
      accountId: 110,
      active: true,
      branches: [],
      account: '',
      deliveryAgent: '',
    });
    setShowForm(false);
  };

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

  return (
    <>
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
          <RoleSelect newUser={newUser} setNewUser={setNewUser} />
          <button type="submit" style={{ marginTop: '10px' }}>Save User</button>
        </form>
      )}
    </>
  );
};

export default UserForm;
