// @flow

import React from 'react';
import { PALETTE } from '@asidatascience/adler-ui';
import {
  extent as d3ArrayExtent,
  mean as d3Mean,
} from 'd3-array';
import { scaleTime, scaleLinear } from 'd3-scale';
import { csvParse } from 'd3-dsv';
import { nest as d3Nest } from 'd3-collection';
import { timeMonth as d3TimeMonth } from 'd3-time';

import Line from '../../components/Line';
import { Axes } from '../../components/Axes';

type Props = {

};

type State = {
  ready: boolean,
  scales: Object,
  data: Object,
}

const height = 1000;
const width = 1500;
const xKey = 'date';
const yKey = 'high';
const color = PALETTE.blue;

export default class Crypto extends React.Component<Props, State> {
  props: Props;
  state: State;
  node: Element | null;
  margins: Object;
  line: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      scales: {
        x: scaleTime(),
        y: scaleLinear(),
      },
      data: {},
      ready: false,
    };
    this.margins = { top: 50, right: 20, bottom: 100, left: 60 };
  }

  componentDidMount() {
    this.createChart();
  }

  componentWillReceiveProps() {
    this.createChart();
  }

  generateData = async () => {
    const response = await fetch(`/files/crypto-markets.csv`);
    const csvText = await response.text();
    const data = csvParse(csvText)
      .filter(d => d.symbol === 'BTC')
      .sort((a, b) => new Date(a[xKey]) - new Date(b[xKey]));
    return d3Nest()
      .key(d => new Date(d[xKey]))
      .rollup(v => d3Mean(v, d => d[yKey]))
      .entries(data);
  };

  createChart = async () => {
    const data = await this.generateData();
    this.setState(prevState => {
      return {
        data,
        scales: this.calculateScale(prevState.scales, data),
        ready: true,
      };
    });
  }

  calculateScale = (prevScale: Object, data: any) => {
    // const { height, width } = this.props;

    let x = prevScale.x
      .domain(d3ArrayExtent(data, d => new Date(d.key)))
      .range([ this.margins.left, width - this.margins.right ]);

    let y = prevScale.y
      .domain(d3ArrayExtent(data, d => d.value))
      .range([ height - this.margins.bottom, this.margins.top ]);

    return { x, y };
  }

  render() {
    // const { height, width } = this.props;
    const { scales, ready, data } = this.state;
    return (
      <div style={{ display: 'flex' }}>
        <svg ref={node => this.node = node} width={width} height={height} >
          <Axes
            scales={scales}
            margins={this.margins}
            svgDimensions={{ width, height }}
          />
          <Line
            ref={c => this.line = c}
            data={data}
            scales={scales}
            color={color}
            xFunc={d => new Date(d.key)}
            yFunc={d => d.value}
            dimensions={{ width, height }}
            margins={this.margins}
          />
        </svg>
      </div>
    );
  }
}
