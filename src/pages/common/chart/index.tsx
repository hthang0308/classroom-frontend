
import BaseChart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, ChartProps } from 'react-chartjs-2';

BaseChart.register(ChartDataLabels);
const Chart = (props: ChartProps) => <ChartJS {...props} />;

export default Chart;
