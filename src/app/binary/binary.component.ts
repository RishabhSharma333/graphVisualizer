import { Component, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import * as shape from 'd3-shape';
import { Node, Edge } from '@swimlane/ngx-graph';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-binary',
  templateUrl: './binary.component.html',
  styleUrls: ['./binary.component.css']
})
export class BinaryComponent implements OnInit {

  constructor(private modalService:ModalService) {
  }


  center$: Subject<boolean> = new Subject();
  update$: Subject<boolean> = new Subject();
  dragging: boolean;
  panning: boolean;
  progress: number = 0;
  layout: string;
  links: Edge[];
  nodes: Node[];
  nodeSetBinary: Set<string>;
  colorSet:Set<string>;
  animate: boolean = true;
  makeEdgeVisible: boolean = false;
  doingAlgo: boolean = false;
  textBoxMessage: string;
  textBoxInput: string;
  textBoxMenu: boolean = false;
  lineMenu: boolean = false;
  inputFormat: number = 0;
  currForBinary: number = 0;
  startIdx: number;
  makingMaxHeap: boolean = true;
  isModalActive:boolean;

  ngOnInit(): void {
    this.nodeSetBinary = new Set<string>();
    this.colorSet=new Set<string>();
    this.textBoxMessage = 'Input an Numeric Array within braces to make a Binary Heap';
    this.dragging = false;
    this.textBoxInput = '';
    this.panning = true;
    if(!this.modalService.binaryModal){
      this.isModalActive=true;
    }
    this.nodes = [];
    this.links = [];
    // this.isModalActive=true;
    this.layout = 'dagreCluster';
    // console.log('printing from binary');
  }


  updateGraph() {
    this.update$.next(true)
  }

  interpolationTypes = [
    'Linear',
    'Monotone X',
    'Step'
  ];

  curveType: string = 'Linear';
  curve: any = shape.curveLinear;

  setInterpolationType(curveType) {
    this.curveType = curveType;
    if (curveType === 'Linear') {
      this.curve = shape.curveLinear;
    }
    if (curveType === 'Monotone X') {
      this.curve = shape.curveMonotoneX;
    }
    if (curveType === 'Step') {
      this.curve = shape.curveStep;
    }
  }

  toggleDragging() {
    this.dragging = !this.dragging;
  }
  togglePanning() {
    this.panning = !this.panning;
  }
  toggleDropdown() {
    this.textBoxMenu = !this.textBoxMenu;
  }
  centerGraph() {
    this.center$.next(true);
  }

  parseString() {
    this.toggleDragging();
    this.animate = true;
    var len: number = this.textBoxInput.length;
    if (len > 2) {
      var input: string[] = this.textBoxInput.substr(1, len - 2).split(',');
      this.arrayHelper(input, input.length);
    }
    // console.log(this.nodes);
    // console.log(this.links);
    this.textBoxInput='A Binary Array heap will be made \n use next button to proceed';
  }



  arrayHelper(arr: string[], len: number) {

    for (let i = 0; i < len; i++) {
      this.nodes.push({ id: this.makeid(), label: arr[i] });
    }
    this.startIdx = Math.floor((this.nodes.length) / 2) - 1;
    for (let ii = 0; ii <= this.startIdx; ii++) {
      var left: number = ii * 2 + 1;
      var right: number = ii * 2 + 2;
      // console.log(left + ii + right);
      if (left < len) {
        this.links.push({ id: this.makeid(), source: this.nodes[ii].id, target: this.nodes[left].id, label: this.makeid() });
      }
      if (right < len) {
        this.links.push({ id: this.makeid(), source: this.nodes[ii].id, target: this.nodes[right].id, label: this.makeid() });
      }
    }

  }

  helperBinary() {
    if (this.currForBinary <= this.nodes.length) {
      this.nodeSetBinary.add(this.nodes[this.currForBinary++].id);
      if (this.currForBinary == this.nodes.length) {
        this.makeEdgeVisible = true;
        this.currForBinary++;
        this.updateGraph();
      }
      this.progress = (this.currForBinary / this.nodes.length) * 100;
    }
    else{
      this.textBoxInput='Now select max or min heap to make ';
    }
  }

  makeid() {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i < 5; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  startMakeMaxHeap() {
    this.progress = 0;
    this.doingAlgo = true;
    this.startIdx = Math.floor((this.nodes.length) / 2) - 1;
    this.animate = false;
    this.makingMaxHeap = true;
    this.textBoxInput='A Maxinum heap will be made use next button';
  }
  startMakeMinHeap() {
    this.progress = 0;
    this.doingAlgo = true;
    this.startIdx = Math.floor((this.nodes.length) / 2) - 1;
    this.animate = false;
    this.makingMaxHeap = false;
    this.textBoxInput='A Minimum heap will be made \n use next button to proceed';


  }

  makeMaxHeap() {
    if (this.startIdx >= 0) {
      this.progress = ((this.nodes.length / 2 - 1) - this.startIdx) / (this.nodes.length / 2 - 1) * 100;
      this.heapify(this.nodes.length, this.startIdx--);
      this.updateGraph();
    }
    else {
      this.textBoxInput = this.makeMaxHeap?'Max Binary heap has been made':'Min Binary heap has been made' ;
      // console.log(this.nodes);
    }
  }

  heapify(n: number, i: number) {
    var largest: number = i;
    this.colorSet.add(this.nodes[largest].id);
    var l: number = 2 * i + 1;
    var r: number = 2 * i + 2;
    if (l < n) {
      this.colorSet.add(this.nodes[l].id)
      if (this.makingMaxHeap) {
        if ((Number(this.nodes[l].label) > Number(this.nodes[largest].label))) {
          largest = l;
        }
      }
      else {
        if ((Number(this.nodes[l].label) < Number(this.nodes[largest].label))) {
          largest = l;
        }
      }
    }
    if (r < n) {
      this.colorSet.add(this.nodes[r].id);
      if (this.makingMaxHeap) {
        if ((Number(this.nodes[r].label) > Number(this.nodes[largest].label))) {
          largest = r;
        }
      }
      else {
        if ((Number(this.nodes[r].label) < Number(this.nodes[largest].label))) {
          largest = r;
        }
      }
    }
    if (largest != i) {
      var swap = this.nodes[i].label;
      this.nodes[i].label = this.nodes[largest].label;
      this.nodes[largest].label = swap;
      this.textBoxInput = 'swapped ' + this.nodes[i].label + ' with ' + this.nodes[largest].label;
      this.heapify(n, largest);
    }
  }

  toggleModal(){
    this.modalService.changebinaryModal();
    this.isModalActive = false;
  }

  // #a95963
}
