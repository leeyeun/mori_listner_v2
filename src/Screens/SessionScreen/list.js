import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import styles from './style';
import {useSelector} from 'react-redux';
import post from '../../utils/axios';
function SessionList({
  _engine,
  joinid,
  setJoinId,
  data,
  isJoined,
  lang,
  stop,
  getSession,
}) {
  //인터벌 실행 함수
  const [int_data, setInt_data] = useState({
    code: null,
    name: null,
  });

  const listen_interval_handle = async () => {
    console.log('확인용 2');

    const fromData = new FormData();
    fromData.append('set_lang', lang);
    fromData.append('session_code', int_data.code);
    fromData.append('channel_name', int_data.name);
    const result = await post('/api/listen_ing_interval.php', fromData);
    await console.log('확인용 3');

    if (result.result === 'false') {
      console.log('확인용 4');
      await stop();
      await setInt_data({
        code: null,
        name: null,
      });
      await console.log('여기까지 ');
    }
  };

  useEffect(() => {
    let interval = setInterval(() => {
      console.log('확인용 1');
      int_data?.code !== null && listen_interval_handle();
      getSession();
    }, 10000);

    return () => clearInterval(interval);
  }, [int_data.code, isJoined]);

  const logindata = useSelector(state => state.LoginReducer.loginstate);
  const start = async (code, status, listen_token, channel_name) => {
    console.log('channel_name ::: ', channel_name);
    if (status == 'open' && listen_token) {
      if (!joinid) {
        // await _engine?.joinChannel(listen_token, code, null, 0);
        await _engine?.joinChannel(listen_token, channel_name, null, 0);
        setJoinId(joinid === code ? '' : code);
        const formdata = new FormData();
        formdata.append('set_lang', lang);
        formdata.append('code_in', code);
        formdata.append('mt_idx', logindata.mt_idx);
        const result = await post('/api/listen_session_play.php', formdata);
        if (result.result == 'false') return Alert.alert('', result.msg);
      } else {
        if (isJoined) {
          await stop();
          //   await _engine?.joinChannel(listen_token, code, null, 0);
          await _engine?.joinChannel(listen_token, channel_name, null, 0);
          setJoinId(joinid === code ? '' : code);
          const formdata = new FormData();
          formdata.append('set_lang', lang);
          formdata.append('code_in', code);
          formdata.append('mt_idx', logindata.mt_idx);
          const result = await post('/api/listen_session_play.php', formdata);
          if (result.result == 'false') {
            return Alert.alert('', result.msg);
          }
        }
      }
    }
  };

  const renderItem = ({item}) => (
    <View
      style={
        item.status == 'open'
          ? [
              styles.seslistwrap,
              joinid == item.session_code && isJoined
                ? {backgroundColor: '#F36180'}
                : {backgroundColor: '#39393A'},
            ]
          : isJoined == item.session_code
          ? [styles.seslistwrap, {backgroundColor: '#F36180'}]
          : styles.seslistwrap
      }>
      <View style={styles.seslist}>
        <Text
          style={
            item.status == 'open'
              ? styles.lang
              : [
                  styles.lang,
                  joinid == item.session_code && isJoined
                    ? {color: '#FFFFFF'}
                    : {color: '#555555'},
                ]
          }>
          {item.lang_title}
        </Text>
        {isJoined == false || joinid !== item.session_code ? (
          // <TouchableOpacity onPress={()=>start(item.session_code,item.status,item.listen_token)}>
          <TouchableOpacity
            onPress={() => {
              start(
                item.session_code,
                item.status,
                item.listen_token,
                item.channel_name,
              );
              setInt_data(data => {
                if (data.name === item.channel_name) {
                  return {code: null, name: null};
                } else {
                  return {code: item.session_code, name: item.channel_name};
                }
              });
            }}>
            <Image
              source={require('../../assign/img/ic_play.png')}
              style={styles.sesplay}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => stop()} style={styles.stopbox}>
            <Image
              source={require('../../assign/img/ic_eq_w.png')}
              style={styles.seseq}
              resizeMode="contain"
            />
            <Image
              source={require('../../assign/img/ic_stop.png')}
              style={styles.sesplay}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
  return (
    <FlatList
      data={data}
      keyExtractor={item => item.lang_id}
      renderItem={item => renderItem(item)}
    />
  );
}
export default SessionList;
