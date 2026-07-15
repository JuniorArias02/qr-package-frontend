export const isValidEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
}

export const isValidPhone = (phone: string): boolean => {
    // Basic validation for numbers and optional plus sign
    const re = /^\+?[\d\s-]{7,20}$/
    return re.test(phone)
}

export const isValidQR = (qr: string): boolean => {
    // Require at least 5 chars for QR
    return qr.length >= 5
}
