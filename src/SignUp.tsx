
import React, { useState } from "react";
import { supabase } from "./supabase";

function SignUp () {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignUp = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setMessage(error.message);
        } else if (data.user) {
            setMessage('Check your email to confirm your account');
            setEmail("");
            setPassword("");
        }

        setLoading(false);
    };

    return (
        <div>
            <h2>Create Account</h2>

            <form onSubmit={handleSignUp}>
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
                    {loading ? "creating account..." : "Sign Up"}
                </button>
            </form>
            
            <p>{message}</p>

        </div>
    );
}

export default SignUp;