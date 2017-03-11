import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[selectme]'
})
export class SelectMeDirective {
  private element: HTMLInputElement;

  constructor ($element: ElementRef) {
    this.element = $element.nativeElement;
  }

  ngAfterViewInit () {
    this.element.select();
  }
}