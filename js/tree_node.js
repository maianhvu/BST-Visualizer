//-------------------------------------------------------------------------------------------------
// TREE NODE
//-------------------------------------------------------------------------------------------------
/* @constructor
 * @params
 *   value: the value to be held
 *   parentNode: self-explanatory
 */
var TreeNode = function(value, parentNode) {
  this.value = value;
  this.parentNode = parentNode;
  this.leftNode = undefined;
  this.rightNode = undefined;
};
//-------------------------------------------------------------------------------------------------
// WEIGHTED TREE NODE
//-------------------------------------------------------------------------------------------------
var WeightedTreeNode = function(value, parentNode) {
  TreeNode.call(this, value, parentNode);
  this.weight = 1;
  this.isRightChild = parentNode === undefined || value > parentNode.value;
};
WeightedTreeNode.inheritsFrom(TreeNode);
//-------------------------------------------------------------------------------------------------
// VISUAL TREE NODE
//-------------------------------------------------------------------------------------------------
var VisualTreeNode = function(value, parentNode) {
  WeightedTreeNode.call(this, value, parentNode);
  this.center = { x: undefined, y: undefined};
};
VisualTreeNode.inheritsFrom(WeightedTreeNode);
