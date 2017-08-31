// This class, as implemented, is only a demonstration.
// Its code is expected to be modified heavily in actual applications,
// including the constructor, the draw() and update() methods,
// and the World.new() method.

function World(name, dateCreated, size, playerPos)
{
	this.name = name;
	this.dateCreated = dateCreated;
	this.size = size;

	this.timerTicksSoFar = 0;

	this.playerLoc = new Location(playerPos);
	var goalPos = new Coords().randomize().multiply(this.size);
	this.goalLoc = new Location(goalPos);
	this.enemyLoc = new Location(this.size.clone().subtract(playerPos));

	var entityDimension = 10;
	var entitySize = new Coords(1, 1, 1).multiplyScalar(entityDimension);

	this.colliderForPlayer = new Sphere(playerPos, entityDimension / 2);
	this.colliderForGoal = new Bounds(this.goalLoc.pos, entitySize);
	this.colliderForEnemy = new Sphere(this.enemyLoc.pos, entityDimension / 2);
	this.colliderForObstacle = new Arc
	(
		new Shell
		(
			new Sphere(goalPos, entityDimension * 4), // sphereOuter
			entityDimension * 3 // radiusInner
		),
		new Wedge(goalPos, 0, .4) // Error if larger than .5
	);

	var playerColor = "Gray";
	var visualPlayerBody = new VisualCircle(entityDimension / 2, playerColor);
	var visualPlayerDirectionalIndicator = new VisualDirectional
	(
		new VisualNone(),
		[
			new VisualRay
			(
				entityDimension * 1.25, // length
				playerColor
			)
		]
	)
	
	var visualRectangleSmall = new VisualRectangle(entitySize.clone().divideScalar(4), playerColor);
	var visualPlayerMovementIndicator = new VisualDirectional
	(
		new VisualNone(),
		[
			new VisualAnimation
			(
				5, // ticksPerFrame
				[
					new VisualOffset(visualRectangleSmall, new Coords(1, 0).multiplyScalar(entityDimension)),
					new VisualOffset(visualRectangleSmall, new Coords(1.5, 0).multiplyScalar(entityDimension)),
					new VisualOffset(visualRectangleSmall, new Coords(2, 0).multiplyScalar(entityDimension)),
				]
			),
			new VisualAnimation
			(
				5, // ticksPerFrame
				[
					new VisualOffset(visualRectangleSmall, new Coords(0, 1).multiplyScalar(entityDimension)),
					new VisualOffset(visualRectangleSmall, new Coords(0, 1.5).multiplyScalar(entityDimension)),
					new VisualOffset(visualRectangleSmall, new Coords(0, 2).multiplyScalar(entityDimension)),
				]
			),
			new VisualAnimation
			(
				5, // ticksPerFrame
				[
					new VisualOffset(visualRectangleSmall, new Coords(-1, 0).multiplyScalar(entityDimension)),
					new VisualOffset(visualRectangleSmall, new Coords(-1.5, 0).multiplyScalar(entityDimension)),
					new VisualOffset(visualRectangleSmall, new Coords(-2, 0).multiplyScalar(entityDimension)),
				]
			),
			new VisualAnimation
			(
				5, // ticksPerFrame
				[
					new VisualOffset(visualRectangleSmall, new Coords(0, -1).multiplyScalar(entityDimension)),
					new VisualOffset(visualRectangleSmall, new Coords(0, -1.5).multiplyScalar(entityDimension)),
					new VisualOffset(visualRectangleSmall, new Coords(0, -2).multiplyScalar(entityDimension)),
				]
			),
		]
	);

	var visualPlayerName = new VisualOffset
	(
		new VisualText("Player", playerColor),
		new Coords(0, entityDimension)
	);

	this.visualForPlayer = new VisualGroup
	([
		visualPlayerDirectionalIndicator,
		visualPlayerBody,
		visualPlayerName,
		visualPlayerMovementIndicator,
	]);

	var goalColor = "Green";
	this.visualForGoal = new VisualGroup
	([
		new VisualRectangle(entitySize, goalColor),
		new VisualOffset
		(
			new VisualText("Goal", goalColor),
			new Coords(0, entityDimension)
		)
	]);

	var enemyColor = "Red";

	this.visualForEnemy = new VisualGroup
	([
		new VisualPolygon
		(
			enemyColor,
			// vertices
			[
				new Coords(0, -entityDimension).divideScalar(2),
				new Coords(entityDimension, entityDimension).divideScalar(2),
				new Coords(-entityDimension, entityDimension).divideScalar(2),
			]
		),
		new VisualOffset
		(
			new VisualText("Enemy", enemyColor),
			new Coords(0, entityDimension)
		)
	]);
		
	this.visualForObstacle = new VisualArc
	(
		this.colliderForObstacle,
		enemyColor, enemyColor
	);

	// helper variables
	this.displacement = new Coords();
}

{
	// static methods

	World.new = function()
	{
		var now = DateTime.now();
		var nowAsString = now.toStringMMDD_HHMM_SS();

		var returnValue = new World
		(
			"World-" + nowAsString,
			now, // dateCreated
			Globals.Instance.display.sizeInPixels.clone(),
			new Coords(10, 10)
		);
		return returnValue;
	}

	// instance methods

	World.prototype.draw = function()
	{
		var display = Globals.Instance.display;

		display.clear();

		this.visualForGoal.drawToDisplayForDrawableAndLoc(display, null, this.goalLoc);
		this.visualForPlayer.drawToDisplayForDrawableAndLoc(display, null, this.playerLoc);
		this.visualForEnemy.drawToDisplayForDrawableAndLoc(display, null, this.enemyLoc);
		this.visualForObstacle.drawToDisplayForDrawableAndLoc(display, null, this.goalLoc);
	}

	World.prototype.updateForTimerTick = function()
	{
		this.updateForTimerTick_Input();
		this.updateForTimerTick_Agents();
		this.updateForTimerTick_WinOrLose();
		this.timerTicksSoFar++;
	}

	World.prototype.updateForTimerTick_Input = function()
	{
		this.playerLoc.orientation.forwardSet(Coords.Instances.Zeroes);

		var inputHelper = Globals.Instance.inputHelper;
		if (inputHelper.isMouseClicked == true)
		{
			inputHelper.isMouseClicked = false;
			var mouseClickPos = inputHelper.mouseClickPos;
			this.playerLoc.pos.overwriteWith(mouseClickPos);
			Globals.Instance.soundHelper.soundWithNamePlayAsEffect("Sound");
		}

		var inputsActive = inputHelper.inputsActive;
		for (var i = 0; i < inputsActive.length; i++)
		{
			var inputActive = inputsActive[i];
			if (inputActive == "Escape")
			{
				var universe = Globals.Instance.universe;
				var venueNext = new VenueControls
				(
					Globals.Instance.controlBuilder.configure
					(
						Globals.Instance.display.sizeInPixels
					)
				);
				venueNext = new VenueFader(venueNext);
				universe.venueNext = venueNext;
			}
			else if
			(
				inputActive.startsWith("Arrow") == true
				|| inputActive.startsWith("Gamepad") == true
			)
			{
				var directionToMove;

				if (inputActive.endsWith("Down") == true)
				{
					directionToMove = new Coords(0, 1);
				}
				else if (inputActive.endsWith("Left") == true)
				{
					directionToMove = new Coords(-1, 0);
				}
				else if (inputActive.endsWith("Right") == true)
				{
					directionToMove = new Coords(1, 0);
				}
				else if (inputActive.endsWith("Up") == true)
				{
					directionToMove = new Coords(0, -1);
				}
				else
				{
					directionToMove = new Coords(0, 0);
				}

				this.playerLoc.orientation.forwardSet(directionToMove);
				var vel = this.playerLoc.vel;
				if (vel.equals(directionToMove) == false)
				{
					this.playerLoc.timeOffsetInTicks = this.timerTicksSoFar;
				}
				vel.overwriteWith(directionToMove);
				this.playerLoc.pos.add(vel).trimToRangeMax(this.size);
			}
		}
	}

	World.prototype.updateForTimerTick_Agents = function()
	{
		var directionFromEnemyToCursor = this.displacement.overwriteWith
		(
			this.playerLoc.pos
		).subtract
		(
			this.enemyLoc.pos
		).normalize();

		this.enemyLoc.pos.add(directionFromEnemyToCursor);
	}

	World.prototype.updateForTimerTick_WinOrLose = function()
	{
		var messageToDisplay = null;

		var collisionHelper = Globals.Instance.collisionHelper;

		var doPlayerAndEnemyCollide = collisionHelper.doCollidersCollide
		(
			this.colliderForPlayer,
			this.colliderForEnemy
		);
		
		var doPlayerAndObstacleCollide = collisionHelper.doCollidersCollide
		(
			this.colliderForPlayer,
			this.colliderForObstacle
		);

		if (doPlayerAndEnemyCollide == true || doPlayerAndObstacleCollide == true)
		{
			messageToDisplay = "You lose!";
		}
		else
		{
			var doPlayerAndGoalCollide = collisionHelper.doCollidersCollide
			(
				this.colliderForPlayer,
				this.colliderForGoal
			);

			if (doPlayerAndGoalCollide == true)
			{
				messageToDisplay = "You win!"
			}
		}

		if (messageToDisplay != null)
		{
			var venueMessage = new VenueMessage
			(
				messageToDisplay,
				null // venueNext
			);

			var venueAfterMessageAcknowedged = new VenueFader
			(
				new VenueControls
				(
					Globals.Instance.controlBuilder.title
					(
						Globals.Instance.display.sizeInPixels
					)
				),
				venueMessage // venueToFadeFrom
			);

			venueMessage.venueNext = venueAfterMessageAcknowedged;

			var venueNext = new VenueFader(venueMessage);

			var universe = Globals.Instance.universe;
			universe.venueNext = venueNext;
		}
	}
}
