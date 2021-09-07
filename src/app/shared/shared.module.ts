import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { TableComponent } from './components/table/table.component';
@NgModule({
  imports: [MaterialModule, CommonModule],
  declarations: [TableComponent],
  exports: [TableComponent],
})
export class SharedModule {}
