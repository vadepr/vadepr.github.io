var w = 2000;
var h = 2000;

function preload(){

    table = loadTable("data/database-well-being-of-students-in-Nice.csv","csv","header");
}

function setup() {
  // put setup code here

  //cnv = createCanvas(w,h);
  cnv = createCanvas(windowWidth,windowHeight);
  background(210);
  // rand = Math.round(Math.random() * 500)
  
  datarows = table.getColumn('Field of study');
  
  //get unique elements of the list
  fieldStudies = [...new Set(datarows)];
  
  //get number of each study field
  numOfEachField = getNumOfEachUniqueElement(datarows);
  
  console.log(numOfEachField);
  
  colors = ['red', 'green', 'purple', 'navy', 'brown', 'blue'];

  // This stops the draw() function to be always executing
  noLoop();
}

/*function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}*/

function draw(x,y,size) {
  // put drawing code here
  for (let i = 0; i<fieldStudies.length; i++){
    
    console.log(numOfEachField[fieldStudies[i]]);
    
    let y = num = numOfEachField[fieldStudies[i]];
    
    //let x = (i*300)+350
    let x = i*300 + 150;
    
    y = ((h - y)/2) - 150;
    
    drawPoint(x, y, 1, 1, 'black', 8);
    
    let nPoint = 0;
    let radius = 0;
    
    // test = round(num * 0.01)
    while (num>0) {
      console.log('Num: ', num);
      console.log('Radius: ', radius);
      if ( nPoint + 10 < num){
        nPoint += 10
        radius = nPoint + 10;
        drawPoint(x, y, radius, nPoint, colors[i], 3);
        num -= nPoint;
        console.log(num)
        
      } else {
        drawPoint(x, y, radius +10, num, colors[i], 3);
        break;
      }
    } 
    
  }
}

function drawPoint(x0, y0, r, items, color, weight){
  
  for(var i = 0; i < items; i++) {
    
      var x = x0 + r * Math.cos(2 * Math.PI * i / items);
      var y = y0 + r * Math.sin(2 * Math.PI * i / items);   
      stroke(color); // Change the color
      strokeWeight(weight); // Make the points n pixels in size
      point(x, y)

  }
}

//get number of each unique elements of the list
function getNumOfEachUniqueElement(datarows) {
  
  result = {};
  for(var i = 0; i < datarows.length; ++i) {
    if(!result[datarows[i]])
        result[datarows[i]] = 0;
        ++result[datarows[i]];
  }
  
  return result;
}

function showDetail() {
  console.log("mouseon!")
  
}

