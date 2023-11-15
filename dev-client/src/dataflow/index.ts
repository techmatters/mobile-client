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

import {
  ProjectPreview,
  Project,
  UserProfile,
  SiteDisplay,
} from 'terraso-mobile-client/types';

export function fetchProjects(): ProjectPreview[] {
  return [
    {
      id: 0,
      name: 'Project #1',
      description:
        'This is an optional project description that will have a limited length.',
      siteCount: 8,
      userCount: 4,
      lastModified: '1995-12-17T03:24:00',
      isNew: true,
      percentComplete: 60,
    },
    {
      id: 1,
      name: 'A really long project name that should not be shortened despite the fact that it is too long to be feasible.',
      description:
        'The optional project description should be limited on the backend. We can limit it if it is too long to be displayed properly.',
      siteCount: 10,
      userCount: 5,
      lastModified: '2010-05-01T01:25:23',
      isNew: false,
      percentComplete: 60,
    },
  ];
}

const projectSiteMap = new Map([
  [
    1,
    [
      {
        id: 1,
        name: 'site1',
        lastModified: {
          date: '2010-05-01T01:25:23',
          user: {name: 'alice', id: 1},
        },
        percentComplete: 60,
      },
      {
        id: 2,
        name: 'site2',
        lastModified: {
          date: '2010-05-01T01:25:23',
          user: {name: 'alice', id: 1},
        },
        percentComplete: 60,
      },
      {
        id: 3,
        name: 'site3',
        lastModified: {
          date: '2010-05-01T01:25:23',
          user: {name: 'alice', id: 1},
        },
        percentComplete: 60,
      },
      {
        id: 4,
        name: 'site4',
        lastModified: {
          date: '2010-05-01T01:25:23',
          user: {name: 'alice', id: 1},
        },
        percentComplete: 60,
      },
      {
        id: 5,
        name: 'site5',
        lastModified: {
          date: '2010-05-01T01:25:23',
          user: {name: 'alice', id: 1},
        },
        percentComplete: 60,
      },
    ],
  ],
  [
    2,
    [
      {
        id: 6,
        name: 'site6',
        lastModified: {
          date: '2010-05-01T01:25:23',
          user: {name: 'alice', id: 1},
        },
        percentComplete: 60,
      },
      {
        id: 7,
        name: 'site7',
        lastModified: {
          date: '2010-05-01T01:25:23',
          user: {name: 'alice', id: 1},
        },
        percentComplete: 60,
      },
      {
        id: 8,
        name: 'site8',
        lastModified: {
          date: '2010-05-01T01:25:23',
          user: {name: 'alice', id: 1},
        },
        percentComplete: 60,
      },
      {
        id: 9,
        name: 'site9',
        lastModified: {
          date: '2010-05-01T01:25:23',
          user: {name: 'alice', id: 1},
        },
        percentComplete: 60,
      },
      {
        id: 10,
        name: 'site10',
        lastModified: {
          date: '2010-05-01T01:25:23',
          user: {name: 'alice', id: 1},
        },
        percentComplete: 60,
      },
    ],
  ],
]);

export const USER_PROFILES: UserProfile[] = [
  {
    firstName: 'John',
    lastName: 'Adams',
    role: 'manager',
    id: 4,
  },
  {
    firstName: 'Debbie',
    lastName: 'Baker',
    role: 'member',
    id: 5,
  },
  {
    firstName: 'Courtney',
    role: 'member',
    id: 6,
  },
];

export const SITE_DISPLAYS: SiteDisplay[] = [
  {
    lat: 0,
    lon: 0,
    name: 'TEST_SITE_1',
    id: 1,
  },
  {
    lat: 0.5,
    lon: 0.5,
    name: 'TEST_SITE_2',
    id: 2,
  },
  {
    lat: 5,
    lon: 3,
    name: 'TEST_SITE_3',
    id: 3,
  },
];

export function fetchProject(projectId: number): Project {
  return {
    meta: fetchProjects()[projectId],
    sites: projectSiteMap.get(projectId) || [],
    inputs: {
      units: 'metric',
      source: 'survey',
    },
    memberPermissions: 'view',
    users: [{name: 'alice', id: 1}],
  };
}

export const SITES_BY_PROJECT = {
  1: {
    projectName: 'Project #1',
    sites: [
      {name: 'Site #1', id: 1},
      {name: 'Site #2', id: 2},
    ],
  },
  0: {
    projectName: 'Project #2',
    sites: [{name: 'Site #3', id: 3}],
  },
  3: {
    projectName: 'Project #3',
    sites: [
      {name: 'Site #4', id: 4},
      {name: 'Site #5', id: 5},
      {name: 'Site #6', id: 6},
    ],
  },
};
