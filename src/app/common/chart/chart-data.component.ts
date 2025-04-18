import { Component, inject, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { type ChartOptions } from './chart-data.interfaces';
import { type MarketData } from '../../models/market-data.interface';
import { type ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { EventService } from '../../services/event.service';

interface OrderBookLevel {
  price: number;
  bid: number;
  ask: number;
}

@Component({
  selector: 'app-chart',
  imports: [CommonModule, NgApexchartsModule, FormsModule],
  templateUrl: './chart-data.component.html',
  styleUrl: './chart-data.component.scss',
})
export class ChartDataComponent {
  @Input() public maxSize: number = 0;
  @Input() public marketData: MarketData | null = null;

  private readonly eventService = inject(EventService);

  protected isGlobalMaxSize = true;

  private currentMaxSize: number = 0;
  private readonly askString = 'Ask';
  private readonly bidString = 'Bid';
  private readonly asksString = 'Asks';
  private readonly bidsString = 'Bids';
  private readonly sizeString = 'Size';
  private readonly priceString = 'Price';

  private eventSubscription: Subscription | undefined;

  @ViewChild('chart') chart: ChartComponent | undefined;

  //#region Lifecycle

  protected ngOnInit() {
    this.eventSubscription = this.eventService.changeDataEvent$.subscribe(
      (data: MarketData) => {
        this.updateChartOptions(data);
      }
    );
  }

  protected ngAfterViewInit() {
    if (this.marketData != null) {
      this.updateChartOptions(this.marketData!);
    }
  }

  protected ngOnDestroy(): void {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }

  //#endregion

  //#region Chart Options

  protected title: ChartOptions['title'] = { text: '' };
  protected series: ChartOptions['series'] = [
    {
      name: this.asksString,
      data: [],
    },
    {
      name: this.bidsString,
      data: [],
    },
  ];

  protected chartOptions: ChartOptions['chart'] = {
    type: 'bar',
    height: 700,
    stacked: true,
  };

  protected colors: ChartOptions['colors'] = ['#008FFB', '#FF4560'];

  protected plotOptions: ChartOptions['plotOptions'] = {
    bar: {
      horizontal: true,
      barHeight: '80%',
    },
  };

  protected dataLabels: ChartOptions['dataLabels'] = {
    enabled: false,
  };

  protected stroke: ChartOptions['stroke'] = {
    width: 1,
    colors: ['#fff'],
  };

  protected grid: ChartOptions['grid'] = {
    xaxis: {
      lines: {
        show: true,
      },
    },
  };

  protected yaxis: ChartOptions['yaxis'] = {
    min: 0,
    max: 0,
    title: {
      text: this.priceString,
    },
  };

  protected tooltip: ChartOptions['tooltip'] = {
    shared: false,
    x: {
      formatter: function (val) {
        return val.toString();
      },
    },
    y: {
      formatter: function (val) {
        return Math.abs(val).toString();
      },
    },
  };

  protected xaxis: ChartOptions['xaxis'] = {
    categories: [],
    title: {
      text: this.sizeString,
    },
    labels: {
      formatter: function (val) {
        return Math.abs(parseInt(val)).toString();
      },
    },
  };

  //#endregion

  /**parsing data for chart */
  private updateChartOptions(currentData: MarketData) {
    this.currentMaxSize = 0;

    const grouped: OrderBookLevel[] = this.parceDataSource(currentData);

    const asks: number[] = [];
    const bids: number[] = [];
    const size: string[] = [];

    for (let i = 0; i < grouped.length; i++) {
      const item = grouped[i];

      size.push(item.price.toString());
      asks.push(item.ask);
      bids.push(-item.bid);
    }

    for (let i = 0; i < this.series.length; i++) {
      if (this.series[i].name === this.asksString) {
        this.series[i].data = asks;
      } else if (this.series[i].name === this.bidsString) {
        this.series[i].data = bids;
      }
    }

    this.xaxis.categories = size;

    this.yaxis.min = this.isGlobalMaxSize
      ? -this.maxSize
      : -this.currentMaxSize;
    this.yaxis.max = this.isGlobalMaxSize ? this.maxSize : this.currentMaxSize;

    this.chart?.updateOptions({
      title: this.title,
      series: this.series,
      xaxis: this.xaxis,
      yaxis: this.yaxis,
    });
  }

  private parceDataSource(currentData: MarketData) {
    const grouped: OrderBookLevel[] = [];

    for (const key in currentData) {
      if (currentData.hasOwnProperty(key)) {
        if (key === 'Time') {
          const timeValue = currentData[key];
          const index = timeValue.indexOf('.');

          if (index !== -1) {
            this.title.text = timeValue.slice(0, index);
          } else {
            this.title.text = currentData[key];
          }
        } else if (
          (key.startsWith(this.bidString) || key.startsWith(this.askString)) &&
          !key.endsWith(this.sizeString)
        ) {
          const isBid = key.startsWith(this.bidString);
          const value = currentData[key];
          const sizeVal: number = currentData[
            `${key}${this.sizeString}`
          ] as number;

          if (sizeVal > this.currentMaxSize) {
            this.currentMaxSize = sizeVal;
          }

          if (typeof value === 'number' && typeof sizeVal === 'number') {
            grouped.push({
              price: value,
              bid: isBid ? sizeVal : 0,
              ask: isBid ? 0 : sizeVal,
            });
          }
        }
      }
    }

    return grouped.sort((a, b) => b.price - a.price);
  }

  protected onCheckBoxChange() {
    this.yaxis.min = this.isGlobalMaxSize
      ? -this.maxSize
      : -this.currentMaxSize;
    this.yaxis.max = this.isGlobalMaxSize ? this.maxSize : this.currentMaxSize;

    this.chart?.updateOptions({
      yaxis: this.yaxis,
    });
  }
}
