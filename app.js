const X_IMAGE_URL = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1083533/x.png';
const O_IMAGE_URL = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1083533/circle.png';
const SIZE = 5;

function assignSpace(space, owner) {
  const image = document.createElement('img');
  image.src = owner === 'x' ? X_IMAGE_URL : O_IMAGE_URL;
  space.appendChild(image);

  const index = parseInt(space.dataset.index);
  takenBoxes[index] = owner;
  const indexToRemove = freeBoxes.indexOf(space);
  freeBoxes.splice(indexToRemove, 1);
  space.removeEventListener('click', changeToX);
}

function changeToX(event) {
  assignSpace(event.currentTarget, 'x');

  if (isGameOver()) {
    displayWinner();
  } else {
    computerChooseO();
  }
}

function computerChooseO() {
  const allBoxes  = document.querySelectorAll('#grid div');
  const index = Math.floor(Math.random() * freeBoxes.length);
  const freeSpace = freeBoxes[index];

  assignSpace(freeSpace, 'o');

  if (isGameOver()) {
    displayWinner();
  }
}

function isGameOver() {
  return freeBoxes.length === 0 || getWinner() !== null;
}

function displayWinner() {
  const winner = getWinner();

  const resultContainer = document.querySelector('#results');
  const header = document.createElement('h1');
  if (winner === 'x') {
    header.textContent = 'You win!';
  } else if (winner === 'o') {
    header.textContent = 'Computer wins';
  } else {
    header.textContent = 'Tie';
  }
  resultContainer.appendChild(header);

  // Remove remaining event listeners
  for (const box of freeBoxes) {
    box.removeEventListener('click', changeToX);
  }
}

function checkBoxes(one, two, three, four, five) {
  if (takenBoxes[one] !== undefined &&
      takenBoxes[one] === takenBoxes[two] &&
      takenBoxes[two] === takenBoxes[three]&&
      takenBoxes[three] === takenBoxes[four]&&
      takenBoxes[four] === takenBoxes[five]) {
    return takenBoxes[one];
  }
  return null;
}

// Returns 'x', 'o', or null for no winner yet.
function getWinner() {
  for (let col = 0; col < 5; col++) {
    const offset = col * 5;
    // Check rows and columns.
    let result = checkBoxes(offset, 1 + offset, 2 + offset, 3 + offset, 4 + offset) ||
        checkBoxes(col, 5 + col, 10 + col, 15 + col, 20 + col);
    if (result) {
      return result;
    }
  }
  
  // Check diagonals
  return checkBoxes(0, 6, 12, 18, 24) || checkBoxes(4, 8, 12, 16, 20);
}

const freeBoxes = [];
// Map of box number -> 'x' or 'o'
const takenBoxes = {};
const boxes = document.querySelectorAll('#grid div');
for (const box of boxes) {
  box.addEventListener('click', changeToX);
  freeBoxes.push(box);
}
