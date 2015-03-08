// Define operations
var Operations = [
  { name: 'insert',      requireInput: true },
  { name: 'search',      requireInput: true },
  { name: 'searchMin',   requireInput: false },
  { name: 'searchMax',   requireInput: false },
  { name: 'successor',   requireInput: true },
  { name: 'predecessor', requireInput: true },
  { name: 'delete',      requireInput: true },
  { name: 'deleteAll',   requireInput: false }
];
// Add operations to select element
var selectField = document.getElementById('tree_operation');
selectField.innerHTML = '';
var firstProperty = true;
for (var key in Operations)
  if (Operations.hasOwnProperty(key)) {
    selectField.innerHTML += '<option value="' + key + '">' + Operations[key].name + '</option>';
    if (firstProperty) {
      document.getElementById('commit').innerHTML = Operations[key].name;
      firstProperty = false;
    }
  }
// store current operation in a variable
var operation = 0;

function changeOperation(value) {
  operation = parseInt(value);
  var selectedOperation = selectField.options[selectField.selectedIndex].text;
  document.getElementById('commit').innerHTML = selectedOperation;
  document.getElementById('tree_value').style.display = Operations[selectedOperation].requireInput ? "inline-block" : "none";
}

var log = function(message, emphasize) {
  var logbox = document.getElementById('tree_log');
  if (document.getElementById('tree_log_clear').checked && emphasize)
    logbox.innerHTML = "";
  var html = "";
  if (emphasize === true) html += '<strong>';
  html += message + '<br>';
  if (emphasize === true) html += '</strong>';
  logbox.innerHTML += html;
  logbox.scrollTop = logbox.scrollHeight;
}

document.getElementById('commit').addEventListener("click", function(e) {
  e.preventDefault();
  var value = document.getElementById('tree_value').value;
  if (value === undefined || isNaN(value)) {
    log("Invalid value: " + value);
    return false;
  }
  if (value%1 !== 0) {
    log(value + " is not an integer.");
    return false;
  }
  m_tree.clearHighlight();
  switch (Operations[operation].name) {
    case 'insert':
      m_tree.insert(value);
      break;
    case 'search':
      var node = m_tree.search(value);
      m_tree.highlightNode(node);
      break;
    case 'delete':
      break;
  }
  m_tree.drawTree();
  return false;
});

// drag events for canvas
var mainCanvas = document.getElementById('main-canvas');
var m_tree = new VisualBinarySearchTree(log, mainCanvas, {
  drawWeights: false
});
var isDraggingCanvas = false;
var startPosition = { x: undefined, y: undefined };
var originalOffset = { x: 0, y: 0};

mainCanvas.addEventListener("mousedown", function(e) {
  isDraggingCanvas = true;
  originalOffset = mainCanvas.canvasOffset;
  startPosition = { x: e.layerX, y: e.layerY };
  console.log(startPosition);
});
mainCanvas.addEventListener("mouseup", function(e) {
  isDraggingCanvas = false;
  startPosition = { x: undefined, y: undefined };
});
mainCanvas.addEventListener("mousemove", function(e) {
  if (isDraggingCanvas) {
    mainCanvas.canvasOffset = {
      x: originalOffset.x + (e.layerX - startPosition.x),
      y: originalOffset.y + (e.layerY - startPosition.y)
    }
    m_tree.drawTree();
  }
});

