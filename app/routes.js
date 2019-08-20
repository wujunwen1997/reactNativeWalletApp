import React from 'react'
import {
  TabBarBottom, addNavigationHelpers, createSwitchNavigator,
  createBottomTabNavigator, createStackNavigator, createAppContainer
} from 'react-navigation'
import AuthLoadingScreen from './components/loading/index'
import {StatusBar, View, Platform, Image, Animated, Easing, TouchableOpacity} from "react-native";
import Register from './pages/Register/index'
import Establish from './pages/Establish/index'
import Restore from './pages/Restore/index'
import ScannerScreen  from './pages/ScannerScreen/index'

import LoggedHome from './pages/Logged/Home/index'
import PasswordEnter from './pages/Logged/Home/passwordEnter'
import AddWallet from './pages/Logged/AddWallet/index'
import ChoiceCurrency from './pages/Logged/AddWallet/Childs/ChoiceCurrency'
import WalletConfig from './pages/Logged/AddWallet/Childs/WalletConfig'
import MultiSignature from './pages/Logged/AddWallet/Childs/MultiSignature'
import JoinShare from './pages/Logged/AddWallet/Childs/JoinShare'
import WalletName from './pages/Logged/AddWallet/Childs/WalletName'

import WalletHome from './pages/Logged/WalletOperation/Wallet'
import WalletDetail from './pages/Logged/WalletOperation/WalletDetail'
import TransactionDetail from './pages/Logged/WalletOperation/TransactionDetail'
import Transfer from './pages/Logged/WalletOperation/Transfer'
import Receivables from './pages/Logged/WalletOperation/Receivables'

import BackupPrompt from "./pages/Backup/BackupPrompt";
import BackupMnemonics from "./pages/Backup/BackupMnemonics";
import SetIndex from "./pages/Logged/Set/SetIndex";
import IdentityName from "./pages/Logged/Set/IdentityName";
import AboutUs from "./pages/Logged/Set/AboutUs";
import Introduction from "./pages/Logged/Set/Introduction";

const TITLE_OFFSET = Platform.OS === 'ios' ? 70 : 56;
const headerTitleContainerStyle = {
  left: TITLE_OFFSET,
  right: TITLE_OFFSET,
};
const defaultNavigationOptions= {
  headerTitleStyle: {
    color: '#FFFFFF',
    textAlign: 'center',
    flex:1,
    fontSize: 17,
    fontWeight: '400'
  },
  headerBackImage:<Image source={require('./assets/images/r6.png')} style={{width: 28, height: 16}}/>,
  headerTitleContainerStyle,
  headerStyle: {
    backgroundColor: '#1C97E0',
    height: Platform.OS === 'ios' ? 75 : 55 + StatusBar.currentHeight,
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    shadowOpacity: 0,
    shadowColor: 'transparent',
    borderBottomWidth: 0,
    shadowOffset: {
      height: 0,
    },
    elevation: 0, // 视图添加一个投影，android5.0有效，设置为0
  }
}
const commonNavigationOptions = {
  ...defaultNavigationOptions,
  headerStyle: Object.assign({}, defaultNavigationOptions.headerStyle,
                             {backgroundColor: '#fff', borderBottomWidth: 0.8, borderBottomColor: '#f7f7f7',}),
  headerTitleStyle: Object.assign({}, defaultNavigationOptions.headerTitleStyle, {color: '#333'}),
}
//  未拥有身份的状态：注册
const AuthStack = createStackNavigator(
  {
    Register,
    Establish,
    Restore,
    BackupPrompt,
    BackupMnemonics,
  },
  {
    headerMode: 'screen',
    initialRouteName: 'Register',
    transitionConfig: () => ({
      transitionSpec: {
        duration: 1,//  300
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
      },
      screenInterpolator: sceneProps => {
        const { position, scene } = sceneProps;
        const { index } = scene;

        const opacity = position.interpolate({
          inputRange: [index - 1, index - 0.99, index],
          outputRange: [0, 1, 1],
        })

        return { opacity }
      },
    }),
    defaultNavigationOptions: {
      headerTintColor: '#333',
      headerTitleStyle: {
        color: '#333',
        alignSelf:'center',
        textAlign: 'center',
        flex:1,
        fontSize: 17
      },
      headerBackImage:<Image source={require('./assets/images/r4.png')} style={{width: 28, height: 16}}/>,
      headerTitleContainerStyle,
      headerStyle: {
        textAlign: 'center',
        height: Platform.OS === 'ios' ? 75 : 55 + StatusBar.currentHeight,
        paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
        shadowOpacity: 0,
        shadowColor: 'transparent',
        borderBottomWidth: 0.8,
        borderBottomColor: '#f7f7f7',
        shadowOffset: {
          height: 0,
        },
        elevation: 0, // 视图添加一个投影，android5.0有效，设置为0
      }
    },
  }
);
//  钱包
const WalletSet = createStackNavigator(
  {
    WalletHome,
    WalletDetail: {
      screen: WalletDetail,
      navigationOptions: {
        ...defaultNavigationOptions,
      }
    },
    Transfer,
    TransactionDetail,
    Receivables,
  },
  {
    headerMode: 'screen',
    initialRouteName: 'WalletHome',
    defaultNavigationOptions: commonNavigationOptions,
    transitionConfig: () => ({
      transitionSpec: {
        duration: 1,//  300
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
      },
      screenInterpolator: sceneProps => {
        const { layout, position, scene } = sceneProps
        const { index } = scene

        const height = layout.initHeight
        const translateY = position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [height, 0, 0],
        })

        const opacity = position.interpolate({
          inputRange: [index - 1, index - 0.99, index],
          outputRange: [0, 1, 1],
        })

        return { opacity, transform: [{ translateY }] }
        // return { opacity }
      },
    })
  }
);
//  钱包
const AppSet = createStackNavigator(
  {
    SetIndex,
    IdentityName,
    Introduction,
    AboutUs: {
    screen: AboutUs,
    navigationOptions: {
      ...defaultNavigationOptions,
      headerStyle: Object.assign({}, defaultNavigationOptions.headerStyle,
        {backgroundColor: '#fff', borderBottomWidth: 0}),
    }
  },
  },
  {
    headerMode: 'screen',
    initialRouteName: 'SetIndex',
    defaultNavigationOptions: commonNavigationOptions,
  }
);
//  已获得身份的状态：首页导航
const HomeNavigator = createStackNavigator(
  {
    Home: LoggedHome,
    PasswordEnter,
    AddIndex: AddWallet,
    ChoiceCurrency,
    WalletConfig,
    MultiSignature,
    JoinShare,
    Scanner: ScannerScreen,
    getWalletName: WalletName,
    Wallet: {
      screen: WalletSet,
      navigationOptions: {header: null}
    },
    AppSet: {
      screen: AppSet,
      navigationOptions: {header: null}
    },
  },
  {
    headerMode: 'screen',
    initialRouteName: 'PasswordEnter',
    defaultNavigationOptions,
    transitionConfig: () => ({
      transitionSpec: {
        duration: 1,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
      },
      screenInterpolator: sceneProps => {
        const { position, scene } = sceneProps;
        const { index } = scene;
        const opacity = position.interpolate({
          inputRange: [index - 1, index - 0.99, index],
          outputRange: [0, 1, 1],
        });
        return { opacity }
      },
    })
  }
);
const AppNavigation = createSwitchNavigator(
  {
    App: HomeNavigator,
    Auth: AuthStack,
    AuthLoading: AuthLoadingScreen
  },
  {
    initialRouteName: 'AuthLoading',
    mode:'modal',
  }
);

const App = createAppContainer(AppNavigation);

export default App
