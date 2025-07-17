const gql = String.raw;

const typeDefs = gql`
    type User {
        id: ID!
        username: String!
        email: String!
        name: String
    }

    type AuthPayload {
        message: String!
    }

    type Query {
        getUsers: [User]
    }

    type Mutation {
        createUser(username: String!, email: String!, password: String!, name: String): User
        loginUser(username: String!, password: String!): AuthPayload
    }
`;

module.exports = typeDefs;
