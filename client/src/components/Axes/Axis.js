// @flow

import React from 'react';
import * as d3Axis from 'd3-axis';
import { select as d3Select } from 'd3-selection';

import './Axis.css';

type Props = {
  orient: 'Bottom' | 'Left' | 'Top' | 'Right',
  scale: any,
  translate: string,
  tickSize: number,
};

export default class Axis extends React.Component<Props> {
  props: Props;
  axisElement: Element | null;

  componentDidMount() {
    this.renderAxis();
  }

  componentDidUpdate() {
    this.renderAxis();
  }

  renderAxis() {
    if (!this.axisElement) {
      return;
    }
    const { orient, scale, tickSize } = this.props;
    const axisType = `axis${orient}`;
    const axis = d3Axis[axisType]()
      .scale(scale)
      // .tickSize(-1 * tickSize)
      // .tickPadding([12])
      // .ticks([4]);

    d3Select(this.axisElement).call(axis);
  }

  render() {
    const { orient, translate } = this.props;
    return (
      <g
        className={`Axis Axis-${orient}`}
        ref={(el) => { this.axisElement = el; }}
        transform={translate}
      />
    );
  }
}
