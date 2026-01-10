const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const ROUTES = {
    LOGIN: `${API_URL}/login`,
    LOGOUT: `${API_URL}/logout`,
    REGISTER: `${API_URL}/register`,
    USER: `${API_URL}/user`,
    CHANGE_PASSWORD: `${API_URL}/change-password`,
    UPDATE_PROFILE: `${API_URL}/update-profile`,
    STATISTICS: `${API_URL}/statistics`,
    PACKAGES: `${API_URL}/packages`,
    PACKAGES_CHECK_QR: `${API_URL}/packages/check-qr`,
    SCANS: `${API_URL}/scans`,
    FORGOT_PASSWORD: `${API_URL}/forgot-password`,
    VERIFY_CODE: `${API_URL}/verify-code`,
    RESET_PASSWORD: `${API_URL}/reset-password`,
};

export default ROUTES;
