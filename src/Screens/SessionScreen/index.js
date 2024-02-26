import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  Text,
  SafeAreaView,
  Alert,
  View,
  ImageBackground,
  ScrollView,
  Platform,
  AppState,
} from 'react-native';
import styles from './style';
import RtcEngine, {
  ChannelProfile,
  ClientRole,
  RtcEngineConfig,
} from 'react-native-agora';
import {useIntl} from 'react-intl';
import Header from '../../Components/headers';
import List from './list';
import Sound from './sound';
import DataList from './datalist';
import Duration from './duration';
import config from '../../../agora.config.json';
import {useSelector, useDispatch} from 'react-redux';
import post from '../../utils/axios';
import {set_push_refresh, leave_channel} from '../../redux/actions/loginAction';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
let _engine = undefined;
const defaulturl = `https://change-all.com`;
let joincheck = false;
function SessionScreen({navigation, route}) {
  const {messages} = useIntl();
  const dispatch = useDispatch();
  const lang = useSelector(state => state.LangsReducer.langs);
  const refrash = useSelector(state => state.LoginReducer.refreshcheck);
  const leave = useSelector(state => state.LoginReducer.leave);
  const loginstate = useSelector(state => state.LoginReducer.loginstate);
  const [tabactive, setTabactive] = useState('translate');
  const [getEngine, setGetEngine] = useState(false);
  const [isJoined, setisJoined] = useState(false);
  const [joinid, setJoinId] = useState('');
  const [volume, setVolume] = useState(0);
  const [duration, setDuration] = useState(0);
  const [sessiondata, setSessionData] = useState({});
  useEffect(() => {
    if (refrash) {
      dispatch(set_push_refresh({refreshcheck: false}));
      setTimeout(async () => {
        await getSession();
      }, 1500);
    }
  }, [refrash]);
  useEffect(() => {
    async function agoraRemove() {
      await stop();
      setTimeout(async () => {
        dispatch(set_push_refresh({refreshcheck: true}));
      }, 2500);
    }
    if (leave?.check) {
      if (joinid === leave.room) {
        dispatch(leave_channel({check: false, room: ''}));
        setJoinId('');
        agoraRemove();
      } else {
        setTimeout(async () => {
          dispatch(set_push_refresh({refreshcheck: true}));
        }, 2500);
      }
    }
  }, [leave]);
  useEffect(() => {
    initEngine();
    async function get() {
      await getSession();
      await joinsession();
    }
    get();
    return () => {
      async function agoraRemove() {
        await stop();
        await leaveSession();
      }
      agoraRemove();
      _engine?.destroy();
    };
  }, []);
  const joinsession = async () => {
    const formdata = new FormData();
    formdata.append('set_lang', lang);
    formdata.append('mt_idx', loginstate.mt_idx);
    formdata.append('code_in', route.params.code);
    await post('api/listen_session_page_in.php', formdata);
  };
  const leaveSession = async () => {
    const formdata = new FormData();
    formdata.append('set_lang', lang);
    formdata.append('mt_idx', loginstate.mt_idx);
    await post('/api/listen_session_page_out.php', formdata);
  };
  const stop = async () => {
    if (isJoined) {
      await _engine?.leaveChannel();
      setJoinId('');
      setDuration(0);
      if (Platform.OS == 'android') {
        if (ReactNativeForegroundService.is_task_running('agora')) {
          ReactNativeForegroundService.remove_task('agora');
        }
        // Stoping Foreground service.
        ReactNativeForegroundService.stop();
      }
    }
  };
  const getSession = async () => {
    const formdata = new FormData();
    formdata.append('set_lang', lang);
    formdata.append('code_in', route.params?.code);
    const result = await post('/api/listen_session_info.php', formdata);
    if (result.result == 'false') {
      return Alert.alert('', result.msg);
    } else {
      if (result.data?.filelist.length > 0) {
        for (let file in result.data.filelist) {
          result.data.filelist[file].file_link =
            defaulturl + result.data.filelist[file].file_link.substring(2);
        }
      }
      if (result.data?.img) {
        if (result.data.img.indexOf('https://') === -1) {
          result.data.img = defaulturl + result.data.img.substring(2);
        }
      }
      console.log(result.data);
      setSessionData(result.data);
    }
  };

  const initEngine = async () => {
    _engine = await RtcEngine.createWithConfig(
      new RtcEngineConfig(config.appId),
    );
    await addListeners(_engine);
    await _engine.enableAudio();
    await _engine.enableAudioVolumeIndication(300, 3, true);
    await _engine.setChannelProfile(ChannelProfile.LiveBroadcasting);
    await _engine.setClientRole(ClientRole.Audience);
    setGetEngine(true);
  };

  const addListeners = _engine => {
    _engine?.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      console.info('JoinChannelSuccess', channel, uid, elapsed);
      joincheck = true;
      setisJoined(true);
      if (Platform.OS === 'android') {
        if (ReactNativeForegroundService.is_task_running('agora')) return;
        ReactNativeForegroundService.add_task(
          () => {
            // console.log('I am Being Tested')
          },
          {
            delay: 1000,
            onLoop: true,
            taskId: 'agora',
            onError: e => console.log(`Error logging:`, e),
          },
        );
        // starting  foreground service.
        ReactNativeForegroundService.start({
          id: 144,
          title: messages.listenerstart,
          message: messages.listenerstart,
        });
      }
    });
    // _engine?.addListener('RtcStats', (stats) => {
    //     setDuration(changetime(stats.duration))
    //     console.info('RtcStats', stats);
    // });
    _engine?.addListener('LeaveChannel', stats => {
      console.info('LeaveChannel', stats);
      joincheck = false;
      setisJoined(false);
      if (Platform.OS == 'android') {
        if (ReactNativeForegroundService.is_task_running('agora')) {
          ReactNativeForegroundService.remove_task('agora');
        }
        // Stoping Foreground service.
        ReactNativeForegroundService.stop();
      }
    });
    _engine?.addListener('AudioVolumeIndication', stats => {
      if (stats && stats.length > 0) {
        setVolume(parseInt(stats[0].volume));
      }
    });
    _engine?.addListener('RtcStats', state => {
      if (AppState.currentState == 'background') {
        if (state) {
          console.log(state);
          setDuration(state?.duration);
        }
      }
    });
  };
  return sessiondata ? (
    <SafeAreaView style={styles.container}>
      <Header title={messages.session} navigation={navigation} />
      <View style={styles.content}>
        <ImageBackground
          source={{uri: sessiondata.img ? sessiondata.img : null}}
          resizeMode="cover"
          style={styles.image}
          imageStyle={{borderRadius: 10}}>
          <ScrollView contentContainerStyle={styles.conferbox}>
            <Text style={styles.time}>{sessiondata.date}</Text>
            <Text style={styles.title}>{sessiondata.title}</Text>
            <Text style={styles.des}>{sessiondata.content}</Text>
          </ScrollView>
        </ImageBackground>
      </View>
      <View style={styles.sessionbox}>
        <View style={styles.sessionheader}>
          <TouchableOpacity
            style={styles.tabbtn}
            onPress={() => setTabactive('translate')}>
            <View />
            <Text
              style={
                tabactive == 'translate' ? styles.tabactivetext : styles.tabtext
              }>
              {messages.translate}
            </Text>
            <View style={tabactive == 'translate' && styles.activetab}></View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabbtn}
            onPress={() => setTabactive('databox')}>
            <View />
            <Text
              style={
                tabactive == 'databox' ? styles.tabactivetext : styles.tabtext
              }>
              {messages.databox}
            </Text>
            <View style={tabactive == 'databox' && styles.activetab}></View>
          </TouchableOpacity>
        </View>
        <View style={styles.listbox}>
          {tabactive == 'translate' ? (
            <List
              _engine={_engine}
              isJoined={isJoined}
              joinid={joinid}
              channelid={config.channelId}
              token={config.token}
              setJoinId={setJoinId}
              data={sessiondata?.codelist}
              lang={lang}
              stop={stop}
              getSession={getSession}
            />
          ) : null}
          {tabactive == 'databox' && <DataList data={sessiondata?.filelist} />}
        </View>
      </View>
      <View style={styles.soundAnddurationbox}>
        <View>
          <Duration
            isJoined={isJoined}
            duration={duration}
            setDuration={setDuration}
          />
          <Sound volume={volume} />
        </View>
      </View>
    </SafeAreaView>
  ) : null;
}
export default SessionScreen;
