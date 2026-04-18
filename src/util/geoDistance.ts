// See https://en.wikipedia.org/wiki/Haversine_formula
export function getDistanceInMeters(
    start: { latitude: number; longitude: number },
    end: { latitude: number; longitude: number },
) {
    const earthRadiusMeters = 6371000;
    const lat1 = (start.latitude * Math.PI) / 180;
    const lat2 = (end.latitude * Math.PI) / 180;
    const deltaLat = ((end.latitude - start.latitude) * Math.PI) / 180;
    const deltaLng = ((end.longitude - start.longitude) * Math.PI) / 180;
    const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusMeters * c;
}

// Distance in meters or undefined if the location has no coordinates
export function getLocationDistanceFromUser(
    location: { coordinateLat: number | null; coordinateLng: number | null },
    userCoordinates: { latitude: number; longitude: number },
): number | undefined {
    if (location.coordinateLat === null || location.coordinateLng === null) return undefined;
    return getDistanceInMeters(userCoordinates, {
        latitude: location.coordinateLat,
        longitude: location.coordinateLng,
    });
}
