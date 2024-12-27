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
import {TouchableRippleProps} from 'react-native-paper';

import {OutlinedButton} from 'terraso-mobile-client/components/buttons/OutlinedButton';

export type CreateSiteButtonProps = {
  disabled?: boolean;
  onPress?: TouchableRippleProps['onPress'];
};

export const CreateSiteButton = ({
  disabled,
  onPress,
}: CreateSiteButtonProps) => {
  const {t} = useTranslation();

  return (
    <OutlinedButton
      label={t('site.create.title')}
      disabled={disabled}
      onPress={onPress}
    />
  );
};
