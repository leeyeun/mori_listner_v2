import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor:'#2B292A'
    },  
    privacySec:{
        paddingHorizontal:16,
        paddingTop:20,                
    },
    radiogroup:{
        flexDirection:"row",
        justifyContent:'space-between',
        alignItems:'center',
        marginBottom:13
    },
    radiotit:{
        fontSize:16,
        color:"white",
        fontWeight:"bold"
    },
    scroll:{
        height:158,
        backgroundColor:"#231F21",
        borderRadius:7
    },
    contentbox:{
        marginBottom:30
    },
    btn:{
        height:50,
        backgroundColor:'#F35174',
        marginHorizontal:16,
        marginBottom:16,
        borderRadius:7,
        justifyContent:'center',
        alignItems:'center'
    },
    pressTxt:{
        color:'white',
        fontSize:16,
        fontWeight:"bold"
    }
  });
  