// @flow
import React from 'react';
import { Button } from '@asidatascience/adler-ui';
import BarChartComponent from '../../components/BarChart';

type Props = {

};

type State = {
  data: Array<{ label: number, value: number }>,
};

const N = 10;
const maxValue = 20;

export default class BarChart extends React.Component<Props, State> {
  props: Props;
  state: State = { data: []};

  componentWillMount() {
    this.generateData();
  }

  generateData = () => {
    const data = [];
    for (let i = 0; i < N; i++) {
      data.push({ label: i, value: Math.floor(Math.random() * maxValue) });
    }
    this.setState({ data });
  };

  render() {
    const { data } = this.state;
    return (
      <div>
        <BarChartComponent
          data={data}
          height={500}
          width={500}
          maxValue={maxValue}
          N={N}
        />
        <Button text="Generate new data" onClick={this.generateData} />
      </div>
    );
  }
};
