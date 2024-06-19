import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const RegistrationContext = createContext(null);

export const RegistrationContextProvider = (props) => {
  const [userInfo, setUserInfo] = useState({
    charusat_id: "",
    user_type: "",
    email: "",
    first_name: "",
    last_name: "",
    institute: "",
    department: "",
    counsellor: "",
    hod: { name: "", email: "" },
    mobile: "",
    password: "",
    confirm_password: "",
  });

  return (
    <RegistrationContext.Provider value={[userInfo, setUserInfo]}>
      {props.children}
    </RegistrationContext.Provider>
  );
};


RegistrationContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};