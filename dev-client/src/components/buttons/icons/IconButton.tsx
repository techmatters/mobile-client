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

import React, {forwardRef} from 'react';
import {Pressable, PressableProps, StyleSheet, View} from 'react-native';

import MaterialIcon from '@expo/vector-icons/MaterialIcons';

import {IconButton as NativeIconButton} from 'native-base';

import {IconName} from 'terraso-mobile-client/components/icons/Icon';
import {
  convertColorProp,
  convertIconSize,
} from 'terraso-mobile-client/components/util/nativeBaseAdapters';

export type IconButtonType = 'sm' | 'md' | 'sq';

export type IconButtonVariant =
  | 'normal'
  | 'normal-filled'
  | 'light'
  | 'light-filled'
  | 'location';

export type IconButtonProps = React.ComponentProps<typeof NativeIconButton> & {
  type: IconButtonType;
  name: IconName;
  variant?: IconButtonVariant;
  accessibilityLabel?: string;
  onPress?: PressableProps['onPress'];
};

export const IconButton = forwardRef<View, IconButtonProps>(
  (
    {
      type,
      name,
      variant = 'normal',
      accessibilityLabel,
      onPress,
    }: IconButtonProps,
    ref,
  ) => {
    return (
      <Pressable
        ref={ref}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}>
        <MaterialIcon
          name={name}
          size={convertIconSize(type === 'sq' ? 'md' : type)}
          style={[
            styles.base,
            iconStyleForType(type),
            iconStyleForVariant(variant),
          ]}
        />
      </Pressable>
    );
  },
);

const iconStyleForType = (type: IconButtonType) => {
  switch (type) {
    case 'sm':
      return styles.sm;
    case 'md':
      return styles.md;
    case 'sq':
      return styles.sq;
  }
};

const iconStyleForVariant = (variant: IconButtonVariant) => {
  switch (variant) {
    case 'normal-filled':
      return styles.normalFilled;
    case 'light':
      return styles.light;
    case 'light-filled':
      return styles.lightFilled;
    case 'location':
      return styles.location;
    default:
      return styles.normal;
  }
};

const styles = StyleSheet.create({
  base: {
    verticalAlign: 'middle',
    textAlign: 'center',
  },
  sm: {
    padding: 4,
    borderRadius: 100,
  },
  md: {
    padding: 12,
    borderRadius: 100,
  },
  sq: {
    padding: 8,
    borderRadius: 5,
  },
  normal: {
    color: convertColorProp('text.locationicon'),
    backgroundColor: convertColorProp('transparent'),
  },
  normalFilled: {
    color: convertColorProp('text.locationicon'),
    backgroundColor: convertColorProp('grey.200'),
  },
  light: {
    color: convertColorProp('primary.contrast'),
    backgroundColor: convertColorProp('transparent'),
  },
  lightFilled: {
    color: convertColorProp('text.locationicon'),
    backgroundColor: convertColorProp('primary.contrast'),
  },
  location: {
    color: convertColorProp('secondary.dark'),
    backgroundColor: convertColorProp('transparent'),
    borderColor: convertColorProp('secondary.dark'),
    borderWidth: 1,
  },
});