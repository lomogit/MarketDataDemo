import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time',
})
export class TimePipe implements PipeTransform {
  transform(value: string): string {
    const index = value.indexOf('.');

    if (index !== -1) {
      return value.slice(0, index);
    }

    return value;
  }
}
