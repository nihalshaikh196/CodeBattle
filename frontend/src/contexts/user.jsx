import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const UserContext = createContext(null);

export const UserContextProvider = (props) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={[user, setUser]}>
      {props.children}
    </UserContext.Provider>
  );
};

// Add prop types validation
UserContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
