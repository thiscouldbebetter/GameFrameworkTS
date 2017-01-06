
function ControlLabel(name, pos, size, isTextCentered, text)
{
	this.name = name;
	this.pos = pos;
	this.size = size;
	this.isTextCentered = isTextCentered;
	this.text = text;
}

{
	ControlLabel.prototype.draw = function()
	{
		Globals.Instance.display.drawControlLabel(this);
	}
}
