const hideIP = (ipAddress) => {
    if (!ipAddress) return null;
    const ipParts = ipAddress.split('.');
    if (ipParts.length === 4) {
        ipParts[2] = '***';
        ipParts[3] = '***';
    }
    return ipParts.join('.');
};
export default hideIP;