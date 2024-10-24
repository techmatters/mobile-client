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

import {createSlice, Draft} from '@reduxjs/toolkit';

import {
  SiteAddMutationInput,
  SiteTransferMutationInput,
  SiteUpdateMutationInput,
} from 'terraso-client-shared/graphqlSchema/graphql';
import * as siteService from 'terraso-client-shared/site/siteService';
import {Site} from 'terraso-client-shared/site/siteTypes';
import {createAsyncThunk} from 'terraso-client-shared/store/utils';

import {
  addSiteToProject,
  removeSiteFromAllProjects,
  removeSiteFromProject,
} from 'terraso-mobile-client/model/project/projectSlice';

const initialState = {
  sites: {} as Record<string, Site>,
};

type SiteState = typeof initialState;

export const fetchSite = createAsyncThunk(
  'site/fetchSite',
  siteService.fetchSite,
);

export const fetchSitesForProject = createAsyncThunk(
  'site/fetchSitesForProject',
  siteService.fetchSitesForProject,
);

export const fetchSitesForUser = createAsyncThunk(
  'site/fetchSitesForUser',
  siteService.fetchSitesForUser,
);

export const addSite = createAsyncThunk<Site, SiteAddMutationInput>(
  'site/addSite',
  async (site, _, {dispatch}) => {
    let res = await siteService.addSite(site);
    if (site.projectId) {
      dispatch(addSiteToProject({siteId: res.id, projectId: site.projectId}));
    }
    return res;
  },
);

export const updateSite = createAsyncThunk<Site, SiteUpdateMutationInput>(
  'site/updateSite',
  async (input, _currentUser, {dispatch}) => {
    const result = await siteService.updateSite(input);
    dispatch(removeSiteFromAllProjects(result.id));
    if (result.projectId) {
      dispatch(
        addSiteToProject({projectId: result.projectId, siteId: input.id}),
      );
    }
    return result;
  },
);

export const deleteSite = createAsyncThunk<string, Site>(
  'site/deleteSite',
  async (site, _currentUser, {dispatch}) => {
    const result = await siteService.deleteSite(site);
    dispatch(removeSiteFromAllProjects(site.id));
    return result;
  },
);

export const transferSites = createAsyncThunk<
  Awaited<ReturnType<typeof siteService.transferSitesToProject>>,
  SiteTransferMutationInput
>('site/transferSites', async (input, _currentUser, {dispatch}) => {
  const result = await siteService.transferSitesToProject(input);
  for (const {siteId, oldProjectId} of result.updated) {
    if (oldProjectId !== undefined) {
      dispatch(removeSiteFromProject({siteId, projectId: oldProjectId}));
    }
    dispatch(addSiteToProject({siteId, projectId: result.projectId}));
  }
  return result;
});

export const addSiteNote = createAsyncThunk(
  'site/addSiteNote',
  siteService.addSiteNote,
);

export const deleteSiteNote = createAsyncThunk(
  'site/deleteSiteNote',
  siteService.deleteSiteNote,
);

export const updateSiteNote = createAsyncThunk(
  'site/updateSiteNote',
  siteService.updateSiteNote,
);

export const setSites = (
  state: Draft<SiteState>,
  sites: Record<string, Site>,
) => {
  state.sites = sites;
};

export const updateSites = (
  state: Draft<SiteState>,
  sites: Record<string, Site>,
) => {
  Object.assign(state.sites, sites);
};

export const updateProjectOfSite = (
  state: Draft<SiteState>,
  args: {siteId: string; projectId: string},
) => {
  state.sites[args.siteId].projectId = args.projectId;
};

export const deleteSites = (state: Draft<SiteState>, siteIds: string[]) => {
  for (const siteId of siteIds) {
    delete state.sites[siteId];
  }
};

const siteSlice = createSlice({
  name: 'site',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // TODO: add case to delete site if not found
    builder.addCase(fetchSite.fulfilled, (state, {payload: site}) => {
      state.sites[site.id] = site;
    });

    // TODO: add case to delete project sites if project not found
    builder.addCase(
      fetchSitesForProject.fulfilled,
      (state, {payload: sites, meta: {arg: projectId}}) => {
        Object.values(state.sites)
          .filter(site => site.projectId === projectId)
          .forEach(site => {
            delete state.sites[site.id];
          });
        Object.assign(
          state.sites,
          Object.fromEntries(sites.map(site => [site.id, site])),
        );
      },
    );

    builder.addCase(fetchSitesForUser.fulfilled, (state, {payload: sites}) => {
      state.sites = Object.fromEntries(sites.map(site => [site.id, site]));
    });

    builder.addCase(addSite.fulfilled, (state, {payload: site}) => {
      state.sites[site.id] = site;
    });

    builder.addCase(updateSite.fulfilled, (state, {payload: site}) => {
      state.sites[site.id] = site;
    });

    builder.addCase(deleteSite.fulfilled, (state, {meta}) => {
      delete state.sites[meta.arg.id];
    });

    builder.addCase(
      transferSites.fulfilled,
      (state, {payload: {projectId, updated}}) => {
        for (const {siteId} of updated) {
          state.sites[siteId].projectId = projectId;
        }
      },
    );

    builder.addCase(addSiteNote.fulfilled, (state, {payload: siteNote}) => {
      state.sites[siteNote.siteId].notes[siteNote.id] = siteNote;
    });

    builder.addCase(deleteSiteNote.fulfilled, (state, {payload: siteNote}) => {
      delete state.sites[siteNote.siteId].notes[siteNote.id];
    });

    builder.addCase(updateSiteNote.fulfilled, (state, {payload: siteNote}) => {
      state.sites[siteNote.siteId].notes[siteNote.id] = siteNote;
    });
  },
});

export default siteSlice.reducer;
