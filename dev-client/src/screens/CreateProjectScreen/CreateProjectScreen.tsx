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

import {useCallback, useRef} from 'react';

import {BottomSheetModal} from '@gorhom/bottom-sheet';

import {PrivacyInfoModal} from 'terraso-mobile-client/components/modals/privacy/PrivacyInfoModal';
import {AppBar} from 'terraso-mobile-client/navigation/components/AppBar';
import {ScreenCloseButton} from 'terraso-mobile-client/navigation/components/ScreenCloseButton';
import {CreateProjectForm} from 'terraso-mobile-client/screens/CreateProjectScreen/components/CreateProjectForm';
import {ScreenScaffold} from 'terraso-mobile-client/screens/ScreenScaffold';

export const CreateProjectScreen = () => {
  const infoModalRef = useRef<BottomSheetModal>(null);

  const onInfoPress = useCallback(
    () => infoModalRef.current?.present(),
    [infoModalRef],
  );
  const onInfoClose = useCallback(
    () => infoModalRef.current?.dismiss(),
    [infoModalRef],
  );

  return (
    <ScreenScaffold AppBar={<AppBar LeftButton={<ScreenCloseButton />} />}>
      <CreateProjectForm onInfoPress={onInfoPress} />
      <PrivacyInfoModal ref={infoModalRef} onClose={onInfoClose} />
    </ScreenScaffold>
  );
};
