import React from 'react';
import { Image, Text, Button, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import PropTypes from 'prop-types';

//アドレス取得apiからhome,work取得
let post_data = {
  method: 'POST',
  credentials: 'same-origin',
  mode: 'same-origin',
  body: JSON.stringify({
    signature: '09952995308',
  }),
  headers: {
    'Accept':       'application/json',
    'Content-Type': 'application/json',
  }
}
let home_address
let work_address;
fetch('https://opofood.000webhostapp.com/index.php/user/get_address', post_data)
            .then(response => response.json() )
            .then((data) => {
              console.log(data);
              home_address = {lat:data.home.lat, lng:data.home.lng};
              work_address = {lat:data.work.lat, lng:data.work.lng};
              
            })
            .catch(error => {
              //console.log(error);
            });

//home,workの設定
const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};
const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } }};
if(home_address){
  homePlace = { description: 'Home', geometry: { location: home_address }};
  workPlace = { description: 'Work', geometry: { location: work_address }};

}


const GooglePlacesInput = (props) => {
  return (
    <View>
      <GooglePlacesAutocomplete
        placeholder='Enter your  address'
        minLength={2}
        autoFocus={false}
        returnKeyType={'search'}
        keyboardAppearance={'light'}
        listViewDisplayed='true'
        fetchDetails={true}
        renderDescription={row => row.description}
        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
          console.log(data);
          console.log(data.description);
          let address = data.description; // selected address
          let coordinates = `${details.geometry.location.lat},${details.geometry.location.lng}`; // selected coordinates
          let latitude = details.geometry.location.lat;
          let longitude = details.geometry.location.lng;
          
          //call method in parent component
          props.chooseAddressInAddress(address, latitude, longitude);
        }}

        getDefaultValue={() => ''}

        query={{
          // available options: https://developers.google.com/places/web-service/autocomplete
          key: '********************',
          language: 'en', // language of the results
        }}

        styles={{
          textInputContainer: {
            width: '100%'
          },
          description: {
            color:'#000000',
            fontWeight: 'bold',
            zIndex:99
          },
          predefinedPlacesDescription: {
            color: '#1faadb',
            zIndex:99
          },
          listView: { 
            top: 40,
            zIndex: 9999, //To popover the component outwards
            position: 'absolute', 
          },
          row: {
                  backgroundColor: 'white'
          },
        }}

        currentLocation={true}
        currentLocationLabel="Current location"

        nearbyPlacesAPI='GooglePlacesSearch' 
        GoogleReverseGeocodingQuery={{
          // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
        }}
        GooglePlacesSearchQuery={{
          // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
          rankby: 'prominence',
        }}

        GooglePlacesDetailsQuery={{
          // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
          fields: 'address_component,name,formatted_address,geometry',
        }}

        filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
        predefinedPlaces={[homePlace, workPlace]}

        debounce={200}
      />
    </View>
  );
}
export default GooglePlacesInput;
