import { Component, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import * as shape from 'd3-shape';
import { Node, Edge, ClusterNode } from '@swimlane/ngx-graph';

@Component({
  selector: 'app-binary',
  templateUrl: './binary.component.html',
  styleUrls: ['./binary.component.css']
})
export class BinaryComponent implements OnInit {

  constructor() { }

  
  center$: Subject<boolean> = new Subject();
  update$: Subject<boolean> = new Subject();
  dragging: boolean;
  panning: boolean;
  layout: string;
  links: Edge[];
  nodes: Node[];
  nodeSetBinary:Set<string>;
  animate: boolean = false;
  makeEdgeVisible:boolean=false;
  textForDropdown: string;
  textBoxMessage: string;
  textBoxInput: string;
  textBoxMenu: boolean = false;
  lineMenu: boolean = false;
  layoutMenu: boolean = false;
  inputFormat: number = 0;
  currForBinary: number = 0;

  ngOnInit(): void {
    this.nodeSetBinary=new Set<string>();
    this.textBoxMessage='Input an Array to Make Its Binary Heap';
    this.dragging = false;
    this.panning = true;
    this.layout = 'dagreCluster';
    console.log('printing from ng on in it');
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

  
  setLayout(layoutName: string): void {
    this.layout = layoutName;
  }
  toggleLayoutMenu() {
    this.layoutMenu = !this.layoutMenu;
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

  selectType(num: number) {
    this.toggleDropdown();
    this.textBoxInput = '';
    this.inputFormat = num;
    if (num == 1) {
      this.textForDropdown = 'Adjacency List';
      this.textBoxMessage = 'use format as \n Node:[Array of adjacent Nodes] \n Node:[Array of adjacent Nodes]\n...';
    }
    
  }

  parseString() {
    this.nodes = [];
    this.links = [];
   
      var items: Node[] = [];
      var edges: Edge[] = [];
      var len: number = this.textBoxInput.length;
      var input: string[] = this.textBoxInput.split('\n');
      var nodeSet = new Set<string>();
      for (let st of input) {
        var list = st.split(':');
        var node = list[0];
        var len = list[1].length;
        var adjList: string[] = list[1].substring(1, len - 1).split(',');
        if (!nodeSet.has(node)) {
          nodeSet.add(node);
          items.push({ id: node, label: node });
        }
        for (let str of adjList) {
          if (!nodeSet.has(str)) {
            nodeSet.add(str);
            items.push({ id: str, label: str });
          }
          edges.push({ id: this.makeid(), source: node, target: str, label: node + str });
        }
      }
      this.links = edges;
      this.nodes = items;
      console.log('printing form adjacency list');

  }
  
  helperBinary() {
    if (this.currForBinary < this.nodes.length) {
      this.nodeSetBinary.add(this.nodes[this.currForBinary++].id);
      console.log(this.nodeSetBinary);
    }
    else if(this.currForBinary==this.nodes.length){
      this.makeEdgeVisible=true;
      this.currForBinary++;
      this.updateGraph();
    }
    else {
      console.log('print');
      console.log(this.nodes);
      this.animate=false;
    var st:string= this.nodes[0].label;
    this.nodes[0].label=this.nodes[1].label;
    this.nodes[1].label=st;
    this.updateGraph();
    console.log(this.nodes);
    }
    
  }

  arrayHelper(nodes: Node[], edges: Edge[], arr: string[], len: number, curr: number, currId: string) {
    var left: number = curr * 2 + 1;
    var right: number = curr * 2 + 2;
    nodes.push({ id: currId, label: arr[curr] });
    if (left < len) {
      var leftId: string = this.makeid();
      edges.push({ id: this.makeid(), source: currId, target: leftId, label: left.toString() });
      this.arrayHelper(nodes, edges, arr, len, left, leftId);
      // setTimeout(()=>{
      //   console.log('delay done for 300');  
      //   this.updateGraph();
      // },1000);
    }
    if (right < len) {
      var rightId: string = this.makeid();
      edges.push({ id: this.makeid(), source: currId, target: rightId, label: left.toString() });
      this.arrayHelper(nodes, edges, arr, len, right, rightId);

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
  
  wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
      end = new Date().getTime();
    }
  }
  clearGraph(){
    this.nodes=[];
    this.textBoxInput='';
    this.links=[];
    this.nodeSetBinary.clear();
  }
}
