import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor:"#2B292A",
    },  
    wrap:{
        height:"19%",
        alignItems:"center",
    },
    signuptit:{
        color:"white",
        fontSize:18,
        fontWeight:'bold',
        marginBottom:3,
        marginTop:45
    },
    signupsub:{
        color:'#A1A1A1',
        fontSize:14,
        fontWeight:'600',
        marginBottom:45
    },
    inputgroup:{
        paddingHorizontal:16,
    },
    input:{
        fontSize: 13,
        borderWidth: 1,
        borderColor: '#555555',
        borderRadius: 7,
        height: 45,
        paddingLeft: 16,
        paddingVertical: 13,
        color: 'white',
    },
    errorbox:{
        height:30,        
        justifyContent:"center",
    },
    error:{
        fontSize:13,
        color:"#F35174",
        marginLeft:10
    },
    btn:{
        height:50,
        backgroundColor:'#F36180',
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
        borderColor:'#F36180',
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
    pwfindbtn:{
        height:50,
        backgroundColor:'#F35174',
        marginHorizontal:16,
        borderRadius:7,
        justifyContent:'center',
        alignItems:'center',
        marginTop:20
    }
  });
  