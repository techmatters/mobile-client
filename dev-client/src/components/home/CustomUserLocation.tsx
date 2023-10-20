import {UserLocation, CircleLayer, Location} from '@rnmapbox/maps';
import {USER_DISPLACEMENT_MIN_DISTANCE_M} from 'terraso-mobile-client/constants';

const mapboxBlue = 'rgba(51, 181, 229, 100)';

const layerStyles = {
  pulse: {
    circleRadius: 15,
    circleColor: mapboxBlue,
    circleOpacity: 0.2,
    circlePitchAlignment: 'map',
  },
  background: {
    circleRadius: 9,
    circleColor: '#fff',
    circlePitchAlignment: 'map',
  },
  foreground: {
    circleRadius: 6,
    circleColor: mapboxBlue,
    circlePitchAlignment: 'map',
  },
};

type CustomUserLocationProps = {
  onUserLocationPress: (event?: GeoJSON.GeoJsonProperties) => void;
  updateUserLocation?: (location: Location) => void;
};

export const CustomUserLocation = ({
  onUserLocationPress,
  updateUserLocation,
}: CustomUserLocationProps) => {
  const handleUserLocationPress = (event?: GeoJSON.GeoJsonProperties) => {
    onUserLocationPress(event);
  };

  return (
    <UserLocation
      onUpdate={updateUserLocation}
      onPress={handleUserLocationPress}
      minDisplacement={USER_DISPLACEMENT_MIN_DISTANCE_M}>
      <CircleLayer
        key="mapboxUserLocationPulseCircle"
        id="mapboxUserLocationPulseCircle"
        belowLayerID="sitesLayer"
        style={layerStyles.pulse}
      />
      <CircleLayer
        key="mapboxUserLocationWhiteCircle"
        id="mapboxUserLocationWhiteCircle"
        belowLayerID="sitesLayer"
        style={layerStyles.background}
      />
      <CircleLayer
        key="mapboxUserLocationBlueCircle"
        id="mapboxUserLocationBlueCircle"
        aboveLayerID="mapboxUserLocationWhiteCircle"
        style={layerStyles.foreground}
      />
    </UserLocation>
  );
};
