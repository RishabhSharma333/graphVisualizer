import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { BinaryComponent } from './binary/binary.component';
import { GraphVisualComponent } from './graph-visual/graph-visual.component';
import { GraphAlgosComponent } from './graph-algos/graph-algos.component';
import { RecursionComponent } from './recursion/recursion.component';

@NgModule({
  declarations: [
    AppComponent,
    BinaryComponent,
    GraphVisualComponent,
    GraphAlgosComponent,
    RecursionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxGraphModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
// #a95963