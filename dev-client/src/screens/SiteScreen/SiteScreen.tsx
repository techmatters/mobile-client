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
import {StyleSheet, ScrollView} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Button, Divider} from 'native-base';

import {SitePrivacy, updateSite} from 'terraso-client-shared/site/siteSlice';
import {useDispatch, useSelector} from 'terraso-mobile-client/store';
import {RadioBlock} from 'terraso-mobile-client/components/RadioBlock';
import {Accordion} from 'terraso-mobile-client/components/Accordion';
import {StaticMapView} from 'terraso-mobile-client/components/StaticMapView';
import {Coords} from 'terraso-mobile-client/model/map/mapSlice';
import {ProjectInstructionsButton} from 'terraso-mobile-client/screens/SiteScreen/components/ProjectInstructionsButton';

import {Icon} from 'terraso-mobile-client/components/icons/Icon';
import {IconButton} from 'terraso-mobile-client/components/icons/IconButton';
import {useInfoPress} from 'terraso-mobile-client/hooks/useInfoPress';
import {
  Box,
  Column,
  HStack,
  Row,
  Text,
} from 'terraso-mobile-client/components/NativeBaseAdapters';

import StackedBarChart from 'terraso-mobile-client/assets/stacked-bar.svg';

const TEMP_ELEVATION = '1900 ft';
const TEMP_ACCURACY = '20 ft';
const TEMP_MODIFIED_DATE = '8/15/23';
const TEMP_MODIFIED_NAME = 'Sample Sam';
const TEMP_NOT_FOUND = 'not found';
const TEMP_SOIL_ID_VALUE = 'Clifton';
const TEMP_ECO_SITE_PREDICTION = 'Loamy Upland';

type Props = {
  siteId?: string;
  coords?: Coords;
};

const LocationDetail = ({label, value}: {label: string; value: string}) => (
  <Text variant="body1">
    <Text bold>{label}: </Text>
    <Text>{value}</Text>
  </Text>
);

type LocationPredictionProps = {
  label: string;
  soilName: string;
  ecologicalSiteName: string;
};

const LocationPrediction = ({
  label,
  soilName,
  ecologicalSiteName,
}: LocationPredictionProps) => {
  const {t} = useTranslation();

  return (
    <Column
      backgroundColor="background.secondary"
      alignItems="flex-start"
      py="18px"
      pl="16px">
      <Row alignItems="center">
        <Box mr={15}>
          <StackedBarChart />
        </Box>
        <Text variant="body1" color="primary.lighter" bold>
          {label}
        </Text>
      </Row>
      <Box h="15px" />
      <Text variant="body2" color="primary.contrast" mb="5px">
        <Text bold>{t('soil.top_match')}: </Text>
        <Text>{soilName}</Text>
      </Text>
      <Text variant="body2" color="primary.contrast" mb="25px">
        <Text bold>{t('soil.ecological_site_name')}: </Text>
        <Text>{ecologicalSiteName}</Text>
      </Text>

      <Button w="95%" rightIcon={<Icon name="chevron-right" />}>
        {t('soil.explore_data').toUpperCase()}
      </Button>
    </Column>
  );
};

export const SiteScreen = ({siteId, coords}: Props) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const onInfoPress = useInfoPress();

  const site = useSelector(state =>
    siteId === undefined ? undefined : state.site.sites[siteId],
  );
  if (coords === undefined) {
    coords = site!;
  }
  const project = useSelector(state =>
    site?.projectId === undefined
      ? undefined
      : state.project.projects[site.projectId],
  );

  const onSitePrivacyChanged = useCallback(
    (privacy: SitePrivacy) => dispatch(updateSite({id: site!.id, privacy})),
    [site, dispatch],
  );

  return (
    <ScrollView>
      <StaticMapView
        coords={coords}
        style={styles.mapView}
        displayCenterMarker={true}
      />
      <Accordion
        initiallyOpen
        Head={
          <Text variant="body1" color="primary.contrast">
            {t('general.details')}
          </Text>
        }>
        <Box px="16px" py="8px">
          {project && (
            <LocationDetail label={t('projects.label')} value={project.name} />
          )}
          {project && (
            <LocationDetail
              label={t('site.dashboard.privacy')}
              value={t(`privacy.${project.privacy.toLowerCase()}.title`)}
            />
          )}
          {site && !project && (
            <HStack>
              <RadioBlock
                label={
                  <HStack>
                    <Text variant="body1" bold>
                      {t('site.dashboard.privacy')}
                    </Text>
                    <IconButton
                      pt={0}
                      pb={0}
                      pl={2}
                      size="md"
                      name="info"
                      onPress={onInfoPress}
                      _icon={{color: 'primary'}}
                    />
                  </HStack>
                }
                options={{
                  PUBLIC: {text: t('privacy.public.title')},
                  PRIVATE: {text: t('privacy.private.title')},
                }}
                groupProps={{
                  name: 'site-privacy',
                  onChange: onSitePrivacyChanged,
                  value: site.privacy,
                  ml: '0',
                }}
              />
            </HStack>
          )}
          <LocationDetail
            label={t('geo.latitude.title')}
            value={coords?.latitude.toFixed(6)}
          />
          <LocationDetail
            label={t('geo.longitude.title')}
            value={coords?.longitude.toFixed(6)}
          />
          <LocationDetail
            label={t('geo.elevation.title')}
            value={TEMP_ELEVATION}
          />
          {site && (
            <>
              <LocationDetail
                label={t('site.dashboard.location_accuracy')}
                value={TEMP_ACCURACY}
              />
              <LocationDetail
                label={t('soil.bedrock')}
                value={TEMP_NOT_FOUND}
              />
              <LocationDetail
                label={t('site.dashboard.last_modified.label')}
                value={t('site.dashboard.last_modified.value', {
                  date: TEMP_MODIFIED_DATE,
                  name: TEMP_MODIFIED_NAME,
                })}
              />
            </>
          )}
          {project?.siteInstructions && (
            <ProjectInstructionsButton project={project} />
          )}
        </Box>
      </Accordion>
      <Divider />
      <Column space="20px" padding="16px">
        <LocationPrediction
          label={t('soil.soil_id').toUpperCase()}
          soilName={TEMP_SOIL_ID_VALUE}
          ecologicalSiteName={TEMP_ECO_SITE_PREDICTION}
        />
      </Column>
    </ScrollView>
  );
};

const styles = StyleSheet.create({mapView: {height: 170}});
