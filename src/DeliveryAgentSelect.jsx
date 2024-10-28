import React from 'react';
import { useQuery, gql } from '@apollo/client';

const LIST_DELIVERY_AGENTS_DROPDOWN_QUERY = gql`
  query ListDeliveryAgentsDropdown {
    listDeliveryAgentsDropdown {
      id
      code
      name
    }
  }
`;

const DeliveryAgentSelect = ({ newUser, setNewUser }) => {
  const { loading, error, data } = useQuery(LIST_DELIVERY_AGENTS_DROPDOWN_QUERY, {
    skip: !newUser.roles.includes('DLVRY'), // Skip if "Delivery" role is not selected
  });

  const handleDeliveryAgentChange = (e) => {
    setNewUser((prevUser) => ({
      ...prevUser,
      deliveryAgent: e.target.value,
    }));
  };

  if (loading) return <p>Loading delivery agents...</p>;
  if (error) return <p>Error fetching delivery agents: {error.message}</p>;

  const deliveryAgentsDropdown = data?.listDeliveryAgentsDropdown || []; // Use optional chaining to avoid errors

  return (
    <>
      <label htmlFor="deliveryAgentSelect">Delivery Agent:</label>
      <select
        id="deliveryAgentSelect"
        value={newUser.deliveryAgent}
        onChange={handleDeliveryAgentChange}
        required
      >
        <option value="">Choose a delivery agent...</option>
        {deliveryAgentsDropdown.map((agent) => (
          <option key={agent.id} value={agent.id}>
            {agent.name}
          </option>
        ))}
      </select>
    </>
  );
};

export default DeliveryAgentSelect;
