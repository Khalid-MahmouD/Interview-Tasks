import React from 'react';

const UserListItems = ({ users }) => {
  return (
    <ul style={{ listStyleType: 'none', padding: 0 }}>
      {users.map((user) => (
        <li key={user.id} style={{ margin: '10px 0' }}>
          <strong>Username:</strong> {user.username} <br />
          <strong>Account Type:</strong> {user.account.__typename}
        </li>
      ))}
    </ul>
  );
};

export default UserListItems;
