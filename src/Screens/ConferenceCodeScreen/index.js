import React, { useState, useEffect } from 'react';
import {
    TouchableOpacity,
    Text,
    SafeAreaView,
    TextInput,
    View,
    Image,
    Keyboard
} from 'react-native';
import styles from './style';
import { useDispatch, useSelector } from "react-redux";
import { useIntl } from "react-intl";
import {SetHeader} from '../../Components/headers';
import Alert from '../../Components/Alert';
import post from '../../utils/axios';
function ConferenceScreen({navigation}) {
    const lang = useSelector((state) => state.LangsReducer.langs);
    const dispatch = useDispatch();
    const { messages } = useIntl();
    const [code, setCode] = useState('');
    const [errmsg, setErrmsg] = useState('');
    const [errmsgcheck, setErrmsgCheck] = useState(false);
    const onPressSubmit = async() => {      
        Keyboard.dismiss();  
        const formdata = new FormData();
        formdata.append('set_lang',lang)
        formdata.append('code_in',code)
        const result = await post('/api/listen_code_in.php',formdata);
        if(result.result=='false'){
            setErrmsg(result.msg);
            setErrmsgCheck(true);
            setTimeout(() => {
                setErrmsgCheck(false);
            }, 2000);
        }else{
            if(result.data=='conference'){
                navigation.navigate('Conference',{code}); 
            }else if(result.data=='session'){   
                navigation.navigate('Session',{code}); 
            }
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <SetHeader title={messages.conference} navigation={navigation}/>
                <View style={styles.wrap}>
                    <Text style={styles.conftit}>{messages.conferencetit}</Text>
                    <Text style={styles.confsub}>{messages.conferencesub}</Text>
                </View>
                <View style={styles.inputgroup}>
                    <TextInput style={styles.input} placeholder={messages.conferenceodeceplaceholder} placeholderTextColor="#AAAAAA" textAlign="center" onChangeText={text=>setCode(text)}/>
                    <View style={styles.errorbox}>
                        <Text style={styles.error}>{messages.conferencealert}</Text>
                    </View>
                </View>
                <View style={styles.btnbox}>
                    <TouchableOpacity style={styles.custombtn} onPress={()=>onPressSubmit()}>
                    <Image source={require('../../assign/img/code_btn.png')} style={styles.nextbtn} />
                    <View style={styles.textbox}>
                        <Text style={styles.btntext}>{messages.next}</Text>
                    </View>
                    </TouchableOpacity>
                </View>
                {errmsgcheck&&<Alert title={errmsg}/>} 
        </SafeAreaView>
    );
}
export default ConferenceScreen;