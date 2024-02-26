import {StyleSheet,Dimensions} from 'react-native';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor:'#2B292A'
    },  
    imgSection: {
        height:"36%",
        alignItems:'center',
        justifyContent:'center'
    },
    loginAndSignBtn:{
        height:"29%",
        paddingHorizontal:16,
    },
    LoginImg:{
        width:'35%',
        height:'50%',
    },
    emailLogin:{
        marginBottom:10,
        backgroundColor:'#F36180',
        height:50,
        borderRadius:5,
        justifyContent:'center',
        alignItems:'center'
    },
    emailSign:{
        borderWidth:1,
        borderColor:'#F36180',
        height:50,
        borderRadius:5,
        justifyContent:'center',
        alignItems:'center'
    },
    whitetext:{
        color:'white',
        fontSize:16
    },
    pinktext:{
        color:"#F35174",
        fontSize:16
    },
    socialgroup:{
        flexDirection:'row',
        width:width-40,
        justifyContent:'space-between'
    },
    socialimage:{
        width:width*0.14,
        height:height*0.0785,
    },
    socialtit:{
        fontSize:16,
        color:'white',

    },
    socialdes:{
        fontSize:14,
        color:'#A1A1A1',
        letterSpacing:-0.56,
        marginBottom:30
    },
    snsSection:{
        alignItems:'center',
        justifyContent:'center',
    }, 
  });
  