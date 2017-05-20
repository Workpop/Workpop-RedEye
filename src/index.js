import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import { mapValues, get } from 'lodash'; //eslint-disable-line import/no-extraneous-dependencies
import rp from 'request-promise';

export default class RedEye {
  constructor(params) {
    this.origin = get(params, 'origin');
    this.headers = get(params, 'headers');
    this.requestOptions = get(params, 'requestOptions', {});
  }

  _sendQuery(query) {
    const options = {
      method: 'POST',
      uri: this.origin,
      headers: this.headers,
      body: query,
      json: true, // Automatically stringifies the body to JSON
      ...this.requestOptions,
    };

    return rp(options);
  }

  _createQuery(query, variables) {
    const request = Object.assign({}, { query: gql`${query}` });
    if (variables) {
      request.variables = variables;
    }
    return mapValues(request, (val, key) => {
      return key === 'query' ? print(val) : val;
    });
  }

  generateQuery(query, variables) {
    const generatedQuery = this._createQuery(query, variables);
    return {
      query: generatedQuery,
      send: () => {
        return this._sendQuery(generatedQuery);
      },
      refetch: (refetchVariables = variables) => {
        const refetchedQuery = this._createQuery(query, refetchVariables);
        return this._sendQuery(refetchedQuery);
      },
    };
  }
}
