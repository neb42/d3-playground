import React from 'react';
import ReactDOM from 'react-dom';

export default class Grid extends React.Component {

  componentDidUpdate() {
    this.renderGrid();
  }

  componentDidMount() {
    this.renderGrid();
  }

  renderGrid() {
    const node = ReactDOM.findDOMNode(this);
    d3.select(node).call(this.props.grid);
  }

  render() {
    const translate = 'translate(0,'+(this.props.h)+')';
    return (
      <g className="y-grid" transform={this.props.gridType=='x'?translate:""}>
      </g>
    );
  }
}
