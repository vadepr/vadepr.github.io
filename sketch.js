
////////////////////////////////////////////////////////////////////////////////
var w = 2000;
var h = 2000;

///////////////////////// Sketch One ////////////////////////////////////
//////////////////////////////////////////////////////////////
var sketch1 = function( self ) { // p could be any variable name

  self.preload = function() {
    table = self.loadTable("data/database-well-being-of-students-in-Nice.csv","csv","header");
  }

  self.setup = function() {

    // header = createElement('h1', 'Field of Study and Depressive symptoms');
    // box = createElement('h3', 'Description');
    // box.position(1000,20);

    // separator = createElement('separator');
    // separator.position(1000, 20);

    // boxText = createElement('p', 'The aim of this visualization is to show the amount of students who have depressive symptoms by field of study. <br> <br>\
    //   Each point represents a student with depressive symptoms. <br> <br>\
    //   Each circle represents the different fields of study that the dataset contains.');
    // boxText.position(1000, 70);

    // if (windowWidth <1600 || windowHeight <800) {
    //   cnv = p.createCanvas(1600, 800);
    // } else {
    //   cnv = p.createCanvas(windowWidth,windowHeight);
    // }

    cnv = self.createCanvas(1600, 800);
    
    fieldCol = table.getColumn('Field of study');
    studentsDepr = table.findRows("yes", "Depressive symptoms"); // Take only students with depression
    
    //get unique elements of the list
    fieldStudies = [...new Set(fieldCol)];
    
    //get number of each study field
    numOfEachField = getNumOfEachUniqueElement(fieldCol);

    // Students with depression by field
    studentsByField = createArrayByField(fieldStudies, studentsDepr);
    // console.log(studentsByField);

    // Percentages
    // TODO: think on how are we going to use these percentages
    total = 0;
    percentages = {};
    
    // TODO: Improve this if possible
    for(let i=0; i<fieldStudies.length; i++) {
      total += studentsByField[fieldStudies[i]].length;
    }

    for (let i=0; i<fieldStudies.length; i++) {
      percentages[fieldStudies[i]] = (studentsByField[fieldStudies[i]].length/total)*100;
    }

    // console.log(percentages);
    colors = ['red', 'green', 'purple', 'navy', 'brown', 'blue'];

    // This stops the draw() function to be always executing
    self.noLoop();
  }

  self.draw = function(x,y,size) {
    // put drawing code here
    // console.log(fieldStudies);
    // To position in the circles a bit closer
    // PROBLEM: two cricles collide
    let aux = 0;
    for (let i = 0; i<fieldStudies.length; i++){
      aux += 150;
      // console.log(numOfEachField[fieldStudies[i]]);
      
      let y = num = studentsByField[fieldStudies[i]].length;
      
      //let x = (i*300)+350
      let x = i*100 + aux;
      
      y = ((h - y)/2) - num - 500;

      field = self.createElement('field', fieldStudies[i]);
      field.position(x, y + 30);
      
      drawPoint(self, x, y, 1, 1, 'black', 8);
      
      let nPoint = 0;
      let radius = 0;
      
      // test = round(num * 0.01)
      while (num>0) {
        if ( nPoint + 10 <= num){
          nPoint += 10
          radius = nPoint + 10;
          drawPoint(self, x, y, radius, nPoint, colors[i], 6);
          num -= nPoint;
        } else {
          drawPoint(self, x, y, radius + 10, num, colors[i], 6);
          break;
        }
      }
      
    }
  }
};
var myp5 = new p5(sketch1, 's1');

//////////// Sketch Two///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
var sketch2 = function( self, table ) { // p could be any variable name

  self.preload = function() {
    table = self.loadTable("data/database-well-being-of-students-in-Nice.csv","csv","header");
  }

  self.setup = function() {

    cnv = self.createCanvas(100, 20);

    // self.background(0, 0, 255);
    rand = Math.round(Math.random() * 500)

    var myPieChart = new Chart(cnv, {
      type: 'pie',
      data: {
        labels: ["Non-Depressed", "Depressed"],
        datasets: [{
          label: "Number of students",
          backgroundColor: ["#3e95cd", "#8e5ea2"],
          data: [1000,200]
        }]
      },
      options: {
        title: {
          display: true,
          text: 'Number of student in dataset'
        }
      }
    });

    // This stops the draw() function to be always executing
    self.noLoop();
  }

  self.draw = function() {

  }
};
var myp5 = new p5(sketch2, 's2');



///////// Global Function Here///////////////////


//get number of each unique elements of the list
var getNumOfEachUniqueElement = function(datarows) {
  
  result = {};
  for(var i = 0; i < datarows.length; ++i) {
    if(!result[datarows[i]])
        result[datarows[i]] = 0;
        ++result[datarows[i]];
  }
  
  return result;
}

// Creates an array for each students in an specific field
var createArrayByField = function(arrFields, data) {
  let studentsDepr = [];
  var myObject = {};
  
  for (var i=0; i<arrFields.length; i++) {
    studentsDepr = [];

    for (var j=0; j<data.length; j++) {
      if (data[j].obj['Field of study'] == arrFields[i]) {
        studentsDepr.push(data[j]);
      }
    }
    myObject[arrFields[i]] = studentsDepr;
  }

  return myObject;
}

//Function to draw point
var drawPoint = function(self, x0, y0, r, items, color, weight){
  
  for(var i = 0; i < items; i++) {
    
      var x = x0 + r * Math.cos(2 * Math.PI * i / items);
      var y = y0 + r * Math.sin(2 * Math.PI * i / items);   
      self.stroke(color); // Change the color
      self.strokeWeight(weight); // Make the points n pixels in size
      self.point(x, y)

  }
  }