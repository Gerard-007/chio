const { formatDistanceToNow } = require('date-fns');

function formatDate(timestamp) {
    if (!(timestamp instanceof Date) || isNaN(timestamp.getTime())) {
        // If timestamp is not a valid Date object, return a default message
        return "Unknown";
    }

    // If timestamp is a valid Date object, format it
    return formatDistanceToNow(timestamp, { addSuffix: true });
}

module.exports = formatDate;


