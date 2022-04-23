import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BlockUIModule } from 'ng-block-ui';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ClarityModule } from '@clr/angular';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BlockUIModule.forRoot({
      message: 'Loading...',
    }),

    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ClarityModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
