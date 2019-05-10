import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GameRendererComponent} from './game-engine/game-renderer.component';

const routes: Routes = [
  {path: '', component: GameRendererComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
