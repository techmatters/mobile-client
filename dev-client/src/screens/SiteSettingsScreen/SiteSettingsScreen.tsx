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

import {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';

import {Button, Fab} from 'native-base';

import {deleteSite, updateSite} from 'terraso-client-shared/site/siteSlice';

import {Icon} from 'terraso-mobile-client/components/icons/Icon';
import {TextInput} from 'terraso-mobile-client/components/inputs/TextInput';
import {ConfirmModal} from 'terraso-mobile-client/components/modals/ConfirmModal';
import {Column} from 'terraso-mobile-client/components/NativeBaseAdapters';
import {SITE_NAME_MAX_LENGTH} from 'terraso-mobile-client/constants';
import {AppBar} from 'terraso-mobile-client/navigation/components/AppBar';
import {useNavigation} from 'terraso-mobile-client/navigation/hooks/useNavigation';
import {ScreenScaffold} from 'terraso-mobile-client/screens/ScreenScaffold';
import {useDispatch, useSelector} from 'terraso-mobile-client/store';

type Props = {
  siteId: string;
};

export const SiteSettingsScreen = ({siteId}: Props) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const site = useSelector(state => state.site.sites[siteId]);
  const [name, setName] = useState(site?.name);

  const onSave = useCallback(
    () => dispatch(updateSite({id: site.id, name})),
    [dispatch, site, name],
  );

  const onDelete = useCallback(async () => {
    await dispatch(deleteSite(site));
    navigation.navigate('BOTTOM_TABS');
  }, [dispatch, navigation, site]);

  if (!site) {
    return null;
  }

  return (
    <ScreenScaffold BottomNavigation={null} AppBar={<AppBar title={name} />}>
      <Column px="16px" py="22px" space="20px" alignItems="flex-start">
        <TextInput
          maxLength={SITE_NAME_MAX_LENGTH}
          value={name}
          onChangeText={setName}
          label={t('site.create.name_label')}
          placeholder={t('site.create.name_label')}
        />
        <ConfirmModal
          trigger={onOpen => (
            <Button
              pl={0}
              variant="link"
              _text={{color: 'error.main'}}
              startIcon={<Icon color="error.main" name="delete-forever" />}
              onPress={onOpen}>
              {t('site.dashboard.delete_button')}
            </Button>
          )}
          title={t('site.dashboard.delete_site_modal.title')}
          body={t('site.dashboard.delete_site_modal.body', {
            siteName: site.name,
          })}
          actionName={t('site.dashboard.delete_site_modal.action_name')}
          handleConfirm={onDelete}
        />
      </Column>
      <Fab label={t('general.save_fab')} onPress={onSave} />
    </ScreenScaffold>
  );
};
