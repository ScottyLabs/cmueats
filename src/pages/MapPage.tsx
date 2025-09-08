import { useMemo, useState } from 'react';
import { Map, Marker, ColorScheme, PointOfInterestCategory } from 'mapkit-react';
import { AnimatePresence, motion } from 'motion/react';
import EateryCard from '../components/EateryCard';
import css from './MapPage.module.css';
import { IReadOnlyLocation_FromAPI_PostProcessed, IReadOnlyLocation_ExtraData_Map } from '../types/locationTypes';
import { mapMarkerBackgroundColors, mapMarkerTextColors } from '../constants/colors';
import env from '../env';

function abbreviate(longName: string) {
    const importantPart = longName.split(/(-|\(|'|&| at )/i)[0].trim();
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

function MapPage({
    locations,
    extraLocationData,
    pinnedIds,
    updatePinnedIds,
}: {
    locations: IReadOnlyLocation_FromAPI_PostProcessed[] | undefined;
    extraLocationData: IReadOnlyLocation_ExtraData_Map | undefined;
    pinnedIds: Record<string, true>;
    updatePinnedIds: (newPinnedIds: Record<string, true>) => void;
}) {
    const [selectedLocationIndex, setSelectedLocationIndex] = useState<number>();

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
    const extendedLocationData =
        locations && extraLocationData
            ? locations.map((location) => ({
                  ...location,
                  ...extraLocationData[location.conceptId],
              }))
            : undefined;
    return (
        <div className={css['map-page']}>
            {extendedLocationData && (
                <>
                    <Map
                        token={env.VITE_AUTO_GENERATED_MAPKITJS_TOKEN}
                        colorScheme={ColorScheme.Dark}
                        initialRegion={initialRegion}
                        excludedPOICategories={[PointOfInterestCategory.Restaurant]}
                        cameraBoundary={cameraBoundary}
                        minCameraDistance={100}
                        maxCameraDistance={1000}
                        showsUserLocationControl
                        allowWheelToZoom
                    >
                        {extendedLocationData.map((location, locationIndex) => {
                            if (!location.coordinates) return undefined;
                            const bgColor = derivedRootColors.getPropertyValue(
                                stripVarFromString(mapMarkerBackgroundColors[location.locationState]),
                            ); // mapkit doesn't accept css variables, so we'll go ahead and get the actual color value from :root first
                            const textColor = derivedRootColors.getPropertyValue(
                                stripVarFromString(mapMarkerTextColors[location.locationState]),
                            );
                            return (
                                <Marker
                                    key={location.conceptId}
                                    latitude={location.coordinates.lat}
                                    longitude={location.coordinates.lng}
                                    color={pinnedIds[location.conceptId] ? '#007ffd' : bgColor}
                                    glyphColor={textColor}
                                    glyphText={abbreviate(location.name)}
                                    onSelect={() => {
                                        setSelectedLocationIndex(locationIndex);
                                    }}
                                    onDeselect={() => {
                                        setSelectedLocationIndex(undefined);
                                    }}
                                />
                            );
                        })}
                    </Map>
                    <AnimatePresence>
                        {selectedLocationIndex !== undefined && (
                            <motion.div
                                className={css['map-drawer-container']}
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                exit={{ height: 0 }}
                                transition={{ duration: 0.4, ease: [0.14, 0.9, 0.42, 1.03] }}
                            >
                                <div className={css['map-drawer']}>
                                    <EateryCard
                                        location={extendedLocationData[selectedLocationIndex]}
                                        isPinned={pinnedIds[extendedLocationData[selectedLocationIndex].conceptId]}
                                        onTogglePin={() => {
                                            const id = extendedLocationData[selectedLocationIndex].conceptId.toString();
                                            const newPinnedIds = { ...pinnedIds };
                                            if (newPinnedIds[id]) {
                                                delete newPinnedIds[id];
                                            } else {
                                                newPinnedIds[id] = true;
                                            }
                                            updatePinnedIds(newPinnedIds);
                                        }}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </div>
    );
}

export default MapPage;
