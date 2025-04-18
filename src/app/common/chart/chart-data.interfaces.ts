import {
  type ApexAxisChartSeries,
  type ApexChart,
  type ApexTitleSubtitle,
  type ApexDataLabels,
  type ApexStroke,
  type ApexGrid,
  type ApexYAxis,
  type ApexXAxis,
  type ApexPlotOptions,
  type ApexTooltip,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  colors: string[];
  tooltip: ApexTooltip;
  title: ApexTitleSubtitle;
};
