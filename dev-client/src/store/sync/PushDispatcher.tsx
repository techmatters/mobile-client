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

import {useEffect} from 'react';

import {
  useDebouncedIsOffline,
  useDebouncedUnsyncedSiteIds,
  useIsLoggedIn,
  usePushDispatch,
  useRetryInterval,
} from 'terraso-mobile-client/store/sync/hooks/syncHooks';

export const PUSH_DEBOUNCE_MS = 500;
export const PUSH_RETRY_INTERVAL_MS = 1000 * 60;

/**
 * Automated system to dispatch push operations to the server.
 *
 * Listens for unsynced data and, when the app is online, sets up a Redux dispatch to push
 * the relevant entities to the server. If the push does not succeed, sets an interval to
 * retry the push until it succeeds. Retries are canceled any time the underlying state changes
 * (i.e., the set of unsynced data changes due to a success or new user-made changes.)
 */
export const PushDispatcher = () => {
  /* Determined whether the user is logged in before doing anything. */
  const isLoggedIn = useIsLoggedIn();

  /* Sebounce offline state so we know when it's safe to attempt a push. */
  const isOffline = useDebouncedIsOffline(PUSH_DEBOUNCE_MS);

  /* Also debounce unsynced IDs so we have a stable state when queuing up a push */
  const unsyncedSiteIds = useDebouncedUnsyncedSiteIds(PUSH_DEBOUNCE_MS);

  /* Set up a callback for the dispatcher to use when it determines a push is needed. */
  const dispatchPush = usePushDispatch(unsyncedSiteIds);

  /*A push is needed when the user is logged in, not offline, and has unsynced data. */
  const needsPush = isLoggedIn && !isOffline && unsyncedSiteIds.length > 0;

  /* Set up retry mechanism which will dispatch the push action when it begins. */
  const {beginRetry, endRetry} = useRetryInterval(
    PUSH_RETRY_INTERVAL_MS,
    dispatchPush,
  );

  useEffect(() => {
    /* Dispatch a push if needed */
    if (needsPush) {
      dispatchPush()
        /* If the initial push failed, begin a retry cycle */
        .then(result => {
          if (!result.payload || 'error' in result.payload) {
            beginRetry();
          }
        })
        .catch(beginRetry);
    }

    /* Cancel any pending retries when push input changes or component unmounts */
    return endRetry;
  }, [needsPush, dispatchPush, beginRetry, endRetry]);

  return <></>;
};