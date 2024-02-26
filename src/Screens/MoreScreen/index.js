import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Image,
  ImageBackground,
  Dimensions,
  Animated,
  Keyboard,
} from 'react-native';
import {useIntl} from 'react-intl';
import {useSelector} from 'react-redux';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import Header from '../../Components/headers';
import styles from './style';
import post from '../../utils/axios';
import Alert from '../../Components/Alert';
import ImageZoom from 'react-native-image-pan-zoom';
const defaulturl = `https://change-all.com`;
const Width = Dimensions.get('screen').width;
const Height = Dimensions.get('screen').height;

function MoreScreen({navigation, route}) {
  const {messages} = useIntl();
  const lang = useSelector(state => state.LangsReducer.langs);
  const [data, setData] = useState([]);
  const [errmsg, setErrmsg] = useState('');
  const [errmsgcheck, setErrmsgCheck] = useState(false);
  const [current, setCurrent] = useState(0);
  const slideref = useRef(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const scaleValue = useRef(1);
  useEffect(() => {
    async function getDetail() {
      if (route.params?.type) {
        Keyboard.dismiss();
        const formdata = new FormData();
        formdata.append('set_lang', lang);
        formdata.append('code_in', route.params.code);
        formdata.append('type', route.params.type);
        // formdata.append('type','POSTER')
        const result = await post(
          '/api/listen_conference_detail.php',
          formdata,
        );
        if (result.result == 'false') {
          setErrmsg(result.msg);
          setErrmsgCheck(true);
          setTimeout(() => {
            setErrmsgCheck(false);
          }, 2000);
        } else {
          if (route.params?.type == 'TEXT') {
            let getdata = result.data;
            getdata.back_img = defaulturl + getdata.back_img.substring(2);
            setData(getdata);
          } else {
            let getdata = result.data?.list;
            if (getdata?.length > 0) {
              for (let test in getdata) {
                getdata[test].poster_img =
                  defaulturl + getdata[test].poster_img.substring(2);
              }
              setData(getdata);
            } else {
              let getdata = result.data;
              getdata.back_img = defaulturl + getdata.back_img.substring(2);
              setData(getdata);
            }
          }
        }
      }
    }
    getDetail();
  }, []);

  const handleCurrentChange = e => {
    let contentOffset = e.nativeEvent.contentOffset;
    let viewSize = e.nativeEvent.layoutMeasurement;
    let pageNum = Math.round(contentOffset.x / viewSize.width);
    setCurrent(pageNum);
  };
  return route.params?.type == 'TEXT' ? (
    data && (
      <SafeAreaView>
        <Header
          title={messages.conferenceMain}
          navigation={navigation}
          usesetting={true}
        />
        <ImageBackground
          source={{uri: data.back_img}}
          resizeMode="cover"
          style={styles.backimg}>
          <ScrollView>
            {data.list?.map((rows, index) => {
              console.log(rows);
              return (
                <View style={styles.textsection} key={index}>
                  <Text style={styles.title}>{rows.txt_title}</Text>
                  <Text style={styles.des}>{rows.txt_content}</Text>
                </View>
              );
            })}
          </ScrollView>
        </ImageBackground>
        {errmsgcheck && <Alert title={errmsg} />}
      </SafeAreaView>
    )
  ) : (
    <SafeAreaView style={styles.container}>
      <Header title={messages.more} navigation={navigation} />
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScrollEndDrag={handleCurrentChange}
        bounces={false}
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {data?.map((rows, index) => {
          return (
            <ImageZoom
              cropWidth={Width}
              cropHeight={Height - 56}
              imageWidth={Width}
              imageHeight={Height}
              minScale={1}
              key={index}
              style={{alignItems: 'center', justifyContent: 'center'}}
              onStartShouldSetPanResponder={e => {
                return (
                  e.nativeEvent.touches.length === 2 || scaleValue.current > 1
                );
              }}
              onMove={({scale}) => {
                scaleValue.current = scale;
                setScrollEnabled(scale === 1);
              }}>
              <View
                style={{width: '100%', height: '100%'}}
                onStartShouldSetResponder={e => {
                  return (
                    e.nativeEvent.touches.length < 2 && scaleValue.current <= 1
                  );
                }}>
                <Image
                  source={{uri: rows.poster_img ? rows.poster_img : null}}
                  style={{width: Width, flex: 1}}
                  resizeMode="contain"
                />
              </View>
            </ImageZoom>
          );
        })}
      </Animated.ScrollView>
      <Pagination
        dotsLength={data.length}
        activeDotIndex={current}
        dotColor={'red'}
        dotStyle={styles.paginationDot}
        inactiveDotColor={'#ffffff'}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
        carouselRef={slideref}
        tappableDots={!!slideref}
        containerStyle={{position: 'absolute', bottom: 20}}
      />
    </SafeAreaView>
  );
}
export default MoreScreen;
