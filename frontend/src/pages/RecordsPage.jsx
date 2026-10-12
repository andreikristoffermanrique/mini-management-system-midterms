// ---- FALLBACK (Developer 5): owner's version wins on merge ----
import { useState, useEffect } from 'react';
import { apiRequest } from '../api.js';
import AddRecord from '../components/AddRecord.jsx';
import EditRecord from '../components/EditRecord.jsx';
import DeleteRecord from '../components/DeleteRecord.jsx';

export default function RecordsPage() {
    const [records, setRecords] = useState([]);
    const [editingRecord, setEditingRecord] = useState(null);

    const fetchRecords = async () => {
        try {
            const res = await apiRequest('/records');
            setRecords(res.data?.records || res.data || []);
        } catch (err) {
            console.error("Failed to fetch records", err);
        }
    };

    // Initial load
    useEffect(() => { fetchRecords(); }, []);

    // These callbacks trigger a re-fetch, giving "real-time" updates
    const refreshUI = () => {
        fetchRecords();
        setEditingRecord(null);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Records Management</h2>
            <AddRecord onRecordAdded={refreshUI} />
            
            {editingRecord && (
                <EditRecord 
                    record={editingRecord} 
                    onRecordUpdated={refreshUI} 
                    onCancel={() => setEditingRecord(null)} 
                />
            )}

            <hr style={{ margin: '20px 0' }} />

            <table border="1" cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr><th>ID</th><th>Title</th><th>Description</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    {records.map(r => (
                        <tr key={r.id}>
                            <td>{r.id}</td><td>{r.title}</td><td>{r.description}</td>
                            <td>
                                <button onClick={() => setEditingRecord(r)}>Edit</button>
                                <DeleteRecord recordId={r.id} onDeleted={refreshUI} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
