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
  this.weight = 1;
  this.isRightChild = parentNode === undefined || value > parentNode.value;
};
//-------------------------------------------------------------------------------------------------
// VISUAL TREE NODE
//-------------------------------------------------------------------------------------------------
var VisualTreeNode = function(value, parentNode) {
  TreeNode.call(this, value, parentNode);
  this.center = { x: undefined, y: undefined};
};
VisualTreeNode.inheritsFrom(TreeNode);
