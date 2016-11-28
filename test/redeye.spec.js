import { expect } from 'chai';
import { get } from 'lodash';
import RedEye from '../src';

// use GraphQL Hub to use RedEye to query real data sources
const QueryManager = new RedEye({
  origin: 'https://www.graphqlhub.com/graphql',
});

describe('RedEye - GraphQLHub', function () {
  const query = QueryManager.generateQuery(`
      {
        graphQLHub
      }
  `);

  it('should correctly return a response for generate query', function () {
    expect(query.query).to.eql({ query: '{\n  graphQLHub\n}\n' });
  });

  it('should correctly return a response from the server when query is sent', function (done) {
    query.send().then((response) => {
      const data = get(response, 'data.graphQLHub');
      expect(data).to.eql('Use GraphQLHub to explore popular APIs with GraphQL! Created by Clay Allsopp @clayallsopp');
      done();
    }).catch((e) => {
      throw new Error(e.reason);
    });
  });
});

describe('RedEye - GraphQLHub Reddit', function () {
  const query = QueryManager.generateQuery(`
      {
        reddit {
          user(username: "kn0thing") {
            username
            commentKarma
            createdISO
          }
        }
      }
  `);

  it('should correctly return a response for generate query', function () {
    expect(query.query).to.eql({ query: '{\n  reddit {\n    user(username: "kn0thing") {\n      username\n      commentKarma\n      createdISO\n    }\n  }\n}\n' });
  });

  it('should correctly return a response from the server when query is sent', function (done) {
    this.timeout(20000);
    query.send().then((response) => {
      const data = get(response, 'data.reddit.user');
      expect(data.username).to.eql('kn0thing');
      done();
    }).catch((e) => {
      throw new Error(e.reason);
    });
  });
});

describe('RedEye - GraphQLHub Subreddit with variables', function () {
  const query = QueryManager.generateQuery(`
      query GetSubReddit($name: String!, $limit: Int!) {
        reddit {
          subreddit(name: $name) {
            newListings(limit: $limit) {
              title
              comments {
                body
                author {
                  username
                  commentKarma
                }
              }
            }
          }
        }
      }
  `, {
    name: 'movies',
    limit: 2,
  });

  it('should correctly return a response from the server when query is sent', function (done) {
    this.timeout(20000);
    query.send().then((response) => {
      const data = get(response, 'data.reddit.subreddit');
      expect(data).not.to.eql(undefined);
      done();
    }).catch((e) => {
      console.log('handled the error', e);
      done();
    });
  });

  it('should be able to refetch with same variables', function (done) {
    this.timeout(20000);
    query.refetch().then((response) => {
      const data = get(response, 'data.reddit.subreddit');
      expect(data).not.to.eql(undefined);
      done();
    }).catch((e) => {
      console.log('handled the error', e);
      done();
    });
  });

  it('should be able to refetch with different variables', function (done) {
    this.timeout(20000);
    query.refetch({
      name: 'movies',
      limit: 4,
    }).then((response) => {
      const data = get(response, 'data.reddit.subreddit.newListings');
      expect(data.length).to.eql(4);
      done();
    }).catch((e) => {
      console.log('handled the error', e);
      done();
    });
  });
});
