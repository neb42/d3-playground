// @flow

import React from 'react';
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
  transform: string,
  x2: number,
  y2: number,
  text: string,
};

export default class CircleTooltip extends React.Component<Props, State> {
  props: Props;
  state: State;

  static defaultProps = {
    xFunc: d => d,
    yFunc: d => d,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      transform: '',
      x2: props.dimensions.width - props.margins.left - props.margins.right,
      y2: props.dimensions.height - props.margins.top - props.margins.bottom,
      text: '',
    };
  }

  handleMouseMouse = (event: MouseEvent) => {
    const { data, scales, xFunc, yFunc, dimensions, margins } = this.props;

    const width = dimensions.width - margins.left - margins.right;
    const height = dimensions.height - margins.top - margins.bottom;

    const x0 = scales.x.invert(event.clientX);
    const i = d3Bisector(xFunc).left(data, x0, 1);
    const d0 = data[i - 1];
    const d1 = data[i];
    const d = x0 - xFunc(d0) > xFunc(d1) - x0 ? d1 : d0;

    this.setState(prevState => ({
      transform: `translate(${scales.x(xFunc(d))}, ${scales.y(yFunc(d))})`,
      x2: width + width,
      y2: height - scales.y(yFunc(d)),
      text: yFunc(d),
    }));
  }

  render() {
    const { dimensions, margins } = this.props;
    const {
      transform,
      x2,
      y2,
      text,
    } = this.state;

    const width = dimensions.width - margins.left - margins.right;
    const height = dimensions.height - margins.top - margins.bottom;

    return [
      <g transform={transform} >
        <line y1={0} y2={y2} />
        <line x1={width} x2={x2} />
        <circle r={7.5} />
        <text x={15} dy="0.31em" >{text}</text>
      </g>,
      <rect
        style={{
          fill: 'none',
          pointerEvents: 'all',
        }}
        transform={`translate(${margins.left}, ${margins.top})`}
        width={width}
        height={height}
        onMouseMove={this.handleMouseMouse}
      />,
    ];
  }
}
