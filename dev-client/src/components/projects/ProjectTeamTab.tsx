import {VStack} from 'native-base';
import AddButton from '../common/AddButton';
import UserList from '../common/UserList';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {TabRoutes, TabStackParamList} from './constants';
import {useDispatch, useSelector} from '../../model/store';
import {useCallback, useState} from 'react';
import {
  Membership,
  removeMember,
} from 'terraso-client-shared/memberships/membershipsSlice';
import {removeMembershipFromProject} from 'terraso-client-shared/project/projectSlice';
import {useTranslation} from 'react-i18next';
import {User} from 'terraso-client-shared/account/accountSlice';
import RadioBlock from '../common/RadioBlock';

type Props = NativeStackScreenProps<TabStackParamList, TabRoutes.TEAM>;

export default function ProjectTeamTab({route}: Props) {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.account.currentUser);
  let [members, setMembers] = useState(
    route.params.memberships.reduce(
      (x, y) => ({...x, [y[0].membershipId]: y}),
      {} as Record<string, [Membership, User]>,
    ),
  );

  const removeMembership = useCallback(
    (membership: Membership) => {
      return async () => {
        await dispatch(removeMember(membership));
        dispatch(
          removeMembershipFromProject({
            membershipId: membership.membershipId,
            projectId: route.params.projectId,
          }),
        );
        // TODO: This is just to get the project to update
        let newMembers = {...members};
        delete newMembers[membership.membershipId];
        setMembers(newMembers);
      };
    },
    [dispatch, members, route.params.projectId],
  );

  return (
    <VStack alignItems="flex-start" p={4} space={3}>
      <RadioBlock<'add-and-edit' | 'view'>
        label="Member Permissions"
        options={{
          'add-and-edit': {text: 'Can add sites and edit site data'},
          view: {text: 'View only'},
        }}
        groupProps={{
          name: 'member-permissions',
          accessibilityLabel: 'member permissions',
          defaultValue: 'add-and-edit',
        }}
      />
      <AddButton text={t('projects.team.add')} />
      <UserList
        memberships={Object.entries(members)}
        currentUserId={currentUser.data?.id}
        userAction={removeMembership}
      />
    </VStack>
  );
}
