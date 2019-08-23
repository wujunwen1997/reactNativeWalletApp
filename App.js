/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,Dimensions
} from 'react-native';
var ScrollableTabView = require('react-native-scrollable-tab-view');

const FirstRoute = () => (
  <View style={[styles.scene, { backgroundColor: '#ff4081' }]} />
);

const SecondRoute = () => (
  <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />
);
class Apps extends React.Component {
  componentDidMount() {
    SplashScreen.hide();
  }
  state = {
    index: 0,
    routes: [
      { key: 'first', title: 'First' },
      { key: 'second', title: 'Second' },
    ],
  };
  renderTabBar = (props) => {
    return(
      <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: 'white' }}
        style={{ backgroundColor: 'pink' }}
      />
    )
  }
  render(){
     return (
       <ScrollableTabView>
         <View  tabLabel='Tab #1' style={[styles.scene, { backgroundColor: '#ff4081' }]} >
           <Text>123123123123</Text>
         </View>
         <View  tabLabel='Tab #2' style={[styles.scene, { backgroundColor: '#673ab7' }]} />
       </ScrollableTabView>
  );
  }

};

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});

export default Apps;
