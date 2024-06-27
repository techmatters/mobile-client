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

import {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';

import {ProjectRole} from 'terraso-client-shared/project/projectSlice';

import {Select} from 'terraso-mobile-client/components/inputs/Select';
import {useProjectUserRolesFilter} from 'terraso-mobile-client/hooks/permissionHooks';
import {useSelector} from 'terraso-mobile-client/store';

type Props = {
  projectId: string | null;
  userRoles?: ProjectRole[];
  setProjectId: (projectId: string | null) => void;
};

export const ProjectSelect = ({projectId, userRoles, setProjectId}: Props) => {
  const {t} = useTranslation();
  const projects = useSelector(state => state.project.projects);
  const rolesFilter = useProjectUserRolesFilter(userRoles);
  const projectIdList = useMemo(
    () => Object.values(projects).filter(project => rolesFilter(project)),
    [projects, rolesFilter],
  ).map(project => project.id);

  const renderProject = useCallback(
    (id: string) => projects[id].name,
    [projects],
  );

  return (
    <Select
      nullable
      options={projectIdList}
      label={t('site.create.add_to_project_caption')}
      value={projectId}
      onValueChange={setProjectId}
      unselectedLabel={t('general.nullable_option')}
      renderValue={renderProject}
    />
  );
};
