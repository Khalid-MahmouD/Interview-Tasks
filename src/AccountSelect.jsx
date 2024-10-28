import React from 'react';
import { useQuery, gql } from '@apollo/client';

// GraphQL query for listing customers
const LIST_CUSTOMERS_DROPDOWN_QUERY = gql`
  query ListCustomersDropdown($input: UserInput!) {
    listCustomersDropdown(input: $input) {
      id
      code
      name
    }
  }
`;

const AccountSelect = ({ newUser, setNewUser }) => {
  // Default values for the user input
  const defaultInput = {
    username: newUser.username || 'defaultUsername',
    password: newUser.password || 'defaultPassword',
    roles: newUser.roles.length > 0 ? newUser.roles : [3], // Default to customer role if none selected
    accountId: newUser.accountId || 110, // Default accountId
    active: newUser.active !== undefined ? newUser.active : true, // Default active status
    branches: newUser.branches || [], // Default branches
  };

  const token = localStorage.getItem('token');

  // Fetch the data using the defaultInput variable
  const { loading, error, data } = useQuery(LIST_CUSTOMERS_DROPDOWN_QUERY, {
    variables: { input: defaultInput }, // Use default input
    context: {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token for authentication
      },
    },
    skip: !newUser.roles.includes(3), // Skip if "Customer" role is not selected
  });

  const handleAccountChange = (e) => {
    setNewUser((prevUser) => ({
      ...prevUser,
      account: e.target.value,
    }));
  };

  // Loading and error handling
  if (loading) return <p>Loading accounts...</p>;
  if (error) return <p>Error fetching accounts: {error.message}</p>;

  const customersDropdown = data?.listCustomersDropdown || []; // Use optional chaining to avoid errors

  return (
    <>
      <label htmlFor="accountSelect">Account:</label>
      <select
        id="accountSelect"
        value={newUser.account}
        onChange={handleAccountChange}
        required
      >
        <option value="">Choose an account...</option>
        {customersDropdown.map((account) => (
          <option key={account.id} value={account.id}>
            {account.name}
          </option>
        ))}
      </select>
    </>
  );
};

export default AccountSelect;
