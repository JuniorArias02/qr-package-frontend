import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './core/auth/AuthContext';
import { AppRouter } from './router/AppRouter';

function App() {
    return (
        <AuthProvider>
            <RouterProvider router={AppRouter} />
        </AuthProvider>
    );
}

export default App;
