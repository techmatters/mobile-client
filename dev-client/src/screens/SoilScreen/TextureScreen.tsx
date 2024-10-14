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

import {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, ImageSourcePropType} from 'react-native';

import {Button, ScrollView} from 'native-base';

import {entries, fromEntries} from 'terraso-client-shared/utils';

import {DoneButton} from 'terraso-mobile-client/components/buttons/DoneButton';
import {InfoButton} from 'terraso-mobile-client/components/buttons/icons/common/InfoButton';
import {HelpContentSpacer} from 'terraso-mobile-client/components/content/HelpContentSpacer';
import {TranslatedHeading} from 'terraso-mobile-client/components/content/typography/TranslatedHeading';
import {useHandleMissingSite} from 'terraso-mobile-client/components/dataRequirements/handleMissingData';
import {RestrictByRequirements} from 'terraso-mobile-client/components/dataRequirements/RestrictByRequirements';
import {Icon} from 'terraso-mobile-client/components/icons/Icon';
import {
  ImageRadio,
  radioImage,
} from 'terraso-mobile-client/components/ImageRadio';
import {Select} from 'terraso-mobile-client/components/inputs/Select';
import {
  Box,
  Column,
  Heading,
  Row,
  Text,
} from 'terraso-mobile-client/components/NativeBaseAdapters';
import {RestrictBySiteRole} from 'terraso-mobile-client/components/RestrictByRole';
import {SiteRoleContextProvider} from 'terraso-mobile-client/context/SiteRoleContext';
import {
  isProjectViewer,
  SITE_EDITOR_ROLES,
} from 'terraso-mobile-client/model/permissions/permissions';
import {
  RockFragmentVolume,
  SoilTexture,
  textures,
  updateDepthDependentSoilData,
} from 'terraso-mobile-client/model/soilId/soilIdSlice';
import {useNavigation} from 'terraso-mobile-client/navigation/hooks/useNavigation';
import {RockFragmentVolumeInfoContent} from 'terraso-mobile-client/screens/SoilScreen/components/RockFragmentVolumeInfoContent';
import {
  SoilPitInputScreenProps,
  SoilPitInputScreenScaffold,
} from 'terraso-mobile-client/screens/SoilScreen/components/SoilPitInputScreenScaffold';
import {TextureInfoContent} from 'terraso-mobile-client/screens/SoilScreen/components/TextureInfoContent';
import {useDispatch, useSelector} from 'terraso-mobile-client/store';
import {
  selectDepthDependentData,
  selectSite,
  selectUserRoleSite,
} from 'terraso-mobile-client/store/selectors';

const FRAGMENT_IMAGES = {
  VOLUME_0_1: require('terraso-mobile-client/assets/texture/rock-fragment/1.png'),
  VOLUME_1_15: require('terraso-mobile-client/assets/texture/rock-fragment/15.png'),
  VOLUME_15_35: require('terraso-mobile-client/assets/texture/rock-fragment/35.png'),
  VOLUME_35_60: require('terraso-mobile-client/assets/texture/rock-fragment/60.png'),
  VOLUME_60: require('terraso-mobile-client/assets/texture/rock-fragment/90.png'),
} satisfies Record<RockFragmentVolume, ImageSourcePropType> as Record<
  RockFragmentVolume,
  ImageSourcePropType
>;

export const TextureScreen = (props: SoilPitInputScreenProps) => {
  const {siteId, depthInterval} = props;
  const navigation = useNavigation();

  const {t} = useTranslation();
  const depthData = useSelector(selectDepthDependentData(props));
  const dispatch = useDispatch();

  const userRole = useSelector(state => selectUserRoleSite(state, siteId));

  const isViewer = useMemo(() => isProjectViewer(userRole), [userRole]);

  const site = useSelector(state => selectSite(siteId)(state));
  const handleMissingSite = useHandleMissingSite();
  const requirements = [{data: site, doIfMissing: handleMissingSite}];

  const onTextureChange = useCallback(
    (texture: SoilTexture | null) => {
      dispatch(
        updateDepthDependentSoilData({
          siteId,
          depthInterval: depthInterval.depthInterval,
          texture,
        }),
      );
    },
    [dispatch, siteId, depthInterval],
  );

  const renderTexture = useCallback(
    (value: SoilTexture) => t(`soil.texture.class.${value}`),
    [t],
  );

  const onGuide = useCallback(
    () => navigation.navigate('TEXTURE_GUIDE', props),
    [props, navigation],
  );

  // const onClayChange = useCallback(
  //   (clay: string) => {
  //     const parsed = parseInt(clay, 10);
  //     if (parsed >= 0 && parsed <= 100) {
  //       dispatch(
  //         updateDepthDependentSoilData({
  //           siteId,
  //           depthInterval: depthInterval.depthInterval,
  //           // clayPercent: clay,
  //         }),
  //       );
  //     }
  //   },
  //   [dispatch, siteId, depthInterval],
  // );

  const fragmentOptions = useMemo(
    () =>
      fromEntries(
        entries(FRAGMENT_IMAGES).map(([value, image]) => [
          value,
          {
            label: t(`soil.texture.rockfragment.${value}`),
            image: <Image style={radioImage} source={image} />,
          },
        ]),
      ),
    [t],
  );

  const onFragmentChange = useCallback(
    (rockFragmentVolume: RockFragmentVolume | null) => {
      dispatch(
        updateDepthDependentSoilData({
          siteId,
          depthInterval: depthInterval.depthInterval,
          rockFragmentVolume,
        }),
      );
    },
    [dispatch, siteId, depthInterval],
  );

  return (
    <RestrictByRequirements requirements={requirements}>
      {() => (
        <SoilPitInputScreenScaffold {...props}>
          <SiteRoleContextProvider siteId={siteId}>
            <ScrollView>
              <Column p="15px" bg="primary.contrast">
                <Row alignItems="center">
                  <Heading variant="h6">{t('soil.texture.title')}</Heading>
                  <HelpContentSpacer />
                  <InfoButton
                    sheetHeading={
                      <TranslatedHeading i18nKey="soil.texture.info.title" />
                    }>
                    <TextureInfoContent />
                  </InfoButton>
                </Row>
                <Box height="sm" />
                <Select
                  disabled={isViewer}
                  nullable
                  label={t('soil.texture.label')}
                  options={textures}
                  value={depthData?.texture ?? null}
                  onValueChange={onTextureChange}
                  renderValue={renderTexture}
                />
              </Column>
              <RestrictBySiteRole role={SITE_EDITOR_ROLES}>
                <Column p="15px" alignItems="flex-start" bg="grey.300">
                  <Text variant="body1">{t('soil.texture.guide_intro')}</Text>
                  <Box height="10px" />
                  <Button
                    onPress={onGuide}
                    rightIcon={<Icon name="chevron-right" />}
                    _text={{textTransform: 'uppercase'}}>
                    {t('soil.texture.use_guide_label')}
                  </Button>
                </Column>
              </RestrictBySiteRole>

              <Column p="15px" bg="primary.contrast">
                <Row alignItems="center">
                  <Text variant="body1-strong">
                    {t('soil.texture.fragment_title')}
                  </Text>
                  <HelpContentSpacer />
                  <InfoButton
                    sheetHeading={
                      <TranslatedHeading i18nKey="soil.texture.fragment.info.title" />
                    }>
                    <RockFragmentVolumeInfoContent />
                  </InfoButton>
                </Row>
                <Box height="10px" />
                <ImageRadio
                  value={depthData?.rockFragmentVolume}
                  options={fragmentOptions}
                  minimumPerRow={2}
                  onChange={isViewer ? () => {} : onFragmentChange}
                />
              </Column>
            </ScrollView>
            <RestrictBySiteRole role={SITE_EDITOR_ROLES}>
              <DoneButton />
            </RestrictBySiteRole>
          </SiteRoleContextProvider>
        </SoilPitInputScreenScaffold>
      )}
    </RestrictByRequirements>
  );
};
