// @flow

import React from 'react';
import { Tooltip } from '@asidatascience/adler-ui';
import OverlayTrigger from '@asidatascience/adler-ui/dist/components/OverlayTrigger';
import { line as d3Line } from 'd3-shape';
import { select as d3Select } from 'd3-selection';
import { bisector as d3Bisector } from 'd3-array';

type Props = {
  data: any,
  scales: Object,
  color: string,
  xFunc: (d: Object) => any,
  yFunc: (d: Object) => any,
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
  lineStyle: Object,
};

const defaultLineStyle = {
  fill: 'transparent',
  strokeWidth: 2,
  strokeOpactiy: 0.3,
};

export default class Line extends React.Component<Props, State> {
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
      lineStyle: {
        ...defaultLineStyle,
        stroke: props.color,
      },
    };
  }

  setLineStyle = (style: Object) => {
    this.setState({
      lineStyle: {
        ...defaultLineStyle,
        stroke: this.props.color,
        ...style,
      },
    });
  };

  render() {
    const { data, scales, xFunc, yFunc, dimensions, margins } = this.props;
    const {
      lineStyle,
    } = this.state;

    const width = dimensions.width - margins.left - margins.right;
    const height = dimensions.height - margins.top - margins.bottom;

    const line = d3Line()
      .x(d => scales.x(xFunc(d)))
      .y(d => scales.y(yFunc(d)));

    const newline = line(data);

    return (
      <path d={newline} style={lineStyle} ></path>
    );
  }
}
