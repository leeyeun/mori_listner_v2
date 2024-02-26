import React, { useState, useEffect,useRef } from 'react';
import {
    TouchableOpacity,
    Text,
    SafeAreaView,
    TextInput,
    View,
    Keyboard
} from 'react-native';
import styles from './style';
import { useIntl } from "react-intl";
import Header from '../../Components/headers';
import Alert from '../../Components/Alert';
import post from '../../utils/axios';
import {CommonActions} from '@react-navigation/native';
import {useSelector,useDispatch} from 'react-redux';
import {set_login} from '../../redux/actions/loginAction';
function EmailCodeScreen({navigation,route}) {
    const { messages } = useIntl();
    const dispatch = useDispatch();
    const fcmtoken = useSelector((state) => state.LoginReducer.apptoken); 
    const [code1,setCode1] = useState('');
    const [code2,setCode2] = useState('');
    const [code3,setCode3] = useState('');
    const [code4,setCode4] = useState('');   
    const [errmsg, setErrmsg] = useState('');
    const [errmsgcheck, setErrmsgCheck] = useState(false)
    const input_ref = new Array(4).fill(null);    
    input_ref[0] = useRef(null)
    input_ref[1] = useRef(null)
    input_ref[2] = useRef(null)
    input_ref[3] = useRef(null)
    useEffect(() => {
        if(code1){
            if(!code1){
                input_ref[0].current.focus();
            }else if(!code2){
                input_ref[1].current.focus();
            }else if(!code3){
                input_ref[2].current.focus();
            }else if(!code4){
                input_ref[3].current.focus();
            }
        }else{
            input_ref[0].current.focus();
        }
    }, [code1,code2,code3,code4])
    const chkAndSign = async() =>{
        if(code1&&code2&&code3&&code4){   
            Keyboard.dismiss();
            let code = code1+code2+code3+code4;
            let formdata = new FormData();
            formdata.append('set_lang',route.params?.logindata.selectlang)
            formdata.append('mt_id',route.params?.logindata.email)
            formdata.append('passcode',code)
            const resultemail = await post('/api/email_certi_check.php',formdata)
            if(resultemail.result=='false'){
                setErrmsg(resultemail.result.msg);
                setErrmsgCheck(true);
                setTimeout(() => {
                    setErrmsgCheck(false);
                }, 2000);
            }else{                
                formdata.append('mt_name',route.params?.logindata.name)
                formdata.append('mt_pwd',route.params?.logindata.password)
                formdata.append('email_certi','Y')
                formdata.append('app_token',fcmtoken.token)
                const result = await post('/api/member_join.php',formdata)
                if(result.result=='false'){
                        setErrmsg(resultemail.result.msg);
                        setErrmsgCheck(true);
                        setTimeout(() => {
                        setErrmsgCheck(false);
                    }, 2000);
                }else{
                    dispatch(set_login(route.params?.logindata))
                    navigation.dispatch(
                        CommonActions.reset({
                          index:1,
                          routes:[{name:'ConferenceCode'}]
                        })
                      )
                }
            }
        }else{
            setErrmsg(messages.codeinputerr);
            setErrmsgCheck(true);
            setTimeout(() => {
                setErrmsgCheck(false);
            }, 2000);
        }
    }
    
    return (
        <SafeAreaView style={styles.container}>
            <Header title={messages.emailcode} navigation={navigation}/>
                <View style={styles.wrap}>
                    <Text style={styles.emailcodetit}>{messages.emailcodetit}</Text>
                    <Text style={styles.emailcodesub}>{messages.emailcodesub}</Text>
                </View>
                <View style={styles.inputgroup}>
                        <TextInput style={!code1?styles.input:styles.activeinput}  maxLength={1} onChangeText={(text)=>setCode1(text)} ref={input_ref[0]} textAlign="center" keyboardType="numeric"/>
                        <TextInput style={!code2?styles.input:styles.activeinput}  maxLength={1} onChangeText={(text)=>setCode2(text)} ref={input_ref[1]} textAlign="center" keyboardType="numeric"/>
                        <TextInput style={!code3?styles.input:styles.activeinput}  maxLength={1} onChangeText={(text)=>setCode3(text)} ref={input_ref[2]} textAlign="center" keyboardType="numeric"/>
                        <TextInput style={!code4?styles.input:styles.activeinput}  maxLength={1} onChangeText={(text)=>setCode4(text)} ref={input_ref[3]} textAlign="center" keyboardType="numeric"/>
                </View>
                <TouchableOpacity style={styles.btn} onPress={()=>chkAndSign()}>
                    <Text style={styles.pressTxt}>{messages.codesuccess}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.borderbtn} >
                    <Text style={styles.borderbtnTxt}>{messages.coderesend}</Text>
                </TouchableOpacity>
                {errmsgcheck&&<Alert title={errmsg}/>} 
                {/* alert title 값넘겨줘야함 07.20*/}
        </SafeAreaView>
    );
}
export default EmailCodeScreen;
