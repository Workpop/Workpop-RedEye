import gql from 'graphql-tag';
import { print } from 'graphql-tag/printer';
import { mapValues, get } from 'lodash';
import rp from 'request-promise';

//type RequestType = {
//  debugName: string,
//  query: Object,
//  variables: Object,
//  operationName: string,
//};

function generateQuery(query) {
  return mapValues({
    query,
  }, (val, key) => {
    return key === 'query' ? print(val) : val;
  });
}

function sendQuery(origin, query) {
  var options = {
    method: 'POST',
    uri: origin,
    body: query,
    json: true // Automatically stringifies the body to JSON
  };

  rp(options)
    .then(function (parsedBody) {
      // POST succeeded...
      console.log(get(parsedBody, 'data'));

    })
    .catch(function (err) {
      // POST failed...
      console.log(err);
    });
}

sendQuery('http://localhost:8000/graphql', generateQuery(gql`
  { allCountries { name } }
`));

console.log(generateQuery(gql`
  { allCountries { name } }
`));
