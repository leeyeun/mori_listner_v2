import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor:"#2B292A",
    },  
    wrap:{
        alignItems:"center",
        marginBottom:45
    },
    emailcodetit:{
        color:"white",
        fontSize:18,
        fontWeight:'bold',
        marginBottom:3,
        marginTop:50,
    },
    emailcodesub:{
        color:'#A1A1A1',
        fontSize:14,
        fontWeight:'600'
    },
    inputgroup:{
        paddingHorizontal:16,
        flexDirection:'row',
        justifyContent:'center',
        marginBottom:100  
    },
    input:{
        fontSize: 18,
        fontWeight:'bold',
        borderBottomWidth: 1,
        borderColor: '#555555',
        borderRadius: 7,
        height: 45,
        width:52,
        paddingVertical: 13,
        color: '#F35174',
        marginRight:8
    },
    activeinput:{
        fontSize: 18,
        fontWeight:'bold',
        borderBottomWidth: 3,
        borderColor: '#F35174',
        height: 45,
        width:52,
        paddingVertical: 13,
        color: '#F35174',
        marginRight:8
    },
    btn:{
        height:50,
        backgroundColor:'#F35174',
        marginHorizontal:16,
        borderRadius:7,
        justifyContent:'center',
        alignItems:'center',
        marginTop:40

    },
    pressTxt:{
        color:'white',
        fontSize:16,
        fontWeight:"bold"
    },
    borderbtn:{
        marginTop:10,
        height:50,
        borderColor:'#F35174',
        borderWidth:1,
        marginHorizontal:16,
        borderRadius:7,
        justifyContent:'center',
        alignItems:'center',
    },
    borderbtnTxt:{
        color:"#F35174",
        fontSize:16,
        fontWeight:'bold'
    },
 
  });
  