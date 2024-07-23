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

import {DepthDependentSoilData} from 'terraso-client-shared/soilId/soilIdTypes';

import {isColorComplete} from 'terraso-mobile-client/model/color/soilColorValidation';

describe('isColorComplete', () => {
  test('returns true if complete', () => {
    expect(
      isColorComplete({
        colorHue: 1,
        colorValue: 2,
        colorChroma: 3,
      } as DepthDependentSoilData),
    ).toEqual(true);
  });

  test('returns false if value is missing any number', () => {
    expect(isColorComplete({} as DepthDependentSoilData)).toEqual(false);

    expect(
      isColorComplete({
        colorHue: 1,
        colorValue: null,
        colorChroma: null,
      } as DepthDependentSoilData),
    ).toEqual(false);

    expect(
      isColorComplete({
        colorHue: null,
        colorValue: 1,
        colorChroma: null,
      } as DepthDependentSoilData),
    ).toEqual(false);

    expect(
      isColorComplete({
        colorHue: null,
        colorValue: null,
        colorChroma: 1,
      } as DepthDependentSoilData),
    ).toEqual(false);
  });
});
