import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {IntlProvider} from 'react-intl';
import en from './locale/en';
import ko from './locale/ko';
import {useSelector, useDispatch} from 'react-redux';
import LoginAndSignScreen from './Screens/LoginAndSignScreen';
import PrivacyScreen from './Screens/PrivacyScreen';
import SignupScreen from './Screens/SignupScreen';
import LoginScreen from './Screens/LoginScreen';
import PwFindScreen from './Screens/PwFindScreen';
import EmailCodeScreen from './Screens/EmailCodeScreen';
import ConferenceCodeScreen from './Screens/ConferenceCodeScreen';
import SettingScreen from './Screens/SettingScreen';
import TosScreen from './Screens/SettingScreen/TosScreen';
import PwChangeScreen from './Screens/PwChangeScreen';
import ConferenceScreen from './Screens/ConferenceScreen';
import SessionScreen from './Screens/SessionScreen';
import MoreScreen from './Screens/MoreScreen';
import messaging from '@react-native-firebase/messaging';
import {set_push_refresh, leave_channel} from './redux/actions/loginAction';

const Stack = createStackNavigator();

function stack() {
  let langs = useSelector(state => state.LangsReducer.langs);
  const dispatch = useDispatch();
  let message = langs === 'ko' ? ko : en;
  messaging().onMessage(async remoteMessage => {
    if (remoteMessage.data.title == 'end') {
      dispatch(leave_channel({check: true, room: remoteMessage.data.message}));
    } else {
      dispatch(set_push_refresh({refreshcheck: true}));
    }
  });
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    if (remoteMessage.data.title == 'end') {
      dispatch(leave_channel({check: true, room: remoteMessage.data.message}));
    } else {
      dispatch(set_push_refresh({refreshcheck: true}));
    }
  });
  return (
    <IntlProvider locale={langs} messages={message}>
      <Stack.Navigator>
        <Stack.Screen
          name="LoginAndSign"
          component={LoginAndSignScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Privacy"
          component={PrivacyScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Pwfind"
          component={PwFindScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EmailCode"
          component={EmailCodeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ConferenceCode"
          component={ConferenceCodeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Conference"
          component={ConferenceScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Setting"
          component={SettingScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Tos"
          component={TosScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PwChangeScreen"
          component={PwChangeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Session"
          component={SessionScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="More"
          component={MoreScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </IntlProvider>
  );
}

export default stack;
