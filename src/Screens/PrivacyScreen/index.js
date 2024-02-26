import React, { useState, useEffect } from 'react';
import {
    TouchableOpacity,
    Text,
    SafeAreaView,
    ScrollView,
    View,
    Alert,
    TouchableWithoutFeedback 
} from 'react-native';
import styles from './style';
import post from '../../utils/axios';
import { useIntl } from "react-intl";
import Header from '../../Components/headers';
import {useSelector} from 'react-redux';
import Webview from 'react-native-webview';

function PrivacyScreen({navigation}) {
    const selectlang = useSelector((state) => state.LangsReducer.langs); 
    useEffect(() => {
        async function getAgree(){
            const lang = new FormData();
            lang.append('set_lang',selectlang);
            const tosresult = await post('/api/agree1.php',lang);
            const privacyresult = await post('/api/agree2.php',lang);
            const marketingresult = await post('/api/agree3.php',lang);
            setTos(tosresult);
            setPrivacy(privacyresult);
            setMarketting(marketingresult);
        }        
        getAgree();
    }, [selectlang])
    const { messages } = useIntl();
    const [tos,setTos] = useState('');
    const [privacy,setPrivacy] = useState('');
    const [marketing,setMarketting] = useState('');
    const [tosSelect, setTosSelect] = useState(false);
    const [privacySelect, setPrivacySelect] = useState(false);
    const [marketingSelect, setMarketingSelect] = useState(false);
    
    const privacyCheck = () => {
        if(!tosSelect){
            return Alert.alert('',messages.toserror)
        }else if(!privacySelect){
            return Alert.alert('',messages.privacyerror)
        }else if(!marketingSelect){
            return Alert.alert('',messages.marketingerror)
        }
        navigation.navigate('Signup')
    }
    return (
        <SafeAreaView style={styles.container}>
            <Header title={messages.seviceagree} navigation={navigation}/>
            <ScrollView nestedScrollEnabled={true}>
                <View style={styles.contentbox}>
                    <View style={styles.privacySec}>
                        <View style={styles.radiogroup}>
                            <Text style={styles.radiotit}>{messages.tos}</Text>
                            <TouchableOpacity style={{ paddingHorizontal: 5, flexDirection: 'row' }} onPress={()=>setTosSelect(!tosSelect)}>
                                <View style={{
                                    height: 20,
                                    width: 20,
                                    borderRadius: 12,
                                    borderWidth: 2,
                                    borderColor: "white",
                                    backgroundColor: "white",
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    {
                                        tosSelect&&
                                        <View style={{
                                            height: 12,
                                            width: 12,
                                            borderRadius: 6,
                                            backgroundColor: '#F35174',
                                        }} />
                                    }
                                </View>
                            </TouchableOpacity>
                        </View>
                        {
                            tos?
                            <Webview
                                style={styles.scroll}
                                originWhitelist={['*']}
                                source={{html:tos.data}}
                                injectedJavaScript={`document.body.style.color='white';document.body.style.fontSize=24;`}
                            />
                            :<ScrollView style={styles.scroll} nestedScrollEnabled={true}></ScrollView>
                        }
                    </View>
                    <View style={styles.privacySec}>
                        <View style={styles.radiogroup}>
                            <Text style={styles.radiotit}>{messages.privacy}</Text>
                            <TouchableOpacity style={{ paddingHorizontal: 5, flexDirection: 'row' }} onPress={()=>setPrivacySelect(!privacySelect)}>
                                <View style={{
                                    height: 20,
                                    width: 20,
                                    borderRadius: 12,
                                    borderWidth: 2,
                                    borderColor: "white",
                                    backgroundColor: "white",
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    {
                                        privacySelect&&
                                        <View style={{
                                            height: 12,
                                            width: 12,
                                            borderRadius: 6,
                                            backgroundColor: '#F35174',
                                        }} />
                                    }
                                </View>
                            </TouchableOpacity>
                        </View>
                        {
                            privacy?
                            <Webview
                                style={styles.scroll}
                                originWhitelist={['*']}
                                source={{html:privacy.data}}
                                injectedJavaScript={`document.body.style.color='white';document.body.style.fontSize=24;`}
                            />
                            :<ScrollView style={styles.scroll} nestedScrollEnabled={true}></ScrollView>
                        }
                    </View>
                    <View style={styles.privacySec}>
                        <View style={styles.radiogroup}>
                            <Text style={styles.radiotit}>{messages.marketing}</Text>
                            <TouchableOpacity style={{ paddingHorizontal: 5, flexDirection: 'row' }} onPress={()=>setMarketingSelect(!marketingSelect)}>
                                <View style={{
                                    height: 20,
                                    width: 20,
                                    borderRadius: 12,
                                    borderWidth: 2,
                                    borderColor: "white",
                                    backgroundColor: "white",
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    {
                                        marketingSelect&&
                                        <View style={{
                                            height: 12,
                                            width: 12,
                                            borderRadius: 6,
                                            backgroundColor: '#F35174',
                                        }} />
                                    }
                                </View>
                            </TouchableOpacity>
                        </View>
                        {
                            marketing?
                            <Webview
                                style={styles.scroll}
                                originWhitelist={['*']}
                                source={{html:marketing.data}}
                                injectedJavaScript={`document.body.style.color='white';document.body.style.fontSize=24;`}
                            />
                            :<ScrollView style={styles.scroll} nestedScrollEnabled={true}></ScrollView>
                        }
                    </View>
                </View>
                <TouchableOpacity style={styles.btn} onPress={()=>privacyCheck()}><Text style={styles.pressTxt} >확인</Text></TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
export default PrivacyScreen;