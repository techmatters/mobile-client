/*
 * Copyright © 2024 Technology Matters
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

import {useMemo, useState} from 'react';

import {Photo} from 'terraso-mobile-client/components/ImagePicker';
import {DEFAULT_STACK_NAVIGATOR_OPTIONS} from 'terraso-mobile-client/navigation/constants';
import {
  ColorAnalysisContext,
  ColorAnalysisContextState,
} from 'terraso-mobile-client/screens/ColorAnalysisScreen//context/colorAnalysisContext';
import {
  screens,
  Stack,
} from 'terraso-mobile-client/screens/ColorAnalysisScreen/navigation/screenDefinitions';
import {SoilPitInputScreenProps} from 'terraso-mobile-client/screens/SoilScreen/components/SoilPitInputScreenScaffold';

export type ColorAnalysisProps = {
  photo: Photo;
  pitProps: SoilPitInputScreenProps;
};

export const ColorAnalysisScreen = ({photo, pitProps}: ColorAnalysisProps) => {
  const [state, setState] = useState<ColorAnalysisContextState>({});
  const contextValue = useMemo(
    () => ({
      photo,
      pitProps,
      state,
      setState,
    }),
    [photo, pitProps, state, setState],
  );

  return (
    <ColorAnalysisContext.Provider value={contextValue}>
      <Stack.Navigator
        initialRouteName="COLOR_ANALYSIS_HOME"
        screenOptions={DEFAULT_STACK_NAVIGATOR_OPTIONS}>
        {screens}
      </Stack.Navigator>
    </ColorAnalysisContext.Provider>
  );
};
