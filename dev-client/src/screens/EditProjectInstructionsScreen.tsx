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

import {useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Keyboard} from 'react-native';

import {ProjectUpdateMutationInput} from 'terraso-client-shared/graphqlSchema/graphql';
import {Project} from 'terraso-client-shared/project/projectTypes';

import {
  Box,
  Column,
  Heading,
} from 'terraso-mobile-client/components/NativeBaseAdapters';
import {ScreenFormWrapper} from 'terraso-mobile-client/components/ScreenFormWrapper';
import {updateProject} from 'terraso-mobile-client/model/project/projectGlobalReducer';
import {useNavigation} from 'terraso-mobile-client/navigation/hooks/useNavigation';
import {SiteNoteForm} from 'terraso-mobile-client/screens/SiteNotesScreen/components/SiteNoteForm';
import {useDispatch} from 'terraso-mobile-client/store';

type Props = {
  project: Project;
};

export const EditProjectInstructionsScreen = ({project}: Props) => {
  const formWrapperRef = useRef<{handleSubmit: () => void}>(null);
  const {t} = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateProject = async ({content}: {content: string}) => {
    Keyboard.dismiss();
    setIsSubmitting(true);
    try {
      const projectInput: ProjectUpdateMutationInput = {
        id: project.id,
        siteInstructions: content,
      };
      await dispatch(updateProject(projectInput));
    } catch (error) {
      console.error('Failed to update project:', error);
    } finally {
      setIsSubmitting(false);
      navigation.pop();
    }
  };

  const handleDelete = async () => {
    await handleUpdateProject({content: ''});
  };

  return (
    <ScreenFormWrapper
      ref={formWrapperRef}
      initialValues={{content: project.siteInstructions || ''}}
      onSubmit={handleUpdateProject}
      onDelete={handleDelete}
      isSubmitting={isSubmitting}>
      {formikProps => (
        <Column pt={10} pl={5} pr={5} pb={10} flex={1}>
          <Heading variant="h6" pb={7}>
            {t('projects.inputs.instructions.title')}
          </Heading>
          <Box flexGrow={1}>
            <SiteNoteForm content={formikProps.values.content || ''} />
          </Box>
        </Column>
      )}
    </ScreenFormWrapper>
  );
};
