import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentsRoutingModule } from './payments-routing.module';
import { PaymentComponent } from './payment.component';

@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    PaymentsRoutingModule,
    PaymentComponent
  ]
})
export class PaymentsModule { }