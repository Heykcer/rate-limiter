import ip from 'ip';

const myIP = hideIP(ip.address());

export const extractKey = (req) => {
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
    return myIP || ipAddress;
};
