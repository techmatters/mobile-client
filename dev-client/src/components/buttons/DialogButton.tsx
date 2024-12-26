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

import {useCallback, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableRipple, TouchableRippleProps} from 'react-native-paper';

import {buttonShape} from 'terraso-mobile-client/components/buttons/ButtonShapes';
import {convertColorProp} from 'terraso-mobile-client/components/util/nativeBaseAdapters';

export type DialogButtonType = 'default' | 'destructive' | 'outlined';

export type DialogButtonProps = {
  label: string;
  type?: DialogButtonType;
  onPress?: TouchableRippleProps['onPress'];
};

export const DialogButton = ({
  label,
  type = 'default',
  onPress,
}: DialogButtonProps) => {
  const [pressed, setPressed] = useState(false);
  const onPressIn = useCallback(() => setPressed(true), [setPressed]);
  const onPressOut = useCallback(() => setPressed(false), [setPressed]);

  const shape = buttonShape('dialog');
  const containerStyles = CONTAINER_STYLES[type];
  const containerStyle = pressed
    ? containerStyles.pressed
    : containerStyles.default;
  const contentStyle = CONTENT_STYLES[type];

  return (
    <View>
      <TouchableRipple
        style={[...shape.containerStyles, containerStyle]}
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}>
        <>
          <Text style={[...shape.labelStyles, contentStyle]}>{label}</Text>
        </>
      </TouchableRipple>
    </View>
  );
};

export type BaseContainedButtonProps = {
  label: string;
  type?: DialogButtonType;
  onPress?: TouchableRippleProps['onPress'];
};

const styles = StyleSheet.create({
  containerDefault: {
    borderColor: convertColorProp('primary.main'),
    backgroundColor: convertColorProp('primary.main'),
  },
  containerDefaultPressed: {
    borderColor: convertColorProp('primary.dark'),
    backgroundColor: convertColorProp('primary.dark'),
  },
  containerDestructive: {
    borderColor: convertColorProp('error.main'),
    backgroundColor: convertColorProp('error.main'),
  },
  containerDestructivePressed: {
    borderColor: convertColorProp('error.dark'),
    backgroundColor: convertColorProp('error.dark'),
  },
  containerOutlined: {
    borderColor: convertColorProp('text.primary'),
    backgroundColor: convertColorProp('transparent'),
  },
  containerOutlinedPressed: {
    borderColor: convertColorProp('text.primary'),
    backgroundColor: convertColorProp('action.selected'),
  },
  contentDefault: {
    color: convertColorProp('primary.contrast'),
  },
  contentDestructive: {
    color: convertColorProp('error.contrast'),
  },
  contentOutlined: {
    color: convertColorProp('text.primary'),
  },
});

const CONTAINER_STYLES = {
  default: {
    default: styles.containerDefault,
    pressed: styles.containerDefaultPressed,
  },
  destructive: {
    default: styles.containerDestructive,
    pressed: styles.containerDestructivePressed,
  },
  outlined: {
    default: styles.containerOutlined,
    pressed: styles.containerOutlinedPressed,
  },
};

const CONTENT_STYLES = {
  default: styles.contentDefault,
  destructive: styles.contentDestructive,
  outlined: styles.contentOutlined,
};
