let value = 0;

function setup() {
  createCanvas(100, 100);

  describe(
    "A gray square with a black square at its center. The inner square changes color when the user presses and releases a mouse button.",
  );
}

function draw() {
  background(200);

  // Style the square.
  fill(value);

  // Draw the square.
  square(25, 25, 50);
}

// Toggle the square's color when the user clicks.
function mouseClicked() {
  if (value === 0) {
    value = 255;
  } else {
    value = 0;
  }
  // Uncomment to prevent any default behavior.
  // return false;
}
