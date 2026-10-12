// ---- FALLBACK (Developer 5): owner's version wins on merge ----
import { useState } from 'react';
import { apiRequest } from '../api.js';

export default function EditRecord({ record, onRecordUpdated, onCancel }) {
    const [title, setTitle] = useState(record?.title || '');
    const [description, setDescription] = useState(record?.description || '');
    const [error, setError] = useState(null);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await apiRequest(`/records/${record.id}`, {
                method: 'PUT',
                body: { title, description }
            });
            alert('Record updated successfully!');
            if (onRecordUpdated) onRecordUpdated();
        } catch (err) {
            setError(err.message || 'Failed to update record');
        }
    };

    if (!record) return null;

    return (
        <div style={{ border: '1px solid black', padding: '10px', marginTop: '10px' }}>
            <h3>Edit Record {record.id} (Fallback)</h3>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <form onSubmit={handleUpdate}>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
                <input type="text" value={description} onChange={e => setDescription(e.target.value)} required />
                <button type="submit">Save Changes</button>
                <button type="button" onClick={onCancel}>Cancel</button>
            </form>
        </div>
    );
}
