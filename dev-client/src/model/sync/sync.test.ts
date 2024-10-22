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

import {
  ChangeRecords,
  getChanges,
  getRevisionId,
  getUnsyncedRecords,
  isUnsynced,
  markChanged,
  markSynced,
  nextRevisionId,
} from 'terraso-mobile-client/model/sync/sync';

describe('sync', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));
  });

  describe('getRevisionId', () => {
    test('zero for undefined revision', () => {
      expect(getRevisionId(undefined)).toEqual(0);
    });

    test('zero for empty revision', () => {
      expect(getRevisionId({})).toEqual(0);
    });

    test('value for revision', () => {
      expect(getRevisionId({revisionId: 123})).toEqual(123);
    });
  });

  describe('nextRevisionId', () => {
    test('increments by one', () => {
      expect(nextRevisionId(1)).toEqual(2);
    });
  });

  describe('getChanges', () => {
    test('returns changes for ids', () => {
      const changes = {a: {revisionId: 1}, b: {revisionId: 2}};
      expect(getChanges(changes, ['a'])).toEqual({a: {revisionId: 1}});
    });

    test('returns empty changes when missing', () => {
      const changes = {};
      expect(getChanges(changes, ['a'])).toEqual({a: {}});
    });
  });

  describe('markChanged', () => {
    let changes: ChangeRecords<unknown>;

    beforeEach(() => {
      changes = {};
    });

    test('initializes change record if not present', () => {
      markChanged(changes, 'a', Date.now());
      expect(changes.a).toBeDefined();
    });

    test('initializes revision id if not present', () => {
      changes.a = {};
      markChanged(changes, 'a', Date.now());
      expect(changes.a.revisionId).toEqual(1);
    });

    test('increments revision id', () => {
      changes.a = {revisionId: 122};
      markChanged(changes, 'a', Date.now());
      expect(changes.a.revisionId).toEqual(123);
    });

    test('records modified date', () => {
      const at = Date.now();
      markChanged(changes, 'a', at);
      expect(changes.a.lastModifiedAt).toEqual(at);
    });

    test('preserves other properties', () => {
      changes.a = {
        lastSyncedRevisionId: 100,
        lastSyncedData: 'data',
        lastSyncedAt: 10000,
      };
      markChanged(changes, 'a', Date.now());
      expect(changes.a.lastSyncedRevisionId).toEqual(100);
      expect(changes.a.lastSyncedData).toEqual('data');
      expect(changes.a.lastSyncedAt).toEqual(10000);
    });
  });

  describe('markSynced', () => {
    let changes: ChangeRecords<unknown>;

    beforeEach(() => {
      changes = {};
    });

    test('initializes change record if not present', () => {
      markSynced(changes, 'a', 'data', Date.now());
      expect(changes.a).toBeDefined();
    });

    test('initializes revision id if not present', () => {
      markSynced(changes, 'a', 'data', Date.now());
      expect(changes.a.revisionId).toEqual(0);
      expect(changes.a.lastSyncedRevisionId).toEqual(0);
    });

    test('records synced revision id', () => {
      changes.a = {revisionId: 123};
      markSynced(changes, 'a', 'data', Date.now());
      expect(changes.a.revisionId).toEqual(123);
      expect(changes.a.lastSyncedRevisionId).toEqual(123);
    });

    test('records synced data', () => {
      markSynced(changes, 'a', 'data', Date.now());
      expect(changes.a.lastSyncedData).toEqual('data');
    });

    test('records synced date', () => {
      const at = Date.now();
      markSynced(changes, 'a', 'data', at);
      expect(changes.a.lastSyncedAt).toEqual(at);
    });

    test('preserves other properties', () => {
      changes.a = {
        lastModifiedAt: 10000,
      };
      markSynced(changes, 'a', 'data', Date.now());
      expect(changes.a.lastModifiedAt).toEqual(10000);
    });
  });

  describe('getUnsyncedRecords', () => {
    test('returns un-synced records', () => {
      const changes = {
        a: {revisionId: 1, lastSyncedRevisionId: 0},
        b: {revisionId: 1, lastSyncedRevisionId: 1},
      };
      expect(getUnsyncedRecords(changes)).toEqual({
        a: {revisionId: 1, lastSyncedRevisionId: 0},
      });
    });
  });

  describe('isUnsynced', () => {
    test('returns synced for empty records', () => {
      expect(isUnsynced({})).toBeFalsy();
    });

    test('returns synced for records with matching revision ids', () => {
      expect(
        isUnsynced({
          revisionId: 10,
          lastSyncedRevisionId: 10,
        }),
      ).toBeFalsy();
    });

    test('returns unsynced for records without matching revision ids', () => {
      expect(
        isUnsynced({
          revisionId: 10,
          lastSyncedRevisionId: 9,
        }),
      ).toBeTruthy();
    });

    test('returns unsynced for never-synced records', () => {
      expect(
        isUnsynced({
          revisionId: 10,
        }),
      ).toBeTruthy();
    });
  });
});
