// ---- FALLBACK (Developer 5): owner's version wins on merge ----
import { useState, useEffect } from 'react';
import { apiRequest } from '../api.js';

export default function ViewRecords() {
    const [records, setRecords] = useState([]);
    const [search, setSearch] = useState('');
    const [error, setError] = useState(null);

    const fetchRecords = async (searchQuery = '') => {
        setError(null);
        try {
            const endpoint = searchQuery ? `/records?search=${encodeURIComponent(searchQuery)}` : '/records';
            const res = await apiRequest(endpoint);
            // Safely extract records whether Dev 3 nested them in { data: { records: [] } } or just { data: [] }
            setRecords(res.data?.records || res.data || []);
        } catch (err) {
            setError(err.message || 'Failed to fetch records');
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchRecords(search);
    };

    return (
        <div>
            <h3>View Records (Fallback)</h3>
            <form onSubmit={handleSearch} style={{ marginBottom: '10px' }}>
                <input type="text" placeholder="Search records..." value={search} onChange={e => setSearch(e.target.value)} />
                <button type="submit">Search</button>
            </form>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <table border="1" cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {records.length > 0 ? (
                        records.map(r => (
                            <tr key={r.id}>
                                <td>{r.id}</td>
                                <td>{r.title}</td>
                                <td>{r.description}</td>
                                <td>
                                    <button disabled>Edit (Pending)</button>
                                    <button disabled>Delete (Pending)</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="4" style={{textAlign: 'center'}}>No records found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
