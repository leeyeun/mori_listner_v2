import React, {useState, useEffect, useReducer} from 'react';
import {
  TouchableOpacity,
  Text,
  SafeAreaView,
  ScrollView,
  View,
  Image,
  Alert,
} from 'react-native';
import styles from './style';
import {useIntl} from 'react-intl';
import Header from '../../Components/headers';
import post from '../../utils/axios';
import {useSelector} from 'react-redux';

const defaulturl = `https://change-all.com`;
function ConferenceScreen({navigation, route}) {
  const {messages} = useIntl();
  const lang = useSelector(state => state.LangsReducer.langs);
  const [conference, setConference] = useState({});
  useEffect(() => {
    async function getList() {
      if (route.params?.code) {
        const formdata = new FormData();
        formdata.append('set_lang', lang);
        formdata.append('code_in', route.params.code);
        const result = await post('/api/listen_conference_info.php', formdata);
        if (result.result == 'false') {
          return Alert.alert('', result.msg);
        } else {
          let getdata = result.data;
          getdata.con_img = defaulturl + getdata.con_img.substring(2);
          if (result.data.session_list?.length > 0) {
            for (let value in result.data.session_list) {
              if (getdata.session_list[value]['ses_img'].indexOf('https://')) {
                getdata.session_list[value]['ses_img'] =
                  defaulturl +
                  result.data.session_list[value]['ses_img'].substring(2);
              }
            }
          }
          return setConference(getdata);
        }
      }
    }
    getList();
  }, [lang]);
  return conference ? (
    <SafeAreaView style={styles.container}>
      <Header
        title={messages.conferenceMain}
        navigation={navigation}
        usesetting={true}
      />
      <ScrollView>
        <View>
          <Image
            source={{uri: conference.con_img ? conference.con_img : null}}
            style={styles.img}
          />
        </View>
        <View style={styles.conferenceBox}>
          <View style={styles.conferenceContent}>
            <View style={styles.titlearea}>
              <View>
                <Text style={styles.date}>{conference.date}</Text>
                <Text style={styles.title}>{conference.title}</Text>
              </View>
              <View>
                {conference.con_detail_type != 'NONE' ? (
                  <TouchableOpacity
                    style={styles.more}
                    onPress={() =>
                      navigation.push('More', {
                        type: conference.con_detail_type,
                        code: route.params.code,
                        date: conference.date,
                      })
                    }>
                    <Text style={styles.moretxt}>MORE</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
            <Text style={styles.confcontent} numberOfLines={4}>
              {conference.sub}
            </Text>
          </View>
        </View>
        <View style={styles.sessionwrap}>
          <View style={styles.sessionlist}>
            <View style={styles.sessionbox}>
              <Text style={styles.sessiontxt}>세션목록</Text>
              <Text style={styles.sessioncnt}>
                {conference.session_list?.length}
              </Text>
            </View>
          </View>
          <View style={styles.list}>
            {conference.session_list?.map((rows, index) => {
              return (
                <TouchableOpacity
                  style={styles.sessioneContent}
                  onPress={() =>
                    navigation.push('Session', {code: rows.ses_code})
                  }
                  key={rows.ses_idx}>
                  <View style={styles.sestitlearea}>
                    <View style={styles.txtbox}>
                      <Text style={styles.date}>{rows.ses_date}</Text>
                      <Text style={styles.sessiontitle}>{rows.ses_title}</Text>
                      <Text style={styles.content} numberOfLines={2}>
                        {rows.ses_content}
                      </Text>
                    </View>
                    <View style={styles.sessionimgbox}>
                      <Image
                        source={{uri: rows.ses_img ? rows.ses_img : null}}
                        style={styles.sessionimg}
                        resizeMode="cover"
                      />
                      <Image
                        source={require('../../assign/img/session_arrow.png')}
                        style={styles.arrowimg}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  ) : null;
}
export default ConferenceScreen;
