
function Orientation(forward, down)
{
	this.forward = forward.clone().normalize();
	this.right = down.clone().crossProduct(this.forward).normalize();
	this.down = this.forward.clone().crossProduct(this.right).normalize();

	this.axes = [ this.forward, this.right, this.down ];
}

{
	// instances

	Orientation.Instances = new Orientation_Instances();

	function Orientation_Instances()
	{
		this.ForwardXDownZ = new Orientation
		(
			new Coords(1, 0, 0), // forward
			new Coords(0, 0, 1) // down
		);

		this.ForwardZDownY = new Orientation
		(
			new Coords(0, 0, 1), // forward
			new Coords(0, 1, 0) // down
		);
	}

	// methods

	Orientation.prototype.clone = function()
	{
		return new Orientation(this.forward.clone(), this.down.clone());
	}

	Orientation.prototype.forwardSet = function(value)
	{
		this.forward.overwriteWith(value).normalize();
		this.right.overwriteWith(this.down).crossProduct(this.forward).normalize();
		this.down.overwriteWith(this.forward).crossProduct(this.right).normalize();
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

			returnValue = returnValue.wrapToRangeMinMax(0, 1);
		}

		return returnValue;
	}
}
