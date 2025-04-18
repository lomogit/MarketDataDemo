import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { interval, Subject, takeUntil } from 'rxjs';
import { type MarketData } from '../../models/market-data.interface';
import { TimePipe } from '../../helpers/pipes/time.pipe';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-control',
  imports: [FormsModule, TimePipe],
  templateUrl: './control.component.html',
  styleUrl: './control.component.scss',
})
export class ControlComponent {
  @Input() public marketData: MarketData[] = [];

  private readonly eventService = inject(EventService);

  private id = 0;
  protected getId() {
    return this.id++;
  }

  protected selectedValue = 0;
  protected isStarted: boolean = false;
  private intervalTime: number = 2000; // 2 seconds
  private stop$ = new Subject<void>();

  protected onChange() {
    console.log(this.selectedValue);
    const selectedObject: MarketData = this.marketData[this.selectedValue];

    this.eventService.emitChangeDataEvent(selectedObject);
  }

  protected onStartClick() {
    this.isStarted = true;
    this.run();
  }

  protected onStopClick() {
    this.isStarted = false;
    this.stop();
  }

  protected onLeftClick() {
    this.eventService.emitChangeDataEvent(
      this.marketData[--this.selectedValue]
    );
  }

  protected onRightClick() {
    this.eventService.emitChangeDataEvent(
      this.marketData[++this.selectedValue]
    );
  }

  protected run() {
    interval(this.intervalTime)
      .pipe(takeUntil(this.stop$))
      .subscribe(() => {
        this.eventService.emitChangeDataEvent(
          this.marketData[this.selectedValue++]
        );
      });

    if (this.selectedValue === this.marketData.length - 1) {
      this.selectedValue = 0; // or this.stop(); to stop the interval
    }
  }

  private stop() {
    this.isStarted = false;
    this.stop$.next();
    this.stop$.complete();
    this.stop$ = new Subject<void>();
  }
}
