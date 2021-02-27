export default function(pseudo = "", action) {
    if(action.type == 'newName') {
       
       return action.userName;
    } else {
        return pseudo;
    }
   }