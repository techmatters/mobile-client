import {Box, Button, Column, Heading, Text} from 'native-base';
import {useNavigation} from 'terraso-mobile-client/screens/AppScaffold';
import {useDispatch, useSelector} from 'terraso-mobile-client/model/store';
import {useEffect, useCallback} from 'react';
import {auth} from 'terraso-mobile-client/auth';
import {setHasAccessTokenAsync} from 'terraso-client-shared/account/accountSlice';
import {useTranslation} from 'react-i18next';
import {
  Icon,
  MaterialCommunityIcons,
} from 'terraso-mobile-client/components/common/Icons';
import TerrasoLogo from 'terraso-mobile-client/assets/terraso-logo.svg';
import GoogleLogo from 'terraso-client-shared/assets/google.svg';
import MicrosoftLogo from 'terraso-client-shared/assets/microsoft.svg';

export const LoginScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const loggedIn = useSelector(
    state => state.account.currentUser.data !== null,
  );

  // note: we intentionally run this on every render,
  // so we can't accidentally get stuck on this view because
  // it was navigated to while there is already user data

  const dispatch = useDispatch();
  const onPress = useCallback((providerName) => {
    return () => {
      auth(providerName)
        .then(() => dispatch(setHasAccessTokenAsync()))
        .catch(e => console.error(e));
    }
  }, [dispatch]);

  useEffect(() => {
    if (loggedIn) {
      navigation.replace('HOME');
    }
  });

  return (
    <Column bgColor="primary.main" alignItems="center" h="100%">
      <Box flexGrow={2} />
      <Column justifyContent="flex-end" alignItems="center">
        <Heading variant="h3" fontSize="40px" color="primary.contrast">
          {t('login.title')}
        </Heading>
        <Box h="28px" />
        <Heading variant="h5" color="primary.contrast" textAlign="center" pl={10} pr={10}>
          {t('login.subtitle')}
        </Heading>
        <Box h="72px" />
        <Button.Group direction="column" space={5}>
          <Button
            bgColor="primary.contrast"
            _text={{color: 'primary.main'}}
            size="lg"
            onPress={onPress('google')}
            startIcon={
              <GoogleLogo />
            }>
            {t('account.google_login').toUpperCase()}
          </Button>
          <Button
            bgColor="primary.contrast"
            _text={{color: 'primary.main'}}
            size="lg"
            onPress={onPress('microsoft')}
            startIcon={
              <MicrosoftLogo />
            }>
            {t('account.microsoft_login').toUpperCase()}
          </Button>
          <Button
            bgColor="primary.contrast"
            _text={{color: 'primary.main'}}
            size="lg"
            onPress={onPress('apple')}
            startIcon={
              <Icon
                as={MaterialCommunityIcons}
                name="apple"
                color="primary.main"
              />
            }>
            {t('account.apple_login').toUpperCase()}
          </Button>
        </Button.Group>
      </Column>
      <Box flexGrow={3} />
      <Column pb="60px" alignItems="center" justifyContent="flex-end">
        <TerrasoLogo width="122px" height="39px" />
        <Box h="12px" />
        <Text variant="caption" color="primary.contrast">
          {t('login.description')}
        </Text>
      </Column>
    </Column>
  );
};
