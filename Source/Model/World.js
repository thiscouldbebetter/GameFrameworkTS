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
	
	this.actions = 
	[
		Action.Instances.DoNothing,
		new Action
		(
			"ShowMenu",
			function perform(actor)
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
		),
		new Action
		(
			"MoveDown",
			function perform(actor)
			{
				var world = Globals.Instance.universe.world;
				world.bodyMoveInDirection(actor, Coords.Instances.ZeroOneZero);
			}
		),
		new Action
		(
			"MoveLeft",
			function perform(actor)
			{
				var world = Globals.Instance.universe.world;
				world.bodyMoveInDirection(actor, Coords.Instances.MinusOneZeroZero);
			}
		),
		new Action
		(
			"MoveRight",
			function perform(actor)
			{
				var world = Globals.Instance.universe.world;
				world.bodyMoveInDirection(actor, Coords.Instances.OneZeroZero);
			}
		),
		new Action
		(
			"MoveUp",
			function perform(actor)
			{
				var world = Globals.Instance.universe.world;
				world.bodyMoveInDirection(actor, Coords.Instances.ZeroMinusOneZero);
			}
		),
	].addLookups("name");
	
	this.inputToActionMappings = 
	[
		new InputToActionMapping("Escape", "ShowMenu"),
		new InputToActionMapping("ArrowDown", "MoveDown"),
		new InputToActionMapping("ArrowLeft", "MoveLeft"),
		new InputToActionMapping("ArrowRight", "MoveRight"),
		new InputToActionMapping("ArrowUp", "MoveUp"),
	].addLookups("inputName");
	
	// bodies

	var entityDimension = 10;
	var entitySize = new Coords(1, 1, 1).multiplyScalar(entityDimension);

	// player

	var playerLoc = new Location(playerPos);
	var playerCollider = new Sphere(playerLoc.pos, entityDimension / 2);
	var playerColor = "Gray";
	var playerVisualBody = new VisualCircle(entityDimension / 2, playerColor);
	var playerVisualDirectionalIndicator = new VisualDirectional
	(
		new VisualNone(),
		[
			new VisualRay
			(
				entityDimension * 1.25, // length
				playerColor
			)
		]
	);
	var visualRectangleSmall = new VisualRectangle(entitySize.clone().divideScalar(4), playerColor);
	var playerVisualMovementIndicator = new VisualDirectional
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

	var playerVisualName = new VisualOffset
	(
		new VisualText("Player", playerColor),
		new Coords(0, entityDimension)
	);

	var playerVisual = new VisualGroup
	([
		playerVisualDirectionalIndicator,
		playerVisualBody,
		playerVisualName,
		playerVisualMovementIndicator,
	]);
	
	var playerBody = new Body
	(
		"Player", 
		playerLoc, 
		playerCollider, 
		playerVisual
	);

	// goal

	var goalPos = new Coords().randomize().multiplyScalar
	(
		.5
	).addDimensions
	(
		.25, .25, 0
	).multiply
	(
		this.size
	);
	
	var goalColor = "Green";
	var goalBody = new Body
	(
		"Goal",
		new Location(goalPos),
		new Bounds(goalPos, entitySize), // collider
		new VisualGroup
		([
			new VisualRectangle(entitySize, goalColor),
			new VisualOffset
			(
				new VisualText("Goal", goalColor),
				new Coords(0, entityDimension)
			)
		])
	)

	// enemy
	
	var enemyColor = "Red";
	var enemyPos = this.size.clone().subtract(playerBody.loc.pos);
	var enemyBody = new Body
	(
		"Enemy",
		new Location(enemyPos),
		new Sphere(enemyPos, entityDimension / 2), // collider
		new VisualGroup
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
		])
	);

	// obstacle
	
	var obstaclePos = goalBody.loc.pos;
	var obstacleColor = enemyColor;
	var obstacleCollider = new Arc
	(
		new Shell
		(
			new Sphere(obstaclePos, entityDimension * 3), // sphereOuter
			entityDimension * 2 // radiusInner
		),
		new Wedge(obstaclePos, 0, .85)
	);
	
	var obstacleBody = new Body
	(
		"Obstacle",
		new Location(obstaclePos),
		obstacleCollider,
		new VisualArc
		(
			obstacleCollider,
			obstacleColor, obstacleColor
		)
	);
	
	this.bodies = 
	[
		goalBody, playerBody, enemyBody, obstacleBody 
	].addLookups("name");

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

	World.prototype.bodyMoveInDirection = function(body, directionToMove)
	{
		var bodyLoc = body.loc;
		
		bodyLoc.orientation.forwardSet(directionToMove);
		var vel = bodyLoc.vel;
		if (vel.equals(directionToMove) == false)
		{
			bodyLoc.timeOffsetInTicks = this.timerTicksSoFar;
		}
		vel.overwriteWith(directionToMove);
		bodyLoc.pos.add(vel).trimToRangeMax(this.size);
	}

	World.prototype.draw = function()
	{
		var display = Globals.Instance.display;

		display.clear();

		for (var i = 0; i < this.bodies.length; i++)
		{
			var body = this.bodies[i];
			body.visual.drawToDisplayForDrawableAndLoc(display, body, body.loc);
		}
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
		var player = this.bodies["Player"];
		var playerLoc = player.loc;
		playerLoc.orientation.forwardSet(Coords.Instances.Zeroes);

		var inputHelper = Globals.Instance.inputHelper;
		if (inputHelper.isMouseClicked == true)
		{
			inputHelper.isMouseClicked = false;
			var mouseClickPos = inputHelper.mouseClickPos;
			playerLoc.pos.overwriteWith(mouseClickPos);
			Globals.Instance.soundHelper.soundWithNamePlayAsEffect("Sound");
		}

		var inputsActive = inputHelper.inputsActive;
		for (var i = 0; i < inputsActive.length; i++)
		{
			var inputActive = inputsActive[i];
			var mapping = this.inputToActionMappings[inputActive];
			var actionName = mapping.actionName;
			var action = this.actions[actionName];
			action.perform(player);
		}
	}

	World.prototype.updateForTimerTick_Agents = function()
	{
		var player = this.bodies["Player"];
		var enemy = this.bodies["Enemy"];
		var enemyLoc = enemy.loc;
		
		var directionFromEnemyToCursor = this.displacement.overwriteWith
		(
			player.loc.pos
		).subtract
		(
			enemyLoc.pos
		).normalize();

		enemyLoc.pos.add(directionFromEnemyToCursor);
	}

	World.prototype.updateForTimerTick_WinOrLose = function()
	{
		var player = this.bodies["Player"];
		var playerCollider = player.collider;

		var goal = this.bodies["Goal"];
		var enemy = this.bodies["Enemy"];
		var obstacle = this.bodies["Obstacle"];

		var messageToDisplay = null;

		var collisionHelper = Globals.Instance.collisionHelper;

		var doPlayerAndEnemyCollide = collisionHelper.doCollidersCollide
		(
			playerCollider,
			enemy.collider
		);
		
		var doPlayerAndObstacleCollide = collisionHelper.doCollidersCollide
		(
			playerCollider,
			obstacle.collider
		);

		if (doPlayerAndEnemyCollide == true || doPlayerAndObstacleCollide == true)
		{
			messageToDisplay = "You lose!";
		}
		else
		{
			var doPlayerAndGoalCollide = collisionHelper.doCollidersCollide
			(
				playerCollider,
				goal.collider
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
