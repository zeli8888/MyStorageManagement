import * as React from 'react';

export interface Session {
    user: {
        name?: string;
        email?: string;
        image?: string;
    };
}

interface SessionContextType {
    session: Session | null;
    setSession: (session: Session) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

const SessionContext = React.createContext<SessionContextType>({
    session: null,
    setSession: () => { },
    loading: true,
    setLoading: () => { },
});

export default SessionContext;