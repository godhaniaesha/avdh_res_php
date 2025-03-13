import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        // Redirect to login if there is no token
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute; 