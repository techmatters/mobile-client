import {ProjectPreview, Project, SiteDisplay} from '../types';

export const enum ScreenRoutes {
  LOGIN = 'LOGIN',
  PROJECT_LIST = 'PROJECT_LIST',
  PROJECT_VIEW = 'PROJECT_VIEW',
  SITES_MAP = 'SITES_MAP',
  SITE_TRANSFER_PROJECT = 'SITE_TRANSFER_PROJECT',
}

export type RootStackParamList = {
  [ScreenRoutes.LOGIN]: undefined;
  [ScreenRoutes.PROJECT_LIST]: {projects: ProjectPreview[]};
  [ScreenRoutes.PROJECT_VIEW]: {project: Project};
  [ScreenRoutes.SITES_MAP]: {sites: SiteDisplay[]};
  [ScreenRoutes.SITE_TRANSFER_PROJECT]: {projectId: number};
};
