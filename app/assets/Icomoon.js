import {createIconSetFromIcoMoon} from 'react-native-vector-icons';
import icoMoonConfig from './selection';
const Icon = createIconSetFromIcoMoon(icoMoonConfig);

export default Icon;

export const Button = Icon.Button;
export const TabBarItem = Icon.TabBarItem;
export const TabBarItemIOS = Icon.TabBarItemIOS;
export const ToolbarAndroid = Icon.ToolbarAndroid;
export const getImageSource = Icon.getImageSource;
