import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

class FacebookTabBar extends React.Component {
  icons = [];

  constructor(props) {
    super(props);
    this.icons = [];
  }

  componentDidMount() {
    //  箭头函数
    this._listener = this.props.scrollValue.addListener(this.setAnimationValue.bind(this));
  }

  setAnimationValue({ value, }) {
    this.icons.forEach((icon, i) => {
      const progress = (value - i >= 0 && value - i <= 1) ? value - i : 1;
      icon.setNativeProps({
        style: {
          color: this.iconColor(progress),
        },
      });
    });
  }

  //color between rgb(59,89,152) and rgb(204,204,204)
  iconColor(progress) {
    const red = 59 + (204 - 59) * progress;
    const green = 89 + (204 - 89) * progress;
    const blue = 152 + (204 - 152) * progress;
    return `rgb(${red}, ${green}, ${blue})`;
  }

  render() {
    return <View style={[styles.tabs, this.props.style, ]}>
      {this.props.tabs.map((tab, i) => {
        return <TouchableOpacity key={tab} onPress={() => this.props.goToPage(i)} activeOpacity={0.8}
                                 style={Object.assign({}, styles.tab, {borderBottomColor: this.props.activeTab === i ? '#358BFE' : '#FFF'})}>
          <View style={{}}>
            <Text style={{fontSize: 15, lineHeight: 34,  color: this.props.activeTab === i ? '#358BFE' : '#333',
             }}>{tab}</Text>
          </View>

        </TouchableOpacity>;
      })}
    </View>;
  }
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F00'
  },
  tabs: {
    height: 45,marginTop: 6,paddingLeft: 10, paddingRight: 10,
    flexDirection: 'row',
    paddingTop: 5,
    borderBottomWidth: 1,borderBottomColor: '#efefef',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
});

export default FacebookTabBar;
