import { Component, OnInit } from '@angular/core';
import { from, Subject } from 'rxjs';
import { Node, Edge, ClusterNode } from '@swimlane/ngx-graph';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'visualizer';
  center$: Subject<boolean> = new Subject();
  update$: Subject<boolean> = new Subject();
  dragging: boolean;
  panning: boolean;
  layout: string;
  links: Edge[];
  nodes: Node[];
  clusters: ClusterNode[];
  textForDropdown: string;
  textBoxMessage: string;
  textBoxInput: string;
  textBoxMenu: boolean = false;
  inputFormat: number = 0;
  ngOnInit() {
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

    this.textBoxMessage = 'use dropdown to select Input Format Type ';
    this.textForDropdown = 'Select Input Type';

    this.dragging = true;
    this.panning = true;
    this.layout = 'dagre';
    console.log('printing from ng on in it');
    // console.log(this.links);
    // console.log(this.nodes);
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

  updateGraph() {
    this.update$.next(true)
  }

  selectType(num: number) {
    this.toggleDropdown();
    this.textBoxInput = '';
    this.inputFormat = num;
    if (num == 1) {
      this.textForDropdown = 'Adjacency List';
      this.textBoxMessage = 'use format as \n Node:[Array of adjacent Nodes] \n Node:[Array of adjacent Nodes]\n...';
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

      this.textBoxMessage = 'use format as \n array of [Start Node, weight,End Node ]\n [Start Node, weight,End Node ]';
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
      // console.log(this.links);
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
      // console.log(edges);
      // console.log(items);
      this.links = edges;
      this.nodes = items;
    }

    else if (this.inputFormat == 3) {
      var edges: Edge[]=[];
      var helperNodes:any[]=[];
      
      var len: number = this.textBoxInput.length;
      if (len > 2) {
        var input: string[] = this.textBoxInput.substr(1, len - 2).split(',');
        for (let inp of input) {
          helperNodes.push({ id:this.makeid(), label: inp });
        }

        this.arrayHelper(helperNodes, edges, helperNodes.length, 0);
        // console.log(edges);
        this.links = edges;
        for(let hel of helperNodes){
          this.nodes.push({id:hel.id,label:hel.label});
        }
        // console.log(this.nodes);
      }


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
          edges.push({ id: node+adjNode, source: node, target: adjNode, label: weigh });
        }
      }
      // console.log(edges);
      this.links = edges;
      this.nodes = items;
    }

  }

  arrayHelper(arr:any[], edges: Edge[], len: number, curr: number) {
    var left: number = curr * 2 + 1;
    var right: number = curr * 2 + 2;
    if (left < len) {
      edges.push({ id: arr[curr].id+arr[left].id, source: arr[curr].id, target: arr[left].id, label: left.toString() });
      this.arrayHelper(arr, edges, len, left);
    }
    if (right < len) {
      edges.push({ id: arr[curr].id+arr[right].id, source: arr[curr].id, target: arr[right].id, label: right.toString() });
      this.arrayHelper(arr, edges, len, right);
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

}
