var trees = [];
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
var pg;

//Fonts
let myFont, myFont_bold;

//Sound
let mySound;

function wait(ms){
  var start = new Date().getTime();
  var end = start;
  while(end < start + ms) {
    end = new Date().getTime();
 }
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function preload() {
  prefijos = loadStrings("data/prefijos.txt");
  raices = loadStrings("data/raices.txt");
  sufijos = loadStrings("data/sufijos.txt");
}

function setup() {
  var x = document.getElementById("myAudio"); 
  x.play()
  canvas = createCanvas(windowWidth, windowHeight);
  noStroke();
  ellipseMode(CENTER);
  if(displayDensity() >= 2 && width < 600)
     textSize(16);
  else textSize(36);
  textAlign(CENTER);
  textFont("Palatino");
  pixelDensity(displayDensity());

  pg = createGraphics(width/2, windowHeight);

  myFont = textFont('data/CenturySchoolbook-60.vlw', 80); // CenturySchoolbook-60.vlw"
  myFont_bold = textFont('Georgia', 80); // CenturySchoolbook-60.vlw"

  soundFormats('mp3', 'ogg');
  mySound = loadSound('Arrival');

  palabra_num = 3;
  let palabras = [palabra_num];
  reset();

}

function draw() {
  if (!isInit){
      background(d_bg);
      fill(d_min);
      text("El origen de las palabras", width/2, height/2 - textSize());
      text("Click para iniciar ➜", width/2, height/2 + 0.75 * textSize());
      noLoop();
      return;
  }


  var j;
  for (j = 0; j < trees.length; j++) {
    trees[j].render();
    trees[j].update();
    if(trees[j].isDead)
      trees.splice(j--, 1);
  }
  
  pg.fill(0)

  pg.textAlign(LEFT);
  
  let offset = 70;
  let leading = 130;
  let y = (height/2)-100;
  let tSize = 100;
  pg.textLeading(leading);

  pg.fill(0);

  pg.textSize(48)

  for (let i = 0; i < palabra_num; i++) {
    let palabra_l = palabras[i].split(" ");
    let p = palabra_l[0];
    let r = palabra_l[1];
    let s = palabra_l[2];
    let x = offset;

    if (i % 2 == 1) {
      pg.textFont(myFont_bold, tSize);
      pg.text(p + "·", x, y);

      x += textWidth(p + "·");
      pg.textFont(myFont, tSize);
      pg.text(r, x, y);

      x += textWidth(r);
      pg.textFont(myFont_bold, tSize);
      pg.text("·" + s, x, y);
    } else {
      pg.textFont(myFont, tSize);
      pg.text(p + "·", x, y);

      x += textWidth(p + "·");
      pg.textFont(myFont_bold, tSize);
      pg.text(r, x, y);

      x += textWidth(r);
      pg.textFont(myFont, tSize);
      pg.text("·" + s, x, y);
    }
    y += leading;
  }
  
  
  image(pg, 0, 0);  
}

function reset() {
  //bonsai = new Bonsai(createVector(getRandomArbitrary(0,width), getRandomArbitrary(-10,height-20)), conf.baseEnergy)
  //compute();
  //drawBonzai();
  for (let i = 0; i < palabra_num; i++) {
    palabras[i] = getpalabra();
  }
  console.log(palabras)
  if (!isInit){
    background(d_bg);
    fill(d_min);
    text("El origen de las palabras", width/2, height/2 - textSize());
    text("Click para iniciar ➜", width/2, height/2 + 0.75 * textSize());
    noLoop();
    return;
  }
  generateTree()
  pg.background(250)
}

function mousePressed() {
  if(!isInit){
    background(d_bg);
    isInit = true;
    loop();
  }
  reset()
}

function getpalabra() {
  let pre = prefijos[floor(random(prefijos.length))];
  let roo = raices[floor(random(raices.length))];
  let suf = sufijos[floor(random(sufijos.length))];
  return pre + " " + roo + " " + suf;
}



function generateTree(){
  if(!isInit){
    background(d_bg);
    isInit = true;
    loop();
  }
  var l = createVector(getRandomArbitrary(width/2,width), getRandomArbitrary(-10,height-20));
  var v = createVector(0, -1);
  var r = (4 + 10 * mouseY / height);
  if(displayDensity() >= 2 && width < 600)
    r /= displayDensity();
  var root = new Tree(l, v, r, r, 1, 0, d_max - (d_max - d_min) * mouseY / height, 0);
  trees.push(root);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  trees = [];
  isInit = false;
}