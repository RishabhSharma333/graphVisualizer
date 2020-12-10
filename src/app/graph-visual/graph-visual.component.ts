import { Component, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import * as shape from 'd3-shape';
import { Node, Edge, ClusterNode } from '@swimlane/ngx-graph';

@Component({
  selector: 'app-graph-visual',
  templateUrl: './graph-visual.component.html',
  styleUrls: ['./graph-visual.component.css']
})
export class GraphVisualComponent implements OnInit {

  constructor() { }

  center$: Subject<boolean> = new Subject();
  update$: Subject<boolean> = new Subject();
  dragging: boolean;
  panning: boolean;
  layout: string;
  links: Edge[];
  nodes: Node[];
  isDirected:boolean=false;
  animate: boolean = false;
  makeEdgeVisible:boolean=false;
  clusters: ClusterNode[];
  textForDropdown: string;
  textBoxMessage: string;
  textBoxInput: string;
  textBoxMenu: boolean = false;
  lineMenu: boolean = false;
  layoutMenu: boolean = false;
  inputFormat: number = 0;
  ngOnInit(): void {
    this.links = [];
    this.nodes = [];
    this.clusters = [];

    this.textBoxMessage = 'use dropdown to select Input Format Type ';
    this.textForDropdown = 'Select Input Type';

    this.dragging = true;
    this.panning = true;
    this.layout = 'colaForceDirected';
    console.log('printing from graph visuals on in it');
  }


  updateGraph() {
    this.update$.next(true)
  }

  layouts: any[] = [
    {
      label: 'Cola Force Directed',
      value: 'colaForceDirected',
      isClustered: true,
    },
    {
      label: 'D3 Force Directed',
      value: 'd3ForceDirected',
    }
  ];

  interpolationTypes = [
    'Bundle',
    'Linear',
    'Monotone X'
  ];

  curveType: string = 'Bundle';
  curve: any = shape.curveLinear;

  setInterpolationType(curveType) {
    this.curveType = curveType;
    if (curveType === 'Bundle') {
      this.curve = shape.curveBundle.beta(1);
    }

    if (curveType === 'Linear') {
      this.curve = shape.curveLinear;
    }
    if (curveType === 'Monotone X') {
      this.curve = shape.curveMonotoneX;
    }
    
    this.lineMenu = false;
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
  toggleIsGraphDirected(){
    this.isDirected=!this.isDirected;
  }
  

  selectType(num: number) {
    this.toggleDropdown();
    this.textBoxInput = '';
    this.inputFormat = num;
   if (num == 2) {
      this.textForDropdown = 'Edge List';
      this.textBoxMessage = 'use format as \n [Start Node,End Node]\n [Start Node,End Node]  \n ...';
    }
    else if (num == 3) {
      this.textForDropdown = 'Array (Binary Heap)';
      this.textBoxMessage = 'use format as \n normal Array [ ... , ... , ... ]';
    }
    else if (num == 4) {
      this.textForDropdown = 'Weighted Edge List';
      this.textBoxMessage = 'use format as \n  [Start Node, weight,End Node ]\n [Start Node, weight,End Node ]';
    }
  }

  parseString() {
    this.nodes = [];
    this.links = [];
    if (this.inputFormat == 1) {
      var input: string[] = this.textBoxInput.split('\n');
      var nodeSet = new Set<string>();
      for (let st of input) {
        var list:string[] = st.split(':');
        var node = list[0];
        var adjlen:number=list[1].length;
        var adjList: string[] = list[1].substring(1, adjlen-1).split(',');
        if (!nodeSet.has(node)) {
          nodeSet.add(node);
          this.nodes.push({ id: node, label: node });
        }
        for (let str of adjList) {
          if (!nodeSet.has(str)) {
            nodeSet.add(str);
            this.nodes.push({ id: str, label: str });
          }
          this.links.push({ id: this.makeid(), source: node, target: str, label: node + str });
        }
      }
      console.log('printing form adjacency list');
      // console.log(this.nodes);

    }

    else if (this.inputFormat == 2) {
      var items: Node[] = [];
      var edges: Edge[] = [];
      var len: number = this.textBoxInput.length;
      var input: string[] = this.textBoxInput.split('\n');
      var nodeSet = new Set<string>();
      for (let st of input) {
        var len = st.length;
        if (len >= 3) {
          var list = st.substr(1, len - 2).split(',');
          var node = list[0];
          var adjNode = list[1];
          if (!nodeSet.has(node)) {
            nodeSet.add(node);
            items.push({ id: node, label: node });
          }
          if (!nodeSet.has(adjNode)) {
            nodeSet.add(adjNode);
            items.push({ id: adjNode, label: adjNode });
          }
          edges.push({ id: this.makeid(), source: node, target: adjNode, label: node + adjNode });
        }
      }
      this.links = edges;
      this.nodes = items;
    }
    
    else if (this.inputFormat == 4) {
      var items: Node[] = [];
      var edges: Edge[] = [];
      var len: number = this.textBoxInput.length;
      var input: string[] = this.textBoxInput.split('\n');
      var nodeSet = new Set<string>();
      for (let st of input) {
        var len = st.length;
        if (len >= 3) {
          var list = st.substr(1, len - 2).split(',');
          var node = list[0];
          var adjNode = list[2];
          var weigh = list[1];
          if (!nodeSet.has(node)) {
            nodeSet.add(node);
            items.push({ id: node, label: node });
          }
          if (!nodeSet.has(adjNode)) {
            nodeSet.add(adjNode);
            items.push({ id: adjNode, label: adjNode });
          }
          edges.push({ id: node + adjNode, source: node, target: adjNode, label: weigh });
        }
      }
      // console.log(edges);
      this.links = edges;
      this.nodes = items;
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

}
