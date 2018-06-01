// @flow

import React from 'react'
import { TransitionGroup } from 'react-transition-group';
import { scaleLinear } from 'd3-scale'
import { interpolateLab } from 'd3-interpolate'
import { PALETTE } from '@asidatascience/adler-ui';

import Bar from './Bar';

type Props = {
  maxValue: number,
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
  data: Array<{ label: number, value: number }>,
};

export default class Bars extends React.Component<Props> {
  props: Props;
  colorScale: Function;

  constructor(props: Props) {
    super(props);

    this.colorScale = scaleLinear()
      .domain([ 0, this.props.maxValue ])
      .range([PALETTE.blue])
      .interpolate(interpolateLab);
  }

  render() {
    const { scales, margins, data, dimensions } = this.props;
    const { x: xScale, y: yScale } = scales;
    const { height } = dimensions;

    return (
      <TransitionGroup component="g">
        {data.map(datum => (
          <Bar
            key={datum.label}
            label={datum.label}
            x={xScale(datum.label)}
            y={yScale(datum.value)}
            height={height - margins.bottom - yScale(datum.value)}
            width={xScale.bandwidth()}
            fill={this.colorScale(datum.value)}
            transition={true}
          />
        ))}
      </TransitionGroup>
    );
  }
}
