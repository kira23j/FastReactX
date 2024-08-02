
"use client";

import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import '../../../public/styles/Login.css'; // Import the CSS file
import { useRouter } from 'next/navigation'; // Use next/navigation for app directory

const Login = () => {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const router = useRouter(); // Initialize router

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            // Redirect to the home page or desired route after successful login
            router.push("/");
        } catch (error) {
            console.error('Failed to login:', error);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/auth/register', {
                username: registerUsername,
                password: registerPassword,
            });
            // Login the user after successful registration
            await login(registerUsername, registerPassword);
            // Redirect to the home page or desired route
            router.push("/");
        } catch (error) {
            console.error('Failed to register:', error);
        }
    };

    const toggleRegistration = () => {
        setIsRegistering(!isRegistering);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="text-center">{isRegistering ? 'Sign Up' : 'Welcome Back!'}</h2>
                <form onSubmit={isRegistering ? handleRegister : handleSubmit}>
                    {/* Username Field */}
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            value={isRegistering ? registerUsername : username}
                            onChange={(e) => isRegistering ? setRegisterUsername(e.target.value) : setUsername(e.target.value)}
                            required
                        />
                    </div>
                    {/* Password Field */}
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={isRegistering ? registerPassword : password}
                            onChange={(e) => isRegistering ? setRegisterPassword(e.target.value) : setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        {isRegistering ? 'Sign Up' : 'Login'}
                    </button>
                </form>
                <div className="text-center mt-4">
                    <button className="btn btn-link" onClick={toggleRegistration}>
                        {isRegistering ? 'Back to Login' : 'Sign Up'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
