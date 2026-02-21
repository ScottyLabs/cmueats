export function getDistanceMeters(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number {
    const R = 6371000;
    const lat1Rad = (lat1 * Math.PI) / 180;
    const lat2Rad = (lat2 * Math.PI) / 180;
    const deltaLatRad = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLngRad = ((lng2 - lng1) * Math.PI) / 180;
    const hA =
        Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLngRad / 2) * Math.sin(deltaLngRad / 2);
    const angularDistanceRad = 2 * Math.atan2(Math.sqrt(hA), Math.sqrt(1 - hA));
    return R * angularDistanceRad;
}
