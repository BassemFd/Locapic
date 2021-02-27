
import React,  { useState, useEffect } from 'react';
import {ImageBackground, Text} from 'react-native';
import { Button, Input } from 'react-native-elements';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';


function HomeScreen(props) {

  const [pseudo, setPseudo] = useState("");
  const [localPseudo, setLocalPseudo] = useState("");

 

  



const onPressFunction =  () => {
  props.onNewName(pseudo);
  props.navigation.navigate('MapScreen');
 AsyncStorage.setItem("userPseudo", pseudo); 

  }


  useEffect(() => {
    AsyncStorage.getItem('userPseudo', (err, value) => {        
      setLocalPseudo(value);
    })
  }, []);

let pseudoVisibility = <Text style={{fontSize: 20, color: "#db5a5a", fontWeight: "bold"}} h4 > Welcome Back {localPseudo} !</Text>



let inputField = <Input 
containerStyle = {{ paddingHorizontal: 100 }}
style={{width: "50%"}}
placeholder=' Name'
leftIcon={{ type: 'font-awesome', name: 'user', color: "#d64231" }}
onChangeText={(value) => setPseudo(value) }
editable={true}
/> 



  


  const handleUserName = () => {
    // AsyncStorage.removeItem("userPseudo")
    setPseudo("")
    setLocalPseudo("")
  }



  let homeDisplay;
if(localPseudo === ""){

  homeDisplay = inputField
} else {
  
  homeDisplay = pseudoVisibility
}


    return (
  
   <ImageBackground
  source={ require('../assets/home.jpg') }
  resizeMode='cover'
  style={{ width: "100%", height: "100%", flex: 1, alignItems: "center", justifyContent: "center" }}
>
{homeDisplay}
  
 


<Button style={{ marginBottom: "10" }} icon={{type: 'font-awesome', name: 'user', color: "#d64231"}} title="Delete User Name" onPress={() => handleUserName()} />
<Button icon={{type: 'font-awesome', name: 'arrow-right', color: "#d64231"}} title="Go To Map" onPress={() => onPressFunction()} />
</ImageBackground>

    );
  }

  function mapDispatchToProps(dispatch) {
    return {
      onNewName: function(pseudo) {
          dispatch( {type: 'newName', userName: pseudo } )
      }
    }
   }
   
   export default connect(
      null,
      mapDispatchToProps
   )(HomeScreen);
 
