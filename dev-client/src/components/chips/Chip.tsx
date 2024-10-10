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

import {StyleSheet, View} from 'react-native';

import {Icon, IconName} from 'terraso-mobile-client/components/icons/Icon';
import {Text} from 'terraso-mobile-client/components/NativeBaseAdapters';
import {convertColorProp} from 'terraso-mobile-client/components/util/nativeBaseAdapters';

type Props = {
  label: string;
  iconName?: IconName;
};

export const Chip = ({label, iconName}: Props) => {
  return (
    <View style={styles.container}>
      {iconName && (
        <Icon
          name={iconName}
          size="md"
          color="action.active"
          style={styles.icon}
        />
      )}
      <Text variant="chip-text" style={styles.text}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 4,
    borderRadius: 100,
    backgroundColor: convertColorProp('primary.lighter'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 30,
  },
  icon: {
    marginLeft: 4,
  },
  text: {
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
});
