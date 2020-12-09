import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BinaryComponent } from './binary/binary.component';
import { GraphAlgosComponent } from './graph-algos/graph-algos.component';
import { GraphVisualComponent } from './graph-visual/graph-visual.component';
import { RecursionComponent } from './recursion/recursion.component';

const routes: Routes = [
  {path:'binary',component:BinaryComponent},
  {path:'recursion',component:RecursionComponent},
  {path:'graphvisuals',component:GraphVisualComponent},
  {path:'graphalgos',component:GraphAlgosComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
