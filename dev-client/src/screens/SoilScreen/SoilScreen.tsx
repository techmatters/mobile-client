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

import {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';

import {Button, ScrollView} from 'native-base';

import {SoilIdSoilDataDepthIntervalPresetChoices} from 'terraso-client-shared/graphqlSchema/graphql';
import {
  selectSoilData,
  useSiteProjectSoilSettings,
  useSiteSoilIntervals,
} from 'terraso-mobile-client/model/selectors';
import {
  LabelledDepthInterval,
  methodRequired,
  soilPitMethods,
  updateSoilData,
  updateSoilDataDepthInterval,
} from 'terraso-mobile-client/model/soilId/soilIdSlice';

import {AddDepthModalBody} from 'terraso-mobile-client/components/AddDepthModal';
import {IconButton} from 'terraso-mobile-client/components/buttons/icons/IconButton';
import {Icon} from 'terraso-mobile-client/components/icons/Icon';
import {Modal} from 'terraso-mobile-client/components/modals/Modal';
import {
  Box,
  Heading,
  Row,
} from 'terraso-mobile-client/components/NativeBaseAdapters';
import {RestrictBySiteRole} from 'terraso-mobile-client/components/RestrictByRole';
import {FormOverlaySheet} from 'terraso-mobile-client/components/sheets/FormOverlaySheet';
import {SITE_EDITOR_ROLES} from 'terraso-mobile-client/model/permissions/permissions';
import {EditSiteSoilDepthPreset} from 'terraso-mobile-client/screens/SoilScreen/components/EditSiteSoilDepthPreset';
import {SoilDepthSummary} from 'terraso-mobile-client/screens/SoilScreen/components/SoilDepthSummary';
import {SoilSurfaceStatus} from 'terraso-mobile-client/screens/SoilScreen/components/SoilSurfaceStatus';
import {useDispatch, useSelector} from 'terraso-mobile-client/store';

export const SoilScreen = ({siteId}: {siteId: string}) => {
  const {t} = useTranslation();
  const soilData = useSelector(selectSoilData(siteId));
  const projectSettings = useSiteProjectSoilSettings(siteId);

  const projectRequiredInputs = useMemo(() => {
    return soilPitMethods.filter(m => projectSettings?.[methodRequired(m)]);
  }, [projectSettings]);

  const allDepths = useSiteSoilIntervals(siteId);
  const existingDepths = useMemo(
    () => allDepths.map(({interval}) => interval),
    [allDepths],
  );

  const dispatch = useDispatch();

  const onAddDepth = useCallback(
    async (interval: LabelledDepthInterval) => {
      await dispatch(updateSoilDataDepthInterval({siteId, ...interval}));
    },
    [siteId, dispatch],
  );

  const updateSoilDataDepthPreset = useCallback(
    (newDepthPreset: SoilIdSoilDataDepthIntervalPresetChoices) => {
      dispatch(updateSoilData({siteId, depthIntervalPreset: newDepthPreset}));
    },
    [dispatch, siteId],
  );

  return (
    <ScrollView backgroundColor="grey.300">
      <SoilSurfaceStatus siteId={siteId} />
      <Box height="16px" />
      <Row
        backgroundColor="background.default"
        px="16px"
        py="12px"
        justifyContent="space-between"
        alignItems="center">
        <Heading variant="h6">{t('soil.pit')}</Heading>
        {!projectSettings && (
          <FormOverlaySheet
            Header={
              <Heading variant="h6">{t('soil.soil_preset.header')}</Heading>
            }
            trigger={onOpen => (
              <IconButton type="md" name="tune" onPress={onOpen} />
            )}>
            <EditSiteSoilDepthPreset
              selected={soilData.depthIntervalPreset}
              updateChoice={updateSoilDataDepthPreset}
            />
          </FormOverlaySheet>
        )}
      </Row>
      {allDepths.map(interval => (
        <SoilDepthSummary
          key={`${interval.interval.depthInterval.start}:${interval.interval.depthInterval.end}`}
          siteId={siteId}
          interval={interval}
          requiredInputs={projectRequiredInputs}
        />
      ))}
      <RestrictBySiteRole role={SITE_EDITOR_ROLES}>
        <Modal
          trigger={onOpen => (
            <Button
              size="lg"
              variant="fullWidth"
              backgroundColor="primary.dark"
              justifyContent="start"
              _text={{
                color: 'primary.contrast',
                textTransform: 'uppercase',
              }}
              _icon={{
                color: 'primary.contrast',
              }}
              width="full"
              borderRadius="0px"
              leftIcon={<Icon name="add" />}
              onPress={onOpen}>
              {t('soil.add_depth_label')}
            </Button>
          )}
          Header={<Heading variant="h6">{t('soil.depth.add_title')}</Heading>}>
          <AddDepthModalBody
            onSubmit={onAddDepth}
            existingDepths={existingDepths}
          />
        </Modal>
      </RestrictBySiteRole>
    </ScrollView>
  );
};
