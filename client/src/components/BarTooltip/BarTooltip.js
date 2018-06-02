// @flow

import React from 'react';
import { PALETTE } from '@asidatascience/adler-ui';
import { line as d3Line } from 'd3-shape';
import { select as d3Select } from 'd3-selection';
import { bisector as d3Bisector } from 'd3-array';
import { Bar } from '../BarChart';

type Props = {
  data: any,
  scales: Object,
  color: string,
  xFunc: (d: Object) => any,
  yFunc: (d: Object) => any,
  getBucket: (x: any) => [ any, any, any ],
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

type State = {
  barWidth: number,
  barHeight: number,
  x: number,
  y: number,
  text: string,
};

export default class BarTooltip extends React.Component<Props, State> {
  props: Props;
  state: State;
  lineElement: any;

  static defaultProps = {
    xFunc: d => d,
    yFunc: d => d,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      barWidth: 0,
      x: 0,
      y: 0,
      barHeight: 0,
      text: '',
    };
  }

  handleMouseMouse = (event: MouseEvent) => {
    const { data, scales, xFunc, yFunc, dimensions, margins, getBucket } = this.props;

    const width = dimensions.width - margins.left - margins.right;
    const height = dimensions.height - margins.top - margins.bottom;

    const x = scales.x.invert(event.clientX);
    const [ xLow, xHigh, avgValue ] = getBucket(x);
    const iLow = d3Bisector(xFunc).left(data, xLow, 1);
    const iHigh = d3Bisector(xFunc).left(data, xHigh, 1);
    const dLow = data[iLow];
    const dHigh = data[iHigh];
    console.log(iLow, iHigh)

    this.setState(prevState => ({
      barWidth: scales.x(xFunc(dHigh)) - scales.x(xFunc(dLow)),
      x: scales.x(xFunc(dLow)),
      y: scales.y(avgValue),
      barHeight: dimensions.height - margins.bottom - scales.y(avgValue),
      text: avgValue.toString(),
    }));
  }

  render() {
    const { data, scales, xFunc, yFunc, dimensions, margins } = this.props;
    const {
      barWidth,
      text,
      barHeight,
      x,
      y,
    } = this.state;

    const width = dimensions.width - margins.left - margins.right;
    const height = dimensions.height - margins.top - margins.bottom;

    return [
      <Bar
        x={x}
        y={y}
        height={barHeight}
        width={barWidth}
        fill={PALETTE.green}
        fillOpacity={0.3}
        transition={false}
      />,
      <rect
        style={{
          fill: 'none',
          pointerEvents: 'all',
        }}
        transform={`translate(${margins.left}, ${margins.top})`}
        width={width}
        height={height}
        onMouseMove={this.handleMouseMouse}
      />,
    ];
  }
}
