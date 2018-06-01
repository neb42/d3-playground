// @flow

import React from 'react';
import Axis from './Axis';

type Props = {
  scales: {
    x: any,
    y: any,
  },
  margins: {
    top: number,
    right: number,
    bottom: number,
    left: number,
  },
  dimensions: {
    width: number,
    height: number,
  },
};

const Axes = ({ scales, margins, dimensions }: Props) => {
  const { height, width } = dimensions;

  const xProps = {
    orient: 'Bottom',
    scale: scales.x,
    translate: `translate(0, ${height - margins.bottom})`,
    tickSize: height - margins.top - margins.bottom,
  };

  const yProps = {
    orient: 'Left',
    scale: scales.y,
    translate: `translate(${margins.left}, 0)`,
    tickSize: width - margins.left - margins.right,
  };

  return (
    <g>
      <Axis {...xProps} />
      <Axis {...yProps} />
    </g>
  );
};

export default Axes;
