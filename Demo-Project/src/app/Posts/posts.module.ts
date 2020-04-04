import { NgModule } from '@angular/core';

import { PostCreateComponent } from './Posts-create/Posts-create.component';
import { Postslist } from './Posts-list/Posts-list.component';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations :[
    PostCreateComponent,
    Postslist
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class PostModule{}
