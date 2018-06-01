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
  transition: boolean,
  fillOpacity?: number,
};

type State = {
  y: number,
  height: number,
  fillOpacity: number,
};

export default class Bar extends React.Component<Props, State> {
  props: Props;
  state: State;

  transition = d3Transition()
    .duration(750)
    .ease(d3EaseCubicInOut);

  constructor(props: Props) {
    super(props);
    const { y, height, transition, fillOpacity } = props;
    this.state = {
      y: transition ? y + height : y,
      height: transition ? 0 : height,
      fillOpacity: transition ? 0 : fillOpacity || 1,
    };
  }

  componentDidMount() {
    const { height, y, transition } = this.props;

    if (transition) {
      const node = d3Select(ReactDOM.findDOMNode(this));

      node.transition(this.transition)
        .attr('height', height)
        .attr('y', y)
        .style('fillOpacity', 1)
        .on('end', () => {
          this.setState({ height, y, fillOpacity: 1 });
        });
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    const { height, y, transition } = nextProps;
    
    if (transition && (height !== this.props.height || y !== this.props.y)) {
      const node = d3Select(ReactDOM.findDOMNode(this));

      node.transition(this.transition)
        .attr('height', 0)
        .attr('y', y + height)
        .style('fillOpacity', 0)
        .transition(this.transition)
        .attr('height', height)
        .attr('y', y)
        .style('fillOpacity', 1)
        .on('end', () => {
          this.setState({ height, y, fillOpacity: 1 });
        });
    }
  }

  get fillOpacity() {
    const { fillOpacity, transition } = this.props;
    const { fillOpacity: transitionFillOpacity } = this.state;
    return transition ? transitionFillOpacity : fillOpacity || 1;
  }

  render() {
    const { x, width, fill } = this.props;
    const { y, height  } = this.state;
    return (
      <rect
        x={x}
        y={y}
        height={height}
        width={width}
        fill={fill}
        style={{ fillOpacity: this.fillOpacity }}
      />
    );
  }
}
