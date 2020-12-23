import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  constructor(private route: Router) { }

  ngOnInit(): void {
  }

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
