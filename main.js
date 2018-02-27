// *** the assignment of variables

var url = 'http://localhost:3000/vehicles.json';

var automobilesTable = document.querySelector('#tbl_auto tbody'),
    airplanesTable = document.querySelector('#tbl_air tbody'),
    boatsTable = document.querySelector('#tbl_boat  tbody');

var updateBtn = document.getElementById('btn');

// *** main logic of query

window.onload = function() {
  loadVehicle(url);
};


// *** handling of update button

updateBtn.addEventListener('click', function() {
  updateData({
    automobiles: automobilesTable,
    airplanes: airplanesTable,
    boats: boatsTable
  });
});

// *** functions

function loadVehicle(url) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  
  xhr.onload = function() {
    if (this.status === 200) {
      var
        vehicles = JSON.parse(this.responseText),
        vehiclesArrOfObj = [];
      console.log(vehicles);
      
      vehicles.forEach(function(item, i, arr) {
          if (arr[i].type === 'boat') { // create an object depending on the type property
            vehiclesArrOfObj.push(
              new Boat(arr[i].name, arr[i].speed, arr[i].capacity, arr[i].maxpower));
          } else if (arr[i].type === 'auto') {
            vehiclesArrOfObj.push(
              new Auto(arr[i].name, arr[i].speed, arr[i].capacity, arr[i].body) );
          } else {
            vehiclesArrOfObj.push(
              new Airplane(arr[i].name, arr[i].speed, arr[i].capacity, arr[i].wingspan) );
          }
      });
  
      for (var i = 0; i < vehiclesArrOfObj.length; i++) {
        var vehicle = vehiclesArrOfObj[i].constructor; // define an object constructor
    
        switch(vehicle) { // display data in the table, depending on the object's constructor
          case Auto:
            automobilesTable.appendChild(
              vehiclesArrOfObj[i].createHtmlNode(
                vehiclesArrOfObj[i].body));
            break;
          case Boat:
            boatsTable.appendChild(
              vehiclesArrOfObj[i].createHtmlNode(vehiclesArrOfObj[i].maxpower));
            break;
          default:
            airplanesTable.appendChild(
              vehiclesArrOfObj[i].createHtmlNode(vehiclesArrOfObj[i].wingspan));
        }
      }
    } else if(this.status === 500 || this.status === 400) {
      alert('server is not OK or bad request');
    }
  };
  
  xhr.send();
}

function updateData(parentsObj) {
  var parents = [
    parentsObj.automobiles,
    parentsObj.airplanes,
    parentsObj.boats
  ];
  
  for (var i = 0; i < parents.length; i++) {
    var
      parent = parents[i], // current parent of tables
      child = parent.querySelectorAll('.server-data'); // choose all elements with the same class
    for (var j = 0; j < child.length; j++) {
      parent.removeChild(child[j]); // remove '.server-data' elements
    }
  }
  
  loadVehicle(url); // send request
}


// *** "classes"

function Vehicle(name, speed, capacity) { // PARENT
  this.name = name;
  this.speed = speed;
  this.capacity = capacity;
}
Vehicle.prototype.createTableRow = function(individualParameter) { // prototype.function
  return('<tr>' +
           '<td>' + this.name + '</td>' +
           '<td>' + this.speed + '</td>' +
           '<td>' + this.capacity + '</td>' +
           '<td>' + individualParameter + '</td>' +
         '</tr>');
};
Vehicle.prototype.createHtmlNode = function(individualParameter) { // prototype.function
  var tr = document.createElement('tr');
  
  tr.className = 'server-data';
  tr.innerHTML =  this.createTableRow(individualParameter);
  
  return tr;
};



function Auto(name, speed, capacity, body) {
  Vehicle.apply(this, arguments); // call parent constructor
  this.body = body; // uniq property for this object
}
Auto.prototype = Object.create(Vehicle.prototype); // extends from Vehicle
Auto.prototype.constructor = Auto; // this "class" is constructor


function Boat(name, speed, capacity,maxPower) {
  Vehicle.apply(this, arguments);
  this.maxpower = maxPower;
}
Boat.prototype = Object.create(Vehicle.prototype);
Boat.prototype.constructor = Boat;


function Airplane(name, speed, capacity, wingspan) {
  Vehicle.apply(this, arguments);
  this.wingspan = wingspan;
}
Airplane.prototype = Object.create(Vehicle.prototype);
Airplane.prototype.constructor = Airplane;
