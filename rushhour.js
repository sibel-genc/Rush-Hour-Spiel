const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

const GRID_SIZE = 100; // Größe des Gitternetzes (Zellen)
const CANVAS_SIZE = 600; // Größe des Spielfelds
const MOVE_STEP = GRID_SIZE; // Schrittgröße, mit der Autos bewegt werden

let selectedCarIndex = null; // Speichert, welches Auto aktuell ausgewählt ist

var img = new Image();
img.src = "/bilder/car.svg";

const randomColors = [
  "#FF5733", // Rot-Orange
  "#33FF57", // Grün
  "#3357FF", // Blau
  "#FF33A1", // Pink
  "#FFFF33", // Gelb
  "#33FFF3", // Türkis
  "#FF8C33", // Dunkel-Orange
  "#33FFA5", // Mintgrün
  "#8C33FF", // Lila
  "#FFB533", // Gold
  "#33D4FF", // Hellblau
  "#7FFF33", // Hellgrün
  "#FF33F6", // Magenta
  "#33FFCC", // Türkis-Blau
  "#FF6633", // Lachsrot
  "#FF33FF", // Neon-Pink
  "#33FF66", // Neongrün
  "#3366FF", // Königsblau
  "#FF3385", // Rosa
];

// Autoklasse zur Darstellung und Bewegung der Autos
class Car {
  constructor(x, y, length, color, direction) {
    this.x = x * GRID_SIZE; // Startposition des Autos auf der x-Achse
    this.y = y * GRID_SIZE; // Startposition des Autos auf der y-Achse
    if (direction === "horizontal") {
      this.width = GRID_SIZE * length; // Breite des Autos
      this.height = GRID_SIZE; // Höhe des Autos
    } else {
      this.width = GRID_SIZE; // Breite des Autos
      this.height = GRID_SIZE * length; // Höhe des Autos
    }
    this.color = color; // Farbe des Autos
    this.direction = direction; // Bewegungsrichtung (horizontal oder vertikal)
    this.isSelected = false; // Status, ob das Auto ausgewählt ist
  }

  // Methode zum Zeichnen des Autos
  draw() {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);

    if (this.direction === "horizontal") {
      // für horizontales Auto muss das Bild gedreht werden
      context.save();
      context.rotate(Math.PI / 2);
      context.drawImage(
        img,
        this.y - 50,
        -this.x - 200 - (this.width - 200) / 2,
        200,
        200
      );
      context.restore();
    } else {
      context.drawImage(
        img,
        this.x - 50,
        this.y + (this.height - 200) / 2,
        200,
        200
      );
    }

    // Wenn das Auto ausgewählt ist, zeichne einen Rahmen darum
    if (this.isSelected) {
      context.lineWidth = 3;
      context.strokeStyle = "black";
      context.strokeRect(this.x, this.y, this.width, this.height);
    }
  }

  // Methode, um das Auto zu bewegen
  move(step) {
    if (this.direction === "horizontal") {
      this.x += step; // Bewegt das Auto horizontal
    } else {
      this.y += step; // Bewegt das Auto vertikal
    }
  }

  // Methode, die prüft, ob das Auto sich bewegen kann (ohne Kollision)
  canMove(step, cars) {
    let newX = this.x;
    let newY = this.y;

    if (this.direction === "horizontal") {
      newX += step;
    } else {
      newY += step;
    }

    // Überprüft die Grenzen des Spielfelds
    if (
      newX < 0 ||
      newY < 0 ||
      newX + this.width > CANVAS_SIZE ||
      newY + this.height > CANVAS_SIZE
    ) {
      return false;
    }

    // Überprüft die Kollision mit anderen Autos
    for (let car of cars) {
      if (
        car !== this &&
        newX < car.x + car.width &&
        newX + this.width > car.x &&
        newY < car.y + car.height &&
        newY + this.height > car.y
      ) {
        return false;
      }
    }

    return true;
  }

  // Methode, die überprüft, ob das Auto angeklickt wurde
  isClicked(mouseX, mouseY) {
    return (
      mouseX >= this.x &&
      mouseX <= this.x + this.width &&
      mouseY >= this.y &&
      mouseY <= this.y + this.height
    );
  }
}

// Array mit den Autos, die auf das Spielfeld gesetzt werden
let cars = [];
randomCars();

// Funktion, um das Gitternetz zu zeichnen
function drawGrid() {
  context.strokeStyle = "#ccc";
  for (let i = 0; i <= CANVAS_SIZE; i += GRID_SIZE) {
    context.beginPath();
    context.moveTo(i, 0);
    context.lineTo(i, CANVAS_SIZE);
    context.stroke();
    context.beginPath();
    context.moveTo(0, i);
    context.lineTo(CANVAS_SIZE, i);
    context.stroke();
  }
}

// Funktion, um das Spielfeld und die Autos zu zeichnen
function draw() {
  context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  drawGrid();
  for (let car of cars) {
    car.draw();
  }

  // Überprüft, ob das Zielauto das Ende des Spielfelds erreicht hat
  checkWinCondition();
}

// Funktion, um ein Auto zu bewegen
function moveCar(index, step) {
  if (index !== null && cars[index].canMove(step, cars)) {
    cars[index].move(step);
  }
  draw();
}

// Überprüft, ob das Zielauto (rotes Auto) das Spielfeld verlassen hat
function checkWinCondition() {
  const goalCar = cars[0]; // Das rote Auto ist das Zielauto
  if (goalCar.x + goalCar.width >= CANVAS_SIZE) {
    alert("Gewonnen! Das rote Auto hat den Ausgang erreicht.");
    resetGame(); // Setzt das Spiel zurück
  }
}

// Funktion, um das Spiel zurückzusetzen und die Autos neu zu platzieren
function resetGame() {
  randomCars();
  draw();
}

// Event Listener für Tastatursteuerung
document.addEventListener("keydown", (event) => {
  if (selectedCarIndex === null) return; // Kein Auto ausgewählt
  switch (event.key) {
    case "ArrowLeft":
      moveCar(selectedCarIndex, -MOVE_STEP);
      break;
    case "ArrowRight":
      moveCar(selectedCarIndex, MOVE_STEP);
      break;
    case "ArrowUp":
      moveCar(selectedCarIndex, -MOVE_STEP);
      break;
    case "ArrowDown":
      moveCar(selectedCarIndex, MOVE_STEP);
      break;
  }
});

// Maus-Event für Autoauswahl
canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // Überprüft, ob ein Auto angeklickt wurde
  for (let i = 0; i < cars.length; i++) {
    if (cars[i].isClicked(mouseX, mouseY)) {
      if (selectedCarIndex !== null) {
        cars[selectedCarIndex].isSelected = false; // Vorheriges Auto deselektieren
      }

      selectedCarIndex = i; // Neues Auto auswählen
      cars[i].isSelected = true;
      break;
    }
  }

  draw(); // Spielfeld neu zeichnen
});

function randomCars() {
  const number = Number.parseInt(document.getElementById("cars-select").value);

  do {
    generateRandomCars(number);
  } while (cars[0].x != 0); // das rote Auto soll immer ganz links stehen

  setTimeout(() => draw(), 100);
}

function generateRandomCars(number) {
  do {
    cars = [new Car(4, 2, 2, "red", "horizontal")];
    for (let index = 0; index < number; index++) {
      let length;
      if (Math.random() > 0.5) {
        length = 3;
      } else {
        length = 2;
      }
      let direction = Math.random() > 0.7 ? "horizontal" : "vertical";
      let y;

      if (direction === "horizontal") {
        do {
          y = Math.floor(Math.random() * 6);
        } while (y === 2);
        x = Math.floor(Math.random() * (7 - length));
      } else {
        y = Math.floor(Math.random() * (7 - length));
        x = Math.floor(Math.random() * 6);
      }

      cars.push(new Car(x, y, length, randomColors[index], direction));
    }
  } while (!isValid(cars));

  for (let index = 0; index < 10000; index++) {
    const moveCar = Math.floor(Math.random() * number);
    const step = Math.random() > 0.5 ? MOVE_STEP : -MOVE_STEP;

    if (cars[moveCar].canMove(step, cars)) {
      cars[moveCar].move(step);
    }
  }
}

// überprüft ob die cars Liste valide ist, d.h. ob sich 2 Autos "überschneiden"
function isValid(cars) {
  for (const [i, car1] of cars.entries()) {
    for (const [j, car2] of cars.entries()) {
      if (j > i) {
        if (
          !(
            car1.x + car1.width <= car2.x ||
            car1.x >= car2.x + car2.width ||
            car1.y + car1.height <= car2.y ||
            car1.y >= car2.y + car2.height
          )
        ) {
          return false;
        }
      }
    }
  }
  return true;
}
