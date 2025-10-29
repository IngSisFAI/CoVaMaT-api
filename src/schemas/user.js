
import { gql } from 'apollo-server';
const typeDefs = gql`
  type User {
    _id: ID
    userName: String
    password: String
  }

  input InputUser{
    userName: String
    password: String
  }

  type Query {
    getValidUser(InputUser: InputUser): Boolean
  }

`;
export default typeDefs;