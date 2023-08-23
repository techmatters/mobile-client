import SiteMap from '../components/home/SiteMap';
import {useCallback, useEffect, useRef, useState} from 'react';
import Mapbox, {Camera, Location} from '@rnmapbox/maps';
import {Coords, updateLocation} from '../model/map/mapSlice';
import {useDispatch} from '../model/store';
import {useSelector} from '../model/store';
import {Site, fetchSitesForUser} from 'terraso-client-shared/site/siteSlice';
import BottomSheet from '../components/home/BottomSheet';
import {ScreenDefinition} from './AppScaffold';
import {MainMenuBar, MapInfoIcon} from './HeaderIcons';
import {ScreenScaffold} from './ScreenScaffold';
import {fetchProjectsForUser} from 'terraso-client-shared/project/projectSlice';
import MapSearch from '../components/home/MapSearch';
import {Box} from 'native-base';
import {coordsToPosition} from '../components/common/Map';

export type CalloutState =
  | {
      kind: 'site';
      siteId: string;
    }
  | {
      kind: 'location';
      coords: Coords;
      showCallout: boolean;
    }
  | {kind: 'none'};

const STARTING_ZOOM_LEVEL = 12;

const HomeView = () => {
  const [mapInitialized, setMapInitialized] = useState<Location | null>(null);
  const [mapStyleURL, setMapStyleURL] = useState(Mapbox.StyleURL.Street);
  const [calloutState, setCalloutState] = useState<CalloutState>({
    kind: 'none',
  });
  const currentUserID = useSelector(
    state => state.account.currentUser?.data?.id,
  );
  const sites = useSelector(state => state.site.sites);
  const currentUserLocation = useSelector(state => state.map.userLocation);
  const dispatch = useDispatch();
  const camera = useRef<Camera | null>(null);

  useEffect(() => {
    // load sites on mount
    dispatch(fetchSitesForUser());
    dispatch(fetchProjectsForUser());
  }, [dispatch, currentUserID]);

  const moveToPoint = useCallback(
    (coords: Coords) => {
      // TODO: flyTo, zoomTo don't seem to work, find out why
      //camera.current?.flyTo([longitude, latitude]);
      //camera.current?.zoomTo(STARTING_ZOOM_LEVEL);
      camera.current?.setCamera({
        centerCoordinate: coordsToPosition(coords),
        zoomLevel: STARTING_ZOOM_LEVEL,
      });
    },
    [camera],
  );

  const searchFunction = useCallback(
    (coords: Coords) => {
      setCalloutState({kind: 'location', showCallout: false, coords});
      moveToPoint(coords);
    },
    [setCalloutState, moveToPoint],
  );

  useEffect(() => {
    if (mapInitialized !== null && camera.current !== undefined) {
      moveToPoint(mapInitialized.coords);
    }
  }, [mapInitialized, camera, moveToPoint]);

  const updateUserLocation = useCallback(
    (location: Location) => {
      dispatch(updateLocation(location));
      // only set map center at start for now
      if (mapInitialized === null) {
        setMapInitialized(location);
      }
    },
    [dispatch, mapInitialized, setMapInitialized],
  );

  const moveToUser = useCallback(() => {
    if (currentUserLocation?.coords !== undefined) {
      moveToPoint(currentUserLocation.coords);
    }
  }, [currentUserLocation, moveToPoint]);

  const toggleMapLayer = useCallback(
    () =>
      setMapStyleURL(
        mapStyleURL === Mapbox.StyleURL.Street
          ? Mapbox.StyleURL.Satellite
          : Mapbox.StyleURL.Street,
      ),
    [mapStyleURL, setMapStyleURL],
  );

  const showSiteOnMap = useCallback(
    (site: Site) => {
      moveToPoint(site);
      setCalloutState({kind: 'site', siteId: site.id});
    },
    [moveToPoint, setCalloutState],
  );

  return (
    <ScreenScaffold>
      <Box flex={1} zIndex={-1}>
        <MapSearch
          zoomTo={searchFunction}
          zoomToUser={moveToUser}
          toggleMapLayer={toggleMapLayer}
        />
        <SiteMap
          updateUserLocation={updateUserLocation}
          sites={sites}
          ref={camera}
          calloutState={calloutState}
          setCalloutState={setCalloutState}
          styleURL={mapStyleURL}
        />
      </Box>
      <BottomSheet sites={sites} showSiteOnMap={showSiteOnMap} />
    </ScreenScaffold>
  );
};

export const HomeScreen: ScreenDefinition = {
  View: HomeView,
  options: () => ({
    headerLeft: MainMenuBar,
    headerRight: MapInfoIcon,
  }),
};
