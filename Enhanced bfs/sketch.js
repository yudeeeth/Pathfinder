function setup(){
  //scale to set size
  scl = 10;
  createCanvas(ind(window.innerWidth)*scl,ind(window.innerHeight-30)*scl);

  h = Math.floor(height/scl);
  w = Math.floor(width/scl);
  //holds the graph
  node = new Array(w);
  for(i=0;i<w;i++){
    temp = new Array(h);
    node[i]=temp;
  }
  //make graph empty
  for(i = 0;i<w;i++){
    for(j=0;j<h;j++){
      node[i][j]= new nod();
    }
  }
  //colors
  c = new Array();
  setcolors();
  //handle to select mmode
  handle = 0;
  // ds to be used by pathfinding algos.
  //only holds coords for now
  buffer = new Array();
  //start
  startnode = new v();
  startnode.make(-1,-1);
  endnode = new v();
  //neighbhors
  n = new Array();
  //path to handle drawing path;
  p = new v();
  frameRate(30);
  //mouse functionality
  mousepane = new m();
  //slider
  slide = document.getElementById('myRange');
  scaleslider = document.getElementById('myscl');
}

function draw(){
  //console.log(slide.value);
  background(51);
  val = -2;
  switch(handle){
    case 68 : val = -1; break;
    case 66 : val = 0; break;
    case 67 : setval(1); handle = 80; break;
    case 71 : setval(2); handle = 80; break;
    case 82 : resetblank(); break;
    case 83 : bfs(); break;
    //add more sorts later
    default:;
  }
  if(val!=-2 && ind(mouseX)<w && ind(mouseY)<h && ind(mouseX)>=0 && ind(mouseY)>=0)
    {node[ind(mouseX)][ind(mouseY)].code = val;
    //console.log("deleted",val);
    }
  //debug
  temp = -1;
  if(startnode.x != -1){
    temp = node[startnode.x][startnode.y].code;
    node[startnode.x][startnode.y].code = 1;}
  printgraph();
  if(startnode.x != -1)
  node[startnode.x][startnode.y].code = temp;
}

//setsstartand end nodes
function setval(val){
  x = ind(mouseX);
  y = ind(mouseY);
  
  if(val==1){
    if(startnode.x!=-1){
      node[startnode.x][startnode.y].code=-1;
    }
    startnode.make(x,y);
    //console.log(startnode);
    buffer.push(startnode);
    node[x][y].code=3;
  }
  else{
    if(endnode.x!=-1){
      node[endnode.x][endnode.y].code = -1;
    }
    endnode.make(x,y);
    node[x][y].code=2;
  }
}

//keypress event handler
function keyPressed(){
  if(handle!= 83)
    handle = keyCode;
}

//mouse based functionality
function mouseClicked(){
  if(ind(mouseX)>=0 && ind(mouseX)<w && ind(mouseY)>=0 && ind(mouseY) <h){ 
    //console.log("click detected"); 
    switch(mousepane.val){
      case 0: setval(1); handle = 80; break;
      case 1: setval(2); handle = 80; break;
      default: ;
    }
    mousepane.val = -1;
  }
}

//button handling
function m(){
  this.val = -1;
  this.set = function(val){
    //console.log("mousepane");
    switch(val){
      case 0: handle = 66; break;
      case 1: handle = 80; break;
      case 2: this.val = 0; break;
      case 3: this.val = 1; break;
      case 4: handle = 83; break;
      case -1: handle = 68; break;
      default: ;
    }
  }
}

//rests graph
function resetblank(){
  for(i = 0;i<w;i++){
    for(j=0;j<h;j++){
      node[i][j].code=-1;
      node[i][j].cost=0;
      node[i][j].prev.make(-1,-1);
    }
  }
  while(buffer.length !=0)
    buffer.pop();
  startnode.make(-1,-1);
  endnode.make(-1,-1);
  handle = 80;
}

//helper function to get round to 10
function ind(val){ return Math.floor(val/scl); }

//draw rect
function d(x,y){rect(x*scl,y*scl,scl,scl);}

//set colors
function setcolors(){
  c.push('black');
  c.push('blue');
  c.push('green');
  c.push('purple');
  c.push('red');
}

//frame array
function printgraph(){
  for(i = 0;i<w;i++){
    for(j=0;j<h;j++){
      if(node[i][j].code!=-1){
        fill(c[node[i][j].code]);
        d(i,j);
      }
    }
  }
}

//vector
function v(){
  this.x=-1;
  this.y=-1;
  this.make = function (x,y){
    this.x = x;
    this.y = y;
  }
}

//node
function nod(){
  this.code = -1;
  this.cost = 0;
  this.prev = new v();
  this.prev.x = -1;
  this.prev.y = -1;
}

//bfs
function bfs(){
  for(iterator=0;iterator<slide.value;iterator++){
    if(buffer.length!=0){
      //console.log("bfs"); 
      buff = buffer.shift();
      getneighbhors(buff);
      for(i=1;i<=n[0].x;i++){
        node[n[i].x][n[i].y].cost = node[buff.x][buff.y].cost + 1;
        node[n[i].x][n[i].y].prev.make(buff.x,buff.y);
        node[n[i].x][n[i].y].code = 3;
        buffer.push(n[i]);
        //console.log(n[i]);
        if(n[i].x == endnode.x && n[i].y == endnode.y){
          while(buffer.length !=0){
            buffer.pop();
          }
          p = n[i];
          node[endnode.x][endnode.y].code = 2;
          break;
        }
      }
      while(n.length!=0){
        n.pop();
      }
    }
    else{
      if((p.x == startnode.x && p.y == startnode.y)){
        handle = 80;
      }
      else{
        temp = node[p.x][p.y].prev;
        node[temp.x][temp.y].code=4;
        p=temp;
        
      }
    }
  }
}

//calculate neighbhors
function getneighbhors(buff){
  //debug
  //console.log("neighbhors",buff);
  temp = new v();
  temp.make(0,0);
  n.push(temp);
  if(fit(buff.x+1,buff.y)==1){
    n[0].x++;
    k = new v(); k.make(buff.x+1,buff.y);
    n.push(k);
  }
  if(fit(buff.x,buff.y-1)==1){
    n[0].x++;
    k = new v(); k.make(buff.x,buff.y-1);
    n.push(k);
  }
  if(fit(buff.x-1,buff.y)==1){
    n[0].x++;
    k = new v(); k.make(buff.x-1,buff.y);
    n.push(k);
  }
  if(fit(buff.x,buff.y+1)==1){
    n[0].x++;
    k = new v(); k.make(buff.x,buff.y+1);
    n.push(k);
  }
}

function fit(x,y){
  if(x>=0 && x<w && y>=0 && y<h && node[x][y].code!=0 && node[x][y].code!=3)
    return 1;
  return 0;
  //node[buff.x+1][buff.y].code!=0 && node[buff.x+1][buff.y].code!=3
}

//scale function
function scaler(){
  resetblank();
  scl = scaleslider.value;
  createCanvas(ind(window.innerWidth)*scl,ind(window.innerHeight-30)*scl);

  h = Math.floor(height/scl);
  w = Math.floor(width/scl);
  //holds the graph
  node = new Array(w);
  for(i=0;i<w;i++){
    temp = new Array(h);
    node[i]=temp;
  }
  //make graph empty
  for(i = 0;i<w;i++){
    for(j=0;j<h;j++){
      node[i][j]= new nod();
    }
  }
}