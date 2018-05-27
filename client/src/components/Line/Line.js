// @flow

import React from 'react';
import { line as d3Line } from 'd3-shape';
import { select as d3Select } from 'd3-selection';

type Props = {
  data: any,
  scales: Object,
  color: string,
  xFunc: (d: Object) => any,
  yFunc: (d: Object) => any,
  onMouseOver: Function,
  onMouseOut: Function,
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

  constructor(props: Props) {
    super(props);
    this.state = {
      lineStyle: {
        ...defaultLineStyle,
        stroke: props.color,
      },
    };
  }

  handleMouseOver = () => {
    const { onMouseOver } = this.props;
    onMouseOver && onMouseOver();
  }

  handleMouseOut = () => {
    const { onMouseOut } = this.props;
    onMouseOut && onMouseOut();
  }

  handleRef = c => {
    this.lineElement = c;
    d3Select(this.lineElement)
      .on('mouseover', this.handleMouseOver)
      .on('mouseout', this.handleMouseOut)
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
    const { data, scales, xFunc, yFunc } = this.props;
    const { lineStyle } = this.state;

    const line = d3Line()
      .x(d => scales.x(xFunc ? xFunc(d) : d))
      .y(d => scales.y(yFunc ? yFunc(d) : d));

    const newline = line(data);

    return(
      <path
        className="line"
        ref={this.handleRef}
        d={newline}
        style={lineStyle}
      ></path>
    );
  }
}
