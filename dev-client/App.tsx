/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';

import Mapbox from '@rnmapbox/maps';
import {NativeBaseProvider} from 'native-base';
import {theme} from './theme';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LoginProvider} from './context/LoginContext';
import ScreenDisplay from './screens/ScreenDisplay';

Mapbox.setAccessToken(
  'pk.eyJ1Ijoic2hyb3V4bSIsImEiOiJjbGY4bW8wbGEwbDJnM3FsN3I1ZzBqd2kzIn0.2Alc4o911ooGEtnObLpOUQ',
);

function App(): JSX.Element {
  return (
    <NativeBaseProvider theme={theme}>
      <NavigationContainer>
        <LoginProvider>
          <ScreenDisplay />
        </LoginProvider>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

export default App;
