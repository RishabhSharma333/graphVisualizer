import { Component, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import * as shape from 'd3-shape';
import { Queue } from 'queue-typescript';
import { Node, Edge, ClusterNode } from '@swimlane/ngx-graph';
import { sequence } from '@angular/animations';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-graph-algos',
  templateUrl: './graph-algos.component.html',
  styleUrls: ['./graph-algos.component.css']
})
export class GraphAlgosComponent implements OnInit {

  constructor(private modalService:ModalService) { }

  center$: Subject<boolean> = new Subject();
  update$: Subject<boolean> = new Subject();
  dragging: boolean;
  panning: boolean;
  progress: number;
  textForAlgo: string;
  layout: string;
  adjListMain: Map<string, string[]>;
  weightedAdjList: Map<string, string[]>;
  links: Edge[];
  nodes: Node[];
  algoType: string;
  startAlgo: boolean;
  isDirected: boolean = true;
  animate: boolean = false;
  makeEdgeVisible: boolean = false;
  startNode: string;
  endNode: string;
  clusters: ClusterNode[];
  textForDropdown: string;
  textBoxMessage: string;
  textBoxInput: string;
  algoMenu: boolean;
  doingAlgo: boolean;
  dfsColor: Set<String>;
  textBoxMenu: boolean = false;
  varforDfs: number;
  lineMenu: boolean = false;
  layoutMenu: boolean = false;
  inputFormat: number = 0;
  sequenceDfsAdded: string[] = [];
  isModalActive:boolean;
  dfsSet: Set<string>;
  ngOnInit(): void {
    this.links = [];
    this.varforDfs = 0;
    this.textForAlgo = 'Select Algo Type';
    this.nodes = [];
    this.clusters = [];
    this.startNode = '';
    this.endNode = '';
    this.dfsSet = new Set<string>();
    this.progress = 0;
    this.textBoxInput = '';
    this.algoMenu = false;
    if(!this.modalService.graphAlgoModal){
      this.isModalActive=true;
    }
    this.algoType = '';
    this.dfsColor = new Set<string>();
    this.startAlgo = false;
    this.doingAlgo = false;
    this.adjListMain = new Map<string, string[]>();
    this.weightedAdjList = new Map<string, string[]>();
    // this.edgeListMain=new Map<string,string>();
    this.textBoxMessage = 'use dropdown to select Input Format Type ';
    this.textForDropdown = 'Select Input Type';
    this.selectType(1);
    this.dragging = true;
    this.sequenceDfsAdded = [];
    this.panning = true;
    this.layout = 'colaForceDirected';
    // console.log('printing from graph algos on in it');
  }

  toggleAlgoDropdown() {
    this.algoMenu != this.algoMenu;
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
  selectAlgo(num: number) {
    if (num == 1) {
      this.algoType = 'dfs';
      this.textForAlgo = 'Depth First Traversal';
      // console.log('clicked');
    }
    else if (num == 2) {
      this.algoType = 'bfs';
      this.textForAlgo = 'Breadth First Traversal';
    }
    this.startAlgo = true;
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
    // if(this.modalService.graphAlgoModal){
    //    this.toggleDropdown();
    // }
    this.textBoxInput = '';
    this.inputFormat = num;
    if (num == 1) {
      this.textForDropdown = 'Adjacency List';
      this.textBoxMessage = 'use format as \n node:[array of adjacent nodes]\n node:[array of adjacent nodes]  \n ...';
    }
    else if (num == 2) {
      this.textForDropdown = 'Edge List';
      this.textBoxMessage = 'use format as \n [Start Node,End Node]\n [Start Node,End Node]  \n ...';
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
      // console.log('printing form adjacency list');
      // console.log('printing from 1');
      // console.log(this.adjListMain);
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
      // console.log('printing from 2');
      // console.log(this.adjListMain);

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
    // this.startPathFinding = true;
    this.doingAlgo = true;
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

  makeAlgoDone() {
    this.inputFormat = 0;
    if (this.algoType == 'dfs') {
      if (this.varforDfs == 0) {
        this.startDfs();
        this.progress++;
        this.dfsColor.add(this.sequenceDfsAdded[this.varforDfs++]);

      }
      else if (this.varforDfs < this.sequenceDfsAdded.length) {
        this.dfsColor.add(this.sequenceDfsAdded[this.varforDfs++]);
        this.progress = this.dfsColor.size / this.sequenceDfsAdded.length * 100;
      }
    }
    else if(this.algoType=='bfs'){
      if (this.varforDfs == 0) {
        this.bfsImpl();
        this.progress++;
        this.dfsColor.add(this.sequenceDfsAdded[this.varforDfs++]);

      }
      else if (this.varforDfs < this.sequenceDfsAdded.length) {
        this.dfsColor.add(this.sequenceDfsAdded[this.varforDfs++]);
        this.progress = this.dfsColor.size / this.sequenceDfsAdded.length * 100;
      }
    }
  }

  startDfs() {
    this.sequenceDfsAdded=[];
    this.dfsSet.clear();
    var startNodeFound: boolean = false;
    for (let node of this.nodes) {
      if (node.label == this.startNode) {
        startNodeFound = true;
      }
    }
    if (startNodeFound) {
      // this.dfsSet.clear();
      // console.log(this.startNode);
      this.dfsImpl(this.startNode);
      // console.log(this.sequenceDfsAdded);
    }
    else {
      if (!startNodeFound)
        this.textBoxInput = 'Start Node not present';
    }
  }
  clearPath() {
    this.sequenceDfsAdded = [];
    this.dfsColor.clear();
    this.startNode = '';
    this.progress = 0;
    this.varforDfs = 0;
  }

  dfsImpl(nodeh: string) {
    if (!this.dfsSet.has(nodeh)) {
      this.dfsSet.add(nodeh);
      this.sequenceDfsAdded.push(nodeh);
    }

    for (let k of this.adjListMain.get(nodeh)) {
      if (!this.dfsSet.has(k)) {
        this.dfsSet.add(k);
        this.sequenceDfsAdded.push(k);
        if (this.adjListMain.has(k)) {
        this.dfsImpl(k);
       }
      }
      
    }

  }

  // void DFSUtil(int v, boolean visited[])
  //   {
  //       // Mark the current node as visited and print it
  //       visited[v] = true;
  //       System.out.print(v + " ");
 
  //       // Recur for all the vertices adjacent to this
  //       // vertex
  //       Iterator<Integer> i = adj[v].listIterator();
  //       while (i.hasNext()) 
  //       {
  //           int n = i.next();
  //           if (!visited[n])
  //               DFSUtil(n, visited);
  //       }
  //   }

  bfsImpl() {
    var startNodeFound: boolean = false;
    for (let node of this.nodes) {
      if (node.label == this.startNode) {
        startNodeFound = true;
      }

    }

    if (startNodeFound) {
      var q = new Queue<string>();
      var discovered = new Set<string>();
      discovered.add(this.startNode);
      this.sequenceDfsAdded.push(this.startNode);
      q.enqueue(this.startNode);
      while (q.length != 0) {
        var v = q.dequeue();
        if (this.adjListMain.has(v)) {
          for (let u of this.adjListMain.get(v)) {
            // console.log(u);
            if (!discovered.has(u)) {
              discovered.add(u);
              this.sequenceDfsAdded.push(u);
              q.enqueue(u);
            }
          }
        }

      }
      // console.log(this.sequenceDfsAdded);
    }

    else {
      if (!startNodeFound)
        this.textBoxInput = 'Start Node not present';
    }
  }

  toggleModal(){
    this.modalService.changegraphAlgoModal();
    this.isModalActive = false;
  }


}
