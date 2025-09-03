// App.tsx (ringkas)
import * as React from 'react';
import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from './src/screens/home';
import SupportAgent from './src/screens/agent-support';
import PermissionGate from './src/screens/permission';
import EmergencyScreen from './src/screens/emergency';

type Root = {
  Home: undefined;
  Emergency: undefined;
  PermissionGate: undefined;
};

const Stack = createNativeStackNavigator<Root>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="PermissionGate"
        screenOptions={{
          headerShown: false,
          contentStyle: {backgroundColor: '#303030'},
        }}>
        {/* <Stack.Screen
          name="PermissionGate"
          component={(props: any) => (
            <PermissionGate
              onAllGranted={() => props.navigation.replace('Home')}
            />
          )}
        />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Emergency" component={EmergencyScreen} /> */}
        <Stack.Screen name="Home" component={SupportAgent} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const custom = StyleSheet.create({
  note: {color: '#6b7280', fontSize: 12},
});
