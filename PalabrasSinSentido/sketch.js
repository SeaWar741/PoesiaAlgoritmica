//https://editor.p5js.org/sladix/sketches/7JU1YNWdv

var canvas;
var isInit = false;
var d_bg = 225;
var d_max = 215;
var d_min = 170;


let palabras = [];
let palabra_num;

let prefijos= [];
let raices= [];
let sufijos= [];

let myFont, myFont_bold;

let y

function preload() {
  prefijos = loadStrings("data/prefijos.txt");
  raices = loadStrings("data/raices.txt");
  sufijos = loadStrings("data/sufijos.txt");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  myFont = textFont('data/CenturySchoolbook-60.vlw', 80); // CenturySchoolbook-60.vlw"
  myFont_bold = textFont('Georgia', 80); // CenturySchoolbook-60.vlw"
  
  y = windowHeight;
  textAlign(CENTER);
  palabra_num = 3;
  let palabras = [palabra_num];
  reset();
  
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
      y = height;
      reset();
    }
  }

}

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