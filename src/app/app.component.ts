import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'visualizer';
  constructor(private route: Router) { }

  goToRecursion() {
    this.route.navigate(['/recursion']);
  }

  goToBinaryHeap() {
    this.route.navigate(['/binary']);
  }

  goToGraphVisuals() {
    this.route.navigate(['/graphvisuals']);
  }

  goToGraphAlgos() {
    this.route.navigate(['/graphalgos']);
  }

}
