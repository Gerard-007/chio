const { formatDistanceToNow } = require('date-fns');

function formatDate(timestamp) {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
}

module.exports = formatDate;
