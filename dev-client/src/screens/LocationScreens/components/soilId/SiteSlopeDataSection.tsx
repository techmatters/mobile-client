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

import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Button} from 'native-base';
import {Image, StyleSheet} from 'react-native';

import {SoilData} from 'terraso-client-shared/soilId/soilIdSlice';
import {selectSoilData} from 'terraso-client-shared/selectors';
import {
  Box,
  Heading,
  Text,
} from 'terraso-mobile-client/components/NativeBaseAdapters';
import {useSelector} from 'terraso-mobile-client/store';
import {useNavigation} from 'terraso-mobile-client/navigation/hooks/useNavigation';
import {RestrictBySiteRole} from 'terraso-mobile-client/components/RestrictByRole';
import {SiteTabName} from 'terraso-mobile-client/navigation/navigators/SiteLocationDashboardTabNavigator';
import {Icon} from 'terraso-mobile-client/components/icons/Icon';
import {STEEPNESS_IMAGES} from 'terraso-mobile-client/screens/SlopeScreen/utils/steepnessImages';
import {
  renderSlopeSteepnessDegree,
  renderSlopeSteepnessPercent,
} from 'terraso-mobile-client/screens/SlopeScreen/utils/renderValues';

type Props = {siteId: string};
export const SiteSlopeDataSection = ({siteId}: Props) => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const soilData = useSelector(selectSoilData(siteId));

  const onAddSoilDataPress = useCallback(() => {
    navigation.push('LOCATION_DASHBOARD', {
      siteId: siteId,
      initialTab: 'SLOPE' as SiteTabName,
    });
  }, [navigation, siteId]);

  const imageSrc = getSlopeSteepnessImageSource(soilData);

  return (
    <>
      <Heading variant="h6" pt="lg" pb="md">
        {t('site.soil_id.site_data.slope.title')}
      </Heading>

      <Box flexDirection="row">
        <Box borderWidth="2px" width="85px" height="85px" mr="md">
          {imageSrc && <Image style={styles.image} source={imageSrc} />}
        </Box>

        <Box flex={1}>
          <SlopeSteepnessTextSection {...soilData} />
        </Box>

        <RestrictBySiteRole
          role={[
            {kind: 'site', role: 'OWNER'},
            {kind: 'project', role: 'MANAGER'},
            {kind: 'project', role: 'CONTRIBUTOR'},
          ]}>
          <Box paddingVertical="lg">
            <Button
              _text={{textTransform: 'uppercase'}}
              alignSelf="flex-end"
              rightIcon={<Icon name="chevron-right" />}
              onPress={onAddSoilDataPress}>
              {t('site.soil_id.site_data.slope.add_data')}
            </Button>
          </Box>
        </RestrictBySiteRole>
      </Box>
    </>
  );
};

const getSlopeSteepnessImageSource = (soilData: SoilData) => {
  return soilData.slopeSteepnessSelect
    ? STEEPNESS_IMAGES[soilData.slopeSteepnessSelect]
    : undefined;
};

const SlopeSteepnessTextSection = ({
  slopeSteepnessSelect,
  slopeSteepnessPercent,
  slopeSteepnessDegree,
}: SoilData) => {
  const {t} = useTranslation();

  if (slopeSteepnessSelect) {
    return (
      <>
        <Text bold>
          {t(`slope.steepness.select_labels.${slopeSteepnessSelect}`)}
        </Text>
        <Text bold>
          {t(`slope.steepness.select_labels.${slopeSteepnessSelect}_PERCENT`)}
        </Text>
      </>
    );
  } else if (typeof slopeSteepnessPercent === 'number') {
    return (
      <Text bold>{renderSlopeSteepnessPercent(t, slopeSteepnessPercent)}</Text>
    );
  } else if (typeof slopeSteepnessDegree === 'number') {
    return (
      <Text bold>{renderSlopeSteepnessDegree(t, slopeSteepnessDegree)}</Text>
    );
  } else {
    return undefined;
  }
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
