import * as React from 'react';
import { onAuthStateChanged } from '../service/firebase/auth';

export const SessionContext = React.createContext();

const SessionProvider = ({ children }) => {
  const [session, setSession] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [rememberMe, setRememberMe] = React.useState(false);

  React.useEffect(() => {
    // Returns an `unsubscribe` function to be called during teardown
    const unsubscribe = onAuthStateChanged((user) => {
      if (user) {
        setSession({
          user: {
            name: user.displayName || '',
            email: user.email || '',
            image: user.photoURL || '',
          },
        });
      } else {
        setSession(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <SessionContext.Provider value={
      {
        session,
        loading,
        setSession,
        setLoading,
        rememberMe,
        setRememberMe
      }}>
      {children}
    </SessionContext.Provider>)
}

export default SessionProvider;
