import * as React from 'react';
import { View } from 'react-native';
import {connect} from 'react-redux';
import { ListItem, Button } from 'react-native-elements'
import AsyncStorage from '@react-native-async-storage/async-storage';

function POIScreen(props) {
   
   const handleDelete = async (l) => {


    // console.log("HARD L", l)

   const arrPOI = await AsyncStorage.getItem("POIList");

   if(arrPOI !== null){

      let poiScreenList = JSON.parse(arrPOI);
      // console.log(poiScreenList)
      props.deletePOI(l);
      let newLocalPOI = poiScreenList.filter((item) => item.titre !== l.titre);
      AsyncStorage.setItem('POIList', JSON.stringify(newLocalPOI));

    
        //  console.log("POISCREEN LIST", poiScreenList)
      
        }
      }
     

// // Delete LOCAL POI
// const handleDelete = async (poi) => {
//   const arrPOI = await AsyncStorage.getItem('poi');
//   if (arrPOI !== null) {
//     let poiParsed = JSON.parse(arrPOI);

// // For Reducer
// props.deletePOI(poi);

// let newLocalPOI = poiParsed.filter((item) => item.id !== poi.id);

// // console.log(newLocalPOI);
// AsyncStorage.setItem('poi', JSON.stringify(newLocalPOI));
// }
// };



    return (
  <View style={{ flex: 1, backgroundColor:'#f1c40f', paddingTop: 25}}>
  
    
 { 
    props.poi.map((l, i) => (
      <ListItem  key={i} bottomDivider>
        
        <ListItem.Content >
          <ListItem.Title>{l.titre}</ListItem.Title>
          <ListItem.Subtitle>{l.description}</ListItem.Subtitle>
        </ListItem.Content>
        <Button
  title="X"
  type="outline"
  onPress={()=> { handleDelete(l)}}
/>
      </ListItem>
      
    ))
  }

  </View>

)}


function mapDispatchToProps(dispatch) {
    return {
      deletePOI: function(poi) {
          dispatch( {type: 'delete', poi: poi} )
      }
    }
   }


function mapStateToProps(state) {
    return {poi: state.poi }
   }
    
   export default connect(
    mapStateToProps,
    mapDispatchToProps
   )(POIScreen);
