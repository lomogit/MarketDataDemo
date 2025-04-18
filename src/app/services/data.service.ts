import { MarketData } from './../models/market-data.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly url: string = '/api/assets/files/sample.json';

  public data = signal<MarketData[]>([]);

  public getData(): Observable<MarketData[]> {
    return this.http
      .get<string>(this.url, { responseType: 'text' as 'json' }) //not valid json, so use text
      .pipe(
        //parce text to json
        map((rawData: string) => {
          const jsonLines = rawData.trim().split('\n');
          const parsedData: MarketData[] = [];

          for (const line of jsonLines) {
            try {
              parsedData.push(JSON.parse(line));
            } catch (error) {
              console.error('Error parsing JSON:', error, 'line:', line);
            }
          }

          this.data.set(parsedData);

          return parsedData;
        })
      );
  }
}
