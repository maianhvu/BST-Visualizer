var BinarySearchTree = function() {
  this.root = undefined;
}

BinarySearchTree.prototype.insert = function(val, type) {
  // for abstraction, default to TreeNode
  var nodeType = type;
  if (nodeType === undefined) nodeType = TreeNode;
  // convert value to int
  // somehow if we don't do this, things screw up
  var value = parseInt(val);
  var newNode = new nodeType(value);

  if (this.root === undefined) {
    this.root = newNode;
  } else {
    var thisNode = this.root;
    while (thisNode !== undefined) {
      if (value < thisNode.value) {
        if (thisNode.leftNode !== undefined)
          thisNode = thisNode.leftNode;
        else {
          newNode.isRightChild = false;
          thisNode.leftNode = newNode;
          break;
        }
      } else if (value > thisNode.value) {
        if (thisNode.rightNode !== undefined)
          thisNode = thisNode.rightNode;
        else {
          thisNode.rightNode = newNode;
          break;
        }
      } else return undefined;
    }
    newNode.parentNode = thisNode;
    while (thisNode !== undefined) {
      thisNode.weight += 1;
      thisNode = thisNode.parentNode;
    }
  }
  return newNode;
}

BinarySearchTree.prototype.search = function(val) {
  if (this.root === undefined) return undefined;
  var value = parseInt(val);
  var thisNode = this.root;
  while (thisNode !== undefined && value !== parseInt(thisNode.value)) {
    if (value < parseInt(thisNode.value)) {
      thisNode = thisNode.leftNode;
      continue;
    }
    if (value > parseInt(thisNode.value)) {
      thisNode = thisNode.rightNode;
      continue;
    }
  }
  if (thisNode !== undefined && value === parseInt(thisNode.value))
    return thisNode;
  else
    return undefined;
}

BinarySearchTree.prototype.searchMinMax = function(min, node) {
  if (this.root === undefined) return undefined;
  var thisNode = node;
  if (thisNode === undefined) thisNode = this.root;
  while (min && thisNode.leftNode !== undefined || !min && thisNode.rightNode !== undefined) {
    thisNode = min ? thisNode.leftNode : thisNode.rightNode;
  }
  return thisNode;
}

BinarySearchTree.prototype.searchMin = function(node) {
  return BinarySearchTree.prototype.searchMinMax.call(this, true, node);
}
BinarySearchTree.prototype.searchMax = function(node) {
  return BinarySearchTree.prototype.searchMinMax.call(this, false, node);
}

BinarySearchTree.prototype.successor = function(val) {
  var value = parseInt(val);
  var result = this.root;
  if (result === undefined) {
    return undefined;
  }
  // TODO: Code up the rest of this thing
}
//-------------------------------------------------------------------------------------------------
// VISUAL BINARY TREE
//-------------------------------------------------------------------------------------------------
var VisualBinarySearchTree = function(canvas, config) {
  BinarySearchTree.call(this);
  this.visualizer = new TreeVisualizer(canvas);
  this.visualizer.config({
    nodeRadius: this.NODE_RADIUS,
    highRes: (window.devicePixelRatio == 2)
  });
  if (config !== undefined)
    this.visualizer.config(config);
}
VisualBinarySearchTree.inheritsFrom(BinarySearchTree);
// constants
VisualBinarySearchTree.prototype.VERTICAL_DISTANCE = 50;
VisualBinarySearchTree.prototype.HORIZONTAL_DISTANCE = 100;
VisualBinarySearchTree.prototype.NODE_RADIUS = 15;

VisualBinarySearchTree.prototype.rearrangeNodes = function(node, isFirstIteration) {
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
  if (isFirstIteration) {
    var otherChild = node.parentNode.leftNode;
    if (otherChild === node) otherChild = node.parentNode.rightNode;
    if (otherChild !== undefined) this.rearrangeNodes(otherChild);
  }
}

VisualBinarySearchTree.prototype.insert = function(value, type) {
  var nodeType = type;
  if (nodeType === undefined) nodeType = VisualTreeNode;
  var newNode = BinarySearchTree.prototype.insert.call(this, value, nodeType);
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
    this.rearrangeNodes(newNode, true);
  }
  return newNode;
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
  if (this.root !== undefined)
    this.drawNode(this.root);
}

VisualBinarySearchTree.prototype.highlightNode = function(node) {
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
