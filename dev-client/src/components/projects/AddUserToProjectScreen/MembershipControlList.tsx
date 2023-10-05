import {
  Center,
  FlatList,
  HStack,
  Heading,
  Image,
  Select,
  VStack,
} from 'native-base';
import {User} from 'terraso-client-shared/account/accountSlice';
import {IconButton} from '../../common/Icons';
import {formatNames} from '../../../util';
import {UserRole} from 'terraso-client-shared/graphqlSchema/graphql';
import {useTranslation} from 'react-i18next';

type UserFields = Omit<User, 'preferences'>;

export type UserWithRole = {user: UserFields; role: UserRole};

type Props = {
  users: UserWithRole[];
  updateUserRole: (role: UserRole, userId: string) => void;
  removeUser: (userId: string) => void;
};

type DisplayProps = {
  user: UserFields;
  role: UserRole;
  roles: [UserRole, string][];
  updateUserRole: (role: UserRole) => void;
  removeUser: () => void;
};

const UserDisplay = ({
  user: {profileImage, firstName, lastName, email},
  roles,
  role,
  updateUserRole,
  removeUser,
}: DisplayProps) => {
  const {t} = useTranslation();
  return (
    <HStack>
      <Center>
        <Image
          variant="profilePic"
          source={{uri: profileImage}}
          alt={t('general.profile_image_alt')}
        />
      </Center>
      <VStack>
        <Heading>{formatNames(firstName, lastName)}</Heading>
        <Heading>{email}</Heading>
        <Select
          selectedValue={role}
          onValueChange={value => {
            updateUserRole(value as UserRole);
          }}>
          {roles.map(([role, label]) => (
            <Select.Item value={role} label={label} key={role} />
          ))}
        </Select>
      </VStack>
      <IconButton name="delete" onPress={removeUser} />
    </HStack>
  );
};

export const MembershipControlList = ({
  users,
  updateUserRole,
  removeUser,
}: Props) => {
  const itemUpdateUserRole = (userId: string) => (role: UserRole) =>
    updateUserRole(role, userId);
  const itemRemoveUser = (userId: string) => () => removeUser(userId);
  return (
    <FlatList
      renderItem={({item: {user, role}}) => (
        <UserDisplay
          user={user}
          role={role}
          roles={[
            ['viewer', 'Viewer'],
            ['contributor', 'Contributor'],
            ['manager', 'Manager'],
          ]}
          updateUserRole={itemUpdateUserRole(user.id)}
          removeUser={itemRemoveUser(user.id)}
        />
      )}
      data={users}
      keyExtractor={({user: {id}}) => id}
    />
  );
};

export default MembershipControlList;
