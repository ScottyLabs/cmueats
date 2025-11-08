interface CMUMapsApiResponse {
    Fastest: {
        path: {
            path: Array<{
                id: string;
                coordinate: {
                    latitude: number;
                    longitude: number;
                };
                floor: {
                    buildingCode: string;
                    level: string;
                };
                roomId: string;
                neighbors: Record<
                    string,
                    {
                        dist: number;
                        toFloorInfo: any;
                    }
                >;
            }>;
            distance: number;
        };
        instructions: Array<{
            action: string;
            distance: number;
            node_id: string;
        }>;
    };
}

export async function getCMUMapsPath(
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number,
): Promise<CMUMapsApiResponse | null> {
    try {
        const apiUrl = `/api/cmu-maps/path?start=${startLat},${startLng}&end=${endLat},${endLng}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`${response.status}`);
        }

        const data: CMUMapsApiResponse = await response.json();
        return data;
    } catch (error) {
        return null;
    }
}

export async function getUserToDestinationPath(
    userLat: number,
    userLng: number,
    destinationLat: number,
    destinationLng: number,
): Promise<CMUMapsApiResponse | null> {
    return getCMUMapsPath(userLat, userLng, destinationLat, destinationLng);
}
