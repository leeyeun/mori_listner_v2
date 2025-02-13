import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor:"#2B292A",
    },  
    wrap:{
        marginTop:23,        
        paddingHorizontal:16
    },
    content:{
        height:60,
        borderBottomColor:'#555555',
        borderBottomWidth:1,
        justifyContent:'center'
    },
    contentbox:{
        flexDirection:'row',
        justifyContent:'space-between',
        paddingHorizontal:6
    },
    tit:{
        fontSize:14,
        color:'white',
        fontWeight:'700'
    },
    des:{
        fontSize:13,
        color:'#AAAAAA'
    },
    arrow:{
        width:20,
        height:20
    },
    btngroup:{    
        justifyContent:"flex-end",
        flex:1,
        paddingHorizontal:10,
        paddingVertical:16
    },
    logoutbtn:{
        backgroundColor:'#F36180',
        borderRadius:7,
        height:50,
        justifyContent:'center',
        alignItems:'center',
        marginBottom:10
    },
    logouttxt:{
        color:'white',
        fontSize:16
    },
    passwordbtn:{
        borderWidth:1,
        borderColor:'#F36180',
        borderRadius:7,
        height:50,
        justifyContent:'center',
        alignItems:'center',
        marginBottom:10
    },
    passwordtxt:{
        color:"#F35174",
        fontSize:16
    },
    secessionbtn:{
        borderWidth:1,
        borderColor:'#555555',
        borderRadius:7,
        height:50,
        justifyContent:'center',
        alignItems:'center',
        marginBottom:10
    },
    secessiontxt:{
        color:"#A1A1A1",
        fontSize:16
    }
  });
  