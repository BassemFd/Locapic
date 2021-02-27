import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);
import * as React from 'react';

import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import ChatScreen from './screens/ChatScreen';
import POIScreen from './screens/POIScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import { FontAwesome } from '@expo/vector-icons';
import pseudo from './reducers/newName.reducer';
import poi from './reducers/POI.reducer';

import {Provider} from 'react-redux';
import {createStore, combineReducers}  from 'redux';
const store = createStore(combineReducers({pseudo, poi}));

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();



function NavMenu () {
  return (
   
      <Tab.Navigator  screenOptions={({ route }) => ({
  tabBarIcon: ({ color }) => {
    let iconName;

    if (route.name === 'Map') {
      iconName = 'location-arrow';
    } else if (route.name === 'Chat') {
      iconName = 'wechat';
    } else if (route.name === 'POI') {
      iconName = 'bookmark'
    }

    return <FontAwesome name={iconName} size={24} color={color} />;
  },
})}
  tabBarOptions={{
    activeTintColor: '#eb4d4b',
  inactiveTintColor: '#FFFFFF',
  style: {
    backgroundColor: '#130f40',
  }
}}>
<Tab.Screen name="Map" component={MapScreen} />
<Tab.Screen name="Chat" component={ChatScreen} />
<Tab.Screen name="POI" component={POIScreen} />

</Tab.Navigator>

  )}

function App() {
  return (
    <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MapScreen" component={NavMenu} />
     </Stack.Navigator>
</NavigationContainer>
</Provider>

  );
}


export default App;
