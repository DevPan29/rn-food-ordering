import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

type AuthData = {
    session: Session | null;
    loading: boolean;
 }

const AuthContext = createContext<AuthData>({
    session: null,
    loading: true,
});

export default function AuthProvider({children}: PropsWithChildren) {
    
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // check auth state
        // console.log('AuthProvider mounted');
        // fetch user session from supabase
        const fetchSession = async () => {
            const { data } = await supabase.auth.getSession()
           // console.log('AuthProvider session:', data.session);
            setSession(data.session);
            setLoading(false);
        };
        fetchSession();
        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    return (
        <AuthContext.Provider value={{session, loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);