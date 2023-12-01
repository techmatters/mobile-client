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

import {useNavigation} from 'terraso-mobile-client/navigation/hooks/useNavigation';
import {useSelector} from 'terraso-mobile-client/store';
import {useTranslation} from 'react-i18next';
import {useMemo} from 'react';
import {ScreenScaffold} from 'terraso-mobile-client/screens/ScreenScaffold';
import {ScreenCloseButton} from 'terraso-mobile-client/navigation/components/ScreenCloseButton';
import {AppBarIconButton} from 'terraso-mobile-client/navigation/components/AppBarIconButton';
import {AppBar} from 'terraso-mobile-client/navigation/components/AppBar';
import {SiteScreen} from 'terraso-mobile-client/screens/SiteScreen/SiteScreen';
import {Coords} from 'terraso-mobile-client/model/map/mapSlice';
import {LocationDashboardTabNavigator} from 'terraso-mobile-client/navigation/navigators/LocationDashboardTabNavigator';

type Props = {siteId?: string; coords?: Coords};

export const LocationDashboardScreen = ({siteId, coords}: Props) => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const site = useSelector(state =>
    siteId === undefined ? undefined : state.site.sites[siteId],
  );
  if (coords === undefined) {
    coords = site!;
  }

  const appBarRightButton = useMemo(
    () =>
      siteId ? (
        <AppBarIconButton
          name="settings"
          onPress={() => navigation.navigate('SITE_SETTINGS', {siteId})}
        />
      ) : (
        <AppBarIconButton
          name="add"
          onPress={() => navigation.navigate('CREATE_SITE', {coords})}
        />
      ),
    [siteId, coords, navigation],
  );

  return (
    <ScreenScaffold
      AppBar={
        <AppBar
          LeftButton={<ScreenCloseButton />}
          RightButton={appBarRightButton}
          title={site?.name ?? t('site.dashboard.default_title')}
        />
      }>
      {siteId ? (
        <LocationDashboardTabNavigator siteId={siteId} />
      ) : (
        <SiteScreen siteId={siteId} coords={coords} />
      )}
    </ScreenScaffold>
  );
};
