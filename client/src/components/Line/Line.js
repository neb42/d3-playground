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
  onMouseOver: Function,
  onMouseOut: Function,
};

type State = {
  lineStyle: Object,
  focus: {
    transform: string,
    x2: number,
    y2: number,
    text: string,
  },
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
      focus: {
        transform: '',
        x2: props.dimensions.width - props.margins.left - props.margins.right,
        y2: props.dimensions.height - props.margins.top - props.margins.bottom,
        text: '',
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

  handleMouseOver = () => {
    const { onMouseOver } = this.props;
    onMouseOver && onMouseOver();
  }

  handleMouseOut = () => {
    const { onMouseOut } = this.props;
    onMouseOut && onMouseOut();
  }

  handleMouseMouse = e => {
    const { data, scales, xFunc, yFunc, dimensions, margins } = this.props;

    const width = dimensions.width - margins.left - margins.right;
    const height = dimensions.height - margins.top - margins.bottom;
    const xValue = d => xFunc ? xFunc(d) : d;
    const yValue = d  => yFunc ? yFunc(d) : d;

    const x0 = scales.x.invert(e.clientX);
    const i = d3Bisector(xValue).left(data, x0, 1);
    const d0 = data[i - 1];
    const d1 = data[i];
    const d = x0 - xValue(d0) > xValue(d1) - x0 ? d1 : d0;

    this.setState(prevState => ({
      focus: {
        ...prevState.focus,
        transform: `translate(${scales.x(xValue(d))}, ${scales.y(yValue(d))})`,
        x2: width + width,
        y2: height - scales.y(yValue(d)),
        text: yValue(d),
      },
    }));
  }

  render() {
    const { data, scales, xFunc, yFunc, dimensions, margins } = this.props;
    const {
      lineStyle,
      focus: {
        transform,
        x2,
        y2,
        text,
      },
    } = this.state;

    const width = dimensions.width - margins.left - margins.right;
    const height = dimensions.height - margins.top - margins.bottom;

    const line = d3Line()
      .x(d => scales.x(xFunc ? xFunc(d) : d))
      .y(d => scales.y(yFunc ? yFunc(d) : d));

    const newline = line(data);

    return [
      <g>
        <path d={newline} style={lineStyle} ></path>
        <g transform={transform} >
          <line y1={0} y2={y2} />
          <line x1={width} x2={x2} />
          <circle r={7.5} />
          <text x={15} dy="0.31em" >{text}</text>
        </g>
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
