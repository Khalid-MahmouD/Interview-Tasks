// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './Login'; // Your login component
import UserList from './UserList'; // Your user list component
import ProtectedRoute from './ProtectedRoute'; // Import the ProtectedRoute

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route 
          path="/list-user" 
          element={
            <ProtectedRoute>
              <UserList />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;
