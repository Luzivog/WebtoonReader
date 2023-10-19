import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

const CircleLoader = ({ size, percentage }: {
    size: number,
    percentage: number
}) => {

  const radius = size / 2;
  
  const angle = 360*(percentage/100);
  const a = angle * (Math.PI / 180);
  const x = radius + radius * Math.sin(a);
  const y = radius - radius * Math.cos(a);
  const longArcFlag = angle > 180 ? 1 : 0;

  const pathData = `M ${radius}, ${radius} L ${radius},0 A ${radius},${radius} 0 ${longArcFlag},1 ${x},${y} Z`;

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={size}>
        <Circle cx={radius} cy={radius} r={radius} fill="grey" />
        <Path d={pathData} fill="#8b0000" />
      </Svg>
    </View>
  );
};

export default CircleLoader;
