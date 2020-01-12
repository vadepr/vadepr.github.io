
////////////////////////////////////////////////////////////////////////////////
var w = 2000;
var h = 2000;

data = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [{
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
  }]
};

var options = {
  scales: {
      yAxes: [{
          ticks: {
              beginAtZero: true
          }
      }]
  }
}

var point_position = []


///////////////////////// Sketch One ////////////////////////////////////
//////////////////////////////////////////////////////////////
var sketch1 = function( self ) { // p could be any variable name

  self.preload = function() {
    table = self.loadTable("data/database-well-being-of-students-in-Nice.csv","csv","header");
  }

  self.setup = function() {

    // if (windowWidth <1600 || windowHeight <800) {
    //   cnv = p.createCanvas(1600, 800);
    // } else {
    //   cnv = p.createCanvas(windowWidth,windowHeight);
    // }

    cnv = self.createCanvas(1600, 800);
    cnv.position(0, 800)
    
    fieldCol = table.getColumn('Field of study');
    studentsDepr = table.findRows("yes", "Depressive symptoms"); // Take only students with depression
    //get unique elements of the list
    fieldStudies = [...new Set(fieldCol)];

    totalStudentsField = {};
    for(let i=0; i<fieldStudies.length; i++) {
      totalStudentsField[fieldStudies[i]] = table.findRows(fieldStudies[i], "Field of study").length;
    }
    
    //get number of each study field
    numOfEachField = getNumOfEachUniqueElement(fieldCol);

    // Students with depression by field
    studentsByField = createArrayByField(fieldStudies, studentsDepr);
    
    // Total of students by field
    // console.log(studentsByField);
    total = 0;
    percentages = {};
    // TODO: Improve this if possible
    for(let i=0; i<fieldStudies.length; i++) {
      total += studentsByField[fieldStudies[i]].length;
    }
    for (let i=0; i<fieldStudies.length; i++) {
      percentages[fieldStudies[i]] = studentsByField[fieldStudies[i]].length;
    }

    colors = ['#ff7315', 'green', 'purple', '#f0134d', '#ffc55c', '#3282b8'];

    // Creating the legend
    legend = self.createElement('leg');
    legend.position(w-500-300, 900);

    fieldX = w-750;
    fieldY = 910;
    for (let i=0; i<fieldStudies.length; i++) {
      labelCol = self.createElement('labelCol');
      labelCol.position(fieldX-35, fieldY + 3);
      labelCol.style('background-color', colors[i]);
      labelDesc = self.createElement('labelDesc', percentages[fieldStudies[i]] + ' out of ' + totalStudentsField[fieldStudies[i]] + ' students');
      labelDesc.position(fieldX, fieldY);
      fieldY += 30;
    }

  ////////////////////////////////////////////////////////////////////////////////////////////
   // Drawing the axis
   self.stroke('#8B98AA');
   //self.line(w-1920, h-1920, w-1920, h-1350);
   self.line(w-1920, h-1350, w-500, h-1350);

   // console.log(fieldStudies);
   // To position in the circles a bit closer
   // PROBLEM: two cricles collide
   let aux = 0;
   for (let i = 0; i<fieldStudies.length; i++){
     aux += 150;
     // console.log(numOfEachField[fieldStudies[i]]);
     
     let y = num = studentsByField[fieldStudies[i]].length;
     
     //let x = (i*300)+350
     let x = i*5 + aux;
     
     y = ((h - y)/2) - num - 500;

    // Lines to the x axis
    self.stroke('#8B98AA');
    self.strokeWeight(1);
    self.drawingContext.setLineDash([5, 15]);
    self.line(x, y+5, x, h-1350);

    field = self.createElement('field', fieldStudies[i]);
    field.position(x-30, h-550);

    // Center of the circles
    drawPoint(self, x, y, 1, 1, 'black', 8);
    
    let nPoint = 0;
    let radius = 0;
    
    // test = round(num * 0.01)
    while (num>0) {
      if ( nPoint + 10 <= num){
        nPoint += 10;
        radius = nPoint + 10;
        positions = drawPoint(self, x, y, radius, nPoint, colors[i], 6);
        point_position.push(...positions)
        num -= nPoint;
      } else {
        positions = drawPoint(self, x, y, radius + 10, num, colors[i], 6);
        point_position.push(...positions)
        break;
      }
    }
    
    
  }

    // This stops the draw() function to be always executing
    // self.noLoop();

    console.log(point_position)
  }

  self.draw = function(x,y,size) {
    self.frameRate(8);
    self.text("X: "+self.mouseX, 0, self.height/4);
    self.text("Y: "+self.mouseY, 0, self.height/2);

    for(let i=0; i<point_position.length; i++){
      px = point_position[i][0]
      py = point_position[i][1]
      if (self.mouseX >= (px-10) && self.mouseX <= px+10 && self.mouseY >= (py-10) && self.mouseY <= (py +10) ){
        self.point(px, py)
        console.log("Student Age: ", studentsDepr[i].arr[0] , " Student Gender:", studentsDepr[i].arr[1], " Field Studies:", studentsDepr[i].arr[3])
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

    cnv = self.createCanvas(1600, 800);
    cnv.position(0, 1600);

    self.background(0, 0, 255);
    
    studentsDepr = table.findRows("yes", "Depressive symptoms"); // Take only students with depression
    gender = getGender(self, studentsDepr);
    console.log(gender);

    // This stops the draw() function to be always executing
    self.noLoop();
  }

  self.draw = function() {
    var myPieChart = new Chart(cnv, {
      type: 'doughnut',
      data: {
        labels: ['Male', 'Female'],
        datasets: [{
          label: '# of Votes', 
          data: [gender['male'].length, gender['female'].length],
          backgroundColor: [
            'rgb(255,99,132)',
            'rgb(255,205,86)'
          ],
          borderWidth: 1
        }]
      },
      options: options
    });
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
  
  var position_list = [];

  for(var i = 0; i < items; i++) {
    
      var x = x0 + r * Math.cos(2 * Math.PI * i / items);
      var y = y0 + r * Math.sin(2 * Math.PI * i / items);   
      self.stroke(color); // Change the color
      self.strokeWeight(weight); // Make the points n pixels in size
      self.point(x, y)

      position_list.push([x, y])
  }

  return position_list
}

// Get the number of male and female who suffer from depression
var getGender = function(self, data) {
  genderDepr = {};
  males = [];
  females = [];
  for (var i=0; i<data.length; i++) {
    if (data[i].obj['Gender'] == 'male') {
      males.push(data[i]);
    } else {
      females.push(data[i]);
    }
  }
  genderDepr['female'] = females;
  genderDepr['male'] = males;

  return genderDepr;
}