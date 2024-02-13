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

import {Button} from 'native-base';
import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {updatePreferences} from 'terraso-mobile-client/model/preferences/preferencesSlice';
import {useDispatch, useSelector} from 'terraso-mobile-client/store';

export const SwitchWorkflowButton = (
  props: Omit<React.ComponentProps<typeof Button>, 'onPress'>,
) => {
  const workflow = useSelector(state => state.preferences.colorWorkflow);
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const switchWorkflow = useCallback(
    () =>
      dispatch(
        updatePreferences({
          colorWorkflow: workflow === 'MANUAL' ? 'CAMERA' : 'MANUAL',
        }),
      ),
    [dispatch, workflow],
  );

  return (
    <Button
      _text={{textTransform: 'uppercase'}}
      onPress={switchWorkflow}
      {...props}>
      {workflow === 'MANUAL'
        ? t('soil.color.workflow.CAMERA')
        : t('soil.color.workflow.MANUAL')}
    </Button>
  );
};
