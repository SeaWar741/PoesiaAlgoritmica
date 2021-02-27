//https://editor.p5js.org/sladix/sketches/7JU1YNWdv

//Canvas
var canvas;
var isInit = false;
var d_bg = 225;
var d_max = 215;
var d_min = 170;
let y;

//Palabras
let palabras = [];
let palabra_num;
let prefijos= [];
let raices= [];
let sufijos= [];

//Fonts
let myFont, myFont_bold;

//Arboles
if (!Array.prototype.last) {
  Array.prototype.last = function() {
    return this[this.length - 1];
  };
};

function preload() {
  prefijos = loadStrings("data/prefijos.txt");
  raices = loadStrings("data/raices.txt");
  sufijos = loadStrings("data/sufijos.txt");
}

let conf, MIN_TO_BRANCH;
const sketchName = 'Bonsai';

let weight = 0.02

const getPrimes = (min, max) => {
  const result = Array(max + 1)
    .fill(0)
    .map((_, i) => i);
  for (let i = 2; i <= Math.sqrt(max + 1); i++) {
    for (let j = i ** 2; j < max + 1; j += i) delete result[j];
  }
  return Object.values(result.slice(min));
};

const getRandNum = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getRandPrime = (min, max) => {
  const primes = getPrimes(min, max);
  return primes[getRandNum(0, primes.length - 1)];
};

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

const Config = function(name) {
  this.name = name;
  this.seed = getRandPrime(0, 100);
  this.ENERGY_DECAY = 0.91;
  this.baseEnergy = 20;
  this.ns = 0.1;
  this.growingSpeed = 2;
  this.numPass = 15;
  this.generate = () => {
    compute();
  }
  this.grow = () => bonzgrow();
  this.export = () => {
    drawingContext.__clearCanvas();
    drawThing();
    save(`${this.name}_${this.seed}.svg`);
    print("saved svg");
  };
}

let bonsai;


//SETUP

function setup() {
  conf = new Config(sketchName);

  createCanvas(windowWidth, windowHeight);
  
  myFont = textFont('data/CenturySchoolbook-60.vlw', 80); // CenturySchoolbook-60.vlw"
  myFont_bold = textFont('Georgia', 80); // CenturySchoolbook-60.vlw"
  
  y = windowHeight;
  textAlign(CENTER);
  palabra_num = 3;
  let palabras = [palabra_num];
  reset();

  //Arboles
  strokeWeight(weight); // do 0.1 for laser
  stroke(0); // red is good for laser
  noFill(); // better not to have a fill for laser
  rectMode(CENTER);
  /*Compute*/
  compute();
  
}


//ARBOLES
function saveShiet() {
  drawThing();
}

function compute() {
  noiseSeed(++conf.seed);
  randomSeed(++conf.seed);
  
  bonsai = new Bonsai(createVector(getRandomArbitrary(0,width), getRandomArbitrary(-10,height)), conf.baseEnergy);
  MIN_TO_BRANCH = conf.baseEnergy / 8;
  bonsai.init();
}


function draw() {
  
  if (!isInit){
    background(d_bg);
    fill(d_min);
    text("El origen de las palabras", width/2, height/2 - textSize());
    text("click at will.", width/2, height/2 + 0.75 * textSize());
    
    noLoop();
    return;
  }
  
  
  textAlign(LEFT);
  background(253);

  //let offset = 70;
  let leading = 130;
  //let y = height-leading*palabras.length+10;
  let tSize = 100;
  textLeading(leading);
  
  fill(0);
  
  for (let i = 0; i < palabra_num; i++) {
    let palabra_l = palabras[i].split(" ");
    let p = palabra_l[0];
    let r = palabra_l[1];
    let s = palabra_l[2];
    let x = 70;
    
    if (i == 0) {
        textFont(myFont_bold, tSize);
        text(p+"·", x, y);
        
        x += textWidth(p+"·");
        textFont(myFont, tSize);
        text(r, x, y);
        
        x += textWidth(r);
        textFont(myFont_bold, tSize);
        text("·" + s, x, y);
    } else {
        textFont(myFont, tSize);
        text(p+"·", x, y+(leading*i));
        
        x += textWidth(p+"·");
        textFont(myFont_bold, tSize);
        text(r, x, y+(leading*i));
        
        x += textWidth(r);
        textFont(myFont, tSize);
        text("·" + s, x, y+(leading*i));
    }
    
    
    //y += leading;
    // reset al fondos
    y = y - 0.6;
    if (y < -(leading*palabra_num)) {
      
      //Arbol
      drawBonzai();

      y = height;
      
      reset();
    }
  }
}

//Arbol
function drawBonzai() {
  
  if(bonsai.growing){
    bonsai.grow();  
  }
  bonsai.draw();
}

function bonzgrow(){
  if(bonsai.growing){
    bonsai.grow();  
  }
}

class Bonsai {
  constructor(_pos, size) {
    this.pos = _pos.copy();
    this.branches = [];
    this.activeBranch = [];
    this.growing = true;
    this.size = size;
  }

  init() {
    this.branches.length = 0;
    this.branches.push(new Branch(this.pos, createVector(0, -1), this.size));
    this.activeBranch = [...this.branches];
  }

  grow() {
    this.newBranches = this.activeBranch.map(b => b.grow()).reduce((acc, curr) => acc.concat(curr), []);
    this.branches.push(...this.newBranches);
    this.activeBranch = this.activeBranch.filter(b => b.growing).concat(this.newBranches);
    if(this.activeBranch.length == 0){
      print("done");
      this.growing = false;
    }

  }

  draw() {
    this.branches.forEach(c => c.draw());
  }
}

class Branch {
  constructor(_origin, _acceleration, _energy) {
    this.energy = _energy;
    this.baseEnergy = _energy; // initial and display Value 
    this.leaves = [];
    this.acceleration = _acceleration.copy();
    this.velocity = createVector();
    this.nodes = [_origin.copy()];
    this.growing = true;
    this.spread = PI/5;
    this.width = map(this.baseEnergy,1,300,1,30);
  }
  
  divide(){
      if (this.baseEnergy > 5) {
        const numBranches = floor(random(2,5));
        const branches = [];
        const step = this.spread / numBranches;
        let energy = 0;
        for (let i = 1; i <= numBranches;i++){
          let ne = random(this.baseEnergy);
          let a = map(i, 1, numBranches, -this.spread, this.spread);
          branches.push(new Branch(this.nodes.last(), this.velocity.copy().rotate(a), ne));
          energy += ne;
          if(energy >= this.baseEnergy){
            break;
          }
        }
        return branches;
      }
      return [];
  }

  grow() {
    if(random() < 0.5 && this.energy > conf.MIN_TO_BRANCH){
      this.energy/= 2;
      return this.divide();
    }
    this.energy *= conf.ENERGY_DECAY;

    if (this.energy <= 1) {
      this.growing = false;
      //this.growLeaves();
      return this.divide();
    }

    const np = this.nodes.last().copy();
    const acc = this.acceleration.copy();
    //acc.add(createVector(cos(np.y*conf.ns),0));
    acc.add(createVector(0,-0.5));
    this.velocity.add(acc);
    this.velocity.limit(conf.growingSpeed);
    np.add(this.velocity);
    this.nodes.push(np);
    return [];
  }
  
  growLeaves(){
    if(this.baseEnergy > 2 && this.baseEnergy < 10){
      const r = random([-1,1]);
      const v = createVector(0,-1).setMag(10);
      const l = this.nodes.length;
      for(let i = 0; i < l ; i+=2){
        this.leaves.push({
          start: this.nodes[i],
          end: p5.Vector.add(this.nodes[i], v)

        });
      }
    }
  }

  draw() {
    beginShape();
    for (let i = 0; i < this.nodes.length; i++) {
      let o = this.nodes[i];
      vertex(o.x, o.y);

      strokeWeight(weight+(i*0.0001));
      
    }
    endShape();
    
    //bands
    let phase = 0.1;
    for (let j = 0; j < conf.numPass; j++) {
      beginShape();
      for (let i = 0; i < this.nodes.length; i++) {
        let o = this.nodes[i];
        vertex(o.x+cos(i+phase)*this.width*map(i,0,this.nodes.length,1,0.5), o.y);

        

      }
      endShape();
      phase+=TAU/conf.numPass;
    }
    this.leaves.forEach(l => {
      line(l.start.x, l.start.y, l.end.x, l.end.y);
    });
  }
}


//EXTRAS

function reset() {
  for (let i = 0; i < palabra_num; i++) {
    palabras[i] = getpalabra();
  }
}

function getpalabra() {
  let pre = prefijos[floor(random(prefijos.length))];
  let roo = raices[floor(random(raices.length))];
  let suf = sufijos[floor(random(sufijos.length))];
  return pre + " " + roo + " " + suf;
}

function mousePressed() {
  reset();
  if(!isInit){
    background(d_bg);
    isInit = true;
    loop();
  }
  
}

function keyPressed() {
  if (key == ' ') {
    saveFrame("palabra_sin_sentido.png");
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  trees = [];
  isInit = false;
}