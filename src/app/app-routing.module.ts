import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent }        from './components/home/home.component';
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {VirtualroomComponent} from "@components/virtualroom/virtualroom.component";

const routes: Routes = [
    {path: '', component: DashboardComponent},
    {path: 'virtual_room', component: VirtualroomComponent}
];

@NgModule({
            declarations: [],
            imports:      [
              RouterModule.forRoot(routes),
            ],
            exports:      [ RouterModule ],
          })
export class AppRoutingModule {}
