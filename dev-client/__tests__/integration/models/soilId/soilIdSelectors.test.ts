/*
 * Copyright © 2023-2024 Technology Matters
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

import {renderSelectorHook} from '@testing/integration/utils';
import {cloneDeep} from 'lodash';

import {initialState as accountInitialState} from 'terraso-client-shared/account/accountSlice';
import {SoilData} from 'terraso-client-shared/soilId/soilIdTypes';

import {
  selectSyncErrorSites,
  selectUnsyncedSiteIds,
  selectUnsyncedSites,
} from 'terraso-mobile-client/model/soilId/soilIdSelectors';
import {
  markChanged,
  markError,
  markSynced,
} from 'terraso-mobile-client/model/sync/sync';
import {AppState, useSelector} from 'terraso-mobile-client/store';

const appState = (): AppState => {
  return {
    account: {...accountInitialState},
    map: {userLocation: {accuracyM: null, coords: null}},
    elevation: {elevationCache: {}},
    notifications: {messages: {}},
    preferences: {colorWorkflow: 'MANUAL'},
    project: {projects: {}},
    site: {sites: {}},
    soilId: {
      matches: {},
      projectSettings: {},
      soilChanges: {},
      soilData: {},
      status: 'ready',
    },
  };
};

const soilData = (): SoilData => {
  return {
    depthIntervalPreset: 'CUSTOM',
    depthDependentData: [],
    depthIntervals: [],
  };
};

describe('selectUnsyncedSites', () => {
  test('selects unsynced sites only', () => {
    const state = appState();
    const now = Date.now();
    markSynced(state.soilId.soilChanges, 'a', {data: soilData()}, now);
    markChanged(state.soilId.soilChanges, 'b', now);

    const selected = renderSelectorHook(
      () => useSelector(selectUnsyncedSites),
      state,
    );

    expect(selected).toEqual({
      b: {lastModifiedAt: now, revisionId: 1},
    });
  });

  test('returns stable values for input states only', () => {
    const stateA = appState();
    markChanged(stateA.soilId.soilChanges, 'a', Date.now());

    const selectedA1 = renderSelectorHook(
      () => useSelector(selectUnsyncedSites),
      stateA,
    );
    const selectedA2 = renderSelectorHook(
      () => useSelector(selectUnsyncedSites),
      stateA,
    );

    const stateB = cloneDeep(stateA);
    markChanged(stateB.soilId.soilChanges, 'b', Date.now());

    const selectedB = renderSelectorHook(
      () => useSelector(selectUnsyncedSites),
      stateB,
    );

    expect(selectedA1).toBe(selectedA2);
    expect(selectedA1).not.toBe(selectedB);
    expect(selectedA2).not.toBe(selectedB);
  });
});

describe('selectUnsyncedSiteIds', () => {
  test('selects unsynced site IDs only, sorted', () => {
    const state = appState();
    const now = Date.now();
    markSynced(state.soilId.soilChanges, 'a', {data: soilData()}, now);

    markChanged(state.soilId.soilChanges, 'c', now);
    markChanged(state.soilId.soilChanges, 'b', now);

    const selected = renderSelectorHook(
      () => useSelector(selectUnsyncedSiteIds),
      state,
    );

    expect(selected).toEqual(['b', 'c']);
  });

  test('returns stable values for input states', () => {
    const stateA = appState();
    markChanged(stateA.soilId.soilChanges, 'a', Date.now());

    const selectedA1 = renderSelectorHook(
      () => useSelector(selectUnsyncedSiteIds),
      stateA,
    );
    const selectedA2 = renderSelectorHook(
      () => useSelector(selectUnsyncedSiteIds),
      stateA,
    );

    const stateB = cloneDeep(stateA);
    markChanged(stateB.soilId.soilChanges, 'b', Date.now());

    const selectedB = renderSelectorHook(
      () => useSelector(selectUnsyncedSiteIds),
      stateB,
    );

    expect(selectedA1).toBe(selectedA2);
    expect(selectedA1).not.toBe(selectedB);
    expect(selectedA2).not.toBe(selectedB);
  });
});

describe('selectSyncErrorSites', () => {
  test('selects sync error sites only', () => {
    const state = appState();
    const now = Date.now();
    markSynced(state.soilId.soilChanges, 'a', {data: soilData()}, now);
    markError(
      state.soilId.soilChanges,
      'b',
      {revisionId: 1, data: 'DOES_NOT_EXIST'},
      now,
    );

    const selected = renderSelectorHook(
      () => useSelector(selectSyncErrorSites),
      state,
    );

    expect(selected).toEqual({
      b: {
        lastSyncedAt: now,
        lastSyncedRevisionId: 1,
        lastSyncedError: 'DOES_NOT_EXIST',
      },
    });
  });

  test('returns stable values for input states', () => {
    const stateA = appState();
    markError(
      stateA.soilId.soilChanges,
      'a',
      {data: 'DOES_NOT_EXIST'},
      Date.now(),
    );

    const selectedA1 = renderSelectorHook(
      () => useSelector(selectUnsyncedSites),
      stateA,
    );
    const selectedA2 = renderSelectorHook(
      () => useSelector(selectUnsyncedSites),
      stateA,
    );

    const stateB = cloneDeep(stateA);
    markError(
      stateB.soilId.soilChanges,
      'b',
      {revisionId: 1, data: 'DOES_NOT_EXIST'},
      Date.now(),
    );

    const selectedB = renderSelectorHook(
      () => useSelector(selectUnsyncedSites),
      stateB,
    );

    expect(selectedA1).toBe(selectedA2);
    expect(selectedA1).not.toBe(selectedB);
    expect(selectedA2).not.toBe(selectedB);
  });
});
