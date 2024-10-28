import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import AccountSelect from './AccountSelect';
import DeliveryAgentSelect from './DeliveryAgentSelect';

const LIST_ROLES_DROPDOWN_QUERY = gql`
  query ListRolesDropdown {
    listRolesDropdown {
      id
      code
      name
    }
  }
`;

const RoleSelect = ({ newUser, setNewUser }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const { loading, error, data } = useQuery(LIST_ROLES_DROPDOWN_QUERY);

  useEffect(() => {
    if (selectedRole) {
      const role = data.listRolesDropdown.find((role) => role.code === selectedRole);
      setNewUser((prevUser) => ({
        ...prevUser,
        roles: [role.id],
        account: role.code === 'CSTMR' ? '' : prevUser.account,
        deliveryAgent: role.code === 'DLVRY' ? '' : prevUser.deliveryAgent,
      }));
    }
  }, [selectedRole, data, setNewUser]);

  if (loading) return <p>Loading roles...</p>;
  if (error) return <p>Error fetching roles: {error.message}</p>;

  return (
    <>
      <label htmlFor="roleSelect">Role:</label>
      <select
        id="roleSelect"
        value={selectedRole || ''}
        onChange={(e) => setSelectedRole(e.target.value)}
        required
      >
        <option value="">Choose a role...</option>
        {data.listRolesDropdown.map((role) => (
          <option key={role.id} value={role.code}>
            {role.name}
          </option>
        ))}
      </select>

      {selectedRole === 'CSTMR' && <AccountSelect newUser={newUser} setNewUser={setNewUser} />}
      {selectedRole === 'DLVRY' && <DeliveryAgentSelect newUser={newUser} setNewUser={setNewUser} />}
    </>
  );
};

export default RoleSelect;
