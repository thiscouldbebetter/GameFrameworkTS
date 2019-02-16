
function VenueLayered(children, colorToOverlayBetweenChildren)
{
	this.children = children;
	this.colorToOverlayBetweenChildren = colorToOverlayBetweenChildren;
}

{
	VenueLayered.prototype.initialize = function(universe)
	{
		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			if (child.initialize != null)
			{
				child.initialize(universe);
			}
		}
	};

	VenueLayered.prototype.updateForTimerTick = function(universe)
	{
		this.children[this.children.length - 1].updateForTimerTick(universe);
	};

	VenueLayered.prototype.draw = function(universe)
	{
		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			child.draw(universe);
			if (this.colorToOverlayBetweenChildren != null)
			{
				var display = universe.display;
				display.drawRectangle
				(
					Coords.Instances().Zeroes, display.size,
					this.colorToOverlayBetweenChildren
				);
			}
		}
	};
}
