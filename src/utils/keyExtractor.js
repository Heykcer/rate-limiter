export const extractKey = (req) => {
    return req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.connection?.remoteAddress;
};
