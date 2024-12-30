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

import {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Divider} from 'react-native-paper';

import {Button} from 'native-base';

import {ProjectRole} from 'terraso-client-shared/project/projectTypes';

import {ScreenCloseButton} from 'terraso-mobile-client/components/buttons/icons/appBar/ScreenCloseButton';
import {ScreenContentSection} from 'terraso-mobile-client/components/content/ScreenContentSection';
import {
  useNavToBottomTabsAndShowSyncError,
  usePopNavigationAndShowSyncError,
} from 'terraso-mobile-client/components/dataRequirements/handleMissingData';
import {
  ScreenDataRequirements,
  useMemoizedRequirements,
} from 'terraso-mobile-client/components/dataRequirements/ScreenDataRequirements';
import {Icon} from 'terraso-mobile-client/components/icons/Icon';
import {ConfirmModal} from 'terraso-mobile-client/components/modals/ConfirmModal';
import {
  Box,
  Column,
  Text,
} from 'terraso-mobile-client/components/NativeBaseAdapters';
import {
  deleteUserFromProject,
  updateUserRole,
} from 'terraso-mobile-client/model/project/projectSlice';
import {AppBar} from 'terraso-mobile-client/navigation/components/AppBar';
import {useNavigation} from 'terraso-mobile-client/navigation/hooks/useNavigation';
import {MinimalUserDisplay} from 'terraso-mobile-client/screens/AddUserToProjectScreen/components/MinimalUserDisplay';
import {ProjectRoleRadioBlock} from 'terraso-mobile-client/screens/AddUserToProjectScreen/components/ProjectRoleRadioBlock';
import {ScreenScaffold} from 'terraso-mobile-client/screens/ScreenScaffold';
import {useDispatch, useSelector} from 'terraso-mobile-client/store';

type Props = {
  projectId: string;
  userId: string;
  membershipId: string;
};

export const ManageTeamMemberScreen = ({
  projectId,
  userId,
  membershipId,
}: Props) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const project = useSelector(state => state.project.projects[projectId]);
  const user = useSelector(state => state.account.users[userId]);
  const membership = project?.memberships[membershipId];

  const [selectedRole, setSelectedRole] = useState<ProjectRole>(
    membership ? membership.userRole : 'MANAGER',
  );

  const removeMembership = useCallback(async () => {
    await dispatch(
      deleteUserFromProject({
        userId,
        projectId,
      }),
    );
    navigation.pop();
  }, [dispatch, projectId, userId, navigation]);

  const updateUser = useCallback(async () => {
    await dispatch(updateUserRole({projectId, userId, newRole: selectedRole}));
    navigation.pop();
  }, [dispatch, projectId, userId, selectedRole, navigation]);

  const handleMissingProject = useNavToBottomTabsAndShowSyncError();
  const handleMissingUser = usePopNavigationAndShowSyncError();
  const requirements = useMemoizedRequirements([
    {data: project, doIfMissing: handleMissingProject},
    {data: user, doIfMissing: handleMissingUser},
  ]);

  return (
    <ScreenDataRequirements requirements={requirements}>
      {() => (
        <ScreenScaffold
          AppBar={
            <AppBar title={project?.name} LeftButton={<ScreenCloseButton />} />
          }>
          <ScreenContentSection title={t('projects.manage_member.title')}>
            <Column>
              <Box ml="md" my="lg">
                <MinimalUserDisplay user={user} />
              </Box>

              <ProjectRoleRadioBlock
                onChange={setSelectedRole}
                selectedRole={selectedRole}
              />
              <Divider style={DIVIDER_STYLE} />

              <ConfirmModal
                trigger={onOpen => (
                  <Button
                    size="lg"
                    variant="ghost"
                    alignSelf="flex-start"
                    onPress={onOpen}
                    _text={{color: 'error.main', textTransform: 'uppercase'}}
                    _pressed={{backgroundColor: 'red.100'}}
                    leftIcon={<Icon name="delete" color="error.main" />}>
                    {t('projects.manage_member.remove')}
                  </Button>
                )}
                title={t('projects.manage_member.confirm_removal_title')}
                body={t('projects.manage_member.confirm_removal_body')}
                actionLabel={t('projects.manage_member.confirm_removal_action')}
                handleConfirm={removeMembership}
              />
              <Text ml="20px" variant="caption">
                {t('projects.manage_member.remove_help')}
              </Text>

              <Box flex={0} height="15%" justifyContent="flex-end">
                <Button onPress={updateUser} alignSelf="flex-end">
                  {t('general.save')}
                </Button>
              </Box>
            </Column>
          </ScreenContentSection>
        </ScreenScaffold>
      )}
    </ScreenDataRequirements>
  );
};

const DIVIDER_STYLE = {marginTop: 20, marginBottom: 20};
