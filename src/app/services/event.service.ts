import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { type MarketData } from '../models/market-data.interface';

@Injectable({
  providedIn: 'root',
})

export class EventService {
  private changeDataEventSubject = new Subject<MarketData>();
  public changeDataEvent$ = this.changeDataEventSubject.asObservable();

  emitChangeDataEvent(data: MarketData): void {
    this.changeDataEventSubject.next(data);
  }
}
