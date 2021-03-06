
////////////////////////////////////////////////////////////////////////////////
var w = 2000;
var h = 2000;

//Store the center of each circle
var center_points = [];

//Flag for filter
var isFilter = {
  field: false,
  gender: false,
  year: false,
  anxiety: false
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
var sketch1 = function( self ) { // self could be any variable name

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
    cnv.position(0, 1250);
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

    console.log('Students: ', studentsDepr);
    // Students with depression by field
    studentsByField = createArrayByField(fieldStudies, studentsDepr);

    console.log("here is", studentsByField)
    
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

    // Title of Sketch 1
    titleSketch1 = self.createElement('h2', 'Students and the field of study');
    titleSketch1.style('margin-left', '10px');
    titleSketch1.style('font-family', '"Trebuchet MS", Helvetica, sans-serif');
    titleSketch1.position(0, 1250); 

    // Subtitle of Sketch 1
    descriptionSketch1 = self.createElement('h3', 'Description');
    descriptionSketch1.position(w-500-400, 1300);

    // Description of Sketch 1
    descSketch1 = self.createElement('p', 'This visualization represents the students with depressive symptoms in each field of study.<br> - Each <b>point</b> represents a student with depressive symptoms. <br> - Each <b>circle</b> represents the field of study.');
    descSketch1.position(w-500-400, 1350);

    // Title of interactions of Sketch 1
    titleIntSketch1 = self.createElement('h3', 'Interactions:');
    titleIntSketch1.position(w-500-400, 1460);

    // Descpr interactions Sketch 1
    interactionSketch1 = self.createElement('p', '- <b>Hover</b> the dots to find out more information about the students. <br> - With this <b>dropdown</b> you will be able to filter the field of studies by: ');
    interactionSketch1.position(w-500-400, 1500);


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

      var point_list = []
      
      let y = num = studentsByField[fieldStudies[i]].length;
      
      //let x = (i*300)+350
      let x = i*5 + aux;
      
      y = ((h - y)/2) - num - 500;

      //Store the center_point of each circle for using in Draw() function
      center_points.push([x, y]);

      // Lines to the x axis
      self.stroke('#8B98AA');
      self.strokeWeight(1);
      self.drawingContext.setLineDash([5, 15]);
      self.line(x, y+5, x, h-1350);

      field = self.createElement('field', fieldStudies[i]);
      field.position(x-30, h-100);

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
          point_list.push(...positions);
          num -= nPoint;
        } else {
          positions = drawPoint(self, x, y, radius + 10, num, colors[i], 6);
          point_list.push(...positions);
          break;
        }
      }
      
      point_position.push(point_list);


      //Uncomment These Line to use 4 Button 
      

      // // Create a Filter Button for Gender
      // field_btn = self.createButton('Study Field');
      // field_btn.position(10, h-150);
      // field_btn.mousePressed(function() { onChange("field");});

      // // Create a Filter Button for Gender
      // gender_btn = self.createButton('Gender');
      // gender_btn.position(100, h-150);
      // gender_btn.mousePressed(function() { onChange("gender");});

      // // Create a Filter Button for switch Year
      // year_btn = self.createButton('Year of Study');
      // year_btn.position(180, h-150);
      // year_btn.mousePressed(function() { onChange("year");});

      // // Create a Filter Button for switch Learning Disability
      // learn_btn = self.createButton('Learning Disability');
      // learn_btn.position(300, h-150);
      // learn_btn.mousePressed(function() { onChange("learning_disability");});
      //DropDown Selection
      sel = self.createSelect();
      sel.position(w-500-380, 1610);
      
      // Style select
      sel.style('font-weight', '300');
      sel.style('padding-left', '10px');
      sel.style('-moz-appearance', 'none');
      sel.style('-webkit-appearance', 'none');
      sel.style('appearance', 'none');
      sel.style('border', '1px solid');
      sel.style('height', '30px');
      sel.style('width', '175px');
      sel.style('background', '#fff');
      sel.style('background-image', 'linear-gradient(45deg, transparent 50%, gray 50%), linear-gradient(135deg, gray 50%, transparent 50%), linear-gradient(to right, #ccc, #ccc)');
      sel.style('background-position', 'calc(100% - 20px) calc(1em + -2px), calc(100% - 15px) calc(1em + -2px), calc(100% - -1em) 0.5em');
      sel.style('background-size', '5px 5px, 5px 5px, 1px 1.5em');
      sel.style('background-repeat', 'no-repeat');
      sel.style('border-radius', '2px');
      sel.style('border-color', 'white');
      sel.style('box-shadow', '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1');

      // Values select
      sel.option('Field of Study');
      sel.option('Gender');
      sel.option('Year of university');
      sel.option('Anxiety');
      sel.changed(onChange);
      console.log(onChange);

      fieldX = w-750;
      fieldY = 1700;
      let labelCol;
      let labelDesc;
      for (let i=0; i<fieldStudies.length; i++) {
        labelCol = self.createElement('labelCol');
        labelCol.position(fieldX-35, fieldY + 3);
        labelCol.style('background-color', colors[i]);
        prc = ((percentages[fieldStudies[i]]/totalStudentsField[fieldStudies[i]])*100).toFixed(2);
        labelDesc = self.createElement('labelDesc', percentages[fieldStudies[i]] + ' out of ' + totalStudentsField[fieldStudies[i]] + ' students <b> (' + prc + '%) </b>');
        labelDesc.position(fieldX, fieldY);
        fieldY += 30;
      }
    }
    console.log("point_position", point_position);
  }

  //Function Draw
  self.draw = function(x,y,size) {
    console.log(sel.elt.value);
    self.background(247, 247, 247);
    // Center of the circles
    for (let i=0; i<center_points.length; i++){
      drawPoint(self, center_points[i][0], center_points[i][1], 1, 1, 'black', 8);
      // Lines to the x axis
      self.stroke('#8B98AA');
      self.strokeWeight(1);
      self.drawingContext.setLineDash([5, 15]);
      self.line(center_points[i][0], center_points[i][1]+5, center_points[i][0], h-1350);
    }

    // Drawing the axis
    self.stroke('#8B98AA');
    //self.line(w-1920, h-1920, w-1920, h-1350);
    self.line(w-1920, h-1350, w-500, h-1350);
    
    self.frameRate(15);

    for(let i=0; i<point_position.length; i++){
      for(let j=0; j<point_position[i].length; j++){
        px = point_position[i][j][0]; // point_position is a 2d array of vector. so 0 is x, 1 is y.
        py = point_position[i][j][1];
        //Check if the mouse is hover on the position of the points
        if (self.mouseX >= (px-5) && self.mouseX <= px+5 && self.mouseY >= (py-5) && self.mouseY <= (py +5) ){
          let detail = "Age: "+ studentsByField[fieldStudies[i]][j].arr[0]
                + "\nGender: "+ studentsByField[fieldStudies[i]][j].arr[1]
                //+ "\nFrench Nationality: " + studentsByField[fieldStudies[i]][j].arr[2]
                //+ "\nField Studies: "+ studentsByField[fieldStudies[i]][j].arr[3]
                //+ "\nYear: " + studentsByField[fieldStudies[i]][j].arr[4]
                //+ "\nLearning Disability: " + studentsByField[fieldStudies[i]][j].arr[5]
                //+ "\nPanic Attacks: " + studentsByField[fieldStudies[i]][j].arr[53]
                //+ "\nAnxiety: " + studentsByField[fieldStudies[i]][j].arr[52]
                + "\nWeight: " + studentsByField[fieldStudies[i]][j].arr[30]
                + "\nHeight: " + studentsByField[fieldStudies[i]][j].arr[31]
                + "\nSmoker: " + studentsByField[fieldStudies[i]][j].arr[55]
                + "\nDrink: " + studentsByField[fieldStudies[i]][j].arr[57];
          
          //Show the detail in the black retangle
          self.noStroke();
          self.fill('#008dc9');
          self.rect(self.mouseX,100,130,120, 5);
          self.fill('#f7f7f7');
          self.text(detail, self.mouseX + 10, 100 + 10, 270, 150);
          self.textSize(13);
          self.noStroke();
          /*rect = self.rect(self.mouseX,100,250,120, 5);
          rect.fill('#f7f7f7');
          text = self.text(detail, self.mouseX + 10, 100 + 10, 270, 150);
          text.fill('#008dc9');
          text.textSize(13);*/

          // Set the Stroke for the point when hover
          self.stroke(50, 168, 160); // Change the color of the point that being hover
          self.strokeWeight(12); // Make the points n pixels in size.

        } else {
              if (isFilter.gender){
                self.noStroke();
                self.fill('rgb(255,99,132)');
                self.square(w-500-190, 365, 20);
                self.fill('black');
                self.text('Male', w-500-160, 380);  

                self.fill('rgb(255,205,86)');
                self.square(w-500-120, 365, 20);
                self.fill('black');
                self.text('Female', w-500-90, 380);  

                //Filter by gender
                if (studentsByField[fieldStudies[i]][j].arr[1] == 'male'){ // If the gender of the point is male
                  self.stroke(255,99,132); 
                  self.strokeWeight(6);
                  
                } else { // If the gender of the point is female
                  self.stroke(255,205,86); 
                  self.strokeWeight(6);
                }
              }

              //Filter by Year of Study
              else if (isFilter.year){
                self.noStroke();
                self.fill('#5E94D6');
                //self.square(w-500-300, 400, 20);
                self.square(w-500-190, 365, 20);
                self.fill('black');
                //self.text('First', w-500-270, 415);  
                self.text('First', w-500-160, 380);  

                self.fill('#EAC859');
                //self.square(w-500-230, 400, 20);
                self.square(w-500-120, 365, 20);
                self.fill('black');
                //self.text('Second', w-500-200, 415);
                self.text('Second', w-500-90, 380);

                self.fill('#D91E36');
                self.square(w-500-40, 365, 20);
                self.fill('black');
                self.text('Third', w-500-10, 380);

                if (studentsByField[fieldStudies[i]][j].arr[4] == 'first'){ // For Student First Year
                  self.stroke('#5E94D6'); 
                  self.strokeWeight(6);
                } else if(studentsByField[fieldStudies[i]][j].arr[4] == 'second'){ // For Student Second Year
                  self.stroke('#EAC859'); 
                  self.strokeWeight(6);
                } else { // For the rest
                  self.stroke('#D91E36'); 
                  self.strokeWeight(6);
                  
                }
              }

              //Filter by Learning Disability
              else if (isFilter.learning_disability){
                self.noStroke();
                self.fill('#F76A6A');
                self.square(w-500-190, 365, 20);
                self.fill('black');
                self.text('Yes',w-500-160, 380);  

                self.fill('#99C9AA');
                self.square(w-500-120, 365, 20);
                self.fill('black');
                self.text('No', w-500-90, 380); 

                if (studentsByField[fieldStudies[i]][j].arr[5] == 'yes'){ // If the gender of the point is male
                  self.stroke('#F76A6A');
                  self.strokeWeight(6);
                } else { // If the gender of the point is female
                    self.stroke('#99C9AA'); 
                    self.strokeWeight(6);
                }
              } else if (isFilter.anxiety) {
                self.noStroke();
                self.fill('#F76A6A');
                self.square(w-500-190, 365, 20);
                self.fill('black');
                self.text('Yes',w-500-160, 380);  

                self.fill('#5E94D6');
                self.square(w-500-120, 365, 20);
                self.fill('black');
                self.text('No', w-500-90, 380); 

                if (studentsByField[fieldStudies[i]][j].arr[52] == 'yes'){ // If the gender of the point is male
                  self.stroke('#F76A6A');
                  self.strokeWeight(6);
                } else { // If the gender of the point is female
                    self.stroke('#5E94D6'); 
                    self.strokeWeight(6);
                }
              } else {
              // Set the stroke back to normal when the point stop hovering
              self.stroke(colors[i]); 
              self.strokeWeight(6); 
            }
        }

        self.point(px, py)// draw new point
      }
      
    }
  }

};
var myp5 = new p5(sketch1, 's1');

//////////// Sketch Two///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
var sketch2 = function( self, table ) { // self could be any variable name

  self.preload = function() {
    table = self.loadTable("data/database-well-being-of-students-in-Nice.csv","csv","header");
  }

  self.setup = function() {

    cnv = self.createCanvas(600, 400);
    //cnv.position(0, 500);

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
      //options: options
    });
  }
};
var myp5 = new p5(sketch2, 's2');



//////////// Sketch Three///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
var sketch3 = function( self ) { // self could be any variable name

  // self.preload = function() {
  //   table = self.loadTable("data/database-well-being-of-students-in-Nice.csv","csv","header");
  // }

  self.setup = function() {

    cnv3 = self.createCanvas(600, 400);
    // cnv3.position(0, 800);

    self.background(0, 0, 255);
    
    studentsDepr = table.findRows("yes", "Depressive symptoms"); // Take only students with depression
    gender = getGender(self, studentsDepr);
    console.log(gender);

    // This stops the draw() function to be always executing
    self.noLoop();
  }

  self.draw = function() {
    
    var myBarChart = new Chart(cnv3, {
      type: 'bar',
      data: {
        labels: ['Under 18', '19', '20', '20 and more'],
        datasets: [{
            label: 'Age Group',
            data: [12, 19, 3, 5],
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
      },
      options: options,
    });

  }

};
var myp5 = new p5(sketch3, 's3');





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
      self.point(x, y);

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

// Clicking Button Event
var onChange = function(option) {

  if (sel.value() == 'Field of Study') {
    aux = 'field';
  } else if (sel.value() == 'Gender') {
    aux = 'gender';
  } else if (sel.value() == 'Year of university') {
    aux = 'year';
  } else if (sel.value() == 'Anxiety') {
    aux = 'anxiety'
  }

  for (key in isFilter){
    if (key == aux){isFilter[key] = true;} else {isFilter[key] = false;} //change sel.value() to option if using the button
  }
}