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
import {ScrollView} from 'react-native-gesture-handler';

import {Button} from 'native-base';

import LandPksSVG from 'terraso-mobile-client/assets/LandPKS-from-Terraso-logo.svg';
import {ScreenContentSection} from 'terraso-mobile-client/components/content/ScreenContentSection';
import {TranslatedBulletList} from 'terraso-mobile-client/components/content/typography/TranslatedBulletList';
import {TranslatedParagraph} from 'terraso-mobile-client/components/content/typography/TranslatedParagraph';
import {ExternalLink} from 'terraso-mobile-client/components/links/ExternalLink';
import {Box, Text} from 'terraso-mobile-client/components/NativeBaseAdapters';
import {useStorage} from 'terraso-mobile-client/hooks/useStorage';
import {useNavigation} from 'terraso-mobile-client/navigation/hooks/useNavigation';

export const WelcomeScreen = () => {
  const {t} = useTranslation();
  // TODO-cknipe: Convention for this?
  const [deleteThis, setWelcomeScreenAlreadySeen] = useStorage(
    'welcomeScreenAlreadySeen',
    false,
  );
  const navigation = useNavigation();

  // Welcome screen will only show on first time app is opened, so we expect user needs to log in next
  const onGetStarted = useCallback(() => {
    setWelcomeScreenAlreadySeen(true);
    navigation.navigate('LOGIN');
    // TODO-cknipe: Is it expected that this is false here? Probably, if it's like setState
    console.log(`MMKV after GetStarted: ${deleteThis}`);
  }, [navigation, deleteThis, setWelcomeScreenAlreadySeen]);

  return (
    <ScrollView>
      <Box backgroundColor="background.secondary" height="175px">
        <Box alignSelf="center" pt="68px">
          <LandPksSVG />
        </Box>
      </Box>

      <ScreenContentSection title={t('welcome.title')}>
        <Text variant="body1-strong" mb="sm">
          {t('welcome.version_includes.title')}
        </Text>
        <TranslatedBulletList
          i18nKeys={[
            'welcome.version_includes.bullet_1',
            'welcome.version_includes.bullet_2',
            'welcome.version_includes.bullet_3',
            'welcome.version_includes.bullet_4',
          ]}
        />

        <Text variant="body1-strong">{t('welcome.next.title')}</Text>
        <Text variant="body1" mb="sm">
          {t('welcome.next.subtitle')}
        </Text>
        <TranslatedBulletList
          i18nKeys={[
            'welcome.next.bullet_1',
            'welcome.next.bullet_2',
            'welcome.next.bullet_3',
            'welcome.next.bullet_4',
          ]}
        />

        <TranslatedParagraph i18nKey="welcome.learn_more" />

        <ExternalLink
          label={t('welcome.link_text')}
          url={t('welcome.link_url')}
        />

        <Button
          size="lg"
          alignSelf="flex-end"
          onPress={onGetStarted}
          _text={{textTransform: 'uppercase'}}>
          {t('welcome.get_started')}
        </Button>
      </ScreenContentSection>
    </ScrollView>
  );
};
