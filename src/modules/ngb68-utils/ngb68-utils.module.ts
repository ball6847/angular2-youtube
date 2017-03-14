import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectMeDirective, FocusMeDirective } from './directives';
import { BenchmarkService } from './services';

const COMPONENTS = [
  SelectMeDirective,
  FocusMeDirective
];

const SERVICES = [
  BenchmarkService
];


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ...COMPONENTS
  ],
  providers: [
    ...SERVICES
  ],
  exports: [
    ...COMPONENTS
  ]
})
export class Ngb68UtilsModule { }
