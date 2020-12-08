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
  nodeSetBinary;
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
  currForBinary: number = 0;
  ngOnInit(): void {
    this.links = [
      {
        id: 'a',
        source: '1',
        target: '2',
        label: 'custom Label'
      },
      {
        id: 'b',
        source: '1',
        target: '3',
        label: 'custom Label'
      },
      {
        id: 'c',
        source: '3',
        target: '4',
        label: 'custom Label'
      },
      {
        id: 'd',
        source: '3',
        target: '5',
        label: 'custom Label'
      },
      {
        id: 'e',
        source: '4',
        target: '5',
        label: 'custom Label'
      },
      {
        id: 'f',
        source: '2',
        target: '6',
        label: 'custom Label'
      }
    ];

    this.nodes = [
      {
        id: '1',
        label: 'Node A'
      },
      {
        id: '2',
        label: 'Node B'
      },
      {
        id: '3',
        label: 'Node C'
      },
      {
        id: '4',
        label: 'Node D'
      },
      {
        id: '5',
        label: 'Node E'
      },
      {
        id: '6',
        label: 'Node F'
      }
    ];

    this.clusters = [
      {
        id: 'third',
        label: 'Cluster node',
        childNodeIds: ['2', '3', '4']
      },
      {
        id: 'one',
        label: 'Cluster node',
        childNodeIds: ['5', '6']
      }
    ];

    this.textBoxMessage = 'use dropdown to select Input Format Type ';
    this.textForDropdown = 'Select Input Type';
    this.nodeSetBinary=new Set<string>();

    this.dragging = true;
    this.panning = true;
    this.layout = 'dagreCluster';
    console.log('printing from ng on in it');
  }


  updateGraph() {
    this.update$.next(true)
  }

  layouts: any[] = [

    {
      label: 'Dagre Cluster',
      value: 'dagreCluster',
      isClustered: true,
    },
    {
      label: 'Cola Force Directed',
      value: 'colaForceDirected',
      isClustered: true,
    },
    {
      label: 'D3 Force Directed',
      value: 'd3ForceDirected',
    },
  ];

  interpolationTypes = [
    'Bundle',
    'Linear',
    'Monotone X',
    'Monotone Y',
    'Step',
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
    if (curveType === 'Monotone Y') {
      this.curve = shape.curveMonotoneY;
    }

    if (curveType === 'Step') {
      this.curve = shape.curveStep;
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

  // updateGraph() {
  //   this.update$.next(true)
  // }

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

    else if (this.inputFormat == 3) {
      this.toggleDragging();
      this.clusters = [];
      this.animate = true;
      var edges: Edge[] = [];
      var len: number = this.textBoxInput.length;
      if (len > 2) {
        var input: string[] = this.textBoxInput.substr(1, len - 2).split(',');
        this.arrayHelper(this.nodes, this.links, input, input.length, 0, this.makeid());
      }
      console.log(this.nodes);
      console.log(this.links);

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

}
