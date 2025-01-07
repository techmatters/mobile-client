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

import {render} from '@testing/integration/utils';

import {FeatureFlagName} from 'terraso-mobile-client/config/featureFlags';
import {SyncNotificationContext} from 'terraso-mobile-client/context/SyncNotificationContext';
import {SiteSettingsScreen} from 'terraso-mobile-client/screens/SiteSettingsScreen/SiteSettingsScreen';
import {AppState as ReduxAppState} from 'terraso-mobile-client/store';

// TODO-cknipe:
// - Mock syncNotification show
// - Turn the feature flag on

// -------- Too hard ---------
// - Set up redux store
// - Make sure that works
// - Navigate to the site settings screen??
// - Mock dispatch for deleteSite to delete a site from the redux store?

jest.mock('terraso-mobile-client/config/featureFlags', () => {
  const actual = jest.requireActual(
    'terraso-mobile-client/navigation/hooks/useNavigation',
  );
  return {
    ...actual,
    isFlagEnabled: (flag: FeatureFlagName) => {
      if (flag === 'FF_offline') return true;
    },
  };
});

describe('SiteSettingsScreen', () => {
  const site1 = {
    id: 'site1',
    name: 'Site 1',
    latitude: 0,
    longitude: 0,
    privacy: 'PRIVATE',
    archived: false,
    updatedAt: '',
    notes: {},
  };
  const site2 = {
    id: 'site2',
    name: 'Site 2',
    latitude: 1,
    longitude: 1,
    privacy: 'PRIVATE',
    archived: false,
    updatedAt: '',
    notes: {},
  };
  const stateWithTwoSites = {
    site: {
      sites: {
        site1: site1,
        site2: site2,
      },
    },
  } as Partial<ReduxAppState>;

  const mockShowError = jest.fn();

  beforeEach(() => {
    mockShowError.mockReset();
  });

  test('displays delete button and no error', () => {
    const screen = render(
      <SyncNotificationContext.Provider value={{showError: mockShowError}}>
        <SiteSettingsScreen siteId="site1" />
      </SyncNotificationContext.Provider>,
      {
        route: 'SITE_TABS',
        initialState: stateWithTwoSites,
      },
    );

    expect(screen.getByText('Delete this site')).toBeOnTheScreen();
    expect(mockShowError).not.toHaveBeenCalled();
  });

  test('renders no content and displays error if missing site', () => {
    const screen = render(
      <SyncNotificationContext.Provider value={{showError: mockShowError}}>
        <SiteSettingsScreen siteId="site-that-does-not-exist" />
      </SyncNotificationContext.Provider>,
      {
        route: 'SITE_TABS',
        initialState: stateWithTwoSites,
      },
    );

    expect(screen.queryByText('Delete this site')).toBeNull();
    expect(mockShowError).toHaveBeenCalled();
  });
});
