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

import {testState} from '@testing/integration/data';
import {render} from '@testing/integration/utils';

import {collectionMethods} from 'terraso-client-shared/soilId/soilIdTypes';
import {fromEntries} from 'terraso-client-shared/utils';

import {methodRequired} from 'terraso-mobile-client/model/soilData/soilDataSlice';
import {SlopeScreen} from 'terraso-mobile-client/screens/SlopeScreen/SlopeScreen';

test('renders correctly', () => {
  const screen = render(<SlopeScreen siteId="1" />, {
    route: 'SITE_TABS',
    initialState: {
      ...testState,
      soilData: {
        status: 'ready',
        soilData: {
          '1': {
            depthIntervalPreset: 'NRCS',
            depthIntervals: [],
            depthDependentData: [],
            slopeSteepnessSelect: 'FLAT',
          },
        },
        soilSync: {},
        projectSettings: {
          '1': {
            ...fromEntries(
              collectionMethods.map(method => [methodRequired(method), false]),
            ),
            soilPitRequired: false,
            depthIntervalPreset: 'NRCS',
            depthIntervals: [],
            slopeRequired: true,
          },
        },
      },
    },
  }).toJSON();

  expect(screen).toMatchSnapshot();
});
