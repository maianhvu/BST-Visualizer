var TreeVisualizer = function(canvas) {
  this.canvas = canvas;
  this.ctx = canvas.getContext("2d");
  this.nodeRadius = undefined;
  this.highRes = undefined;
  this.drawWeights = false;
  this.textHorizontalOffset = 1;

  this.startX = Math.round(canvas.getAttribute('width') / 2);
  this.startY = Math.round(canvas.getAttribute('height') / 12);

  // for moving
  this.canvas.canvasOffset = { x: 0, y: 0 };

  this.highlightedNode = undefined;
};

TreeVisualizer.prototype.config = function(options) {
  if (options !== undefined) {
    if (options.nodeRadius !== undefined && !isNaN(options.nodeRadius))
      this.nodeRadius = options.nodeRadius;
    if (options.highRes !== undefined && options.highRes) {
      this.canvas.setAttribute('width', this.canvas.getAttribute('width') * 2);
      this.canvas.setAttribute('height', this.canvas.getAttribute('height') * 2);
      this.ctx.scale(2,2);
    }
    if (options.drawWeights !== undefined)
      this.drawWeights = options.drawWeights;
  }
  // set fill style
  this.ctx.lineWidth = 2;
  this.ctx.textBaseline = "middle";
}

TreeVisualizer.prototype.clear = function() {
  this.ctx.clearRect(0,0,this.canvas.getAttribute('width'),this.canvas.getAttribute('height'));
}

// Separate methods to draw components of a node
/**
 * @method drawCircle
 * @params
 *   center: object({x,y})
 *   radius: numeric
 * @description
 *   Draws the outer circle of a node, or fill it in case of a highlight
 */
TreeVisualizer.prototype.drawCircle = function(center, radius, highlight) {
  this.ctx.beginPath();
  this.ctx.arc(this.canvas.canvasOffset.x + center.x, this.canvas.canvasOffset.y + center.y, radius, 0, 2*Math.PI);
  if (highlight === undefined || highlight === false) {
    this.ctx.strokeStyle = "#f2ab1b";
    this.ctx.stroke();
  } else {
    this.ctx.fillStyle = "#f2ab1b";
    this.ctx.fill();
  }
};

/**
 * @method drawValue
 * @params
 *   center: object({x, y})
 *   value: the value to draw
 * @description
 *   Draws the value centered at (x,y)
 */
TreeVisualizer.prototype.drawValue = function(center, value, highlight) {
  this.ctx.font = "14px Helvetica";
  this.ctx.textAlign = "start";
  var textWidth = this.ctx.measureText(value).width;
  this.ctx.fillStyle = (highlight === true) ? "#fff" : "#000";
  this.ctx.fillText(value, this.canvas.canvasOffset.x + center.x - Math.round(textWidth / 2), this.canvas.canvasOffset.y + center.y + this.textHorizontalOffset);
};

/**
 * @method drawWeight
 * @params
 *   position: object({x,y})
 *   weight: the value to draw
 *   leftAlign: this is additionally supplied so that leftChild doesn't have its link with the parent node
 *              blocked
 * @description
 *   Draws the weight of the node either on the left side or right side, depends on which kind of child
 *   it is to the parent node
 */
TreeVisualizer.prototype.drawWeight = function(position, weight, leftAlign) {
  if (!this.drawWeights) return;
  this.ctx.font = "10px Helvetica";
  if (leftAlign === undefined) leftAlign = true;
  this.ctx.textAlign = leftAlign ? "start" : "end";
  this.ctx.fillStyle = "#000";
  this.ctx.fillText(weight, this.canvas.canvasOffset.x + position.x, this.canvas.canvasOffset.y + position.y);
};

/*
 * @method drawNode
 * @param the node object to be drawn
 * @description
 *   combine the drawCircle, drawValue and drawWeight to draw a proper node
 */
TreeVisualizer.prototype.drawNode = function(node) {
  if (node === undefined || !node instanceof VisualTreeNode) {
    console.log("Node is not a visual node.");
    console.log(node);
    return;
  }
  var highlight = this.highlightedNode !== undefined && node.value === this.highlightedNode.value;
  this.drawCircle(node.center, this.nodeRadius, highlight);
  this.drawValue(node.center, node.value, highlight);
  this.drawWeight({
    x: node.center.x + Math.round(this.nodeRadius * .9) * (node.isRightChild ? 1 : -1),
    y: node.center.y - Math.round(this.nodeRadius * .9)},
    node.weight, node.isRightChild);
};

/*
 * @method joinNodes
 * @params node1, node2 are VisualTreeNodes to be joined
 * @description
 *   Use trigonometry to calculate and draw the line connecting node1 and node 2
 */
TreeVisualizer.prototype.joinNodes = function(node1, node2) {
  if (!node1 instanceof VisualTreeNode || !node2 instanceof VisualTreeNode) {
    console.log("Both nodes must be visual nodes.");
    console.log(node1);
    console.log(node2);
    return;
  }
  var theta = Math.atan2(node1.center.y - node2.center.y, node1.center.x - node2.center.x);
  var xOffset = Math.round(this.nodeRadius * Math.cos(theta));
  var yOffset = Math.round(this.nodeRadius * Math.sin(theta));
  this.ctx.moveTo(this.canvas.canvasOffset.x + node1.center.x - xOffset, this.canvas.canvasOffset.y + node1.center.y - yOffset);
  this.ctx.lineTo(this.canvas.canvasOffset.x + node2.center.x + xOffset, this.canvas.canvasOffset.y + node2.center.y + yOffset);
  this.ctx.stroke();
};

TreeVisualizer.prototype.getNodeBounds = function(node) {
  if (!node instanceof VisualTreeNode) {
    console.log("Node must be a visual node.");
    console.log(node);
    return undefined;
  }
  // TODO: find the square of the node
  // TODO: take account for weights too, using measureText
  // TODO: put proper return values
  return {
    x: undefined,
    y: undefined,
    w: undefined,
    h: undefined
  };
}
