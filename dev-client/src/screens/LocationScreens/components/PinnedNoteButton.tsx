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

import {Button} from 'native-base';

import {Project} from 'terraso-client-shared/project/projectTypes';

import {Icon} from 'terraso-mobile-client/components/icons/Icon';
import {
  Box,
  Row,
  Text,
} from 'terraso-mobile-client/components/NativeBaseAdapters';
import {useNavigation} from 'terraso-mobile-client/navigation/hooks/useNavigation';

type Props = {
  project: Project;
};

export const PinnedNoteButton = ({project}: Props) => {
  const {t} = useTranslation();
  const navigation = useNavigation();

  const onShowNote = useCallback(() => {
    return () =>
      navigation.navigate('READ_PINNED_NOTE', {
        projectId: project.id,
      });
  }, [navigation, project]);

  return (
    <Box pt={4} pb={4} alignItems="flex-start">
      <Button
        mt={2}
        pl={4}
        pr={4}
        size="md"
        backgroundColor="primary.main"
        shadow={5}
        onPress={onShowNote()}>
        <Row>
          <Icon color="primary.contrast" size="sm" mr={2} name="push-pin" />
          <Text color="primary.contrast" textTransform="uppercase">
            {t('projects.inputs.instructions.add_label')}
          </Text>
        </Row>
      </Button>
    </Box>
  );
};
