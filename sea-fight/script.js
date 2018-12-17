var model = {
  boardSize: 10,
  numShips: 4,
  shipLength: 4,
  shipsSunk: 0,
  ships: [],

  generateShipLocations: function () {
    var locations;
    for (var i = 0; i < this.numShips; i++) {
      this.ships.push({ locations: [], hits: [] });
    }
    for (var i = 0; i < this.numShips; i++) {
      do {
        locations = this.generateShip();
      }
      while
        (this.collision(locations));

      this.ships[i].locations = locations;
    }
  },

  generateShip: function () {
    var direction = Math.floor(Math.random() * 2);
    var row, col;

    if (direction === 1) {
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
    } else {
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
      col = Math.floor(Math.random() * this.boardSize);
    }

    var newShipLocations = [];
    for (var i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        newShipLocations.push(row + "" + (col + i));
      } else {
        newShipLocations.push((row + i) + "" + col);
      }
    }
    return newShipLocations;
  },

  collision: function (locations) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = this.ships[i];
      for (var j = 0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >= 0) {
          return true;
        }
      }
    }
    return false;
  },

  fire: function (guess) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = this.ships[i];
      var index = ship.locations.indexOf(guess);
      if (ship.hits[index] === "hit") {
        view.displayMessage("Вы уже попадали в этот корабль.");
        return true;
      } else if (index >= 0) {
        ship.hits[index] = "hit";
        view.displayHit(guess);
        view.displayMessage("Попадание!");
        if (this.isSunk(ship)) {
          view.displayMessage("Вы полностью уничтожили корабль!");
          view.displaySinkBoat(ship);
          this.shipsSunk++;
        }
        return true;
      }
    }
    view.displayMiss(guess);
    view.displayMessage("Промах!");
    return false;
  },

  isSunk: function (ship) {
    for (i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] !== "hit") {
        return false;
      }
    }
    return true;
  }

};

var view = {
  displayCells: function (boardSize) {
    var board = document.getElementById("board");
    board.innerHTML = '';

    for (var i = 0; i < boardSize; i++) {
      board.appendChild(renderElement('tr'));
    }

    var tableRows = board.getElementsByTagName("tr");
    for (var i = 0; i < boardSize; i++) {
      for (var j = 0; j < boardSize; j++) {
        var id = "" + j + i;
        tableRows[j].appendChild(renderCellWidthDiv(id));
      }
    }
  },

  displaySinkBoat: function (ship) {
    for (var i = 0; i < ship.locations.length; i++) {
      var hitShip = document.getElementById(ship.locations[i]);
      hitShip.setAttribute("class", "full-hit");
    }
  },

  displayMessage: function (message) {
    var messageArea = document.getElementById("message");
    messageArea.innerHTML = message;
  },

  displayHit: function (location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "hit");
  },

  displayMiss: function (location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  }
};

var control = {
  guesses: 0,
  processGuess: function (location) {
    if (location) {
      this.guesses++;
      var hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage("Победа! Вы потопили " + model.shipsSunk + " кораблей за " + this.guesses + " попыток.");
      }
    }
  }
}

window.onload = init;

function init() {
  view.displayCells(model.boardSize);

  var guessClick = document.getElementsByTagName("td");
  for (var i = 0; i < guessClick.length; i++) {
    guessClick[i].onclick = answer;
  }

  model.generateShipLocations();
  view.displayMessage("Игра началась! По умолчанию в игре 4 корабля длинной по 4 ячейки");
}

function answer(eventObj) {
  var shot = eventObj.target;
  var location = shot.id;
  control.processGuess(location);
}

function renderElement(tagName) {
  return document.createElement(tagName);
};

function renderElementWidthId(tagName, tagId) {
  const wrapper = document.createElement(tagName);
  wrapper.setAttribute(`id`, tagId || ``);
  return wrapper;
};

function renderCellWidthDiv(tagId) {
  const wrapper = document.createElement('td');
  wrapper.appendChild(renderElementWidthId('div', tagId));
  return wrapper;
};


