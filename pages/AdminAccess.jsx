import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminAccess() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/admin/login');
    }, [navigate]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            fontSize: '18px'
        }}>
            Redirecting to admin login...
        </div>
    );
}

export default AdminAccess;