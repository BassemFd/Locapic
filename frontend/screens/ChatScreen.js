import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Button, KeyboardAvoidingView, ScrollView } from 'react-native';
import { ListItem, Avatar, Input, Icon } from 'react-native-elements'
import {connect} from 'react-redux';
import socketIOClient from "socket.io-client";

var emoji_replace = require('emoji-replace');
var socket = socketIOClient("http://172.17.1.63:3000/");

// const list = [

//   {
//     name: 'Raphael',
//     avatar_url: 'https://ariane.lacapsule.academy/images/avatar/5f60dd96e935b5001a71d282.jpg',
//     subtitle: 'Vodka Labs Alcoholic'
//   },
//   {
//     name: 'Juliette',
//     avatar_url: 'https://ariane.lacapsule.academy/images/avatar/5fbbf1298c274800bfc9ce12.jpg',
//     subtitle: 'Saturday Buddy'
//   },
//   {
//     name: 'Yaya',
//     avatar_url: 'https://ariane.lacapsule.academy/images/avatar/5fc4f36a8c274800bfc9d465.jpg',
//     subtitle: 'My Bro'
//   },
//   {
//     name: 'Julie',
//     avatar_url: 'https://ariane.lacapsule.academy/images/avatar/5fdccaa1ce19d500c06a55bb.jpg',
//     subtitle: 'hello'
//   },
 
// ]

// f8ff2b

function ChatScreen(props) {

const [currentMessage, setCurrentMessage] = useState("");
const [listMessage, setListMessage] = useState([]);


  useEffect(() => {
    socket.on('sendMessageToAll', (messageData)=> {
      setListMessage([...listMessage, messageData])
    });
  
  }, [listMessage])
  
  




var listMessageItem = listMessage.map((l, i) => {return (
  <ListItem  key={i} bottomDivider>
    
    <ListItem.Content >
      <ListItem.Title>{l.pseudo}</ListItem.Title>
      <ListItem.Subtitle>{l.message}</ListItem.Subtitle>
    </ListItem.Content>
  </ListItem>
)})

function onValidation(){
  var newStr = emoji_replace(currentMessage)
 
var newerStr = newStr.replace(/[a-z]*fuck[a-z]*\b/ig, "***");


   
// console.log(newerStr)

  socket.emit("sendMessage", {message: newerStr, pseudo: props.pseudo} ); setCurrentMessage('');
}



    return (
  <View style={{ flex: 1, backgroundColor:'#f1c40f', paddingTop: 25}}>
      
      <ScrollView>   
        
    <Text style={{textAlign: "center", paddingBottom: 10, paddingTop: 10, color: "#d64231", fontWeight: "bold"}}>Hello {props.pseudo}!</Text>
        
  { listMessageItem  }

  </ScrollView>


  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={styles.chatbox}
    enabled
  >

  <Input
    placeholder='Ecrire un nouveau message'
    editable={true}
    onChangeText={(value) => setCurrentMessage(value)}
    value={currentMessage}
  /> 

  <Button 
    icon={
      <Icon
      name="mail"
      size={20}
      color="#ffffff"
      />
    }
    color="#d64231" title="Envoyer" 
    onPress={()=> onValidation()}
  />

</KeyboardAvoidingView>


  </View>

    );
  }


  const styles = StyleSheet.create({
   chatbox: {
  //   flex: 1,
  // justifyContent: 'flex-end',
  // marginBottom: 6
   }
  });


  
  function mapStateToProps(state) {
    return {pseudo: state.pseudo }
   }
    
   export default connect(
    mapStateToProps,
    null
   )(ChatScreen);

