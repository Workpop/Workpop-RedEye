RedEye
------
A GraphQL query generator and transport. 

Install
------------

`npm install @workpop/redeye`

Getting Started
---------------------

To hop on the RedEye you will need an origin. This will be the URL of your `graphql` endpoint.
RedEye provides a constructor to configure this origin for Queries/Mutations to transport to.

```js
import RedEye from '@workpop/redeye';

// Our origin for the GraphQL endpoint is GraphQLHub by Clay Allasop
const QueryManager = new RedEye({
  origin: 'https://www.graphqlhub.com/graphql',
});
```

That's it! Now you have a Query Manager. The Query Manager's job is two fold:

1. Create queries for GraphQL Queries and Mutations
2. Make the HTTP Post Request to the endpoint.

API
----------

#### `generateQuery(query: string, variables: Object): string`

To generate a query, RedEye leverages the `graphql-tag` npm module to allow users to express their queries as
template literal strings. The generation function then turns this query string into a GraphQL AST and passes it along
to the `printer` library from the GraphQL main npm module. 

Let's make an example query to GraphQLHub:

```js
  // GraphQL query represented as a template literal
  const q = `
      {
        graphQLHub
      }
  `;
  
  const query = QueryManager.generateQuery(q);
  
  console.log(query); // { query: '{\n  graphQLHub\n}\n' }  
``` 

*** Note, the generated query is intended to be sent in the body of a POST request to a GraphQL Server with `Content-Type/application-json`.
Future versions may support `application/graphql` content-types. 

##### Generating a Query with variables

To pass variables to your query, you can pass in an optional object to the `generateQuery` method.

Let's make an example query to the Reddit API

```js
  // GraphQL query represented as a template literal
  const q = `
    query RedditUser($username: String!) {
      reddit {
        user(username: $username) {
          username
          commentKarma
          createdISO
        }
      }
    }
  `;
  
  const query = QueryManager.generateQuery(q, {
    username: 'Workpop',
  });
``` 

#### `sendQuery(query: string): Promise`

Sends generate query to the RedEye origin as a `POST` request and returns a promise to resolve the result of the request.

```js
    import { get } from 'lodash';
   
    QueryManager.sendQuery(query).then((response) => {
      const user = get(response, 'data.reddit.user');
      console.log(user); // Workpop
      return user;
    }).catch((e) => {
      throw new Error(e.reason);
    });
```

### Coming Soon
- [] Query Refetch
- [] Results Cache
