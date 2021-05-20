import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  binaryModal:boolean;
  graphAlgoModal:boolean;
  graphVisualModal:boolean;
  recursionModal:boolean;
  constructor() { 
    this.binaryModal=false;
    this.graphAlgoModal=false;
    this.graphVisualModal=false;
    this.recursionModal=false;
  }
  changebinaryModal(){
    this.binaryModal=true;
  }
  changegraphAlgoModal(){
    this.graphAlgoModal=true;
  }
  changegraphVisualModal(){
    this.graphVisualModal=true;
  }
  changerecursionModal(){
    this.recursionModal=true;
  }
}
