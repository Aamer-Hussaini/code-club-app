import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import ConnectScreen from './components/connect';
import DataScreen from './components/data';
import CommandScreen from './components/command';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTabState } from './components/connect';

const Tab = createBottomTabNavigator();
const TabNavigator = () => (
  <Tab.Navigator
    tabBarOptions={
      {
        activeTintColor: 'white',
        inactiveTintColor: 'gray',
        
        style: {
          backgroundColor: '#082938',
        },
      }
    }>
    <Tab.Screen 
      name = "Connect"       
      component = {ConnectScreen}
      options={{
        tabBarIcon: ({color, size}) => (
          <MaterialCommunityIcons name="bluetooth-connect" color={color} size={size} />
        )
      }} />
    <Tab.Screen 
      name = "Data" 
      component = {DataScreen}
      options={{
        tabBarIcon: ({color, size}) => (
          <MaterialCommunityIcons name="chart-line" color={color} size={size} />
        ),
      }} />
    <Tab.Screen 
      name = "Command" 
      component = {CommandScreen}
      options={{
        tabBarIcon: ({color, size}) => (
          <MaterialCommunityIcons name="console" color={color} size={size} />
        ),        
      }} />
  </Tab.Navigator>
)

export default function App() {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}
