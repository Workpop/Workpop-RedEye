import gql from 'graphql-tag';
import { print } from 'graphql-tag/printer';
import { mapValues, get } from 'lodash';
import rp from 'request-promise';

export default class RedEye {
  constructor(params) {
    this.origin = get(params, 'origin');
  }
  generateQuery(query, variables) {
    return mapValues({
      query,
      variables,
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

    return rp(options);
  }
}
