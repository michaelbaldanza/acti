/* Base */
class Column {
  constructor(letter) {
    this.letter = letter;
  }

  notes = [];
  heading = '';
}
const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
/* App State */
let columns = [];

/* DOM Elements */
const body = document.body;
const wrapper = document.getElementById('wrapper');

/* App function */
function app(page) {
  const current = {
    'home': function () {
      // Clear DOM for new contents.
      wrapper.innerHTML = '';

      // Set up page skeleton.
      const main = crEl({ el: 'main'});
      const container = crEl({
        el: 'div', cN: 'container', l: [
          { event: 'dragstart', listener: onDragStart, },
          { event: 'dragover', listener: onDragOver, },
          { event: 'drop', listener: onDrop, },
      ]
      });
      const btnContainer = crEl({ el: 'div', cN: 'container' });
      const addColumnBtn = crEl({
        el: 'button',
        cN: 'btn',
        id: 'add-column-btn',
        iT: 'Add a column',
        l: [
          { event: 'click', listener: () => makeColumnState() },
        ],
      });

      // Append bones.
      btnContainer.append(addColumnBtn);
      main.append(container);
      wrapper.append(btnContainer, main);

      // Render columns from state.
      makeColumns(container);
    }
  }

  return current[page]();
}

app('home');

/* Event Listeners */
function onDragStart(e) {
  e.target.classList.add('dragging');
}

function onDragOver(e) {
  e.preventDefault();
  const draggedElement = document.querySelector('.dragging');
  const child = e.target;
  const parent = child.parentNode;
  const next = child.nextSibling;
  if (child.className.includes('block') && child !== draggedElement) {
    if (next && next !== draggedElement) {
      parent.insertBefore(draggedElement, next);
    } else if (next && next === draggedElement) {
      parent.insertBefore(draggedElement, child)
    } else {
      parent.append(draggedElement)
    }
  }
}

function onDrop(e) {
  const newColumns = [...document.querySelectorAll('.column')];
  const newColumnState = [];
  newColumns.map(((newColumn, idx) => {
    const oldColIdx = getIdxFromAttr(newColumn.id);
    newColumnState.push(columns[oldColIdx]);
  }))
  columns = newColumnState;
  app('home')
}

/* DOM stuff */
function makeColumns(parent) {
  for (let c = 0; c < columns.length; c++) {
    const col = crElWithC(
      { el: 'div', cN: 'block column draggable', id: `column-${c + 1}`, draggable: true },
      {
        el: 'span',
        cN: 'column-text',
        id: `column-text-${c + 1}`,
        iT: columns[c].letter,
      }
    );
    parent.append(col);
  }
}

function crElWithC(el, c) {
  const element = crEl(el);
  const child = crEl(c);
  element.append(child);
  return element;
}

function crEl({ el, cN, id, iT, l, draggable }) {
  /* Creates an element from the tag `el`.
  If one of the other arguments is present, then do something.
  cN: Set a `class` attribute. (cN is short for 'class name')
  id: Set an `id`.
  iT: Set the element's `innerText` property.
  l: Set an event listener. `l.e` is a string representing the event to
  listen for. `l.f` is the fucntion to call when the event is triggered.*/
  const element = document.createElement(el);
  if (cN) element.setAttribute('class', cN);
  if (id) element.setAttribute('id', id);
  if (iT) element.innerText = iT;
  if (draggable) element.setAttribute('draggable', draggable);
  if (l) {
    l.forEach((eventListener) => {
      const { event, listener } = eventListener;
      element.addEventListener(event, listener);
    });
  }
  return element;
}

/* State function */
function makeColumnState() {
  let cNum = columns.length;
  const newColumn = new Column(alphabet[cNum]);
  columns.push(newColumn);
  app('home');
}

/* Helpers */
function getIdxFromAttr(attr) {
  return parseInt(attr.match(/(\d+)/)[0], 10) - 1
}

function getAll(dotClassName) {
  return document.querySelectorAll(dotClassName);
}