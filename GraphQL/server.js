const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const schema = buildSchema(`
    type Query {
        getUser(id: ID!): User,
        getAllUser: [User!]!
    }
    
    type User {
        id: ID!,
        name: String!,
        email: String!
    }
    
    input UserInput {
        name: String!,
        email: String!
    }
    
    type Mutation {
        createUser(input: UserInput): User
        updateUser(id: ID!, input: UserInput): User
    }`);
    
const id = require('crypto').randomBytes(10).toString('hex');
let users = [{ id, name: 'brachio', email: 'brachio@email.com' }];

const root = {
//   name: () => 'John Doe',
//   email: () => 'john@gmail.com',
  getAllUser: () => users,
  getUser: ({id}) => {
    const found = users.filter(user => user.id === id);
    if(!found){
        throw new Error('Invalid ID');
    }
    return found;
  },
  createUser: ({ input }) => {
    const id = require('crypto').randomBytes(10).toString('hex');
    users.push({ id, ...input });
    return { id, ...input };
  },
  updateUser: ({ id, input }) => {
    const newUsers = users.map((user) => {
      if (user.id === id) {
        return { ...user, ...input };
      } else {
        return user;
      }
    });
    users = [...newUsers];
    return { id, ...input };
  }
};


const app = express();

app.use('/graphql',
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  }));

app.listen(5000);

console.log('Running a GraphQL API server at http://localhost:5000/graphql');
