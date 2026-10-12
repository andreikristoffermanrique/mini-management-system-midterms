// ---- FALLBACK (Developer 5): owner's version wins on merge ----
import { useState } from 'react';
import { apiRequest } from '../api.js';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await apiRequest('/auth/register', {
                method: 'POST',
                body: { username, password }
            });
            alert("Registration successful!");
        } catch (err) {
            setError(err.message || 'Registration failed');
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <h2>Register (Fallback)</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit">Register</button>
        </form>
    );
}
