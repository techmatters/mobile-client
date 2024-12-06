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

import {useTranslation} from 'react-i18next';

import {MenuItem} from 'terraso-mobile-client/components/menus/MenuItem';
import {SignOutModal} from 'terraso-mobile-client/components/modals/SignOutModal';
import {useIsOffline} from 'terraso-mobile-client/hooks/connectivityHooks';

export function SignOutItem() {
  const {t} = useTranslation();

  const isDisabled = useIsOffline();

  return isDisabled ? (
    <MenuItem
      variant="default"
      uppercase
      icon="logout"
      label={t('settings.sign_out')}
      disabled={isDisabled}
    />
  ) : (
    <SignOutModal
      trigger={onOpen => (
        <MenuItem
          variant="default"
          uppercase
          icon="logout"
          label={t('settings.sign_out')}
          onPress={onOpen}
        />
      )}
    />
  );
}
