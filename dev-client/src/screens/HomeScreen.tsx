import SiteMap from '../components/home/SiteMap';
import {useCallback, useEffect, useRef, useState} from 'react';
import {Camera, Location} from '@rnmapbox/maps';
import {updateLocation} from '../model/map/mapSlice';
import {useDispatch} from '../model/store';
import {useSelector} from '../model/store';
import {fetchSitesForUser} from 'terraso-client-shared/site/siteSlice';
import BottomSheet from '../components/home/BottomSheet';
import {ScreenDefinition} from './AppScaffold';
import {MainMenuBar, MapInfoIcon} from './HeaderIcons';
import {ScreenScaffold} from './ScreenScaffold';
import {fetchProjectsForUser} from 'terraso-client-shared/project/projectSlice';
import MapSearch from '../components/home/MapSearch';

export interface TempSite {
  longitude: number;
  latitude: number;
}

export type TempSiteDisplay = {
  site: TempSite;
  showCallout: boolean;
};

const STARTING_ZOOM_LEVEL = 8;

const HomeView = () => {
  const [mapInitialized, setMapInitialized] = useState<Location | null>(null);
  const [temporarySite, setTemporarySite] = useState<TempSiteDisplay | null>(
    null,
  );
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
    ({longitude, latitude}: Location['coords']) => {
      // TODO: flyTo, zoomTo don't seem to work, find out why
      //camera.current?.flyTo([longitude, latitude]);
      //camera.current?.zoomTo(STARTING_ZOOM_LEVEL);
      camera.current?.setCamera({
        centerCoordinate: [longitude, latitude],
        zoomLevel: STARTING_ZOOM_LEVEL,
      });
    },
    [camera],
  );

  const searchFunction = useCallback(
    (site: TempSite) => {
      setTemporarySite({site, showCallout: false});
      moveToPoint(site);
    },
    [setTemporarySite],
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

  return (
    <ScreenScaffold>
      <MapSearch zoomTo={searchFunction} zoomToUser={moveToUser} />
      <SiteMap
        updateUserLocation={updateUserLocation}
        sites={sites}
        ref={camera}
        temporarySite={temporarySite}
        setTemporarySite={site => {
          setTemporarySite(site !== null ? {...site, showCallout: true} : null);
        }}
        showCallout={() => {
          temporarySite !== null &&
            setTemporarySite(site =>
              site !== null ? {...site, showCallout: true} : null,
            );
        }}
      />
      <BottomSheet sites={sites} showSiteOnMap={moveToPoint} />
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
