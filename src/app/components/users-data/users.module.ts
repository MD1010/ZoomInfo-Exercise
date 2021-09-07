import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { MaterialModule } from 'src/app/material.module';
import { reducers } from 'src/app/store/app-store';
import { effects } from 'src/app/store/effects';
import { UsersDataComponent } from './users-data.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [UsersDataComponent],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    HttpClientModule,
    StoreModule.forFeature('users', reducers),
    EffectsModule.forFeature(effects),
  ],
  exports: [UsersDataComponent],
})
export class UsersModule {}
