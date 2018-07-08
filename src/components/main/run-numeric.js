import RunInfo from './run-info';

export default class RunInfoNumeric extends RunInfo {
  formatValue(){
    console.log('value: ' + this.state.value);
    return [this.state.value.toFixed(2), this.props.unit].join(' ');
  }
}
