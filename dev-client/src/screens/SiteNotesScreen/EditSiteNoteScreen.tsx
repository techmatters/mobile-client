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

import {useHandleMissingSite} from 'terraso-mobile-client/components/dataRequirements/handleMissingData';
import {RestrictByRequirements} from 'terraso-mobile-client/components/dataRequirements/RestrictByRequirements';
import {useNavigation} from 'terraso-mobile-client/navigation/hooks/useNavigation';
import {EditSiteNoteContent} from 'terraso-mobile-client/screens/SiteNotesScreen/components/EditSiteNoteContent';
import {useSelector} from 'terraso-mobile-client/store';
import {selectSite} from 'terraso-mobile-client/store/selectors';

type Props = {
  noteId: string;
  siteId: string;
};

export const EditSiteNoteScreen = ({noteId, siteId}: Props) => {
  const navigation = useNavigation();

  const site = useSelector(state => selectSite(siteId)(state));
  const note = site?.notes[noteId];
  // TODO: Also handle the case where user no longer has permissions to edit notes

  const handleMissingSite = useHandleMissingSite();
  const requirements = [
    {data: site, doIfMissing: handleMissingSite},
    {
      data: note,
      doIfMissing: () => {
        navigation.pop();
      },
    },
  ];

  return (
    <RestrictByRequirements requirements={requirements}>
      {() => <EditSiteNoteContent note={note} />}
    </RestrictByRequirements>
  );
};
