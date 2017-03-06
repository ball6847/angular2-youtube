import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[focusme]'
})
export class FocusMeDirective {
  private element: HTMLElement;

  constructor ($element: ElementRef) {
    this.element = $element.nativeElement;
  }

  ngAfterViewInit () {
    this.element.focus();
  }
}