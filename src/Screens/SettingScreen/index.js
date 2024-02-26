import React, { useState, useEffect } from 'react';
import {
    TouchableOpacity,
    Text,
    SafeAreaView,
    Image,
    View,    
    Alert
} from 'react-native';
import styles from './style';
import {useSelector,useDispatch } from "react-redux";
import { useIntl } from "react-intl";
import Header from '../../Components/headers';
import SelectLangs from '../../Components/SelectLangs';
import Withdrawal from '../../Components/Withdrawal';
import post from '../../utils/axios';
import {logout} from '../../redux/actions/loginAction';
import {CommonActions} from '@react-navigation/native';
function SettingScreen({navigation}) {
    const lang = useSelector((state) => state.LangsReducer.langs);
    const Logindata = useSelector((state) => state.LoginReducer.loginstate);
    const dispatch = useDispatch();
    const { messages } = useIntl();
    const [isopen,setIsopen] = useState(false); 
    const [withdrawalopen,setWithdrawalopen] = useState(false);
    const [tos,setTos] = useState('');
    const [privacy,setPrivacy] = useState('');
    useEffect(() => {
        async function getAgree(){
            const formdata = new FormData();
            formdata.append('set_lang',lang);
            const tosresult = await post('/api/agree1.php',formdata);
            const privacyresult = await post('/api/agree2.php',formdata);
            setTos(tosresult);
            setPrivacy(privacyresult);
        }        
        getAgree();
    }, [lang])

    const Logout = () => {
        dispatch(logout())
        Alert.alert('',messages.logout);
        navigation.dispatch(
            CommonActions.reset({
                index:1,
                routes:[{name:'LoginAndSign'}]
            })
            )
    }
    return (
        <SafeAreaView style={styles.container}>
            <SelectLangs isopen={isopen} setIsopen={setIsopen}/>
            <Withdrawal isopen={withdrawalopen} setIsopen={setWithdrawalopen} navigation={navigation}/>
            <Header title={messages.tos} navigation={navigation}/>
                <View style={styles.wrap}>
                    <View style={styles.content}>
                        <View style={styles.contentbox}> 
                            <Text style={styles.tit}>{messages.email}</Text>
                            <Text style={styles.des} numberOfLines={1}>{Logindata?.mt_id}</Text>
                        </View>
                    </View>
                    <View style={styles.content}>
                        <TouchableOpacity style={styles.contentbox} onPress={()=>navigation.push('Tos',{type:'tos',content:tos.data})}> 
                            <Text style={styles.tit}>{messages.tos}</Text>
                            <Image source={require('../../assign/img/arrow.png')} style={styles.arrow}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.content}>
                        <TouchableOpacity style={styles.contentbox} onPress={()=>navigation.push('Tos',{type:'privacy',content:privacy.data})}> 
                            <Text style={styles.tit}>{messages.privacysettitle}</Text>
                            <Image source={require('../../assign/img/arrow.png')} style={styles.arrow}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.content}>
                    <TouchableOpacity style={styles.contentbox} onPress={()=>setIsopen(true)}> 
                            <Text style={styles.tit}>{messages.lang}</Text>
                            <Image source={require('../../assign/img/arrow.png')} style={styles.arrow}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.btngroup}>
                    <TouchableOpacity style={styles.logoutbtn} onPress={()=>Logout()}><Text style={styles.logouttxt}>{messages.logout}</Text></TouchableOpacity>
                    {Logindata?.mt_type=='EMAIL'?<TouchableOpacity style={styles.passwordbtn} onPress={()=>navigation.push('PwChangeScreen')}><Text style={styles.passwordtxt}>{messages.password}</Text></TouchableOpacity>:null}
                    <TouchableOpacity style={styles.secessionbtn} onPress={()=>setWithdrawalopen(true)}><Text style={styles.secessiontxt}>{messages.Withdrawaltit}</Text></TouchableOpacity>
                </View>
        </SafeAreaView>
    );
}
export default SettingScreen;
