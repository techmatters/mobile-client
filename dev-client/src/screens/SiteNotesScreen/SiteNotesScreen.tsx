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

import {useCallback, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native';

import {Button} from 'native-base';

import {
  Box,
  Column,
  Heading,
  Row,
} from 'terraso-mobile-client/components/NativeBaseAdapters';
import {RestrictBySiteRole} from 'terraso-mobile-client/components/RestrictByRole';
import {SITE_EDITOR_ROLES} from 'terraso-mobile-client/model/permissions/permissions';
import {useNavigation} from 'terraso-mobile-client/navigation/hooks/useNavigation';
import {SiteInstructionsCard} from 'terraso-mobile-client/screens/SiteNotesScreen/components/SiteInstructionsCard';
import {SiteNoteCard} from 'terraso-mobile-client/screens/SiteNotesScreen/components/SiteNoteCard';
import {useSelector} from 'terraso-mobile-client/store';

export const SiteNotesScreen = ({siteId}: {siteId: string}) => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const site = useSelector(state => state.site.sites[siteId]);
  const project = useSelector(state =>
    site.projectId === undefined
      ? undefined
      : state.project.projects[site.projectId],
  );

  console.log('-----> SiteNotesScreen is being rendered');

  const onAddNote = useCallback(() => {
    navigation.navigate('ADD_SITE_NOTE', {siteId: siteId});
  }, [navigation, siteId]);

  // TODO-cknipe: Generalize this
  const dependenciesExist = !!site;
  useEffect(() => {
    if (!dependenciesExist) {
      console.log(
        'We should close the SiteNotes screen',
        navigation.getState().routes[navigation.getState().routes.length - 1],
      );
      navigation.navigate('BOTTOM_TABS');
    }
  }, [dependenciesExist, navigation]);

  if (!dependenciesExist) {
    return null;
  }

  return (
    <ScrollView>
      <Column>
        <Row backgroundColor="background.default" px="16px" py="12px">
          <Heading variant="h6">{t('site.notes.title')}</Heading>
        </Row>
        <Box height="16px" />
        {project?.siteInstructions && (
          <SiteInstructionsCard siteInstructions={project?.siteInstructions} />
        )}
        <RestrictBySiteRole role={SITE_EDITOR_ROLES}>
          <Box pl={4} pb={4} alignItems="flex-start">
            <Button
              size="lg"
              shadow={5}
              onPress={onAddNote}
              _text={{textTransform: 'uppercase'}}>
              {t('site.notes.add_note_label')}
            </Button>
          </Box>
        </RestrictBySiteRole>
        {Object.values(site.notes).map(note => (
          <SiteNoteCard note={note} key={note.id} />
        ))}
        {site.notes && <Box height="300px" />}
      </Column>
    </ScrollView>
  );
};
