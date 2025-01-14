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
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useState,
} from 'react';

import {Project} from 'terraso-client-shared/project/projectTypes';

import {usePopNavigationAndShowSyncError} from 'terraso-mobile-client/components/dataRequirements/handleMissingData';
import {
  ScreenDataRequirements,
  useMemoizedRequirements,
} from 'terraso-mobile-client/components/dataRequirements/ScreenDataRequirements';
import {ProjectRoleContextProvider} from 'terraso-mobile-client/context/ProjectRoleContext';
import {AppBar} from 'terraso-mobile-client/navigation/components/AppBar';
import {useNavigation} from 'terraso-mobile-client/navigation/hooks/useNavigation';
import {ProjectTabNavigator} from 'terraso-mobile-client/navigation/navigators/ProjectTabNavigator';
import {ScreenScaffold} from 'terraso-mobile-client/screens/ScreenScaffold';
import {useSelector} from 'terraso-mobile-client/store';

type ProjectDeletedState = [boolean, Dispatch<SetStateAction<boolean>>];

export const ProjectDeletedContext = createContext<ProjectDeletedState>([
  false,
  () => {},
]);

type Props = {projectId: string};

export const ProjectViewScreen = ({projectId}: Props) => {
  const navigation = useNavigation();

  const project = useSelector(
    state => state.project.projects[projectId],
  ) as Project | null;

  // FYI: I suspect if projectId could change within the same component instance,
  // we'd want to track projectPurposelyDeleted independently for each project.
  // But currently this isn't an issue because the projectId prop only changes
  // when the whole screen gets unmounted and a new one gets mounted.
  const [projectPurposelyDeleted, setProjectPurposelyDeleted] = useState(false);

  const popNavAndShowSyncError = usePopNavigationAndShowSyncError();
  const handleMissingProject = useCallback(() => {
    // If *you* deleted the project, navigate and avoid showing the sync error
    // (as this screen re-renders when project becomes null, but before the dispatched delete ends)
    projectPurposelyDeleted ? navigation.pop() : popNavAndShowSyncError();
  }, [projectPurposelyDeleted, navigation, popNavAndShowSyncError]);

  const requirements = useMemoizedRequirements([
    {data: project, doIfMissing: handleMissingProject},
  ]);

  return (
    <ScreenDataRequirements requirements={requirements}>
      {() => (
        <ProjectDeletedContext.Provider
          value={[projectPurposelyDeleted, setProjectPurposelyDeleted]}>
          <ProjectRoleContextProvider projectId={projectId}>
            <ScreenScaffold
              AppBar={<AppBar title={project?.name} />}
              BottomNavigation={null}>
              <ProjectTabNavigator projectId={projectId} />
            </ScreenScaffold>
          </ProjectRoleContextProvider>
        </ProjectDeletedContext.Provider>
      )}
    </ScreenDataRequirements>
  );
};
