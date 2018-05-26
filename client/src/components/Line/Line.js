// @flow

import React from 'react';
import { line as d3Line } from 'd3-shape';

type Props = {
  color: string,
  data: any,
  scales: Object,
  xKey: string,
  yKey: string,
  dimensions: Object,
  margins: Object,
};

export default class Line extends React.Component<Props> {
  props: Props;
  render() {
    const { color, data, margins, dimensions, scales, xKey, yKey } = this.props;

    const height = dimensions.height - margins.top - margins.bottom;
    const width = dimensions.width  - margins.left - margins.right;

    const line = d3Line()
      .x(d => scales.x(new Date(d[xKey])))
      .y(d => scales.y(d[yKey]));

    const newline = line(data);

    return(
      <path className="line" d={newline} style={{
        fill: 'transparent',
        stroke: color,
        strokeWidth: 2.
      }}></path>
    );
  }
}
