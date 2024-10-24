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

import {useCallback} from 'react';

import {Button} from 'native-base';

import {Text} from 'terraso-mobile-client/components/NativeBaseAdapters';
import {RestrictByFlag} from 'terraso-mobile-client/components/RestrictByFlag';
import {fetchSoilDataForUser} from 'terraso-mobile-client/model/soilId/soilIdGlobalReducer';
import {selectUnsyncedSiteIds} from 'terraso-mobile-client/model/soilId/soilIdSelectors';
import {useDispatch, useSelector} from 'terraso-mobile-client/store';

// TODO: I expect this will move or be removed by the time we actually release the offline feature,
// but is helpful for manually testing
export const SyncButton = () => {
  const dispatch = useDispatch();

  const currentUserID = useSelector(
    state => state.account.currentUser?.data?.id,
  );
  const unsyncedIds = useSelector(selectUnsyncedSiteIds);

  const onSync = useCallback(() => {
    if (currentUserID !== undefined) {
      dispatch(fetchSoilDataForUser(currentUserID));
    }
  }, [currentUserID, dispatch]);

  return (
    // TODO-offline: Create string in en.json if we actually want this button for reals
    <RestrictByFlag flag="FF_offline">
      <Button onPress={onSync}>SYNC: pull</Button>
      <Text>({unsyncedIds.length} changed sites)</Text>
    </RestrictByFlag>
  );
};
