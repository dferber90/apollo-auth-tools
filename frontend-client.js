const Cookies = require("cookies-js");
const { ApolloClient } = require("apollo-client");
const { ApolloLink } = require("apollo-link");
const { HttpLink } = require("apollo-link-http");
const { InMemoryCache } = require("apollo-cache-inmemory");
const { onError } = require("apollo-link-error");

module.exports = {
  logout: (to, cookieName) => {
    // remove cookie and reload page to reset apollo client
    Cookies.expire(cookieName || "authToken");

    if (to) {
      window.location.replace(to);
    } else {
      window.location.reload();
    }
  },
  setAuthCookie: (token, cookieName) => {
    Cookies.set(cookieName || "authToken", token);
  },
  createApolloClient({ uri, initialState, cookieName }) {
    // taken from
    // - https://github.com/apollographql/GitHunt-React/blob/master/src/links.js
    // - https://www.apollographql.com/docs/react/features/error-handling.html
    const errorLink = onError(({ graphQLErrors, networkError }) => {
      // onError receives a callback in the event a GraphQL or network error occurs.
      // This example is a bit contrived, but in the real world, you could connect
      // a logging service to the errorLink or perform a specific action in response
      // to an error.
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          // eslint-disable-next-line no-console
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );

      // eslint-disable-next-line no-console
      if (networkError) console.log(`[Network error]: ${networkError}`);
    });

    const authLink = new ApolloLink((operation, forward) => {
      const token = Cookies.get(cookieName || "authToken");
      if (token) {
        const authorizationHeader = `Bearer ${token}`;
        operation.setContext({
          headers: { authorization: authorizationHeader }
        });
      }
      return forward(operation);
    });

    const apolloClient = new ApolloClient({
      link: ApolloLink.from([
        errorLink,
        authLink,
        new HttpLink({ uri, credentials: "include" })
      ]),
      connectToDevTools: true,
      cache: new InMemoryCache().restore(initialState)
    });

    return apolloClient;
  }
};
