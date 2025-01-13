
namespace ThisCouldBeBetter.GameFramework
{

export class VenueLayered implements Venue
{
	children: Venue[];
	colorToOverlayBetweenChildren: Color;

	constructor(children: Venue[], colorToOverlayBetweenChildren: Color)
	{
		this.children = children;
		this.colorToOverlayBetweenChildren = colorToOverlayBetweenChildren;
	}

	finalize(universe: Universe) {}

	finalizeIsComplete(): boolean { return true; }

	initialize(universe: Universe)
	{
		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			if (child.initialize != null)
			{
				child.initialize(universe);
			}
		}
	}

	initializeIsComplete(universe: Universe): boolean
	{
		var childrenAreInitialized =
			this.children.some
			(
				x => x.initializeIsComplete(universe) == false
			) == false;
		return childrenAreInitialized;
	}

	updateForTimerTick(universe: Universe)
	{
		var childTop = this.children[this.children.length - 1];
		childTop.updateForTimerTick(universe);
	}

	draw(universe: Universe)
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
					Coords.Instances().Zeroes, display.sizeInPixels,
					this.colorToOverlayBetweenChildren, null
				);
			}
		}
	}
}

}
