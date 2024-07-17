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

import {formatCoordinate} from 'terraso-mobile-client/util';

export const getElevation = async (
  lat: number,
  lng: number,
): Promise<number | undefined> => {
  // 1. TypeScript requires values passed to URLSearchParams strings,
  //    which is why we convert the floats to strings.
  // 2. This API uses X for longitude and Y for latitude. That's not a typo.
  const queryString = new URLSearchParams({
    x: formatCoordinate(lng),
    y: formatCoordinate(lat),
    units: 'Meters', // TODO: switch based on user preference
  });
  let elevation;

  try {
    const response = await fetch(
      `https://epqs.nationalmap.gov/v1/json/?${queryString}`,
    );
    const textResult = await response.text();
    if (textResult === 'Invalid or missing input parameters.') {
      return;
    }
    const result = JSON.parse(textResult);

    elevation = parseFloat(result.value);
  } catch (error) {
    console.error(error);
  }
  return elevation;
};
