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

import React from 'react';

import {IconButton as NativeIconButton} from 'native-base';

import {Icon, IconName} from 'terraso-mobile-client/components/icons/Icon';

export type IconButtonProps = React.ComponentProps<typeof NativeIconButton> & {
  name: IconName;
};

export const IconButton = React.forwardRef(
  ({name, ...props}: IconButtonProps, ref: React.Ref<unknown>) => {
    return (
      <NativeIconButton ref={ref} icon={<Icon name={name} />} {...props} />
    );
  },
);
