import React, { useState, useEffect } from 'react';
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
import post from '../../utils/axios';
import { useSelector } from 'react-redux';
import Alert from '../../Components/Alert';

function SignupScreen({ navigation }) {
    const { messages } = useIntl();
    const [email, setEmail] = useState('');
    const [emailCheck, setemailCheck] = useState(false);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setpasswordCheck] = useState('');
    const [pwreg, setPwreg] = useState(false);
    const [pwCheck, setpwCheck] = useState(false);
    const [errmsg, setErrmsg] = useState('');
    const [errmsgcheck, setErrmsgCheck] = useState(false)
    const selectlang = useSelector((state) => state.LangsReducer.langs);
    const onchangeEmail = (text) => {
        setEmail(text);
        let regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        if (regExp.test(text) === true) {
            setemailCheck(true);
        } else if (regExp.test(text) === false && emailCheck) {
            setemailCheck(false);
        }

    }
    const onchangeName = (text) => {
        setName(text);
    }
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
        setPassword(text);

    }
    const onchangePasswordCheck = (text) => {
        if (password === text && password != '' && text != '') setpwCheck(true);
        else if (password !== text || password != '' || text != '') setpwCheck(false);
        setpasswordCheck(text);
    }
    const signup = async () => {
        Keyboard.dismiss();
        const formdata = new FormData();
        const logindata = {
            selectlang,
            email:email.trim(),
            name:name.trim(),
            password:password.trim(),
            passwordCheck:passwordCheck.trim()
        }
        formdata.append('set_lang', selectlang)
        formdata.append('mt_id', email.trim())
        formdata.append('mt_name', name.trim())
        formdata.append('mt_pwd', password.trim())
        formdata.append('mt_pwd_re', passwordCheck.trim())
        const resultcheck = await post('/api/member_join_check.php', formdata);

        if (resultcheck?.result == 'false') {
            setErrmsg(resultcheck.msg);
            setErrmsgCheck(true);
            setTimeout(() => {
                setErrmsgCheck(false);
            }, 2000);
        } else {
            const result = await post('/api/email_certi_send.php', formdata)
            if (result?.result == 'false') {
                setErrmsg(result.msg);
                setErrmsgCheck(true);
                setTimeout(() => {
                    setErrmsgCheck(false);
                }, 2000);
            }else{
                resetState();
                navigation.navigate('EmailCode', { logindata })
            }
        }
    }
    const resetState = () => {

    }
    return (
        <SafeAreaView style={styles.container}>
            <Header title={messages.signup} navigation={navigation} />
            <View style={styles.wrap}>
                <Text style={styles.signuptit}>{messages.signuptit}</Text>
                <Text style={styles.signupsub}>{messages.signupsub}</Text>
            </View>
            <View style={styles.inputgroup}>
                <TextInput style={styles.input} placeholder={messages.emailplaceholder} placeholderTextColor="#AAAAAA" onChangeText={(text) => onchangeEmail(text)} />
                <View style={styles.errorbox}>
                    {!emailCheck &&
                        <Text style={styles.error}>{messages.emailsub}</Text>
                    }
                </View>
                <TextInput style={styles.input} placeholder={messages.nameplaceholder} placeholderTextColor="#AAAAAA" onChangeText={(text) => onchangeName(text)} />
                <View style={styles.errorbox}>
                    {!name && <Text style={styles.error}>{messages.namesub}</Text>}
                </View>
                <TextInput style={styles.input} placeholder={messages.passwordplaceholder} placeholderTextColor="#AAAAAA" onChangeText={(text) => onchangePassword(text)} secureTextEntry={true} />
                <View style={styles.errorbox}>
                    {
                        !pwreg &&
                        <Text style={styles.error}>{messages.passwordsub}</Text>
                    }
                </View>
                <TextInput style={styles.input} placeholder={messages.passwordcheckplaceholder} placeholderTextColor="#AAAAAA" onChangeText={(text) => onchangePasswordCheck(text)} secureTextEntry={true} />
                <View style={styles.errorbox}>
                    {!pwCheck &&
                        <Text style={styles.error}>{messages.passwordchecksub}</Text>
                    }
                </View>
            </View>
            <TouchableOpacity style={styles.btn} onPress={() => signup()}>
                <Text style={styles.pressTxt}>확인</Text>
            </TouchableOpacity>
            {errmsgcheck ? <Alert title={errmsg} /> : null}
        </SafeAreaView>
    );
}

export default SignupScreen;