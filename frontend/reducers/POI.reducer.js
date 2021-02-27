export default function(poi = [], action) {
    if(action.type == 'POI') {
        var newPoi = [...poi, {titre: action.titre, description: action.description, longitude: action.longitude, latitude: action.latitude} ]
       
       return newPoi;
    } else if(action.type == 'delete'){
        var newestPoi = [...poi]
        newestPoi.splice(newestPoi.indexOf(action.poi), 1)
        return newestPoi
    } else {
        return poi;
    }
   }