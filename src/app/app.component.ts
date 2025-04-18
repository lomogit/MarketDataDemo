import { DataService } from './services/data.service';
import { Component, inject, signal } from '@angular/core';
import { ControlComponent } from './common/control/control.component';
import { ChartDataComponent } from './common/chart/chart-data.component';
import type { MarketData } from './models/market-data.interface';

@Component({
  selector: 'app-root',
  imports: [ControlComponent, ChartDataComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly dataService = inject(DataService);

  protected data = signal<MarketData[]>([]);
  protected marketData = signal<MarketData | null>(null);

  protected maxSize: number = 0;

  private readonly sizeString = 'Size';

  //#region lifecycle

  protected ngOnInit() {
    this.dataService.getData().subscribe((data: MarketData[]) => {
      this.data.set(data ?? []);

      if (data != null && data.length > 0) {
        this.maxSize = this.getMaxSize(data);
        this.marketData.set(data[0]);
      }
    });
  }

  //#endregion

  private getMaxSize(data: MarketData[]) {
    let maxSize = 0;

    for (let i = 0; i < data.length; i++) {
      const _data: MarketData = data[i];
      for (const key in _data) {
        if (_data.hasOwnProperty(key)) {
          if (key.endsWith(this.sizeString)) {
            const value = _data[key];

            if (typeof value === 'number') {
              if (maxSize < value) {
                maxSize = value;
              }
            }
          }
        }
      }
    }

    return maxSize;
  }
}
