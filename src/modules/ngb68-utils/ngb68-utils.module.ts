import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectMeDirective, FocusMeDirective } from './directives';


const COMPONENTS = [
  SelectMeDirective,
  FocusMeDirective
];


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ...COMPONENTS
  ],
  exports: [
    ...COMPONENTS
  ]
})
export class Ngb68UtilsModule { }
