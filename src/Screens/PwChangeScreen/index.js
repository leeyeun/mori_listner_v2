import React, { useState, useEffect } from 'react';
import {
    TouchableOpacity,
    Text,
    SafeAreaView,
    TextInput,
    View,
    Alert as DefaultAlert,
    Keyboard
} from 'react-native';
import styles from '../SignupScreen/style';
import { useDispatch, useSelector } from "react-redux";
import { useIntl } from "react-intl";
import Header from '../../Components/headers';
import post from '../../utils/axios';
import Alert from '../../Components/Alert';
import {logout} from '../../redux/actions/loginAction';
import {CommonActions} from '@react-navigation/native';
function PwChangeScreen({navigation}) {
    const lang = useSelector((state) => state.LangsReducer.langs);
    const logindata = useSelector((state) => state.LoginReducer.loginstate);
    const { messages } = useIntl();
    const dispatch = useDispatch();
    const [pwreg,setPwreg] = useState(false);
    const [password, setPassword] = useState('');
    const [newpassword, setNewpassword] = useState('');
    const [passwordCheck, setpasswordCheck] = useState('');
    const [pwCheck, setpwCheck] = useState(false);
    const [errmsg, setErrmsg] = useState('');
    const [errmsgcheck, setErrmsgCheck] = useState(false);
    const onchangePassword = (text) => {
        let regExp = /^.*(?=^.{8,12}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
        // if(text.length>12)return Alert.alert('','비밀번호를 확인해주세요');
        if (regExp.test(text) === true) {
            setPwreg(true)
        } else if (regExp.test(text) === false) {
            setPwreg(false)
        }
        if (passwordCheck === text && passwordCheck != '' && text != '') setpwCheck(true);
        else if (passwordCheck !== text || password != '' || text != '') setpwCheck(false);
        setNewpassword(text);

    }
    const onchangePasswordCheck = (text) => {
        if (password === text && password != '' && text != '') setpwCheck(true);
        else if (password !== text || password != '' || text != '') setpwCheck(false);
        setpasswordCheck(text);
    }
    const passwordChange =async () => {
        Keyboard.dismiss();
        const formdata = new FormData();
        formdata.append('set_lang',lang);
        formdata.append('mt_id',logindata.mt_id);
        formdata.append('mt_pwd',password);
        formdata.append('mt_new_pwd',newpassword);
        formdata.append('mt_new_pwd_re',passwordCheck);
        const result = await post('/api/pwd_modify.php',formdata);
        console.log(result)
        if(result.result=='false'){
            setErrmsg(result.msg);
            setErrmsgCheck(true);
            setTimeout(() => {
                setErrmsgCheck(false);
            }, 2000);
        }else{            
            //로그아웃 api 추가예정            
            dispatch(logout())
            DefaultAlert.alert('',messages.passwordchange);
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
            <Header title={messages.password} navigation={navigation}/>
                <View style={styles.wrap}>
                    <Text style={styles.signuptit}>{messages.passwordtit}</Text>
                    <Text style={styles.signupsub}>{messages.passworddes}</Text>
                </View>
                <View style={styles.inputgroup}>
                    <TextInput style={[styles.input,{marginBottom:10}]} placeholder={messages.nowpw} placeholderTextColor="#AAAAAA" onChangeText={(text)=>setPassword(text)} secureTextEntry={true}/>
                    <TextInput style={[styles.input,{marginBottom:10}]} placeholder={messages.newpw} placeholderTextColor="#AAAAAA" onChangeText={(text)=>onchangePassword(text)} secureTextEntry={true}/>
                    <TextInput style={[styles.input,{marginBottom:10}]} placeholder={messages.newpwcheck} placeholderTextColor="#AAAAAA" onChangeText={(text)=>onchangePasswordCheck(text)} secureTextEntry={true}/>
                </View>
                <TouchableOpacity style={styles.btn} onPress={()=>passwordChange()}>
                    <Text style={styles.pressTxt}>{messages.findpwchange}</Text>
                </TouchableOpacity>
                {errmsgcheck&&<Alert title={errmsg}/>} 
        </SafeAreaView>
    );
}
export default PwChangeScreen;