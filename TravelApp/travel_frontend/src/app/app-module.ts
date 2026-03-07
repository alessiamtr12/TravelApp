import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { App } from './app';
// Change TripList to TripListComponent here:
import { TripListComponent } from './components/trip-list/trip-list';

@NgModule({
  declarations: [
    App,
    TripListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [App]
})
export class AppModule { }
