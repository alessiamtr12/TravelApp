import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { App } from './app';
import { TripListComponent } from './components/trip-list/trip-list';
import { LoginComponent } from './components/login/login';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { AppRoutingModule } from './app-routing-module';

@NgModule({
  declarations: [App, TripListComponent, LoginComponent],
  imports: [BrowserModule, HttpClientModule, FormsModule, AppRoutingModule],
  providers: [],
  bootstrap: [App],
})
export class AppModule {}
