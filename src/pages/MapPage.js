import React, { useMemo } from 'react';
import { Map, Marker, ColorScheme } from 'mapkit-react';
import './MapPage.css';

const token = '…';

function MapPage({ locations }) {
  const cameraBoundary = useMemo(() => ({
    centerLatitude: 40.444,
    centerLongitude: -79.945,
    latitudeDelta: 0.006,
    longitudeDelta: 0.008,
  }), []);
  const initialRegion = useMemo(() => ({
    centerLatitude: 40.44316701238923,
    centerLongitude: -79.9431147637379,
    latitudeDelta: 0.006337455593801167,
    longitudeDelta: 0.011960061265583022,
  }), []);

  return (
    <div className="MapPage">
      <Map
        token={token}
        colorScheme={ColorScheme.Dark}

        initialRegion={initialRegion}
        cameraBoundary={cameraBoundary}
        minCameraDistance={100}
        maxCameraDistance={1000}

        showsUserLocationControl={true}
      >
        {locations.map((location) =>
          <Marker
            key={location.conceptId}

            latitude={location.coordinates.lng} // @TODO Fix whenever the API will be fixed (#27)
            longitude={location.coordinates.lat}

            title={location.name}
            color={location.isOpen ? '#69bb36' : '#ff5b40'}
          />
        )}
      </Map>
    </div>
  );
}

export default MapPage;
