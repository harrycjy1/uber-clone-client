import { gql } from "apollo-boost";

export const FACEBOOK_CONNECT = gql`
  mutation facebookConnect(
    $firstName: String!
    $lastName: String!
    $fbId: String!
    $email: String
  ) {
    FacebookConnect(
      firstName: $firstName
      lastName: $lastName
      fbId: $fbId
      email: $email
    ) {
      ok
      error
      token
    }
  }
`;
