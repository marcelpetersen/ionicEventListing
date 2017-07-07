import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ParkingPage } from './parking';

@NgModule({
  declarations: [
    ParkingPage,
  ],
  imports: [
    IonicPageModule.forChild(ParkingPage),
  ],
  exports: [
    ParkingPage
  ]
})
export class ParkingPageModule {}
