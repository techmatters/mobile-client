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

import {Select} from 'native-base';
import {useSelector} from 'terraso-mobile-client/model/store';
import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {NullableSelect} from '../common/NullableSelect';

type ProjectSelectProps = {
  projectId: string | undefined;
  setProjectId: (projectId: string | undefined) => void;
};
export const ProjectSelect = ({
  projectId,
  setProjectId,
}: ProjectSelectProps) => {
  const {t} = useTranslation();
  const projects = useSelector(state => state.project.projects);
  const projectList = useMemo(() => Object.values(projects), [projects]);

  return (
    <NullableSelect
      selectedValue={projectId}
      onValueChange={setProjectId}
      nullableOption={t('general.nullable_option')}>
      {projectList.map(project => (
        <Select.Item label={project.name} value={project.id} key={project.id} />
      ))}
    </NullableSelect>
  );
};
