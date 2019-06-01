import { gql } from "apollo-boost";

const TOGGLE_DRIVING = gql`
  mutation toggleDriving {
    ToggleDrivingMode {
      ok
      error
    }
  }
`;

export default TOGGLE_DRIVING;
