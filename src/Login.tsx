
import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    //Stores the currently authenticated user
    const [user, setUser] = useState<User | null>(null);

    //Checks the existing session and listens for changes

    useEffect(() => {
        const checkSession = async () => {
            const {data, error} = await supabase.auth.getSession();

            if (error) {
                console.error("session error:", error.message);
                return;
            }

            setUser(data.session?.user ?? null);
        };

        //Listen for login and logout events

        const {
            data: {subscription},
        } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
            }
        );
        
        checkSession();

        //stop listening when the component unmounts

        return () => {

            subscription.unsubscribe();
        };
    }, []);


    const handleLogIn = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const { error } = await supabase.auth.signInWithPassword({
            email, 
            password
        });

        if (error) {
            setMessage(error.message);
        } else {
            setMessage("Login successful!");
            setPassword("");
        }

        setLoading(false);

    };

    const handleLogOut = async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            setMessage(error.message);
        } else {
            setMessage("Logged out succesfully!");
            setEmail("");
            setPassword("");
        }
    };

    return (
        <div>
            <h2>Mini Flip Authentication</h2>

            {
                user ?
                (
                    <div>
                        <h3>Welcome Back!</h3>
                        <p>Signed in as {user.email}</p>
                        <button type="button" onClick={handleLogOut}>Logout</button>
                    </div>
                ) 
                    : 
                (
                    <form onSubmit={handleLogIn}>

                        <input 
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <input 
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={6}
                            required
                        />

                        <button type="submit" disabled={loading}>
                            {loading ? "loggin in..." : "Login"}
                        </button>

                    </form>

                )

            }

            <p>{message}</p>

        </div>
    );
}

export default Login;