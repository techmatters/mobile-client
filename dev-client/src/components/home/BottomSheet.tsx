import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {useNavigation} from '../../screens/AppScaffold';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  Link,
  Image,
  useTheme,
} from 'native-base';
import {useCallback, useMemo} from 'react';
import {Site} from 'terraso-client-shared/site/siteSlice';
import {Trans, useTranslation} from 'react-i18next';
import {Icon} from '../common/Icons';
import {SiteCard} from '../sites/SiteCard';

const LandPKSInfo = () => {
  const {t} = useTranslation();

  return (
    <BottomSheetScrollView>
      <VStack space={3} pb="60%" px={5}>
        <Heading>{t('site.empty.title')}</Heading>
        <Image
          source={require('../../assets/landpks_intro_image.png')}
          width="100%"
          height="30%"
          resizeMode="contain"
          alt={t('site.empty.intro_image_alt')}
        />
        <Text>
          <Text bold>{t('site.empty.description.lead')} </Text>
          {t('site.empty.description.body')}
        </Text>
        <Text alignItems="center">
          <Text bold>{t('site.empty.location.lead')} </Text>
          <Trans
            i18nKey="site.empty.location.body"
            components={{
              icon: (
                <Icon
                  name="my-location"
                  color="action.active"
                  position="relative"
                />
              ),
            }}
          />
        </Text>
        <Text>
          <Text bold>{t('site.empty.search.lead')} </Text>
          {t('site.empty.search.body')}
        </Text>
        <Text>
          <Text bold>{t('site.empty.learn_more.lead')} </Text>
          <Trans
            i18nKey="site.empty.learn_more.body"
            components={{
              // note: "link" is a reserved word for the Trans component, cannot use as key here
              // see https://react.i18next.com/latest/trans-component#alternative-usage-which-lists-the-components-v11.6.0
              landpks: (
                <Link
                  _text={{
                    color: 'primary.main',
                    fontSize: 'sm',
                  }}
                  isExternal
                  pt={2}
                />
              ),
            }}
          />
        </Text>
      </VStack>
    </BottomSheetScrollView>
  );
};

type Props = {
  sites: Record<string, Site>;
  showSiteOnMap: (site: Site) => void;
};
const SiteListBottomSheet = ({sites, showSiteOnMap}: Props) => {
  const {t} = useTranslation();
  const navigation = useNavigation();

  const siteList = useMemo(() => Object.values(sites), [sites]);

  const renderSite = useCallback(
    ({item}: {item: Site}) => (
      <SiteCard site={item} onShowSiteOnMap={showSiteOnMap} />
    ),
    [showSiteOnMap],
  );

  const snapPoints = useMemo(
    () => ['15%', siteList.length === 0 ? '50%' : '75%', '100%'],
    [siteList.length],
  );

  const addSiteCallback = useCallback(() => {
    navigation.navigate('CREATE_SITE');
  }, [navigation]);

  const {colors} = useTheme();
  const style = useMemo(() => ({paddingHorizontal: 16}), []);
  const backgroundStyle = useMemo(
    () => ({backgroundColor: colors.grey[300]}),
    [colors],
  );

  return (
    <BottomSheet
      snapPoints={snapPoints}
      backgroundStyle={backgroundStyle}
      style={style}
      handleIndicatorStyle={{backgroundColor: colors.grey[800]}}>
      <Box paddingX="4px">
        <Flex
          direction="row"
          justify="space-between"
          align="center"
          paddingBottom="4">
          <Heading variant="h6">{t('site.list_title')}</Heading>
          <Button
            size="sm"
            onPress={addSiteCallback}
            startIcon={<Icon name="add" />}>
            {t('site.create')}
          </Button>
        </Flex>
      </Box>
      {siteList.length === 0 ? (
        <LandPKSInfo />
      ) : (
        <BottomSheetFlatList
          data={siteList}
          keyExtractor={site => site.id}
          renderItem={renderSite}
          ItemSeparatorComponent={() => <Box height="8px" />}
        />
      )}
    </BottomSheet>
  );
};

export default SiteListBottomSheet;
