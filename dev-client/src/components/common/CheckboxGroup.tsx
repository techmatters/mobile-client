import {Box, FormControl, HStack, VStack} from 'native-base';
import {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import CheckBox from '@react-native-community/checkbox';

type CheckboxProps = {
  label: string;
  id: string;
  checked: boolean;
};

type Props = {
  checkboxes: CheckboxProps[];
  groupName: string;
  groupId: string;
  onChangeValue: (
    groupId: string,
    checkboxId: string,
  ) => (checked: boolean) => void;
};

const CheckboxGroup = ({
  checkboxes,
  groupName,
  groupId,
  onChangeValue,
}: Props) => {
  const {t} = useTranslation();
  const selectAllChecked = useMemo(() => {
    return checkboxes.every(({checked}) => checked);
  }, [checkboxes]);
  const onSelectAll = useCallback(() => {
    checkboxes.forEach(({id: checkboxId}) =>
      onChangeValue(groupId, checkboxId)(!selectAllChecked),
    );
  }, [checkboxes, selectAllChecked, onChangeValue, groupId]);
  return (
    <Box>
      <HStack>
        <CheckBox
          id={'select-all-' + groupName}
          onValueChange={onSelectAll}
          value={selectAllChecked}
        />
        <FormControl.Label htmlFor={'select-all-' + groupName} variant="body1">
          {t('general.select_all')}
        </FormControl.Label>
      </HStack>
      <VStack px="20px">
        {checkboxes.map(({label, id, checked}) => (
          <HStack key={id}>
            <CheckBox
              id={'checkbox-' + id}
              onValueChange={onChangeValue(groupId, id)}
              value={checked}
            />
            <FormControl.Label htmlFor={'checkbox-' + id} variant="body1">
              {label}
            </FormControl.Label>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};

export default CheckboxGroup;
