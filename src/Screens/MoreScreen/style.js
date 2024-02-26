import {StyleSheet,Dimensions} from 'react-native';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        alignItems:'center',
        backgroundColor:'#2B292A'
    },  
    backimg:{
        width:width,
        height:height-56
    },
    textsection:{
        paddingHorizontal:26,
        paddingVertical:40   
    },
    date:{
        fontSize:12,
        color:'#F35174',
        marginBottom:3
    },
    title:{
        color:'white',
        fontSize:18
    },
    des:{
        marginTop:height*0.027,
        color:'white',
        fontSize:14,
        lineHeight:21        
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 2,
      },
      paginationDotActive: { backgroundColor: "lightblue" },
      paginationDotInactive: { backgroundColor: "gray" },
  });
  