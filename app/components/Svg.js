import React, { Component } from 'react';
import SvgUri from "react-native-svg-uri";
import svgs from '../assets/svgs';

export default class Svg extends Component {
  render() {
    const {
      iocn,
      color,
      width,
      height,
      style,
    } = this.props;
    let svgXmlData = svgs[this.props.icon];

    if (!svgXmlData) {
      let err_msg = `没有"${this.props.icon}"这个icon`;
      console.log(err_msg);
      svgXmlData = svgs['null']
    }
    return (
      <SvgUri
        width={width}
        height={height}
        svgXmlData={svgXmlData}
        fill={color}
        style={style}
      />
    )
  }
}
