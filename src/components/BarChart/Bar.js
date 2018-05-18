// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { transition as d3Transition } from 'd3-transition';
import { easeCubicInOut as d3EaseCubicInOut } from 'd3-ease';
import { select as d3Select } from 'd3-selection';

type Props = {
  x: number,
  y: number,
  height: number,
  width: number,
  fill: string,
};

type State = {
  y: number,
  height: number,
  fillOpacity: number,
};

export default class Bar extends React.Component<Props, State> {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      y: props.y + props.height,
      height: 0,
      fillOpacity: 0.5,
    };
  }

  transition = d3Transition()
    .duration(750)
    .ease(d3EaseCubicInOut);

  componentDidMount() {
    const { height, y } = this.props;
    const node = d3Select(ReactDOM.findDOMNode(this));

    node.transition(this.transition)
      .attr('height', height)
      .attr('y', y)
      .style('fillOpacity', 1)
      .on('end', () => {
        this.setState({ height, y, fillOpacity: 1});
      });
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.height !== this.props.height || nextProps.y !== this.props.y) {
      const { height, y } = nextProps;
      const node = d3Select(ReactDOM.findDOMNode(this));

      node.transition(this.transition)
        .attr('height', 0)
        .attr('y', y + height)
        .style('fillOpacity', 0.5)
        .transition(this.transition)
        .attr('height', height)
        .attr('y', y)
        .style('fillOpacity', 1)
        .on('end', () => {
          this.setState({ height, y, fillOpacity: 1 });
        });
    }
  }

  render() {
    const { x, width, fill } = this.props;
    const { y, height, fillOpacity } = this.state;
    return (
      <rect
        x={x}
        y={y}
        height={height}
        width={width}
        fill={fill}
        style={{ fillOpacity }}
      />
    );
  }
}
