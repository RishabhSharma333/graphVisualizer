import { Component, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import { Queue } from 'queue-typescript';
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
  // edgeListMain:Map<string,string>;
  adjListMain: Map<string, string[]>;
  weightedAdjList: Map<string, string[]>;
  links: Edge[];
  nodes: Node[];
  startPathFinding:boolean;
  isDirected: boolean = true;
  animate: boolean = false;
  makeEdgeVisible: boolean = false;
  startNode: string;
  endNode: string;
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
    this.startPathFinding=false;
    this.adjListMain = new Map<string, string[]>();
    this.weightedAdjList = new Map<string, string[]>();
    // this.edgeListMain=new Map<string,string>();
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
  toggleIsGraphDirected() {
    this.isDirected = !this.isDirected;
  }
  clearGraph() {
    this.ngOnInit();
  }


  selectType(num: number) {
    this.toggleDropdown();
    this.textBoxInput = '';
    this.inputFormat = num;
    if(num==1){
      this.textForDropdown = 'Adjacency List';
      this.textBoxMessage = 'use format as \n node:[array of adjacent nodes]\n node:[array of adjacent nodes]  \n ...';
    }
     else if (num == 2) {
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
        var list: string[] = st.split(':');
        var node = list[0];
        var adjlen: number = list[1].length;
        var adjList: string[] = list[1].substring(1, adjlen - 1).split(',');
        this.adjListMain.set(node, adjList);
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
      console.log('printing from 1');
      console.log(this.adjListMain);
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
          // console.log(node,adjNode);
          if (!this.adjListMain.has(node)) {
            var arrp: string[] = [];
            arrp.push(adjNode);
            // console.log(arrp);
            this.adjListMain.set(node, arrp);
            // console.log(this.adjListMain);
          }
          else {
            this.adjListMain.get(node).push(adjNode);

          }
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
      console.log('printing from 2');
      console.log(this.adjListMain);
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
    this.startPathFinding=true;
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


  setStartNode(node: string) {
    this.startNode = node;
  }
  setEndNode(node: string) {
    this.endNode = node;
  }

  isConnected() {

    var q = new Queue<string>();
    var discovered = new Set<string>();
    discovered.add(this.startNode);
    q.enqueue(this.startNode);
    while (q.length != 0) {

      var v = q.dequeue();
      if (v == this.endNode) {
        this.textBoxInput = 'yes path found';
        return true;
      }
      if (this.adjListMain.has(v)) {
        for (let u of this.adjListMain.get(v)) {
          if (!discovered.has(u)) {
            discovered.add(u);
            q.enqueue(u);
          }
        }
      }
      
    }
    this.textBoxInput = 'path not found';
    return false;
  }
}
