import React from "react";
import {
  Container,
  Body,
  Content,
  Header,
  Left,
  Right,
  Icon,
  Title,
  Input,
  Item,
  Label,
  Text
} from "native-base";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  StatusBar,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  FlatList,
  AppRegistry,
} from 'react-native';
import { Card, ListItem, Button, CheckBox } from 'react-native-elements';

import {
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Map from './Map';
import GooglePlacesInput from './GooglePlacesInput';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-community/async-storage';

export default class Address extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        location: null,
        error: null,
        choosed_address: 'manila',
        choosed_latitude: 35.694549,
        choosed_longitude: 139.982728
      };
//      this.state.choosed_address = 'xxxxxx';
      this.state.choosed_address = null;
      navigator.geolocation = require('@react-native-community/geolocation');
      
      this.chooseAddressInAddress = this.chooseAddressInAddress.bind(this);
      
    }
    async componentDidMount() {
      const location = await this.getCurrentPos().catch(error => {
        this.setState({ error })
      });
      this.setState({ location });
      

    }
    getCurrentPos(timeout = 5000) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout,
          enableHighAccuracy: true,
        });
      });
    }
    
  //GooglePlaceInputで選択した値に変更
  chooseAddressInAddress(address, latitude, longitude) {
    console.log("chooseAddressInAddress111");
    console.log(address);
    console.log(latitude);
    console.log(longitude);
    this.setState({ choosed_address: address, choosed_latitude: latitude, choosed_longitude: longitude });
    
  }
  toShopList = () => {
    console.log("toShopList");
    //sessionに届け先情報を保存
    let deliver_addres_object = { choosed_address: this.state.choosed_address, choosed_latitude: this.state.choosed_latitude, choosed_longitude: this.state.choosed_longitude };
    AsyncStorage.setItem(
            'session_deliver_address',
            JSON.stringify(deliver_addres_object)
    );
    //取得
    AsyncStorage.getItem('session_deliver_address')
    .then((value) => {
      let data = JSON.parse(value);
      console.log(data);
    });
    this.props.already_choosed_address();
  }
  render() {
    //const { location, error, choosed_address, choosed_latitude, choosed_longitude } = this.state;
    return (
          <SafeAreaView style={{flex: 1}}>
            <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              keyboardShouldPersistTaps="always"
              style={styles.scrollView}
            >
              <View style={styles.placeArea}>
                <GooglePlacesInput chooseAddressInAddress={this.chooseAddressInAddress}/>
              </View>
              <View style={styles.mapArea}>
                  <Map longitude={this.state.choosed_longitude} latitude={this.state.choosed_latitude} chooseAddressInAddress={this.chooseAddressInAddress} />
              </View>
              
              { this.state.choosed_address && 
                <View style={styles.mapArea}>
                  <Text style={styles.fs18}>Deliver to111</Text>
                  <Text style={styles.fs15}>{this.state.choosed_address}</Text>
                  <Text style={styles.fs15}>lat:{this.state.choosed_latitude}</Text>
                  <Text style={styles.fs15}>lon:{this.state.choosed_longitude}</Text>
                  <Button
                    style={{fontSize: 40, color: 'green', padding:5}}
                    styleDisabled={{color: 'red'}}
                    onPress={() => this.toShopList()}
                    title="Next"
                  >
                  </Button>
                </View>
              }
            </ScrollView>
          </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
    zIndex:1
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  mapArea: {
    marginTop: 0,
    height: 300,
    zIndex:-1
  },
  placeArea: {
    marginTop: 0,
    height: 50,
    zIndex:99
  },
  listArea: {
    marginTop: 0,
    height: 800,
    zIndex:99
  },
  shopImage1: {
    width: 150,
    height: 150,
    margin:5
  },
  shopImage2: {
    width: 200,
    height: 200,
    margin:5
  },
  categoryText1: {
    color: Colors.dark,
    fontSize: 18,
    fontWeight: '600',
    padding: 4,
    textAlign: 'left',
  },
  categoryText2: {
    color: Colors.dark,
    fontSize: 18,
    fontWeight: '600',
    padding: 4,
    textAlign: 'left',
  },
  fs18: {
    fontSize: 18,
  },
  fs15: {
    fontSize: 15,
  },
});
