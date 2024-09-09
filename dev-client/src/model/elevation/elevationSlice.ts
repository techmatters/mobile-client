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

import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import {Coords} from 'terraso-client-shared/types';

import {elevationKey} from 'terraso-mobile-client/model/elevation/elevationFunctions';
import {getElevation} from 'terraso-mobile-client/model/elevation/elevationService';
import {
  ElevationKey,
  ElevationRecord,
} from 'terraso-mobile-client/model/elevation/elevationTypes';

export type ElevationState = {
  elevationCache: Record<ElevationKey, ElevationRecord>;
};

const initialState: ElevationState = {
  elevationCache: {},
};

const {reducer} = createSlice({
  name: 'elevation',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchElevation.pending, (state, action) => {
        state.elevationCache[elevationKey(action.meta.arg)] = {
          fetching: true,
        };
      })
      .addCase(fetchElevation.rejected, (state, action) => {
        state.elevationCache[elevationKey(action.meta.arg)] = {
          fetching: false,
        };
      })
      .addCase(fetchElevation.fulfilled, (state, action) => {
        state.elevationCache[elevationKey(action.meta.arg)] = {
          fetching: false,
          value: action.payload,
        };
      });
  },
});

const fetchElevation = createAsyncThunk(
  'elevation/fetchElevation',
  async (coords: Coords) => {
    return getElevation(coords.latitude, coords.longitude);
  },
);

export {fetchElevation, reducer};
