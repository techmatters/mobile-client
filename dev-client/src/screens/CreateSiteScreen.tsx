import {useCallback} from 'react';
import CreateSiteView from '../components/sites/CreateSiteView';
import {useDispatch, useSelector} from '../model/store';
import {addSite} from 'terraso-client-shared/site/siteSlice';
import {SiteAddMutationInput} from 'terraso-client-shared/graphqlSchema/graphql';
// import {ScreenRoutes, TopLevelScreenProps} from './constants';

// type Props = TopLevelScreenProps<ScreenRoutes.CREATE_SITE>;

export default function CreateSiteScreen() {
  const userLocation = useSelector(state => state.map.userLocation);
  const dispatch = useDispatch();

  const createSiteCallback = useCallback((input: SiteAddMutationInput) => {
    dispatch(addSite(input));
  }, []);

  return (
    <CreateSiteView
      projects={[]}
      userLocation={userLocation}
      createSiteCallback={createSiteCallback}
    />
  );
}
