/**
 * Formats a UTC date string to the user's local timezone and locale.
 * 
 * @param {string} dateString - The UTC date string (e.g., "2023-10-27T10:00:00.000000Z")
 * @param {string} format - The format type: 'short' | 'long' | 'relative' | 'time'
 * @returns {string} The formatted date string
 */
export const formatDate = (dateString, format = 'short') => {
    if (!dateString) return ''

    const date = new Date(dateString)

    // Check if date is valid
    if (isNaN(date.getTime())) return 'Fecha inválida'

    const userLocale = navigator.language || 'es-ES'

    if (format === 'relative') {
        const now = new Date()
        const diffInSeconds = Math.floor((now - date) / 1000)

        const rtf = new Intl.RelativeTimeFormat(userLocale, { numeric: 'auto' })

        if (diffInSeconds < 60) return 'hace un momento'
        if (diffInSeconds < 3600) return rtf.format(-Math.floor(diffInSeconds / 60), 'minute')
        if (diffInSeconds < 86400) return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour')
        if (diffInSeconds < 604800) return rtf.format(-Math.floor(diffInSeconds / 86400), 'day')
        if (diffInSeconds < 2419200) return rtf.format(-Math.floor(diffInSeconds / 604800), 'week')
        return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month')
    }

    if (format === 'long') {
        return new Intl.DateTimeFormat(userLocale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date)
    }

    if (format === 'time') {
        return new Intl.DateTimeFormat(userLocale, {
            hour: '2-digit',
            minute: '2-digit'
        }).format(date)
    }

    // Default 'short'
    return new Intl.DateTimeFormat(userLocale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(date)
}
