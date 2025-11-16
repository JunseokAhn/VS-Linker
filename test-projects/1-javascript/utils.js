// Utility functions

export function formatDate(date) {
    return date.toLocaleDateString();
}

export function formatTime(date) {
    return date.toLocaleTimeString();
}

module.exports = {
    formatDate,
    formatTime
};
