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
import {NativeModules, Platform} from 'react-native';

export const getSystemLocale = () => {
  let locale;
  if (Platform.OS === 'ios') {
    locale =
      NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0];
  } else if (Platform.OS === 'android') {
    locale = NativeModules.I18nManager.localeIdentifier;
  } else {
    locale = 'en-US';
  }

  return locale.replace('_', '-');
};

export const formatDate = (dateString: string) => {
  const locale = getSystemLocale();
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'short',
  }).format(new Date(dateString));
};

export const formatName = (firstName: string, lastName?: string) => {
  return [lastName, firstName].filter(Boolean).join(', ');
};

export const formatFullName = (firstName: string, lastName?: string) => {
  return firstName + ' ' + lastName;
};

export const removeKeys = (a: any, b: any) => {
  const remove = [a, b];
  let currA, currB;
  while (remove.length) {
    currA = remove.pop();
    currB = remove.pop();
    for (const keyA of Object.keys(currA)) {
      if (!(keyA in currB)) {
        delete currA[keyA];
        continue;
      }
      const valA = currA[keyA];
      const valB = currB[keyA];
      if (typeof valA !== typeof valB) {
        delete currA[keyA];
        continue;
      }
      if (typeof valA === 'object' && !Array.isArray(valA) && valA !== null) {
        remove.push(valA, valB);
      }
    }
  }
};
