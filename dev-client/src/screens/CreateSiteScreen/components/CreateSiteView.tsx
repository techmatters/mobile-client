/*
 * Copyright © 2023 Technology Matters
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see https://www.gnu.org/licenses/.
 */

import {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';

import {Formik} from 'formik';

import {SiteAddMutationInput} from 'terraso-client-shared/graphqlSchema/graphql';
import {Site} from 'terraso-client-shared/site/siteTypes';
import {Coords} from 'terraso-client-shared/types';

import {useSitesScreenContext} from 'terraso-mobile-client/context/SitesScreenContext';
import {useNavigation} from 'terraso-mobile-client/navigation/hooks/useNavigation';
import {siteValidationSchema} from 'terraso-mobile-client/schemas/siteValidationSchema';
import {
  CreateSiteForm,
  FormState,
} from 'terraso-mobile-client/screens/CreateSiteScreen/components/CreateSiteForm';
import {useSelector} from 'terraso-mobile-client/store';

type Props = {
  defaultProjectId?: string;
  sitePin?: Coords;
  elevation?: number;
  createSiteCallback: (
    input: SiteAddMutationInput,
  ) => Promise<Site | undefined>;
};

export const CreateSiteView = ({
  defaultProjectId,
  createSiteCallback,
  sitePin,
  elevation,
}: Props) => {
  const {t} = useTranslation();
  const validationSchema = useMemo(() => siteValidationSchema(t), [t]);
  const defaultProject = useSelector(state =>
    defaultProjectId ? state.project.projects[defaultProjectId] : undefined,
  );
  const sitesScreen = useSitesScreenContext();

  const navigation = useNavigation();

  const onSave = useCallback(
    async ({...form}: FormState) => {
      const {...site} = validationSchema.cast(form);
      const createdSite = await createSiteCallback({...site, elevation});
      if (createdSite !== undefined) {
        sitesScreen?.showSiteOnMap(createdSite);
        navigation.navigate('BOTTOM_TABS');
      }
    },
    [createSiteCallback, navigation, validationSchema, sitesScreen, elevation],
  );

  return (
    <Formik<FormState>
      onSubmit={onSave}
      validationSchema={validationSchema}
      initialValues={{
        name: '',
        latitude: sitePin?.latitude !== undefined ? sitePin?.latitude : 0,
        longitude: sitePin?.longitude !== undefined ? sitePin?.longitude : 0,
        projectId: defaultProject?.id,
        privacy: defaultProject?.privacy ?? 'PUBLIC',
      }}
      validateOnMount={true}
      initialTouched={{
        name: true,
      }}>
      {({isValid, ...props}) => (
        <CreateSiteForm {...props} sitePin={sitePin} isValid={isValid} />
      )}
    </Formik>
  );
};
