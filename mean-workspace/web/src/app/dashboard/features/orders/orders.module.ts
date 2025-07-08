import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersRoutingModule } from './orders-routing.module';
import { OrderComponent } from './order.component';

@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    OrderComponent
  ]
})
export class OrdersModule { }