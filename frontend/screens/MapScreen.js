
import React, { useEffect, useState} from 'react';

import { View, StyleSheet  } from 'react-native';
import {Button, Overlay, Input } from 'react-native-elements';
import MapView, { Marker } from 'react-native-maps';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Location from 'expo-location';

import Icon from 'react-native-vector-icons/FontAwesome';
import socketIOClient from "socket.io-client";

var socket = socketIOClient("http://172.17.1.63:3000/");




function MapScreen(props) {

const [position, setPosition] = useState({ latitude: 48.858370, longitude: 2.294481}); 
const [point, setPoint] = useState([])
const [addPOI, setAddPOI] = useState(false);
// const [listPOI, setListPOI] = useState([]);
const [disableState, setDisabledState] = useState(false)
const [visible, setVisible] = useState(false);
const [titre, setTitre] = useState("");
const [description, setDescription] = useState("");
const [listUser, setListUser] = useState([]);



const handleOnPress = () => {
  setAddPOI(true);
  setDisabledState(true);
  
}

const handleOverlayPress = () => {
  setVisible(false);
  props.onNewPOI(titre, description, point.longitude, point.latitude)
//  console.log("PROPS", props.poi)
 
   AsyncStorage.setItem("POIList", JSON.stringify([...props.poi, {titre: titre, description: description, longitude: point.longitude, latitude: point.latitude}]))

// console.log("PROPS POI", props.poi)


}

// useEffect(() => {
 
//   AsyncStorage.setItem("POIList", JSON.stringify(props.poi))

// }, [props.poi])

const handleMapPress = (coords) => {
  if(addPOI){
    setAddPOI(false);
    setPoint({ latitude: coords.latitude, longitude: coords.longitude })
  setDisabledState(false)
  setVisible(!visible);

  }
}


  useEffect(() => {
    async function askPermissions() {
      var { status } = await Location.requestPermissionsAsync();
      if (status === 'granted') {
        
        Location.watchPositionAsync({distanceInterval: 2},
          (location) => {
            // console.log("IS it empty ? ", props.pseudo, location.coords)
            socket.emit("myPosition", props.pseudo, location.coords)
            setPosition(location.coords)
          }
        );
      }
    }
    askPermissions();
   
    async function fetchData(){
        await AsyncStorage.getItem("POIList", function(error, data){
         
            if(data){
              var getPOI = JSON.parse(data); 
              // console.log("GET POI LIST", getPOI)   
                for(let i = 0; i < getPOI.length; i++){
                  props.onNewPOI(getPOI[i].titre, getPOI[i].description, getPOI[i].longitude, getPOI[i].latitude)
                }
            }
          })};
          fetchData();
      
     
    }, []);




    useEffect(() => {
     
        socket.on("sendMyPositionToAll", (pseudo, location)=>{

          var copyListUser = [...listUser, {pseudo: pseudo, longitude: location.longitude, latitude: location.latitude}]
          //! on prend lsit user, et on filtre pour garder tout les mecs sauf celui là, (e=>e.pseudo !== )
//   var filteredCopy = copyListUser.filter(e=>e.pseudo !== pseudo)
// console.log("FILTERED", filteredCopy)
copyListUser = copyListUser.filter(user => user.pseudo != pseudo);
copyListUser.push({pseudo: pseudo, longitude: location.longitude, latitude: location.latitude})
          // console.log("LSITUSER COPY", copyListUser)

          setListUser(copyListUser)
        })


    }, [listUser])


//  useEffect(  () => {
//   async function fetchData(){
//   await AsyncStorage.getItem("POIList", function(error, data){
   
//       if(data){
//         var getPOI = JSON.parse(data); 
//         console.log(getPOI)   
//           for(let i = 0; i < getPOI.length; i++){
//             props.onNewPOI(getPOI[i])
//           }
//       }
//     })};
//     fetchData();

//   }, [])


    return (
    
    <View style={{ flex: 1, backgroundColor:'lightgrey'}}>   
      <MapView 
          style={styles.map}
          initialRegion={{
          latitude: 48.866667,
          longitude: 2.333333,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
          }}
          
          onPress={ (event)=> handleMapPress(event.nativeEvent.coordinate)}
          
          >
          {/* <Marker  title="Hello"
          description="I am here" pinColor="#ff7383" coordinate={{ latitude : position.latitude , longitude : position.longitude }} draggable>

          </Marker> */}
              { 
              props.poi.map((coords, i) => {
              return <Marker key={i}  title={coords.titre}
                description={coords.description} pinColor="blue" coordinate={{ latitude : coords.latitude , longitude : coords.longitude }} draggable></Marker>
              })
            }

            { 
              listUser.map((user, i) => {
              return <Marker key={i}  title={user.pseudo}
                description="Friend" pinColor="pink" coordinate={{ latitude : user.latitude , longitude : user.longitude }} draggable></Marker>
              })
            }
      

      </MapView>

      <Button color="#d64231" title="Add POI" 
        onPress={() => handleOnPress()} 
        disabled = {disableState}  
        icon={ <Icon name="map-marker" size={20} color="#ffffff" /> }  
        buttonStyle={{backgroundColor: "#eb4d4b"}}
        type="solid" />
      
      <Overlay isVisible={visible} overlayStyle={{width: "80%"}}>
        <View>
          <Input  placeholder='Titre' onChangeText={(value) => setTitre(value)} /> 
          <Input  placeholder='Description' onChangeText={(value) => setDescription(value)}/> 
          <Button color="#d64231" title="Add Details for POI" 
            onPress={() => handleOverlayPress()} 
            icon={ <Icon name="map-marker" size={20} color="#ffffff" /> }  
            buttonStyle={{backgroundColor: "#eb4d4b"}}
            type="solid" />
          </View>
        </Overlay>
      

    </View>
        
    );
  }


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    map: {
      flex: 1,

    }
    });
  


    function mapDispatchToProps(dispatch) {
      return {
        onNewPOI: function(titre, description, longitude, latitude) {
            dispatch( {type: 'POI', titre: titre, description: description, longitude: longitude, latitude: latitude } )
        }
      }
     }

     function mapStateToProps(state) {
      return {poi: state.poi, pseudo: state.pseudo }
     }
     
     export default connect(
        mapStateToProps,
        mapDispatchToProps
     )(MapScreen);
   
