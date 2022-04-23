import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pagePath',
})
export class PagePathPipe implements PipeTransform {
  transform(url: string, args?: any): any {
    let path = '';
    try {
      path = new URL(url).pathname;
    } catch (err) {}

    return path;
  }
}
