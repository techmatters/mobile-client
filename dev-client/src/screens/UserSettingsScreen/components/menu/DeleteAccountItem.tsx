/*
 * Copyright © 2024 Technology Matters
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

import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';

import {MenuItem} from 'terraso-mobile-client/components/menus/MenuItem';
import {useIsOffline} from 'terraso-mobile-client/hooks/connectivityHooks';
import {useUserDeletionRequests} from 'terraso-mobile-client/hooks/userDeletionRequest';
import {useNavigation} from 'terraso-mobile-client/navigation/hooks/useNavigation';

export function DeleteAccountItem() {
  const {t} = useTranslation();
  const {isPending} = useUserDeletionRequests();
  const navigation = useNavigation();
  const onDeleteAccount = useCallback(
    () => navigation.navigate('DELETE_ACCOUNT'),
    [navigation],
  );

  const isDisabled = useIsOffline() === true || isPending;

  return (
    <MenuItem
      variant="destructive"
      uppercase
      icon="delete"
      label={t('settings.delete_account')}
      disabled={isDisabled}
      subLabel={isPending ? t('settings.delete_account_pending') : undefined}
      onPress={onDeleteAccount}
    />
  );
}
