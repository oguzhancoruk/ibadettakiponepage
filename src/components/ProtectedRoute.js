import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const user = localStorage.getItem('user');

  if (!user) {
    // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
