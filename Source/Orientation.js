
function Orientation(forward, down)
{
	this.forward = forward.clone().normalize();
	this.right = down.clone().crossProduct(this.forward).normalize();
	this.down = this.forward.clone().crossProduct(this.right).normalize();
}

{
	Orientation.prototype.forwardSet = function(value)
	{
		this.forward.overwriteWith(value).normalize();
		this.right.overwriteWith(this.down).crossProduct(this.forward).normalize();
	}

	Orientation.prototype.overwriteWith = function(other)
	{
		this.forward.overwriteWith(other.forward);
		this.right.overwriteWith(other.right);
		this.down.overwriteWith(other.down);
	}

	// heading

	Orientation.prototype.headingInTurns = function()
	{
		var returnValue;
		
		var forward = this.forward;
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
}
