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

import {
  Text,
  Column,
  Box,
} from 'terraso-mobile-client/components/NativeBaseAdapters';
import {useTranslation} from 'react-i18next';
import {IconButton} from 'terraso-mobile-client/components/Icons';
import {
  MunsellColor,
  munsellToRGB,
  munsellToString,
} from 'terraso-mobile-client/screens/SoilScreen/ColorScreen/utils/munsellConversions';
import {ConfirmModal} from 'terraso-mobile-client/components/modals/ConfirmModal';

type Props = {
  color: MunsellColor;
  onDelete?: () => void;
  dimensions: number;
};
export const ColorDisplay = ({dimensions, onDelete, color}: Props) => {
  const {t} = useTranslation();

  const rgb = munsellToRGB(color);
  const bgColor = rgb ? `rgb(${rgb.join(', ')})` : undefined;
  return (
    <Column alignItems="center">
      <Text variant="body1-strong">{munsellToString(color)}</Text>
      <Box height="8px" />
      <Box
        width={dimensions}
        height={dimensions}
        backgroundColor={bgColor}
        borderWidth="2px">
        {onDelete && (
          <ConfirmModal
            title={t('soil.color.confirm_delete.title')}
            body={t('soil.color.confirm_delete.body')}
            actionName={t('soil.color.confirm_delete.action_name')}
            handleConfirm={onDelete}
            trigger={onPress => (
              <IconButton
                position="absolute"
                name="delete"
                top="-18px"
                right="-18px"
                size="md"
                borderRadius="full"
                backgroundColor="grey.300"
                _icon={{color: 'action.active'}}
                onPress={onPress}
              />
            )}
          />
        )}
      </Box>
    </Column>
  );
};
