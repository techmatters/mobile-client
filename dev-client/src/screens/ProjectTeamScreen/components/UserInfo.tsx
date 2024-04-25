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

import {Image} from 'native-base';
import {User} from 'terraso-client-shared/account/accountSlice';
import {useTranslation} from 'react-i18next';
import {useMemo} from 'react';
import {ProjectMembership} from 'terraso-client-shared/project/projectSlice';
import {formatName} from 'terraso-mobile-client/util';
import {
  Box,
  HStack,
  Badge,
  Text,
} from 'terraso-mobile-client/components/NativeBaseAdapters';

type InfoProps = {
  membership: ProjectMembership;
  user: User;
  isCurrentUser: boolean;
};

export const UserInfo = ({membership, user, isCurrentUser}: InfoProps) => {
  const {t} = useTranslation();
  const userLabel = useMemo(() => {
    let label = formatName(user.firstName, user.lastName);

    if (isCurrentUser) {
      label += ` (${t('general.you')})`;
    }
    return label;
  }, [user, isCurrentUser, t]);

  return (
    <HStack space={3} justifyContent="space-between" alignItems="center">
      <Box>
        <Image
          variant="profilePic"
          source={{uri: user.profileImage}}
          alt="profile pic"
        />
      </Box>
      <Text flex={3}>{userLabel}</Text>
      <Box>
        <Badge
          variant="chip"
          bg="primary.lighter"
          py="5px"
          px="10px"
          _text={{color: 'text.primary'}}>
          {t(`general.role.${membership.userRole}`)}
        </Badge>
      </Box>
    </HStack>
  );
};
