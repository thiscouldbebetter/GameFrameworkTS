
function ControlList(name, pos, size, dataBindingForItems, bindingExpressionForItemText)
{
	this.name = name;
	this.pos = pos;
	this.size = size;
	this.dataBindingForItems = dataBindingForItems;
	this.bindingExpressionForItemText = bindingExpressionForItemText;

	this.itemSpacing = 12; // hack

	this.indexOfItemSelected = 0;
	this.indexOfFirstItemVisible = 0;
}

{
	ControlList.prototype.draw = function()
	{
		Globals.Instance.displayHelper.drawControlList(this);
	}

	ControlList.prototype.itemSelected = function()
	{
		return (this.indexOfItemSelected == null ? null : this.items()[this.indexOfItemSelected]);
	}

	ControlList.prototype.items = function()
	{
		return this.dataBindingForItems.get();
	}

	ControlList.prototype.mouseClick = function(clickPos)
	{
		var offsetOfItemClicked = clickPos.y - this.pos.y;
		var indexOfItemClicked = 
			this.indexOfFirstItemVisible 
			+ Math.floor
			(
				offsetOfItemClicked 
				/ this.itemSpacing
			);

		if (indexOfItemClicked <= this.items.length)
		{
			this.indexOfItemSelected = indexOfItemClicked;
		}	
	}
}
