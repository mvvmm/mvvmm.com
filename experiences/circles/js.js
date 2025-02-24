var time = 0;
var max = 50;
var spawnInterval = 10;
var circles= [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function step(){
  for(i in circles){
    var circle = circles[i];
    circle.radius = circle.radius * 1.05;
  }
  if(time == 0){
    var circle = {
      radius: 10,
      color:  "#" + ((Math.random() * 0xfffff * 1000000).toString(16)).slice(0,6)
    }
    circles.push(circle);
    if(circles.length > 50){
      circles.shift();
    }
  }

  if(time == spawnInterval){
    time = 0;
  }else{
    time += 1;
  }
}

function draw() {
  for(i in circles){
    var circle = circles[i];
    noStroke();
    fill(circle.color);
    ellipse(windowWidth/2, windowHeight/2, circle.radius);
  }
  step();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}