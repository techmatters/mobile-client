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
import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native-gesture-handler';

import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {ProjectMembership} from 'terraso-client-shared/project/projectTypes';

import {AddButton} from 'terraso-mobile-client/components/AddButton';
import {
  Box,
  Column,
  Heading,
} from 'terraso-mobile-client/components/NativeBaseAdapters';
import {RestrictByProjectRole} from 'terraso-mobile-client/components/restrictions/RestrictByRole';
import {useProjectRoleContext} from 'terraso-mobile-client/context/ProjectRoleContext';
import {PROJECT_MANAGER_ROLES} from 'terraso-mobile-client/model/permissions/permissions';
import {deleteUserFromProject} from 'terraso-mobile-client/model/project/projectSlice';
import {
  TabRoutes,
  TabStackParamList,
} from 'terraso-mobile-client/navigation/constants';
import {useNavigation} from 'terraso-mobile-client/navigation/hooks/useNavigation';
import {UserList} from 'terraso-mobile-client/screens/ProjectTeamScreen/components/UserList';
import {useDispatch, useSelector} from 'terraso-mobile-client/store';
import {selectProjectMembershipsWithUsers} from 'terraso-mobile-client/store/selectors';

type Props = NativeStackScreenProps<TabStackParamList, TabRoutes.TEAM>;

export const ProjectTeamScreen = ({route}: Props) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const currentUser = useSelector(state => state.account.currentUser);
  const currentUserRole = useSelector(state => {
    const memberships = Object.values(
      state.project.projects[route.params.projectId]?.memberships ?? {},
    ).filter(({userId}) => userId === currentUser?.data?.id);
    return memberships.length > 0 ? memberships[0].userRole : 'VIEWER';
  });
  const members = useSelector(state =>
    selectProjectMembershipsWithUsers(state, route.params.projectId),
  );

  const removeMembership = useCallback(
    (membership: ProjectMembership) => {
      return async () => {
        dispatch(
          deleteUserFromProject({
            projectId: route.params.projectId,
            userId: membership.userId,
          }),
        );
      };
    },
    [dispatch, route.params.projectId],
  );

  const userRole = useProjectRoleContext();

  const manageMember = useCallback(
    (userId: string, membershipId: string) => {
      return async () => {
        if (userRole === 'MANAGER') {
          navigation.navigate('MANAGE_TEAM_MEMBER', {
            userId,
            membershipId,
            projectId: route.params.projectId,
          });
        }
      };
    },
    [navigation, route.params.projectId, userRole],
  );

  return (
    <Column height="full" p={4} space={3} backgroundColor="background.default">
      <RestrictByProjectRole role={PROJECT_MANAGER_ROLES}>
        <Box alignSelf="flex-start">
          <AddButton
            text={t('projects.team.add')}
            buttonProps={{
              onPress: () =>
                navigation.navigate('ADD_USER_PROJECT', {
                  projectId: route.params.projectId,
                }),
            }}
          />
        </Box>
      </RestrictByProjectRole>
      <Heading variant="h6" py="20px">
        {t('projects.team.manage_team')}
      </Heading>
      <ScrollView>
        <UserList
          memberships={members}
          currentUserId={currentUser.data?.id}
          removeUser={removeMembership}
          memberAction={manageMember}
          currentUserRole={currentUserRole}
        />
      </ScrollView>
    </Column>
  );
};
