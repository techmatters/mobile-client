import Mapbox, {Camera, Location} from '@rnmapbox/maps';
import {OnPressEvent} from '@rnmapbox/maps/src/types/OnPressEvent';
import {
  memo,
  useMemo,
  useCallback,
  forwardRef,
  ForwardedRef,
  useRef,
  useImperativeHandle,
} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from 'native-base';
import {Keyboard, PixelRatio, Platform, StyleSheet} from 'react-native';
import {Site} from 'terraso-client-shared/site/siteSlice';
import {CameraRef} from '@rnmapbox/maps/lib/typescript/components/Camera';
import {CalloutState} from 'terraso-mobile-client/screens/HomeScreen';
import {
  mapIconSizeForPlatform,
  positionToCoords,
} from 'terraso-mobile-client/components/common/Map';
import {siteFeatureCollection} from 'terraso-mobile-client/components/home/siteFeatureCollection';
import {repositionCamera} from 'terraso-mobile-client/components/home/repositionCamera';
import {SiteMapCallout} from 'terraso-mobile-client/components/home/SiteMapCallout';
import {CustomUserLocation} from 'terraso-mobile-client/components/home/CustomUserLocation';

const DEFAULT_LOCATION = [-98.0, 38.5];
const MAX_EXPANSION_ZOOM = 15;

export type SiteMapProps = {
  updateUserLocation?: (location: Location) => void;
  sites: Record<string, Site>;
  calloutState: CalloutState;
  setCalloutState: (state: CalloutState) => void;
  styleURL?: string;
  onMapFinishedLoading?: () => void;
};

const SiteMap = (
  {
    updateUserLocation,
    sites,
    setCalloutState,
    calloutState,
    styleURL,
    onMapFinishedLoading,
  }: SiteMapProps,
  forwardedCameraRef: ForwardedRef<CameraRef>,
): JSX.Element => {
  const mapRef = useRef<Mapbox.MapView>(null);
  const shapeSourceRef = useRef<Mapbox.ShapeSource>(null);
  const cameraRef = useRef<Mapbox.Camera>(null);
  useImperativeHandle(forwardedCameraRef, () => cameraRef.current!);

  const selectedSite =
    calloutState.kind === 'site' ? sites[calloutState.siteId] : null;

  const {colors} = useTheme();

  const selectedSiteFeature = useMemo(
    () => siteFeatureCollection(selectedSite === null ? [] : [selectedSite]),
    [selectedSite],
  );

  const sitesFeature = useMemo(
    () =>
      siteFeatureCollection(
        Object.values(sites).filter(
          site => !site.archived && site.id !== selectedSite?.id,
        ),
      ),
    [selectedSite, sites],
  );

  const temporarySitesFeature = useMemo(
    () =>
      siteFeatureCollection(
        calloutState.kind !== 'location'
          ? []
          : [{...calloutState.coords, id: 'temp'}],
      ),
    [calloutState],
  );

  const handleClusterPress = useCallback(
    async (feature: GeoJSON.Feature, currentZoom: number) => {
      const shapeSource = shapeSourceRef.current;
      if (!shapeSource) {
        return;
      }

      const expansionZoom = await shapeSource.getClusterExpansionZoom(feature);
      const targetZoom = Math.min(expansionZoom, MAX_EXPANSION_ZOOM);

      if (targetZoom > currentZoom) {
        const animationDuration = 500 + (targetZoom - currentZoom) * 100;
        repositionCamera({
          feature: feature,
          zoomLevel: targetZoom,
          animationDuration: animationDuration,
          paddingBottom: 0,
          cameraRef: cameraRef,
        });
      } else {
        const leafFeatures = (await shapeSource.getClusterLeaves(
          feature,
          100,
          0,
        )) as GeoJSON.FeatureCollection;

        setCalloutState({
          kind: 'site_cluster',
          coords: positionToCoords(
            (feature.geometry as GeoJSON.Point).coordinates,
          ),
          siteIds: leafFeatures.features.map(feat => feat.id as string),
        });
      }
    },
    [shapeSourceRef, setCalloutState],
  );

  const onSitePress = useCallback(
    async (event: OnPressEvent) => {
      const feature = event.features[0];
      const currentZoom = await mapRef.current?.getZoom();
      if (!currentZoom) {
        console.error('Unable to fetch the current zoom level');
        return;
      }

      if (
        feature.properties &&
        'cluster' in feature.properties &&
        feature.properties.cluster
      ) {
        await handleClusterPress(feature, currentZoom);
      } else {
        repositionCamera({
          feature: feature,
          zoomLevel: currentZoom,
          animationDuration: 500,
          paddingBottom: 0,
          cameraRef: cameraRef,
        });
        setCalloutState({kind: 'site', siteId: feature.id as string});
      }
    },
    [setCalloutState, handleClusterPress],
  );

  const onTempSitePress = useCallback(
    () =>
      setCalloutState(
        calloutState.kind === 'location'
          ? {...calloutState, showCallout: true}
          : calloutState,
      ),
    [calloutState, setCalloutState],
  );

  const onPress = useCallback(
    async (feature: GeoJSON.Feature) => {
      if (feature.geometry !== null && feature.geometry.type === 'Point') {
        const currentZoom = await mapRef.current?.getZoom();
        if (!currentZoom) {
          console.error('Unable to fetch the current zoom level');
          return;
        }

        repositionCamera({
          feature: feature,
          zoomLevel: currentZoom,
          animationDuration: 500,
          paddingBottom: 320,
          cameraRef: cameraRef,
        });
        setCalloutState({
          kind: 'location',
          coords: positionToCoords(feature.geometry.coordinates),
          showCallout: true,
        });
      } else {
        Keyboard.dismiss();
        setCalloutState({kind: 'none'});
      }
    },
    [setCalloutState],
  );

  const mapImages = useMemo(
    () => ({
      sitePin: Icon.getImageSourceSync(
        'location-on',
        mapIconSizeForPlatform(35),
        colors.secondary.main,
      ),
      selectedSitePin: Icon.getImageSourceSync(
        'location-on',
        mapIconSizeForPlatform(64),
        colors.secondary.main,
      ),
      temporarySitePin: Icon.getImageSourceSync(
        'location-on',
        mapIconSizeForPlatform(35),
        colors.action.active,
      ),
    }),
    [colors],
  );

  const mapStyles = useMemo(
    () => ({
      siteLayer: {
        iconAllowOverlap: true,
        iconAnchor: 'bottom',
        iconImage: 'sitePin',
      } satisfies Mapbox.SymbolLayerStyle,
      selectedSiteLayer: {
        iconAllowOverlap: true,
        iconAnchor: 'bottom',
        iconImage: 'selectedSitePin',
      } satisfies Mapbox.SymbolLayerStyle,
      siteClusterCircleLayer: {
        circleRadius:
          35 / Platform.select({android: PixelRatio.get(), default: 1}),
        circleColor: colors.secondary.main,
      } satisfies Mapbox.CircleLayerStyle,
      siteClusterTextLayer: {
        textField: ['get', 'point_count_abbreviated'],
        textSize: 13,
        textColor: colors.primary.contrast,
      } satisfies Mapbox.SymbolLayerStyle,
      temporarySiteLayer: {
        iconAllowOverlap: true,
        iconAnchor: 'bottom',
        iconImage: 'temporarySitePin',
      } satisfies Mapbox.SymbolLayerStyle,
    }),
    [colors],
  );

  return (
    <Mapbox.MapView
      ref={mapRef}
      style={styles.mapView}
      scaleBarEnabled={false}
      styleURL={styleURL}
      onPress={onPress}
      onDidFinishLoadingMap={onMapFinishedLoading}>
      <Camera
        ref={cameraRef}
        defaultSettings={{
          centerCoordinate: DEFAULT_LOCATION,
          zoomLevel: 3,
        }}
      />
      <Mapbox.Images images={mapImages} />
      <Mapbox.ShapeSource id="selectedSiteSource" shape={selectedSiteFeature}>
        <Mapbox.SymbolLayer
          id="selectedSiteLayer"
          style={mapStyles.selectedSiteLayer}
        />
      </Mapbox.ShapeSource>
      <Mapbox.ShapeSource
        ref={shapeSourceRef}
        id="sitesSource"
        shape={sitesFeature}
        onPress={onSitePress}
        cluster
        clusterMaxZoomLevel={20}
        clusterRadius={50}>
        <Mapbox.SymbolLayer
          id="sitesLayer"
          style={mapStyles.siteLayer}
          filter={['all', ['!', ['has', 'point_count']]]}
        />
        <Mapbox.CircleLayer
          id="siteClusterCircleLayer"
          belowLayerID="sitesLayer"
          style={mapStyles.siteClusterCircleLayer}
          filter={['has', 'point_count']}
        />
        <Mapbox.SymbolLayer
          id="siteClusterTextLayer"
          style={mapStyles.siteClusterTextLayer}
          filter={['has', 'point_count']}
        />
      </Mapbox.ShapeSource>
      <Mapbox.ShapeSource
        id="temporarySitesSource"
        shape={temporarySitesFeature}
        onPress={onTempSitePress}>
        <Mapbox.SymbolLayer
          id="temporarySitesLayer"
          style={mapStyles.temporarySiteLayer}
        />
      </Mapbox.ShapeSource>
      <CustomUserLocation updateUserLocation={updateUserLocation} />
      <SiteMapCallout
        sites={sites}
        state={calloutState}
        setState={setCalloutState}
      />
    </Mapbox.MapView>
  );
};

const styles = StyleSheet.create({
  mapView: {
    flex: 1,
  },
});

export default memo(forwardRef<CameraRef, SiteMapProps>(SiteMap));
