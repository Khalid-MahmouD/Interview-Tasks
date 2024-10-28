import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Create an HTTP link to your GraphQL server
const httpLink = createHttpLink({
  uri: 'http://192.168.1.100:8000/graphql', // The GraphQL server URI
});

// Set up the authentication link
const authLink = setContext((_, { headers }) => {
  // Get the token from local storage
  const token = localStorage.getItem('token');

  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Create the Apollo Client with both the authLink and httpLink
const client = new ApolloClient({
  link: authLink.concat(httpLink), // Chain the auth link with the http link
  cache: new InMemoryCache(), // To efficiently manage data
});

export default client;
