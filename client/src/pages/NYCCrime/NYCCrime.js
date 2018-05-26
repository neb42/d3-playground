// @flow

import React from 'react';
import { PALETTE } from '@asidatascience/adler-ui';
import { extent as d3ArrayExtent } from 'd3-array';
import { scaleTime, scaleLinear } from 'd3-scale';
import { csvParse } from 'd3-dsv';
import { nest as d3Nest } from 'd3-collection';

import Line from '../../components/Line';
import { Axes } from '../../components/Axes';

type Props = {

};

type State = {
  ready: boolean,
  scales: Object,
  data: Object,
}

const N = 100;
const maxValue = 100;
const height = 1000;
const width = 1500;
const xKey = 'RPT_DT';
const yKey = 'count';
const boros = [
  'QUEENS',
  'BRONX',
  'BROOKLYN',
  'MANHATTAN',
  'STATEN ISLAND',
];
const colors = {
  'QUEENS': PALETTE.green,
  'BRONX': PALETTE.yellow,
  'BROOKLYN': PALETTE.red,
  'MANHATTAN': PALETTE.blue,
  'STATEN ISLAND': PALETTE.purple,
}

export default class NYCCrime extends React.Component<Props, State> {
  props: Props;
  state: State;
  node: Element | null;
  margins: Object;

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
    const data = await Promise.all(boros.map(async b => {
      const response = await fetch(`/files/nyc-crimes-${b}.csv`);
      const csvText = await response.text();
      const data = csvParse(csvText);
      return [
        b,
        // data,
        d3Nest()
          .key(d => d[xKey])
          .entries(data).map(d => ({ [xKey]: d.key, [yKey]: d.values.length })),
      ];
    }));
    const output = {};
    data.forEach(([ b, d ]) => output[b] = d);
    return output;
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
      .domain(d3ArrayExtent(data, d => new Date(d[xKey])))
      .range([ this.margins.left, width - this.margins.right ]);

    let y = prevScale.y
      .domain(d3ArrayExtent(data, d => d[yKey]))
      .range([ height - this.margins.bottom, this.margins.top ]);

    let minX, maxX, minY, maxY;
    boros.forEach(b => {
      const [ newMinX, newMaxX ] = d3ArrayExtent(data[b], d => new Date(d[xKey]));
      if (!minX || minX > newMinX) {
        minX = newMinX;
      }
      if (!maxX || maxX < newMaxX) {
        maxX = newMaxX;
      }

      const [ newMinY, newMaxY ] = d3ArrayExtent(data[b], d => d[yKey]);
      if (!minY || minY > newMinY) {
        minY = newMinY;
      }
      if (!maxY || maxY < newMaxY) {
        maxY = newMaxY;
      }
    });

    console.log(minX, maxX, minY, maxY)

    x = x.domain([ minX, maxX ]);
    y = y.domain([ minY, maxY ]);

    return { x, y };
  }

  render() {
    // const { height, width } = this.props;
    const { scales, ready, data } = this.state;
    return (
      <svg ref={node => this.node = node} width={width} height={height} >
        {/* <Axes
          scales={scale}
          margins={this.margins}
          svgDimensions={{ width, height }}
        /> */}
        {ready && boros.map(b => (
          <Line
            color={colors[b]}
            data={data[b]}
            scales={scales}
            xKey={xKey}
            yKey={yKey}
            margins={this.margins}
            dimensions={{ width, height }}
          />
        ))}
      </svg>
    );
  }
}
