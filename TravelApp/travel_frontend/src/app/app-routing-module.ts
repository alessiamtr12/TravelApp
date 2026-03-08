import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent} from './components/login/login';
import { TripListComponent } from './components/trip-list/trip-list';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'trips', component: TripListComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
