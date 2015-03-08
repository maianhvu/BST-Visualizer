// Define operations
var Operations = Object.freeze({
  insert: true,
  search: true,
  searchMin: false,
  searchMax: false,
  successor: true,
  predecessor: true,
  delete: true,
  deleteAll: false
});
// Add operations to select element
var selectField = document.getElementById('tree_operation');
selectField.innerHTML = '';
var firstProperty = true;
var operationsCount = 0;
for (var key in Operations)
  if (Operations.hasOwnProperty(key)) {
    selectField.innerHTML += '<option value="' + operationsCount++ + '">' + key + '</option>';
    if (firstProperty) {
      document.getElementById('commit').innerHTML = key;
      firstProperty = false;
    }
  }
// store current operation in a variable
var operation = 0;

function changeOperation(value) {
  operation = parseInt(value);
  var selectedOperation = selectField.options[selectField.selectedIndex].text;
  document.getElementById('commit').innerHTML = selectedOperation;
  document.getElementById('tree_value').style.display = Operations[selectedOperation] ? "inline-block" : "none";
  console.log(Operations[selectedOperation]);
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
  switch (operation) {
    case Operations.insert:
      m_tree.insert(value);
      break;
    case Operations.search:
      var node = m_tree.search(value);
      m_tree.highlightNode(node);
      break;
    case Operations.delete:
      break;
  }
  m_tree.drawTree();
  return false;
});

var m_tree = new VisualBinarySearchTree(log, document.getElementById('main-canvas'), {
  drawWeights: false
});
