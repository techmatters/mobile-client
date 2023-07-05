/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

// react-native-get-random-values needed for uuid - https://github.com/uuidjs/uuid#react-native--expo
import 'react-native-get-random-values';

import React, {useEffect, useMemo} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Mapbox from '@rnmapbox/maps';
import {NativeBaseProvider} from 'native-base';
import {theme} from './theme';
import {LoginProvider} from './context/LoginContext';
import AppScaffold from './screens/AppScaffold';
import './translations';
import {checkAndroidPermissions} from './native';
import {PermissionsAndroid} from 'react-native';
import {Provider} from 'react-redux';
import {createStore} from './model/store';
import {setAPIConfig} from 'terraso-client-shared/config';

Mapbox.setAccessToken(
  'pk.eyJ1Ijoic2hyb3V4bSIsImEiOiJjbGY4bW8wbGEwbDJnM3FsN3I1ZzBqd2kzIn0.2Alc4o911ooGEtnObLpOUQ',
);

function App(): JSX.Element {
  // TODO: Integrate this with signup logic
  // For now these are just defaults to prevent errors from being thrown
  setAPIConfig({
    terrasoAPIURL: '',
    graphQLEndpoint: '',
    tokenStorage: {
      getToken: _name => '',
      setToken: (_name, _token) => {},
      removeToken: _name => {},
    },
    logger: _severity => {},
  });
  const store = useMemo(
    () =>
      createStore({
        site: {
          sites: {
            id1: {
              id: 'id1',
              name: 'site 1',
              latitude: 48.3820485,
              longitude: -123.5467687323,
            },
          },
        },
      }),
    [],
  );
  useEffect(() =>
    checkAndroidPermissions(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ),
  );
  return (
    <NativeBaseProvider theme={theme}>
      <NavigationContainer>
        <LoginProvider>
          <Provider store={store}>
            <AppScaffold />
          </Provider>
        </LoginProvider>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

export default App;
