import React, { useState, useEffect } from 'react';

export const UserContext = React.createContext();  //exporting context object

const UserProvider = ({ children }) => {
    const [jwtToken, setJwtToken] = useState();
    const [user, setUser] = useState();

    return (
        <UserContext.Provider value={
            {
                user: user,
                setUser: setUser,
                jwtToken: jwtToken,
                setJwtToken: setJwtToken
            }}>
            {children
                //this indicates that all the child tags with MyProvider as Parent can access the global store  
            }
        </UserContext.Provider>)
}

export default UserProvider;