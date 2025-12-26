import { useMemo, useState, useRef } from 'react';
import { Map, Marker, ColorScheme, PointOfInterestCategory } from 'mapkit-react';
import { ILocation_Full } from '../types/locationTypes';
import { mapMarkerBackgroundColors, mapMarkerTextColors } from '../constants/colors';
import env from '../env';
import { DrawerAPIContextProvider, useDrawerAPIContext } from '../contexts/DrawerAPIContext';
import Drawer from '../components/Drawer';
import css from './MapPage.module.css';

function abbreviate(longName: string) {
    const importantPart = longName.split(/(-|\(|'|&| at )/i)[0]!.trim();
    return importantPart
        .split(' ')
        .map((word) => word.charAt(0))
        .join('');
}

/**
 *
 * @param varString if input is var(XXX), we get back XXX
 * @returns
 */
const stripVarFromString = (varString: string) => varString.match(/var\((.+)\)/)?.[1] ?? '';

function MapSection({ locations }: { locations: ILocation_Full[] }) {
    const { setDrawerActiveId, closeDrawer, selectedId } = useDrawerAPIContext();
    const cameraBoundary = useMemo(
        () => ({
            centerLatitude: 40.444,
            centerLongitude: -79.945,
            latitudeDelta: 0.006,
            longitudeDelta: 0.01,
        }),
        [],
    );

    const initialRegion = useMemo(
        () => ({
            centerLatitude: 40.44316701238923,
            centerLongitude: -79.9431147637379,
            latitudeDelta: 0.006337455593801167,
            longitudeDelta: 0.011960061265583022,
        }),
        [],
    );
    const derivedRootColors = useMemo(() => window.getComputedStyle(document.body), []);
    return (
        <Map
            token={env.VITE_AUTO_GENERATED_MAPKITJS_TOKEN}
            colorScheme={ColorScheme.Dark}
            initialRegion={initialRegion}
            excludedPOICategories={[PointOfInterestCategory.Restaurant]}
            cameraBoundary={cameraBoundary}
            minCameraDistance={10}
            maxCameraDistance={1000}
            showsUserLocationControl
            allowWheelToZoom
        >
            {locations.map((location) => {
                if (!location.coordinateLat || !location.coordinateLng) return undefined;
                const bgColor = derivedRootColors.getPropertyValue(
                    stripVarFromString(mapMarkerBackgroundColors[location.locationState]),
                ); // mapkit doesn't accept css variables, so we'll go ahead and get the actual color value from :root first
                const textColor = derivedRootColors.getPropertyValue(
                    stripVarFromString(mapMarkerTextColors[location.locationState]),
                );
                return (
                    <Marker
                        key={location.id}
                        latitude={location.coordinateLat}
                        longitude={location.coordinateLng}
                        color={bgColor}
                        glyphColor={textColor}
                        glyphText={abbreviate(location.name)}
                        onSelect={() => {
                            setDrawerActiveId(location.id);
                        }}
                        onDeselect={() => {
                            closeDrawer();
                        }}
                        selected={selectedId === location.id}
                    />
                );
            })}
        </Map>
    );
}
function MapPage({ locations }: { locations: ILocation_Full[] | undefined }) {
    return (
        <DrawerAPIContextProvider>
            <div className={css['map-page']}>
                {locations && (
                    <div className={css['map-page__map-container']}>
                        <MapSection locations={locations} />
                    </div>
                )}
                <Drawer locations={locations} />
            </div>
        </DrawerAPIContextProvider>
    );
}

export default MapPage;
