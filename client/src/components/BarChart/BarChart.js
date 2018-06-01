// @flow

import React from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';

import { Axes } from '../Axes';
import Bars from './Bars';

type Props = {
  maxValue: number,
  N: number,
  height: number,
  width: number,
  data: Array<{ label: number, value: number }>,
};

type State = {
  scale: {
    x: any,
    y: any,
  },
  ready: boolean,
};

export default class BarChart extends React.Component<Props, State> {
  props: Props;
  state: State;
  node: Element | null;
  margins: Object;

  constructor(props: Props) {
    super(props);
    this.state = {
      scale: {
        x: scaleBand(),
        y: scaleLinear(),
      },
      ready: false,
    }
    this.margins = { top: 50, right: 20, bottom: 100, left: 60 };
  }

  componentDidMount() {
    this.createBarChart()
  }

  componentWillReceiveProps(nextProps: Props) {
    this.createBarChart();
  }

  createBarChart = () => {
    if (this.props.data.length > 0) {
      this.setState(prevState => ({
        scale: this.calculateScale(prevState.scale),
        ready: true,
      }));
    }
  }

  calculateScale = (prevScale: Object) => {
    const { height, width, data } = this.props;

    const maxValue = this.props.maxValue || Math.max(...data.map(d => d.value));

    const x = prevScale.x
      .padding(0.5)
      .domain(data.map(d => d.label))
      .range([ this.margins.left, width - this.margins.right ])

    const y = prevScale.y
      .domain([ 0, maxValue ])
      .range([ height - this.margins.bottom, this.margins.top ])

    return { x, y };
  }

  render() {
    const { height, width, data } = this.props;
    const { scale, ready } = this.state;
    const maxValue = this.props.maxValue || Math.max(...data.map(d => d.value));
    return (
      <svg ref={node => this.node = node} width={width} height={height} >
        <Axes
          scales={scale}
          margins={this.margins}
          dimensions={{ width, height }}
        />
        {ready && <Bars
          scales={scale}
          margins={this.margins}
          data={data}
          maxValue={maxValue}
          dimensions={{ width, height }}
        />}
      </svg>
    );
  }
};
