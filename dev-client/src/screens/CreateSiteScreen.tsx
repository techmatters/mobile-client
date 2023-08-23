import {useCallback} from 'react';
import CreateSiteView from '../components/sites/CreateSiteView';
import {useDispatch, useSelector} from '../model/store';
import {
  Site,
  addSite,
  fetchSitesForProject,
} from 'terraso-client-shared/site/siteSlice';
import {SiteAddMutationInput} from 'terraso-client-shared/graphqlSchema/graphql';
import {ScreenDefinition} from './AppScaffold';
import CloseButton from '../components/common/CloseButton';

type Props =
  | {
      mapCoords?: Pick<Site, 'latitude' | 'longitude'>;
    }
  | {
      projectId: string;
    }
  | undefined;

const CreateSiteScaffold = (props: Props = {}) => {
  const userLocation = useSelector(state => state.map.userLocation);
  const dispatch = useDispatch();

  const createSiteCallback = useCallback(
    async (input: SiteAddMutationInput) => {
      let result = await dispatch(addSite(input));
      if (result.payload && 'error' in result.payload) {
        console.error(result.payload.error);
        console.error(result.payload.parsedErrors);
        return;
      }
      if (input.projectId) {
        dispatch(fetchSitesForProject(input.projectId));
      }
      return result.payload;
    },
    [dispatch],
  );

  return (
    <CreateSiteView
      userLocation={userLocation}
      createSiteCallback={createSiteCallback}
      defaultProject={('projectId' in props && props.projectId) || undefined}
      sitePin={
        'mapCoords' in props && props.mapCoords
          ? {coords: props.mapCoords}
          : undefined
      }
    />
  );
};

export const CreateSiteScreen: ScreenDefinition<Props> = {
  View: CreateSiteScaffold,
  options: () => ({headerLeft: CloseButton, headerBackVisible: false}),
};
