const fetch = require("node-fetch");
const ApolloClient = require("apollo-client").default;
const { ApolloLink } = require("apollo-link");
const { InMemoryCache } = require("apollo-cache-inmemory");
const { HttpLink } = require("apollo-link-http");

module.exports = {
  createApolloClient: ({ uri, token }) => {
    const authLink = new ApolloLink((operation, forward) => {
      if (token) {
        const authorizationHeader = `Bearer ${token}`;
        operation.setContext({
          headers: { authorization: authorizationHeader }
        });
      }
      return forward(operation);
    });
    return new ApolloClient({
      ssrMode: true,
      ssrForceFetchDelay: 100,
      link: ApolloLink.from([authLink, new HttpLink({ fetch, uri })]),
      cache: new InMemoryCache()
    });
  }
};
