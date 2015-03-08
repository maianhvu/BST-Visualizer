var BinarySearchTree = function(logger) {
  this.root = undefined;
  this.logger = logger;
}

BinarySearchTree.prototype.log = function(message, emphasize) {
  if (this.logger !== undefined)
    this.logger(message, emphasize);
}

BinarySearchTree.prototype.insert = function(val, type) {
  // for abstraction, default to TreeNode
  var nodeType = type;
  if (nodeType === undefined) nodeType = TreeNode;
  // convert value to int
  // somehow if we don't do this, things screw up
  var value = parseInt(val);
  this.log("Begin insertion of " + value + ".", true);
  if (this.root === undefined) {
    this.log("Insert " + value + " as root.");
    this.root = new nodeType(value);
    return this.root;
  } else {
    var parentNode = this.root;
    this.log("Start at root node.");
    while (parentNode.leftNode !== undefined || parentNode.rightNode !== undefined) {
      if (value < parseInt(parentNode.value)) {
        this.log(value + " is smaller than " + parseInt(parentNode.value) + ", go left.");
        if (parentNode.leftNode === undefined) break;
        parentNode = parentNode.leftNode;
        continue;
      }
      if (value > parseInt(parentNode.value)) {
        this.log(value + " is larger than " + parseInt(parentNode.value) + ", go right.");
        if (parentNode.rightNode === undefined) break;
        parentNode = parentNode.rightNode;
        continue;
      }
    }
    if (value === parseInt(parentNode.value)) {
      this.log(value + " already exists.");
      return undefined;
    }
    var newNode = new nodeType(value, parentNode);
    var logMsg = "Insert " + value + " as ";
    if (value < parseInt(parentNode.value)) {
      parentNode.leftNode = newNode;
      logMsg += "left";
    } else {
      parentNode.rightNode = newNode;
      logMsg += "right";
    }
    logMsg += " child of " + parentNode.value + ".";
    this.log(logMsg);
    return newNode;
  }
}

BinarySearchTree.prototype.search = function(val) {
  var value = parseInt(val);
  this.log("Begin searching for " + value + ".", true);
  var thisNode = this.root;
  this.log("Starting at root node.");
  while (thisNode !== undefined && value !== parseInt(thisNode.value)) {
    if (value < parseInt(thisNode.value)) {
      this.log(value + " is smaller than " + thisNode.value + ", go left.");
      thisNode = thisNode.leftNode;
      continue;
    }
    if (value > parseInt(thisNode.value)) {
      this.log(value + " is larger than " + thisNode.value + ", go right.");
      thisNode = thisNode.rightNode;
      continue;
    }
  }
  if (thisNode !== undefined && value === parseInt(thisNode.value)) {
    this.log("Searching completed, found " + value + ".");
    return thisNode;
  } else {
    this.log("Searching complete, " + value + " does not exist in the tree.");
    return undefined;
  }
}
//-------------------------------------------------------------------------------------------------
// WEIGHTED BINARY TREE
//-------------------------------------------------------------------------------------------------
var WeightedBinarySearchTree = function(logger) {
  BinarySearchTree.call(this, logger);
}
WeightedBinarySearchTree.inheritsFrom(BinarySearchTree);

WeightedBinarySearchTree.prototype.insert = function(value, type) {
  var nodeType = type;
  if (nodeType === undefined) nodeType = WeightedTreeNode;
  var newNode = BinarySearchTree.prototype.insert.call(this, value, nodeType);
  if (newNode === undefined)
    return undefined;
  var node = newNode.parentNode;
  while (node !== undefined) {
    node.weight += 1;
    node = node.parentNode;
  }
  return newNode;
}

//WeightedBinarySearchTree.prototype.search = function(node) {
  //return BinarySearchTree.prototype.search.call(this, node);
//}
//-------------------------------------------------------------------------------------------------
// VISUAL BINARY TREE
//-------------------------------------------------------------------------------------------------
var VisualBinarySearchTree = function(logger, canvas, config) {
  WeightedBinarySearchTree.call(this, logger);
  this.visualizer = new TreeVisualizer(canvas);
  this.visualizer.config({
    nodeRadius: this.NODE_RADIUS,
    highRes: (window.devicePixelRatio == 2)
  });
  if (config !== undefined)
    this.visualizer.config(config);
}
VisualBinarySearchTree.inheritsFrom(WeightedBinarySearchTree);
// constants
VisualBinarySearchTree.prototype.VERTICAL_DISTANCE = 50;
VisualBinarySearchTree.prototype.HORIZONTAL_DISTANCE = 100;
VisualBinarySearchTree.prototype.NODE_RADIUS = 15;

VisualBinarySearchTree.prototype.rearrangeNodes = function(node) {
  var currentNode = node.parentNode;
  while (currentNode !== undefined && Math.abs(currentNode.center.x - node.center.x) >= (this.HORIZONTAL_DISTANCE / 2))
    currentNode = currentNode.parentNode;
  if (currentNode !== undefined && Math.abs(currentNode.center.x - node.center.x) < (this.HORIZONTAL_DISTANCE / 2)) {
    if (node.value < currentNode.value) {
      this.shiftNode(currentNode.leftNode, 'left');
    }
    if (node.value > currentNode.value) {
      this.shiftNode(currentNode.rightNode, 'right');
    }
  }
  if (node.parentNode !== undefined)
    this.rearrangeNodes(node.parentNode);
}

VisualBinarySearchTree.prototype.insert = function(value, type) {
  var nodeType = type;
  if (nodeType === undefined) nodeType = VisualTreeNode;
  var newNode = WeightedBinarySearchTree.prototype.insert.call(this, value, nodeType);
  if (newNode === undefined)
    return undefined;
  if (newNode === this.root) {
    newNode.center = { x: this.visualizer.startX, y: this.visualizer.startY };
  } else {
    var offset = ~~(this.HORIZONTAL_DISTANCE / 2);
    if (newNode.value < newNode.parentNode.value)
      offset *= -1;
    newNode.center = {
      x: newNode.parentNode.center.x + offset,
      y: newNode.parentNode.center.y + this.VERTICAL_DISTANCE
    };
    this.rearrangeNodes(newNode);
  }
  return newNode;
}
// Methods inheritance
VisualBinarySearchTree.prototype.search = function(node) {
  return WeightedBinarySearchTree.prototype.search.call(this, node);
}

VisualBinarySearchTree.prototype.drawNode = function(node) {
  this.visualizer.drawNode(node);
  if (node.leftNode !== undefined) {
    this.drawNode(node.leftNode);
    this.visualizer.joinNodes(node, node.leftNode);
  }
  if (node.rightNode !== undefined) {
    this.drawNode(node.rightNode);
    this.visualizer.joinNodes(node, node.rightNode);
  }
}

VisualBinarySearchTree.prototype.drawTree = function() {
  this.visualizer.clear();
  this.drawNode(this.root);
}

VisualBinarySearchTree.prototype.highlightNode = function(node) {
  console.log(node);
  if (node === undefined || !node instanceof VisualTreeNode) return;
  this.visualizer.highlightedNode = node;
}
VisualBinarySearchTree.prototype.clearHighlight = function() {
  this.visualizer.highlightedNode = undefined;
}

VisualBinarySearchTree.prototype.shiftNode = function(node, direction) {
  var shiftDirection = direction;
  if (shiftDirection === undefined || shiftDirection !== 'left' && shiftDirection !== 'right')
    shiftDirection = 'left';
  node.center.x += (this.HORIZONTAL_DISTANCE / 2) * (shiftDirection === 'left' ? -1 : 1);
  if (node.leftNode !== undefined)
    this.shiftNode(node.leftNode, direction);
  if (node.rightNode !== undefined)
    this.shiftNode(node.rightNode, direction);
}
