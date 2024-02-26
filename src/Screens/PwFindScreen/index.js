import React, { useState, useEffect } from 'react';
import {
    TouchableOpacity,
    Text,
    SafeAreaView,
    TextInput,
    View,
    Keyboard
} from 'react-native';
import styles from '../SignupScreen/style';
import { useDispatch, useSelector } from "react-redux";
import { useIntl } from "react-intl";
import Header from '../../Components/headers';
import post from '../../utils/axios';
import Alert from '../../Components/Alert';
import {CommonActions} from '@react-navigation/native';

function PwFindScreen({navigation}) {
    const lang = useSelector((state) => state.LangsReducer.langs);
    const { messages } = useIntl();
    const [email, setEmail] = useState('');
    const [emailCheck, setemailCheck] = useState(false);
    const [errmsg, setErrmsg] = useState('');
    const [errmsgcheck, setErrmsgCheck] = useState(false);
    const onchangeEmail = (text) => {
        setEmail(text);
        let regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        if(regExp.test(text)===true){
            setemailCheck(true);
        }else if(regExp.test(text)===false&&emailCheck){
            setemailCheck(false);
        }
    }
    const onPressFindPw = async() => {
        Keyboard.dismiss();
        const formdata = new FormData();
        formdata.append('set_lang',lang);
        formdata.append('mt_id',email);
        const result = await post('/api/password_find.php',formdata);
        if(result.result=='false'){
            setErrmsg(result.msg);
            setErrmsgCheck(true);
            setTimeout(() => {
                setErrmsgCheck(false);
            }, 2000);
        }else{
            navigation.dispatch(
                CommonActions.reset({
                  index:1,
                  routes:[{name:'LoginAndSign'}]
                })
              )
        }
    }
    
    return (
        <SafeAreaView style={styles.container}>
            <Header title={messages.findpw} navigation={navigation}/>
                <View style={styles.wrap}>
                    <Text style={styles.signuptit}>{messages.findpwtit}</Text>
                    <Text style={styles.signupsub}>{messages.findpwsub}</Text>
                </View>
                <View style={styles.inputgroup}>
                    <TextInput style={styles.input} placeholder={messages.emailplaceholder} placeholderTextColor="#AAAAAA" onChangeText={(text)=>onchangeEmail(text)}/>
                    <View style={styles.errorbox}>
                    {!emailCheck&&
                        <Text style={styles.error}>{messages.emailsub}</Text>
                    }
                    </View>
                </View>
                <TouchableOpacity style={styles.pwfindbtn} onPress={()=>onPressFindPw()}>
                    <Text style={styles.pressTxt}>{messages.findpwbtn}</Text>
                </TouchableOpacity>
                {errmsgcheck&&<Alert title={errmsg}/>} 
        </SafeAreaView>
    );
}
export default PwFindScreen;