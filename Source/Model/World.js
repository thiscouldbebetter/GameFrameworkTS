// This class, as implemented, is only a demonstration.
// Its code is expected to be modified heavily in actual applications,
// including the constructor, the draw() and update() methods,
// and the World.new() method.

function World(name, dateCreated, place)
{
	this.name = name;
	this.dateCreated = dateCreated;

	this.timerTicksSoFar = 0;

	this.place = place;
}

{
	// static methods

	World.new = function(universe)
	{
		var now = DateTime.now();
		var nowAsString = now.toStringMMDD_HHMM_SS();

		var place = new PlaceDemo
		(
			universe,
			universe.display.sizeInPixels.clone(), // size
			new Coords(10, 10) // playerPos
		);
		place.placeInner.entitiesSpawn();

		var returnValue = new World
		(
			"World-" + nowAsString,
			now, // dateCreated
			place
		);
		return returnValue;
	}

	// instance methods

	World.prototype.draw = function(universe)
	{
		this.place.draw(universe, this);
	}

	World.prototype.updateForTimerTick = function(universe)
	{
		this.place.updateForTimerTick(universe, this);
		this.timerTicksSoFar++;
	}
}
