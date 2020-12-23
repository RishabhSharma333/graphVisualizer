import { Component, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import * as shape from 'd3-shape';
import { Node, Edge, ClusterNode } from '@swimlane/ngx-graph';

@Component({
  selector: 'app-recursion',
  templateUrl: './recursion.component.html',
  styleUrls: ['./recursion.component.css']
})
export class RecursionComponent implements OnInit {

  constructor() { }

  center$: Subject<boolean> = new Subject();
  update$: Subject<boolean> = new Subject();
  dragging: boolean;
  panning: boolean;
  progress: number ;
  layout: string;
  links: Edge[];
  nodes: Node[];
  fibonacciSeries: number[] = [];
  nodeSet: Set<string>;
  edgeSet: Set<string>;
  animate: boolean = true;
  makeEdgeVisible: boolean = false;
  doingAlgo: boolean = false;
  textBoxMessage: string;
  textBoxInput: string;
  textBoxMenu: boolean = false;
  lineMenu: boolean = false;
  inputFormat: number = 0;
  options: any[] = [];
  algoType: string;
  fNodeLength:number;
  counting:number;

  ngOnInit(): void {
    this.progress=0;
    this.nodeSet= new Set<string>();
    this.makeEdgeVisible=false;
    this.edgeSet = new Set<string>();
    this.textBoxMessage = 'Select one of the algorithms for illustration';
    this.dragging = false;
    this.textBoxInput = '';
    this.panning = true;
    this.nodes = [];
    this.doingAlgo=false;
    this.links = [];
    this.counting=0;
    this.fibonacciSeries = [0
      , 1
      , 1
      , 2
      , 3
      , 5
      , 8
      , 13
      , 21
      , 34
      , 55
      , 89
      , 144
      , 233
      , 377
      , 610
      , 987
      , 1597
      , 2584
      , 4181
      , 6765
      , 10946
      , 17711
      , 28657
      , 46368
      , 75025
      , 121393
      , 196418
      , 317811
      , 514229];
    //0 to 29
    this.layout = 'dagreCluster';
    this.options = [
      { value: 'Fibonacci', id: 'fibonacci' },
      { value: 'Factorial', id: 'factorial' },
      { value: 'Fast Exponentiaion', id: 'exponentiation' },
      { value: 'Subset Sum', id: 'subsetSum' },
      { value: '0-1 Knapsack', id: 'knapsack' },
      { value: 'Coin Change', id: 'coinChange' }

    ];
    this.algoType = 'fibonacci';
    console.log('printing from recursion');
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
    if (this.algoType == 'fibonacci') {
      this.setInterpolationType('Monotone X');
      var num: number = Number(this.textBoxInput);
      if (num <= 6)
        this.fibonacci(num, this.makeid());
      else if (num > 6 && num < 30) {
        var fibSet: Set<number> = new Set<number>();
        this.fibonacciBig(num, this.makeid(), fibSet);
      }
      else {
        this.textBoxInput = 'use value below 30';
      }
      
    }
    else if (this.algoType == 'factorial') {
      var num: number = Number(this.textBoxInput);
      if (num <= 20)
        this.factorial(num, this.makeid());
      else { this.textBoxInput = 'use value below 20'; }
    }
    else if (this.algoType == 'exponentiation') {
      var inp: string[] = this.textBoxInput.split(',');
      var a = Number(inp[0]);
      var n = Number(inp[1]);
      this.exponentiation(a, n, this.makeid());
    }
    else if (this.algoType == 'subsetSum') {
      var input = this.textBoxInput.split('\n');
      var sum: number = Number(input[0]);
      // var array = input[1].substr(1, input1len - 2);
      // console.log(array);
      var arr: number[] = input[1].substr(1, input[1].length - 2).split(',').map(Number);
      // console.log(arr);
      this.isSubsetSum(arr, arr.length, sum, this.makeid());
    }
    else if (this.algoType == 'knapsack') {
      var input = this.textBoxInput.split('\n');
      var sum: number = Number(input[0]);
      var weights: number[] = input[1].substr(1, input[1].length - 2).split(',').map(Number);
      var values: number[] = input[2].substr(1, input[2].length - 2).split(',').map(Number);
      this.knapsack(sum, weights, values, weights.length, this.makeid());
    }
    else if (this.algoType == 'coinChange') {
      
      var input = this.textBoxInput.split('\n');
      var sum: number = Number(input[0]);
      var arr: number[] = input[1].substr(1, input[1].length - 2).split(',').map(Number);
      this.coinChange(arr,arr.length,sum,this.makeid());
    }

    console.log(this.nodes);
    console.log(this.links);
    this.fNodeLength=this.nodes.length;
    this.doingAlgo=true;
    this.textBoxInput='now use next button to see graphichal dependency';

  }

  fibonacci(num: number, numId: string) {
    this.nodes.push({ id: numId, label: num.toString() });
    if (num == 1 || num == 0) {
      var newId: string = this.makeid();
      this.nodes.push({ id: newId, label: this.fibonacciSeries[num].toString() });
      this.links.push({ id: this.makeid(), source: numId, target: newId, label: ('returns ' + num + '') });
    }
    else {
      var left: string = this.makeid();
      var right: string = this.makeid();
      this.links.push({ id: this.makeid(), source: numId, target: left, label: ('returns ' + this.fibonacciSeries[num - 1]) });
      this.links.push({ id: this.makeid(), source: numId, target: right, label: ('returns ' + this.fibonacciSeries[num - 2]) });
      this.fibonacci(num - 1, left);
      this.fibonacci(num - 2, right);
    }
  }

  fibonacciBig(num: number, numId: string, fiboSet: Set<number>) {
    if (num == 1 || num == 0) {
      this.nodes.push({ id: numId, label: num.toString() });
    }

    else {
      if (fiboSet.has(num)) {
        this.nodes.push({ id: numId, label: num.toString() });
      }
      else {
        var left: string = this.makeid();
        var right: string = this.makeid();
        this.nodes.push({ id: numId, label: num.toString() });
        this.links.push({ id: this.makeid(), source: numId, target: left, label: ('returns ' + this.fibonacciSeries[num - 1]) });
        this.links.push({ id: this.makeid(), source: numId, target: right, label: ('returns ' + this.fibonacciSeries[num - 2]) });
        this.fibonacciBig(num - 1, left, fiboSet);
        this.fibonacciBig(num - 2, right, fiboSet);
        fiboSet.add(num);
      }
    }
  }

  factorial(num: number, numId: string) {

    if (num > 1) {
      this.nodes.push({ id: numId, label: num.toString() });
      var left = this.makeid();
      var value = this.factorial(num - 1, left);
      this.links.push({ id: this.makeid(), source: left, target: numId, label: ('returns ' + value) });
      return value * num;
    }
    else {
      this.nodes.push({ id: numId, label: num.toString() });
      return 1;
    }

  }

  coinChange(arr: number[], n: number, sum: number, numid: string) {
    if (sum == 0) {
      this.nodes.push({ id: numid, label: 'got 1' });
      return 1;

    }
    else if (sum < 0) {
      this.nodes.push({ id: numid, label: 'got 0 ' });

      return 0;
    }
    if (n <= 0 && sum >= 1) {

      this.nodes.push({ id: numid, label: 'got 0' });
      return 0;
    }
    else {
      
      var left = this.makeid();
      var right = this.makeid();
      var leftval: number = this.coinChange(arr, n - 1, sum, left);
      var rightval: number = this.coinChange(arr, n, sum - arr[n - 1], right);
      this.links.push({ id: this.makeid(), source: numid, target: left, label: 'got ' + leftval });
      this.links.push({ id: this.makeid(), source: numid, target: right, label: 'got ' + rightval });
      this.nodes.push({id:numid,label:'('+n+' , '+sum+') - '+(leftval+rightval)});
      return leftval + rightval;
    }
  }

  knapsack(W: number, wt: number[], val: number[], n: number, numid: string) {

    if (n == 0 || W == 0) {
      this.nodes.push({ id: numid, label: 'got 0' });
      return 0;
    }

    else if (wt[n - 1] > W) {
      var left = this.makeid();
      var ret = this.knapsack(W, wt, val, n - 1, left);
      this.nodes.push({ id: numid, label:'('+ W + ' , ' + (n - 1)+')-'+ret });
      return ret;
    }
    else {
      var left = this.makeid();
      var right = this.makeid();
      var leftval: number = val[n-1]+this.knapsack(W - wt[n - 1], wt, val, n - 1, left);
      var rightval: number = this.knapsack(W, wt, val, n - 1, right);
      this.links.push({ id: this.makeid(), source: numid, target: left, label: 'got ' + leftval });
      this.links.push({ id: this.makeid(), source: numid, target: right, label: 'got ' + rightval });
      var answer:number=Math.max(leftval, rightval);
      this.nodes.push({ id: numid, label: '('+ W + ' , ' + (n - 1)+')-'+answer});

      return answer;
    }

  }

  exponentiation(below: number, up: number, id: string) {
    if (below == 1 || up == 0) {
      this.nodes.push({ id: id, label: (1).toString() });
      return 1;
    }
    else {
      if (up % 2 == 0) {

        var left = this.makeid();
        var value = this.exponentiation(below, up / 2, left);
        var ret = value * value;
        this.nodes.push({ id: id, label: ('(' + (below) + ' , ' + (up) + ') - ' + (ret).toString()) });
        this.links.push({ id: this.makeid(), source: id, target: left, label: ('got ' + ret) });

        return ret;
      }
      else {

        var right = this.makeid();
        var value = this.exponentiation(below, Math.floor(up / 2), right);
        var rett = value * value * below;
        this.nodes.push({ id: id, label: ('(' + below + ' , ' + up + ') - ' + (rett).toString()) });
        this.links.push({ id: this.makeid(), source: id, target: right, label: ('got ' + value * value) });
        return rett;
      }
    }
  }

  isSubsetSum(arr: number[], n: number, sum: number, numId: string) {
    if (sum == 0) {
      this.nodes.push({ id: numId, label: n + ' , ' + sum + 'returns true' });
      return true;
    }
    else if (n == 0) {
      this.nodes.push({ id: numId, label: n + ' , ' + sum + 'returns false' });
      return false;
    }

    else if (arr[n - 1] > sum) {
      this.nodes.push({ id: numId, label: n + ' , ' + sum });
      var left: string = this.makeid();
      var rett = this.isSubsetSum(arr, n - 1, sum, left);
      this.links.push({ id: this.makeid(), source: numId, target: left, label: 'got ' + rett });
      return rett;
    }

    else {
      this.nodes.push({ id: numId, label: n + ' , ' + sum });
      var left: string = this.makeid();
      var right: string = this.makeid();
      var leftans = this.isSubsetSum(arr, n - 1, sum, left);
      var rightans = this.isSubsetSum(arr, n - 1, sum - arr[n - 1], right);
      this.links.push({ id: this.makeid(), source: numId, target: left, label: 'got ' + leftans });
      this.links.push({ id: this.makeid(), source: numId, target: right, label: 'got ' + rightans });
      return leftans || rightans;
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

  renderSegments(){
    if(this.counting<this.nodes.length){
      this.nodeSet.add(this.nodes[this.counting++].id);
      this.progress=this.counting/this.nodes.length*100;               
   }
   else if(this.counting>0&&this.counting==this.nodes.length){
     this.makeEdgeVisible=true;
     this.updateGraph();
   }
  }

  setAlgoType(id: string) {
    this.algoType = id;
    if(id=='fibonacci'){
      this.textBoxMessage='write number to find fibonacci , for numbers above 6 memoization will be applied';
    }
    else if(id=='factorial'){
      this.textBoxMessage='write number to find factorial ';

    }
    else if(id=='exponentiation'){
      this.textBoxMessage='write base,exponent to find base to the power exponent ';

    }
    else if(id=='knapsack'){
      this.textBoxMessage='write maximum limit of weight \n write  weights array with in braces \n write values array within braces';

    }
   else  if(id=='coinChange'){
      this.textBoxMessage='write sum \n write  coins array within braces ';

    }
    else if(id=='subsetSum'){
    this.textBoxMessage='write sum \n write  values array within braces ';
    }
  }

  clearGraph(){
    this.ngOnInit();
  }
  
}
