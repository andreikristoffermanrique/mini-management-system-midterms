// ---- FALLBACK (Developer 5): owner's version wins on merge ----
import { useState } from 'react';
import { apiRequest } from '../api.js';

export default function DeleteRecord({ recordId, onDeleted }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this record?')) return;
        setIsDeleting(true);
        try {
            await apiRequest(`/records/${recordId}`, { method: 'DELETE' });
            alert('Record deleted successfully!');
            if (onDeleted) onDeleted();
        } catch (err) {
            alert(err.message || 'Failed to delete record');
            setIsDeleting(false);
        }
    };

    return (
        <button onClick={handleDelete} disabled={isDeleting} style={{ color: 'red', marginLeft: '5px' }}>
            {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
    );
}
