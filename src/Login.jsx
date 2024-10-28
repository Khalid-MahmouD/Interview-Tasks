// Login.js
import React, { useState, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      token
    }
  }
`;


const Auth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRoles, setSelectedRoles] = useState('Default'); // Initialize as single value
  const [accountVisible, setAccountVisible] = useState(false); // State for Account dropdown visibility
  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);
  const navigate = useNavigate();

  // Check if token exists on mount and navigate to /list-user if it does
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/list-user'); // Redirect to ListUser component if token exists
    }
  }, [navigate]);

  const handleRoleChange = (e) => {
    const value = e.target.value;
    setSelectedRoles(value);

    // Show or hide the Account dropdown based on selected role
    if (value === 'Client' || value === 'Delivery') {
      setAccountVisible(true);
    } else {
      setAccountVisible(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: { username, password } });
      localStorage.setItem('token', data.login.token); // Store token in local storage
      navigate('/list-user'); // Navigate to ListUser component
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <br />
        

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {error && <p>Error logging in: {error.message}</p>}
    </div>
  );
};

export default Auth;
