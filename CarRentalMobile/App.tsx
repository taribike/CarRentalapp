import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {StatusBar} from 'react-native';

import {PaymentContextProvider} from './src/contexts/PaymentContext';

// Import screens
import HomeScreen from './src/screens/cars/HomeScreen';
import CarDetailsScreen from './src/screens/cars/CarDetailsScreen';
import BookingScreen from './src/screens/bookings/BookingScreen';
import BookingDetailsScreen from './src/screens/bookings/BookingDetailsScreen';
import ProfileScreen from './src/screens/profile/ProfileScreen';
import PaymentScreen from './src/screens/bookings/PaymentScreen';

// Import types
import {Car} from './src/models/Car';
import {Booking} from './src/models/Booking';

// Navigation types
export type RootStackParamList = {
  MainTabs: undefined;
  CarDetails: {car: Car};
  BookingDetails: {booking: Booking};
  Payment: {booking: Booking};
};

export type TabParamList = {
  Home: undefined;
  Bookings: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Cars',
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingScreen}
        options={{
          tabBarLabel: 'Bookings',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

function App(): React.JSX.Element {
  return (
    <PaymentContextProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#007AFF',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
          <Stack.Screen
            name="MainTabs"
            component={TabNavigator}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="CarDetails"
            component={CarDetailsScreen}
            options={{title: 'Car Details'}}
          />
          <Stack.Screen
            name="BookingDetails"
            component={BookingDetailsScreen}
            options={{title: 'Booking Details'}}
          />
          <Stack.Screen
            name="Payment"
            component={PaymentScreen}
            options={{title: 'Payment'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaymentContextProvider>
  );
}

export default App;