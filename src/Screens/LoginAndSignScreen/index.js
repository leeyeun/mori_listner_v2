import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  Text,
  SafeAreaView,
  Image,
  View,
  Platform,
  Alert,
} from 'react-native';
// import {NaverLogin, getProfile} from '@react-native-seoul/naver-login';
import NaverLogin,{
  NaverLoginResponse,
  GetProfileResponse,
} from '@react-native-seoul/naver-login';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  appleAuth,
  appleAuthAndroid,
} from '@invertase/react-native-apple-authentication';
import {
  LoginManager,
  Settings,
  AuthenticationToken,
  AccessToken,
  Profile,
} from 'react-native-fbsdk-next';
import {
  login as kLogin,
  getProfile as getKakaoProfile,
} from '@react-native-seoul/kakao-login';
import post from '../../utils/axios';
import AsyncStorage from '@react-native-community/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {useIntl} from 'react-intl';
import 'react-native-get-random-values';
import {v4 as uuid} from 'uuid';
import {set_langs} from '../../redux/actions/langsActions';
import {set_token, set_login} from '../../redux/actions/loginAction';
import SelectLangs from '../../Components/SelectLangs';
import styles from './style';
import {getToken} from '../../utils/fcm';
import jwtDecode from 'jwt-decode';
import {CommonActions} from '@react-navigation/native';
const iosKeys = {
  consumerKey: 'ZIi4Wpw4nc4fgcRrWh7k',
  consumerSecret: 'NXykZyW6Ib',
  appName: '모리',
  serviceUrlScheme: 'morilistener', // only for iOS
};

const androidKeys = {
  consumerKey: 'ZIi4Wpw4nc4fgcRrWh7k',
  consumerSecret: 'NXykZyW6Ib',
  appName: '모리',
};
const initials = Platform.OS === 'ios' ? iosKeys : androidKeys;
function LoginAndSignScreen({navigation}) {
  const lang = useSelector(state => state.LangsReducer.langs);
  const [isopen, setIsopen] = useState(false);
  const [naverToken, setNaverToken] = useState(null);
  const [apptoken, setApptoken] = useState('');
  const dispatch = useDispatch();
  useEffect(() => {
    async function _AsyncStorage() {
      AsyncStorage.getItem('langs', (_err, result) => {
        if (result === 'ko' || result === 'en') {
          dispatch(set_langs({langs: result}));
        } else {
          setIsopen(true);
        }
      });
    }
    async function getFcmToken() {
      const fcmToken = await getToken();
      console.log('defaulttoken 333 ::', fcmToken);
      setApptoken(fcmToken);
      dispatch(set_token({token: fcmToken}));
    }
    getFcmToken();
    socialGoogleConfigure();
    Settings.initializeSDK();
    _AsyncStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const {messages} = useIntl();

  const naverlogin = props => {
    return new Promise((resolve, reject) => {
      console.log(props);
      NaverLogin.login(props, (err, token) => {
        console.log(`\n\n  token is fetched  :: ${typeof token} \n\n`);
        if (token == null) {
          resolve(null);
          return;
        }
        setNaverToken(token);
        getUserProfile(token.accessToken);
        if (err) {
          reject(err);
          return;
        }
        resolve(token);
      });
    });
  };

  const getUserProfile = async token => {
    const profileResult = await getProfile(token);
    if (profileResult.resultcode === '024') {
      Alert.alert('', profileResult.message);
      return;
    }
    console.log('profileResult', profileResult, token);
    if (profileResult?.message == 'success') {
      const fcmToken = await getToken();

      const formdata = new FormData();
      formdata.append('set_lang', lang);
      formdata.append('sns_id', profileResult.response.id);
      formdata.append('app_token', fcmToken);
      formdata.append('mt_name', profileResult?.response?.name ?? '');
      formdata.append('mt_email', profileResult?.response?.email ?? '');
      console.log('naver ::: ', profileResult);
      socialLogin('/api/SNS_login_naver.php', formdata);
    }
  };

  const kakaologin = async () => {
    try {
      const kakaoToken = await kLogin();
      console.log('kakao ', kakaoToken);
      await getKakaoProfileHandler(kakaoToken.accessToken);
    } catch (err) {
      console.log(err);
      Alert.alert(
        '카카오톡 계정 정보가 없습니다.',
        '카카오톡을 사용 중이신지 확인해주세요.',
        [
          {
            text: '확인',
          },
        ],
      );
    }
  };
  const getKakaoProfileHandler = async accessToken => {
    try {
      const fcmToken = await getToken();
      const profile = await getKakaoProfile();
      const formdata = new FormData();
      formdata.append('set_lang', lang);
      formdata.append('sns_id', profile.id);
      formdata.append('app_token', fcmToken);
      formdata.append('mt_email', profile?.email);
      formdata.append('mt_name', profile?.nickname);
      console.log('kakao :: ', profile);
      socialLogin('/api/SNS_login_kakao.php', formdata);
    } catch (err) {
      Alert.alert('오류가 발생하였습니다.', '다시 확인해주세요.', [
        {
          text: '확인',
        },
      ]);
    }
  };
  const facebooklogin = () => {
    LoginManager.logInWithPermissions(['public_profile']).then(
      async result => {
        if (result.isCancelled) {
          Alert.alert('로그인 취소', 'login cancelled');
        } else {
          setTimeout(() => {
            getfacebookprofile();
          }, 1000);
          async function getfacebookprofile() {
            const profile = await Profile.getCurrentProfile();
            const formdata = new FormData();
            formdata.append('set_lang', lang);
            formdata.append('sns_id', profile.userID);
            formdata.append('app_token', apptoken);
            formdata.append('mt_email', profile?.email ?? '');
            formdata.append('mt_name', profile?.name ?? '');
            console.log('facebook :: ', profile);
            socialLogin('/api/SNS_login_facebook.php', formdata);
          }
        }
      },
      error => {
        Alert.alert('로그인 실패', error);
      },
    );
  };
  const applelogin = async () => {
    if (Platform.OS === 'ios') {
      try {
        const appleAuthRequestResponse = await appleAuth.performRequest({
          requestedOperation: appleAuth.Operation.LOGIN,
          requestedScopes: [appleAuth.Scope.EMAIL],
        });
        const credentialState = await appleAuth.getCredentialStateForUser(
          appleAuthRequestResponse.user,
        );
        if (credentialState === appleAuth.State.AUTHORIZED) {
          const {identityToken, user} = appleAuthRequestResponse;
          const decoded = jwtDecode(identityToken);
          const formdata = new FormData();
          formdata.append('set_lang', lang);
          formdata.append('sns_id', decoded.sub);
          formdata.append('app_token', apptoken);
          formdata.append('mt_email', decoded?.email ?? '');
          socialLogin('/api/SNS_login_apple.php', formdata);
        }
      } catch (err) {}
    } else if (Platform.OS === 'android') {
      const rawNonce = uuid();
      const state = uuid();
      try {
        appleAuthAndroid.configure({
          clientId: 'com.mori.listener.aos',
          redirectUri: 'https://change-all.com/',
          responseType: appleAuthAndroid.ResponseType.ALL,
          scope: appleAuthAndroid.Scope.ALL,
          nonce: rawNonce,
          state,
        });

        const response = await appleAuthAndroid.signIn();
        if (response) {
          const decoded = jwtDecode(response.id_token);
          const formdata = new FormData();
          formdata.append('set_lang', lang);
          formdata.append('sns_id', decoded.sub);
          formdata.append('app_token', apptoken);
          formdata.append('mt_email', decoded?.email ?? '');
          socialLogin('/api/SNS_login_apple.php', formdata);
        }
      } catch (error) {
        if (error && error.message) {
          switch (error.message) {
            case appleAuthAndroid.Error.NOT_CONFIGURED:
              console.log('appleAuthAndroid not configured yet.');
              break;
            case appleAuthAndroid.Error.SIGNIN_FAILED:
              console.log('Apple signin failed.');
              break;
            case appleAuthAndroid.Error.SIGNIN_CANCELLED:
              console.log('User cancelled Apple signin.');
              break;
            default:
              console.log(error);
          }
        }
      }
    }
  };
  const googlelogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const formdata = new FormData();
      formdata.append('set_lang', lang);
      formdata.append('sns_id', userInfo?.user.id);
      formdata.append('app_token', apptoken);
      formdata.append('mt_name', userInfo?.user.name);
      formdata.append('mt_email', userInfo?.user.email);
      socialLogin('/api/SNS_login_google.php', formdata);
    } catch (error) {
      console.log(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        Alert.alert('구글 로그인을 취소하셨습니다.', '', [
          {
            text: '확인',
          },
        ]);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        // alert('Signin in progress');
        Alert.alert('구글 로그인 진행 중.', '', [
          {
            text: '확인',
          },
        ]);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        // alert('PLAY_SERVICES_NOT_AVAILABLE');
        Alert.alert('귀하의 구글 계정은 사용하실 수 없는 계정입니다.', '', [
          {
            text: '확인',
          },
        ]);
      } else {
        // some other error happened
        console.log('else err');
      }
    }
  };
  const socialGoogleConfigure = async () => {
    await GoogleSignin.configure({
      webClientId:
        '266087303269-oofub3uugjm2nebur4a1dm8mpm1fq1v5.apps.googleusercontent.com',
    });
  };
  const socialLogin = async (url, data) => {
    console.log(data);
    const result = await post(url, data);
    if (result.result == 'true') {
      dispatch(set_login(result.data.data));
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'ConferenceCode'}],
        }),
      );
    } else {
      Alert.alert('', result.msg);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <SelectLangs isopen={isopen} setIsopen={setIsopen} />
      <View style={styles.imgSection}>
        <Image
          source={require('../../assign/img/login_img.png')}
          style={styles.LoginImg}
        />
      </View>
      <View style={styles.loginAndSignBtn}>
        <TouchableOpacity
          style={styles.emailLogin}
          onPress={() => navigation.push('Login')}>
          <Text style={styles.whitetext}>{messages.emailLogin}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.emailSign}
          onPress={() => navigation.push('Privacy')}>
          <Text style={styles.pinktext}>{messages.emailSign}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.snsSection}>
        <Text style={styles.socialtit}>{messages.snsLogintxt}</Text>
        <Text style={styles.socialdes}>{messages.snsLoginDes}</Text>
        <View style={styles.socialgroup}>
          <TouchableOpacity onPress={() => kakaologin()}>
            <Image
              source={require('../../assign/img/btn_kakao.png')}
              style={styles.socialimage}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => naverlogin(initials)}>
            <Image
              source={require('../../assign/img/btn_naver.png')}
              style={styles.socialimage}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => googlelogin()}>
            <Image
              source={require('../../assign/img/btn_google.png')}
              style={styles.socialimage}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => facebooklogin()}>
            <Image
              source={require('../../assign/img/btn_facebook.png')}
              style={styles.socialimage}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => applelogin()}>
            <Image
              source={require('../../assign/img/btn_apple.png')}
              style={styles.socialimage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
export default LoginAndSignScreen;
