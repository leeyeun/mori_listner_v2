import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  Text,
  SafeAreaView,
  TextInput,
  View,
  Keyboard,
} from 'react-native';
import styles from '../SignupScreen/style';
import {useDispatch, useSelector} from 'react-redux';
import {useIntl} from 'react-intl';
import {CommonActions} from '@react-navigation/native';
import Header from '../../Components/headers';
import Alert from '../../Components/Alert';
import post from '../../utils/axios';
import {set_login} from '../../redux/actions/loginAction';
import messaging from '@react-native-firebase/messaging';

function LoginScreen({navigation}) {
  const lang = useSelector(state => state.LangsReducer.langs);
  const fcmtoken = useSelector(state => state.LoginReducer.apptoken);
  const dispatch = useDispatch();
  const {messages} = useIntl();
  const [email, setEmail] = useState('');
  const [emailCheck, setemailCheck] = useState(false);
  const [password, setPassword] = useState('');
  const [pwreg, setPwreg] = useState(false);
  const [errmsg, setErrmsg] = useState('');
  const [errmsgcheck, setErrmsgCheck] = useState(false);
  const onchangeEmail = text => {
    setEmail(text);
    let regExp =
      /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    if (regExp.test(text) === true) {
      setemailCheck(true);
    } else if (regExp.test(text) === false && emailCheck) {
      setemailCheck(false);
    }
  };
  const onchangePassword = text => {
    let regExp = /^.*(?=^.{8,12}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
    // if(text.length>12)return Alert.alert('','비밀번호를 확인해주세요');
    if (regExp.test(text) === true) {
      setPwreg(true);
    } else if (regExp.test(text) === false) {
      setPwreg(false);
    }
    setPassword(text);
  };
  const onPressLogin = async () => {
    if (emailCheck) {
      Keyboard.dismiss();
      const defaulttoken = await messaging().getToken();

      const formdata = new FormData();
      formdata.append('set_lang', lang);
      formdata.append('mt_id', email);
      formdata.append('mt_pwd', password);
      formdata.append('app_token', defaulttoken);
      const result = await post('/api/member_login.php', formdata);
      if (result.result == 'false') {
        setErrmsg(result.msg);
        setErrmsgCheck(true);
        setTimeout(() => {
          setErrmsgCheck(false);
        }, 2000);
      } else {
        dispatch(set_login(result.data.data));
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{name: 'ConferenceCode'}],
          }),
        );
      }
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header title={messages.login} navigation={navigation} />
      <View style={styles.wrap}>
        <Text style={styles.signuptit}>{messages.logintit}</Text>
        <Text style={styles.signupsub}>{messages.loginsub}</Text>
      </View>
      <View style={styles.inputgroup}>
        <TextInput
          style={styles.input}
          placeholder={messages.emailplaceholder}
          placeholderTextColor="#AAAAAA"
          onChangeText={text => onchangeEmail(text)}
        />
        <View style={styles.errorbox}>
          {!emailCheck && email.length > 0 && (
            <Text style={styles.error}>{messages.emailsub}</Text>
          )}
        </View>
        <TextInput
          style={styles.input}
          placeholder={messages.loginpwplaceholder}
          placeholderTextColor="#AAAAAA"
          onChangeText={text => onchangePassword(text)}
          secureTextEntry={true}
        />
        <View style={styles.errorbox}>
          {!pwreg && password.length > 0 && (
            <Text style={styles.error}>{messages.passwordsub}</Text>
          )}
        </View>
      </View>
      {/* 나중에 확인 요망 07.20 RESET으로 수정예정*/}
      <TouchableOpacity style={styles.btn} onPress={() => onPressLogin()}>
        <Text style={styles.pressTxt}>{messages.login}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.borderbtn}
        onPress={() => navigation.push('Pwfind')}>
        <Text style={styles.borderbtnTxt}>{messages.findpw}</Text>
      </TouchableOpacity>
      {errmsgcheck && <Alert title={errmsg} />}
    </SafeAreaView>
  );
}
export default LoginScreen;
