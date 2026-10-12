// ---- FALLBACK (Developer 5): owner's version wins on merge ----
import { useState } from 'react';
import { apiRequest } from '../api.js';

export default function AddRecord({ onRecordAdded }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await apiRequest('/records', {
                method: 'POST',
                body: { title, description }
            });
            setTitle('');
            setDescription('');
            alert('Record added successfully!');
            if (onRecordAdded) onRecordAdded();
        } catch (err) {
            setError(err.message || 'Failed to add record');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Add Record (Fallback)</h3>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
            <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
            <button type="submit">Add Record</button>
        </form>
    );
}
