
function Orientation(forward)
{
	this._forward = new Coords();
	this.forward(forward.clone().normalize());
}

{
	Orientation.prototype.forward = function(valueToSet)
	{
		if (valueToSet != null)
		{
			this._forward.overwriteWith(valueToSet);
		}
		
		this.rightUpdate();
		
		return this._forward;
	}
	
	Orientation.prototype.headingInTurns = function()
	{
		var returnValue;
		
		var forward = this.forward();
		if (forward.x == 0 && forward.y == 0)
		{
			returnValue = null;
		}
		else
		{
			returnValue = Math.atan2(forward.y, forward.x) / (Math.PI * 2);
			
			if (returnValue < 0)
			{
				returnValue += 1;
			}
		}
		
		return returnValue;
	}
		
	Orientation.prototype.overwriteWith = function(other)
	{
		this._forward.overwriteWith(other.forward());
		this.right.overwriteWith(other.right);
		return this;
	}
	
	Orientation.prototype.rightUpdate = function()
	{
		this.right = new Coords
		(
			0 - this._forward.y, 
			this._forward.x
		);
	}
}
