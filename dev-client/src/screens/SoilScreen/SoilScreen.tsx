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

import {Box, Button, Column, Heading, Row, ScrollView} from 'native-base';
import {useDispatch, useSelector} from 'terraso-mobile-client/store';
import {useTranslation} from 'react-i18next';
import {Icon, IconButton} from 'terraso-mobile-client/components/Icons';
import {AddIntervalModal} from 'terraso-mobile-client/components/AddIntervalModal';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {Modal} from 'terraso-mobile-client/components/Modal';
import {useMemo, useCallback, useEffect} from 'react';
import {
  LabelledDepthInterval,
  SoilData,
  methodRequired,
  soilPitMethods,
  updateSoilData,
  updateSoilDataDepthInterval,
} from 'terraso-client-shared/soilId/soilIdSlice';
import {RestrictBySiteRole} from 'terraso-mobile-client/components/RestrictByRole';
import {SoilSurfaceStatus} from './components/SoilSurfaceStatus';
import {SoilDepthIntervalSummary} from 'terraso-mobile-client/screens/SoilScreen/components/SoilDepthIntervalSummary';
import {selectSoilDataIntervals} from 'terraso-client-shared/selectors';
import {BottomSheetModal} from 'terraso-mobile-client/components/BottomSheetModal';
import {EditSiteSoilDepthPreset} from './components/EditSiteSoilDepthPreset';
import {SoilIdSoilDataDepthIntervalPresetChoices} from 'terraso-client-shared/graphqlSchema/graphql';

export const SoilScreen = ({siteId}: {siteId: string}) => {
  const {t} = useTranslation();
  const soilData = useSelector(state => state.soilId.soilData[siteId]) as
    | SoilData
    | undefined;
  const project = useSelector(state => {
    const projectId = state.site.sites[siteId].projectId;
    return projectId ? state.soilId.projectSettings[projectId] : undefined;
  });

  const projectRequiredInputs = useMemo(() => {
    return soilPitMethods.filter(m => (project ?? {})[methodRequired(m)]);
  }, [project]);

  const allIntervals = useSelector(state =>
    selectSoilDataIntervals(state, siteId),
  );

  const existingIntervals = useMemo(
    () => allIntervals.map(({interval: {depthInterval}}) => depthInterval),
    [allIntervals],
  );

  const dispatch = useDispatch();

  const onAddDepthInterval = useCallback(
    async (interval: LabelledDepthInterval) => {
      await dispatch(updateSoilDataDepthInterval({siteId, ...interval}));
    },
    [siteId, dispatch],
  );

  const updateSoilDataDepthPreset = useCallback(
    (newDepthPreset: SoilIdSoilDataDepthIntervalPresetChoices) => {
      dispatch(updateSoilData({siteId, depthIntervalPreset: newDepthPreset}));
    },
    [dispatch, soilData, siteId],
  );

  return (
    <BottomSheetModalProvider>
      <ScrollView>
        <Column backgroundColor="grey.300">
          <SoilSurfaceStatus
            required={project ? project.verticalCrackingRequired : true}
            complete={Boolean(soilData?.surfaceCracksSelect)}
            siteId={siteId}
          />
          <Box height="16px" />
          <Row
            backgroundColor="background.default"
            px="16px"
            py="12px"
            justifyContent="space-between">
            <Heading variant="h6">{t('soil.pit')}</Heading>
            {soilData && !project && (
              <BottomSheetModal
                trigger={onOpen => (
                  <IconButton
                    name="tune"
                    _icon={{color: 'action.active'}}
                    onPress={onOpen}
                  />
                )}>
                <EditSiteSoilDepthPreset
                  /* LANDPKS is the default here */
                  selected={soilData.depthIntervalPreset || 'LANDPKS'}
                  updateChoice={updateSoilDataDepthPreset}
                />
              </BottomSheetModal>
            )}
          </Row>
          {allIntervals.map(aggregated => (
            <SoilDepthIntervalSummary
              key={`${aggregated.interval.depthInterval.start}:${aggregated.interval.depthInterval.end}`}
              siteId={siteId}
              interval={aggregated}
              requiredInputs={projectRequiredInputs}
              data={undefined}
            />
          ))}
          <RestrictBySiteRole
            role={[
              {kind: 'project', role: 'manager'},
              {kind: 'project', role: 'contributor'},
              {kind: 'site', role: 'owner'},
            ]}>
            <Modal
              trigger={onOpen => (
                <Button
                  size="lg"
                  variant="fullWidth"
                  backgroundColor="primary.dark"
                  justifyContent="start"
                  _text={{
                    color: 'primary.contrast',
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
              )}>
              <AddIntervalModal
                onSubmit={onAddDepthInterval}
                existingIntervals={existingIntervals}
              />
            </Modal>
          </RestrictBySiteRole>
        </Column>
      </ScrollView>
    </BottomSheetModalProvider>
  );
};
