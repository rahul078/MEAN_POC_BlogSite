import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Postslist } from './Posts/Posts-list/Posts-list.component';
import { PostCreateComponent } from './Posts/Posts-create/Posts-create.component';
import { AuthGuard } from './auth/auth.guard';


const routes: Routes = [
  { path :"", component :Postslist },
  { path : "create", component :PostCreateComponent,canActivate : [AuthGuard]},
  { path : "edit/:PostId", component :PostCreateComponent,canActivate : [AuthGuard]},
  { path : "auth", loadChildren : './auth/auth-routing.module#AuthRoutingModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers : [AuthGuard]
})
export class AppRoutingModule { }
