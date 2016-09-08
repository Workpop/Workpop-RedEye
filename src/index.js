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

class RedEye {
  constructor(params) {
    this.origin = get(params, 'origin');
  }

  generateQuery(query) {
    return mapValues({
      query,
    }, (val, key) => {
      return key === 'query' ? print(val) : val;
    });
  }

  sendQuery(query) {
    const options = {
      method: 'POST',
      uri: this.origin,
      body: query,
      json: true // Automatically stringifies the body to JSON
    };

    return rp(options)
      .then(function (parsedBody) {
        // POST succeeded...
        console.log(get(parsedBody, 'data'));
      })
      .catch(function (err) {
        // POST failed...
        console.log(err);
      });
  }
}


/***
 * TESTING
 * @type {RedEye}
 */
const QueryManager = new RedEye({
  origin: 'http://localhost:8000/graphql'
});

const allCountries = gql`
  {
    allCountries {
      name
    }
  }
`;

const allCountriesQuery = QueryManager.generateQuery(allCountries);
console.log(allCountriesQuery);
QueryManager.sendQuery(allCountriesQuery);

const testMutation = gql`
    mutation Test {
      test: testCountryMutation(yo: "123")
    }
`;
const countryMutation = QueryManager.generateQuery(testMutation);
console.log(countryMutation);
QueryManager.sendQuery(countryMutation);

