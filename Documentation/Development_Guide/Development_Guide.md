This Could Be Better Game Framework Development Guide
=====================================================

This guide illustrates the creation of a new game from scratch using the This Could Be Better Game Framework.

First, we need to create a new game based on the stub game.  Download a copy of the GameFrameworkTS repository by running this command:

	git clone https://github.com/thiscouldbebetter/GameFrameworkTS

Then, within the repository, locate the "Source/Stub" directory.

Copy the contents the Stub directory to any convenient locatation outside of the original GameFrameworkTS repository.

Now we need to decide what to call our new game.  Let's make a clone of the classic arcade game Defender, in which the player controls a spaceship tasked with protecting the population of a planet from alien abduction.  Rename the Stub directory to "DefenderClone".

In the newly renamed DefenderClone directory, open the Source directory.

In the Source directory, rename the file "GameStub.html" to "DefenderClone.html".

Still in the Source directory, open the file "Game.ts" in a text editor, locate the call to Universe.create(), change the first argument from "GameStub" to "DefenderClone", and save.  This string will be used to name any saved game files.

Most of the gameplay in classic arcade games take place on "levels", so let's rename the PlaceStub class accordingly.  Still in the Source directory, rename the file "PlaceStub.ts" to "PlaceLevel.ts".

Open the newly renamed file PlaceLevel.ts in a text editor, replace all instances of the text "Stub" with "Level", and save.  When you're done, it should look like this:

	class PlaceLevel extends Place
	{
		constructor()
		{
			super
			(
				PlaceLevel.name,
				PlaceLevel.defnBuild().name,
				Coords.fromXY(400, 300), // size
				 // entities
				[
					new UserInputListener()
				]
			);
		}

		static defnBuild(): PlaceDefn
		{
			var actionShowMenu = Action.Instances().ShowMenuSettings;

			var actions =
			[
				actionShowMenu
			];

			var actionToInputsMappings =
			[
				ActionToInputsMapping.fromActionAndInputName
				(
					actionShowMenu.name, Input.Names().Escape
				)
			];

			var entityPropertyNamesToProcess: string[] =
			[
				// todo
			];

			return PlaceDefn.from4
			(
				PlaceLevel.name,
				actions,
				actionToInputsMappings,
				entityPropertyNamesToProcess
			);
		}
	}

Still in the Source directory, open the file "WorldGame.ts" in a text editor.  Locate the constructor, and change the first argument to the super() constructor from "GameStub" to "DefenderClone".  Replace both instances of the text "PlaceStub" with "PlaceLevel".  Save the file.  When you're done, it should look like the following:

	class WorldGame extends World
	{
		constructor()
		{
			super
			(
				"DefenderClone",
				DateTime.now(),
				WorldGame.defnBuild(),
				[ new PlaceLevel() ]
			);
		}

		static defnBuild(): WorldDefn
		{
			return new WorldDefn
			([
				[
					ActivityDefn.Instances().HandleUserInput
				],
				[
					PlaceLevel.defnBuild()
				]
			]);
		}

		toControl(): ControlBase
		{
			return new ControlNone();
		}
	}

From the Source directory, run the command "tsc" to compile the program.  Wait for the command to complete, and verify that no errors are displayed.

Open the file "DefenderClone.html" in a text editor.  This is the file that hosts your program, and it contains references to every class file you use in your program.  Change the reference to "PlaceStub.js" to instead reference "PlaceLevel.js".  You'll need to add a corresponding entry to this file every time you start using a new class.  The edited line for the reference to PlaceLevel will look like this.

	<script type="text/javascript" src="PlaceLevel.js"></script>

Open the file DefenderClone.html in a web browser that runs JavaScript.  Click the "Start" button on the opening and title screens to dismiss 
 them, then click the "Skip" button to skip creation of a player profile.  A black screen will displayed.  If you'd like, you can press the Escape key to see some game and settings menus.
 
<img src="Screenshot-1-Blank.png" />

That blank void is pretty boring.  Let's lay the foundation of our game by adding some ground.

First, we'll add a class to represent it.  But before that, we'll need somewhere to put that class file.  Within the Source directory, create a new directory named "Model".

Within the newly created Model directory, create a new file named "Planet.ts", containing the text below:

	class Planet extends Entity
	{
		constructor(name: string, size: Coords, horizonHeight: number)
		{
			super
			(
				name,
				[
					Drawable.fromVisual
					(
						VisualRectangle.fromSizeAndColorFill
						(
							Coords.fromXY(size.x, horizonHeight),
							Color.Instances().GreenDark
						)
					),

					Locatable.fromPos
					(
						Coords.fromXY(size.x / 2, size.y - horizonHeight / 2)
					),
				]
			);
		}
	}

The new Planet class is a subclass of Entity, and it has two properties, namely, Drawable and Locatable.  An instance of Drawable represents something that can be drawn to the screen, while an instance of Locatable represents something that has a specific position and orientation (and, incidentally, velocity and acceleration, among other things, as will be discussed later).

Note the occurrence of the "VisualRectangle" class in the constructor of the newly declared Planet class.  The VisualRectangle class is already defined as part of the framework.

Because we just added a reference to a class from the framework, we need to update Imports.ts accordingly.  This file "imports" classes from the framework so that you don't have to put "ThisCouldBeBetter.GameFramework." in front of every single class name every time you use it, which would get tedious pretty quickly.

Open Imports.ts in a text editor, add the following line at the bottom of it, and save:

	import VisualRectangle = gf.VisualRectangle;

Remember that you'll need to add entries to Imports.ts almost every time you create a new class, or when you use a new class from the framework.  I say "almost every time" rather than just "every time" because a few classes, like Entity, Drawable, and Locatable, are already referenced as part of the stub game.

We'll also need to add a reference to the new class to DefenderClone.html.  Open it in a text editor and add this line just below the existing reference to "WorldGame.js".  Be careful:  If you add it in the wrong place, it might break your game.

	<script type="text/javascript" src="Model/Planet.js"></script>

Now that we've declared the Planet class and added references to the VisualRectangle class that we need to draw it, we'll add an instance of Planet to PlaceLevel.

Back in the Source directory, open the file PlaceLevel.ts in a text editor.  Locate the constructor, and within it, the array being passed as the "entities" argument of the super() constructor.  Within that array, add the following text, making sure to add commas between array entries as appropriate, then save the file.

	new Planet("Planet0", Coords.fromXY(400, 300), 50)

From the Source directory, run the command "tsc" to compile the program.  Wait for the command to complete, and verify that no errors are displayed.

In the web browser, refresh DefenderClone.html and start the game again.  Verify that a green field, representing the ground, appears at the bottom of the screen.

<img src="Screenshot-2-Ground.png" />

Now there's some ground, but ground by itself is almost as boring as a void.  Let's add a spaceship.  For that, we'll need another class file.

Back in the Model directory, create a new file name "Ship.ts", containing the text below:

	class Ship extends Entity
	{
		constructor(name: string, pos: Coords)
		{
			super
			(
				name,
				[
					Drawable.fromVisual
					(
						VisualPolygon.fromVerticesAndColorFill
						(
							[
								Coords.fromXY(-5, -5),
								Coords.fromXY(5, 0),
								Coords.fromXY(-5, 5),
							],
							Color.Instances().Gray
						)
					),

					Locatable.fromPos(pos)
				]
			);
		}
	}

Like the Planet class, the new Ship class is a subclass of Entity, and it has its own instances of the same two property types, namely, Drawable and Locatable.

Since we've added a new class, we'll need to add a reference to it in DefenderClone.html.  Add the following line right below the one recently added for Planet.js, and save:

	<script type="text/javascript" src="Model/Ship.js"></script>

The Ship class also uses a new class from the framework, namely "VisualPolygon", so we'll need to add references to it in Imports.ts, like this:

	import VisualPolygon = gf.VisualPolygon;

And in DefenderClone.html, like this:

	<script type="text/javascript" src="Framework/Source/Display/Visuals/VisualPolygon.js"></script>

Now that the Ship class is defined and referenced, let's create an instance of it and add it to the entity collection of our PlaceLevel instance.  Back in the Source directory, open the file PlaceLevel.ts in a text editor again.  Within the array being passed as the "entities" argument of the super() constructor, add the following text, then save the file.

	new Ship("Ship0", Coords.fromXY(100, 100))

Compile the program again, then refresh DefenderClone.html, start the game, and progress past the startup screens.  A gray triangle pointing right, representing a spaceship, now appears above the ground.

<img src="Screenshot-3-Ship-Stationary.png" />

Now there's a spaceship, which should be exciting.  But it doesn't move.  So it's still pretty boring.  Let's make it move.

To make it move, we'll assign it a velocity to go along with its position.  Open Ship.ts in a text editor and replace the line "Locatable.fromPos(pos)" with the following text:

	new Locatable
	(
		Disposition.fromPosAndVel
		(
			Coords.fromXY(100, 100), // pos
			Coords.fromXY(1, 0) // vel
		)
	)

Compile the program again, then refresh DefenderClone.html and start the game.  The same gray, triangular spaceship still appears, but now it... still doesn't move.

<img src="Screenshot-3-Ship-Stationary.png" />

What gives?  Well, the problem is that, while the Ship entity does have a Locatable property, and a nonzero velocity is indeed defined within that property, it's all being ignored.  The Locatable property SHOULD be being updated every tick of the game timer.  To make that happen, we need to add Locatable to the list of properties that the PlaceLevel updates every tick.

To make sure that Locatables are being processed every timer tick, open PlaceLevel.ts in a text editor, locate the static defnBuild() method within it, and replace the line where the variable entityPropertyNamesToProcess is declared as an empty array with the following text:

	var entityPropertyNamesToProcess =
	[
		Locatable.name
	];

Compile the program again, then refresh DefenderClone.html and start the game.  The same gray, triangular spaceship still appears, but now it moves.  It moves all the way to the right side of the screen, then disappears, never to return.

<img src="Screenshot-4-Ship-Moving.gif" />

This briefly makes the spaceship somewhat more interesting than when it was stationary, but once it moves off the right side of the screen, the view is even more boring that it was before.  To fix that, that, we can make the screen "wrap", so that when the spaceship moves off the right side of the screen, it reappears on the left side.  That, in turn, can be accomplished by giving the Ship entity the Constrainable property and putting a Constraint on it.

But first, we'll add Constrainable to the list of properties that the PlaceLevel updates each timer tick.  In PlaceLevel.ts, add a new line to the array of strings being assigned to the entityPropertyNamesToProcess variable, making sure to add a comma after the existing one:

	var entityPropertyNamesToProcess =
	[
		Locatable.name,
		Constrainable.name
	];

Now we'll add a Constrainable property to the Ship entity.  Open Ship.ts and, in the list of properties being passed to the super() constructor, add the following text:

	new Constrainable
	([
		new Constraint_WrapXTrimY()
	])

Since Constraint_WrapXTrimY is a previously unused class from the framework, we'll need to add references to it in DefenderClone.html and Imports.ts.  The line to be added to Imports.ts looks like this:

	import Constraint_WrapToPlaceSizeXTrimY = gf.Constraint_WrapToPlaceSizeXTrimY;

And the line to be added to DefenderClone.html looks like this:

	<script type="text/javascript" src="Framework/Source/Geometry/Constraints/Constraint_WrapToPlaceSizeX.js"></script>

Recompile the game by running "tsc" and refresh the web browser.

<img src="Screenshot-5-Ship-Wrapping.gif" />

Now the ship wraps to stay in view continuously, so the view stays interesting.  It would be more interesting still if the ship changed speed and direction.  To make that work, we need to give it the Actor property. 

To make the game process Actor properties every timer tick, open PlaceLevel.ts and add another new line to the array of strings being assigned to the entityPropertyNamesToProcess variable, again making sure to add another comma to the entry between the old final entry and the new final entry:

	var entityPropertyNamesToProcess =
	[
		Locatable.name,
		Constrainable.name,
		Actor.name
	];

To define the ActivityDefn for the ship's behavior, open Ship.ts and add the following method:

	static activityDefnDoSpaceshipStuffBuild(): ActivityDefn
	{
		var activityDefnDoSpaceshipStuff = new ActivityDefn
		(
			"DoSpaceshipStuff",
			// perform
			(universe: Universe, world: World, place: Place, entity: Entity) =>
			{
				var placeWidthHalf = place.size.x / 2;

				var ship = entity as Ship;
				var shipLoc = ship.locatable().loc;
				var shipPos = shipLoc.pos;
				var shipOrientation = shipLoc.orientation;
				var shipForward = shipOrientation.forward;
				var shipAccel = shipLoc.accel;
				if (shipPos.x > placeWidthHalf)
				{
					shipForward.x = -1;
				}
				else
				{
					shipForward.x = 1;
				}
				shipOrientation.forwardSet(shipForward);

				var accelerationPerTick = 0.1;
				shipAccel.x = shipForward.x * accelerationPerTick;
			}
		);

		return activityDefnDoSpaceshipStuff;
	}

Now that the ActivityDefn for the Ship is defined, we want to make sure that the WorldDefn knows about it, so that it's there when the Ship entity's Actor property tries to look it up.  Open WorldGame.ts and replace the existing .defnBuild() method with the following text:

	static defnBuild(): WorldDefn
	{
		return new WorldDefn
		([
			[
				ActivityDefn.Instances().HandleUserInput,
				Ship.activityDefnDoSpaceshipStufBuild()
			],
			[
				PlaceLevel.defnBuild()
			]
		]);
	}

Finally, give the Actor property to the Ship.  In Ship.ts, add a new entry to the array of entity properties, right below the Locatable instance, again making sure to add a comma between the old Locatable declaration and the new Actor declaration:

	Actor.fromActivityDefnName("DoSpaceshipStuff")

Compile the program again, then refresh DefenderClone.html and start the game.  The spaceship now accelerates toward the right side of the screen if it's on the left half of the screen, and accelerates toward the left side of the screen if it's on the right side of the screen.

<img src="Screenshot-6-Ship-Accelerating.gif" />

Furthermore, our spaceship faces to the right when it's accelerating right, and to the left when it's accelerating left.  Ordinarily, we'd need to modify the Visual for the Ship for this to work, but since we're using a VisualPolygon, it automatically transforms the visual based on the Ship's orientation.  And we already added the code to set the Ship's orientation, in the same place where we're setting the acceleration, that is, in Ship.activityDefnDoSpaceshipStuffBuild().  Nice!

It'd be even nicer if we could steer the ship.  Going where the driver wants to go is a major component of consumer satisfication with any vehicle.

To do that, we need to add some Actions that the ship can perform in order to accelerate up, down, left, or right, and then we need to associate, or "map", those Actions to keyboard inputs using some ActionToInputsMapping instances.

The Actions we need happen to already be defined as part of the Movable class, so they and their corresponding mappings just need to be registered in the PlaceLevel class.  Open PlaceLevel.ts, replace the existing declarations of the actions and actionToInputMappings arrays with the text below, and save.

	var actions =
	[
		actionShowMenuSettings,

		Movable.actionAccelerateDown(),
		Movable.actionAccelerateLeft(),
		Movable.actionAccelerateRight(),
		Movable.actionAccelerateUp()
	];

	var inputNames = Input.Names();

	var actionToInputsMappings =
	[
		ActionToInputsMapping.fromActionAndInputName
		(
			actionShowMenuSettings.name, inputNames.Escape
		),

		ActionToInputsMapping.fromActionAndInputName
		(
			Movable.actionAccelerateDown().name, inputNames.ArrowDown
		),
		ActionToInputsMapping.fromActionAndInputName
		(
			Movable.actionAccelerateLeft().name, inputNames.ArrowLeft
		),
		ActionToInputsMapping.fromActionAndInputName
		(
			Movable.actionAccelerateRight().name, inputNames.ArrowRight
		),
		ActionToInputsMapping.fromActionAndInputName
		(
			Movable.actionAccelerateUp().name, inputNames.ArrowUp
		)
	];

This code defines the Actions and the input mappings for them, but in order to actually use them, we'll need to give the Ship entity the Movable property.  We also need to change its Actor property's activity so that it listens to the user's input rather than mindlessly shuttling back and forth forever.

Open Ship.ts and replace the existing declaration of the Actor property with the following text:

	Actor.fromActivityDefnName
	(
		ActivityDefn.Instances().HandleUserInput.name
	),

	Movable.fromAccelerationAndSpeedMax(0.2, 2)

Also, now that we're not using the "DoSpaceshipStuff" ActivityDefn, we can remove the declaration of the static Ship.activityDefnDoSpaceshipStuffBuild() method entirely.  (I know we just added it, but less code is always better!  Technically, for quality's sake we should've quit before we started.)

Because we removed the declaration of the "DoSpaceshipStuff" ActivityDefn, we'll also need to remove the reference to it.  Open WorldGame.ts and, in the static .defnBuild() method, remove the line "Ship.activityDefnDoSpaceshipStuffBuild()" from the ActivityDefns being passed to the WorldDefn constructor call.

Now that the Ship entity is listening for user input, we no longer need that instance of UserInputListener() that came built-in to the stub code.  Two entities listening and reacting to the same input might get weird.  Open PlaceLevel.ts again and, in the constructor, remove the line "new UserInputListener()" from the list of entities being passed to the super() call.

After compiling the program and refreshing the web browser, use the arrow keys to cause the spaceship to acelerate up, down, left, and right.  You're a driver, you're a winner.

<img src="Screenshot-7-Ship-Steering.gif" />

Driving around aimlessly is fun for a while, but conflict is the essence of drama.  It's time to add a villain and a victim, so that you can be the rescuer.

First, we'll create the victim, which we'll call a Habitat.  In the Model directory, add a new file named "Habitat.ts", containing the following text:

	class Habitat extends Entity
	{
		constructor(pos: Coords)
		{
			super
			(
				Habitat.name,
				[
					Constrainable.create(),

					Drawable.fromVisual
					(
						VisualPolygon.fromVerticesAndColorFill
						(
							[
								Coords.fromXY(4, 0),
								Coords.fromXY(-4, 0),
								Coords.fromXY(-4, -4),
								Coords.fromXY(0, -8),
								Coords.fromXY(4, -4),
							],
							Color.byName("Brown")
						)
					),

					Locatable.fromPos(pos)
				]
			);
		}
	}

Next, we'll create the villain, which we'll call a "Raider".  Still in the Model directory, create a new file named Raider.ts, containing the following text.  This class is a bit more complex than the previous one, since the Raider has to actually move around and kidnap people and stuff, while all the Habitat has to do is sit there looking vulnerable.

	class Raider extends Entity
	{
		habitatCaptured: Habitat;

		_displacement: Coords;

		constructor(pos: Coords)
		{
			super
			(
				Raider.name,
				[
					Actor.fromActivityDefnName
					(
						Raider.activityDefnBuild().name
					),

					Constrainable.fromConstraint
					(
						new Constraint_WrapToPlaceSizeX()
					),

					Drawable.fromVisual
					(
						new VisualGroup
						([
							VisualEllipse.fromSemiaxesAndColorFill
							(
								6, 4, Color.byName("Green")
							),
							VisualEllipse.fromSemiaxesAndColorFill
							(
								4, 3, Color.byName("Red")
							),
							new VisualFan
							(
								4, // radius
								.5, .5, // angleStart-, angleSpannedInTurns
								Color.byName("Red"), null // colorFill, colorBorder
							)
						])
					),

					Locatable.fromPos(pos),

					Movable.fromAccelerationAndSpeedMax(2, 1)
				]
			);

			this._displacement = Coords.create();
		}

		static activityDefnBuild(): ActivityDefn
		{
			return new ActivityDefn
			(
				Raider.name, Raider.activityDefnPerform
			);
		}

		static activityDefnPerform
		(
			universe: Universe, world: World, place: Place, entity: Entity
		): void
		{
			var raider = entity as Raider;

			var raiderPos = raider.locatable().loc.pos;

			var raiderActor = raider.actor();
			var raiderActivity = raiderActor.activity;
			var target = raiderActivity.target;

			if (target == null)
			{
				var placeLevel = place as PlaceLevel;
				var habitats = placeLevel.habitats();
				if (habitats.length == 0)
				{
					return; // todo
				}
				else
				{
					target = ArrayHelper.random
					(
						habitats, universe.randomizer
					);
					raiderActivity.target = target;
				}
			}

			var targetPos = target.locatable().loc.pos;
			var displacementToTarget = raider._displacement.overwriteWith
			(
				targetPos
			).subtract
			(
				raiderPos
			);
			var distanceToTarget = displacementToTarget.magnitude();
			var raiderMovable = raider.movable();
			if (distanceToTarget >= raiderMovable.accelerationPerTick)
			{
				var displacementToMove = displacementToTarget.divideScalar
				(
					distanceToTarget
				).multiplyScalar
				(
					raiderMovable.speedMax
				);
				raiderPos.add(displacementToMove);
			}
			else
			{
				raiderPos.overwriteWith(targetPos);
				if (raider.habitatCaptured == null)
				{
					raider.habitatCaptured = target;

					var targetConstrainable = target.constrainable();

					var constraintAttach =
						new Constraint_AttachToEntityWithId(raider.id);
					targetConstrainable.constraintAdd(constraintAttach);

					var constraintOffset =
						new Constraint_Offset(Coords.fromXY(0, 10));
					targetConstrainable.constraintAdd(constraintOffset);

					target = new Entity
					(
						"EscapePoint",
						[
							Locatable.fromPos
							(
								raiderPos.clone().addXY
								(
									0, 0 - place.size.y
								)
							)
						]
					);
					raiderActivity.target = target;
				}
				else
				{
					place.entityToRemoveAdd(raider.habitatCaptured);
					place.entityToRemoveAdd(raider);
				}
			}
		}

	}

The Raider class uses the previously unreferenced framework classes Constraint_AttachToEntityWithId, Constraint_Offset, Constraint_WrapToPlaceSizeX, VisualEllipse, VisualFan, and VisualGroup, which are new to our program and so will need to be referenced in Imports.ts, like this:

	import Constraint_AttachToEntityWithId = gf.Constraint_AttachToEntityWithId;
	import Constraint_Offset = gf.Constraint_Offset;
	import Constraint_WrapToPlaceSizeX = gf.Constraint_WrapToPlaceSizeX;
	import VisualEllipse = gf.VisualEllipse;
	import VisualFan = gf.VisualFan;
	import VisualGroup = gf.VisualGroup;

And also in DefenderClone.html, like this:

	<script type="text/javascript" src="Framework/Source/Geometry/Constraints/Constraint_AttachToEntityWithId.js"></script>
	<script type="text/javascript" src="Framework/Source/Geometry/Constraints/Constraint_Offset.js"></script>
	<script type="text/javascript" src="Framework/Source/Geometry/Constraints/Constraint_WrapToPlaceSizeX.js"></script>

	<script type="text/javascript" src="Framework/Source/Display/Visuals/VisualEllipse.js"></script>
	<script type="text/javascript" src="Framework/Source/Display/Visuals/VisualFan.js"></script>
	<script type="text/javascript" src="Framework/Source/Display/Visuals/VisualGroup.js"></script>

The Raider class also makes use of the method PlaceLevel.habitats() to get a convenient array of all the Habitats on the level.  However, the sharp-eyed observer will note that that method doesn't exist yet.  So open PlaceLevel.ts and add the following lines just before the final close brace of the class:

	habitats(): Habitat[]
	{
		return this.entities.filter(x => x.constructor.name == Habitat.name) as Habitat[];
	}

Also, we need to the reference the newly declared Habitat and Raider classes, but since they're not from the framework, and thus are not part of any namespace, and thus don't need to be imported, we can leave Imports.ts alone.  We only have to add references to them in DefenderClone.html:

	<script type="text/javascript" src="Model/Habitat.js"></script>
	<script type="text/javascript" src="Model/Raider.js"></script>

Now we'll add one Habitat and one Raider to the level.  Open PlaceLevel.ts, and, in the constructor, add these two lines to bottom of the array of Entities being passed to the super() call.  Make sure to separate all the array elements with commas as appropriate:

	new Habitat(Coords.fromXY(150, 250) ),
	new Raider(Coords.fromXY(200, -50) )

Finally, re-compile the game and refresh the web browser.  Now a civilian Habitat appears on the ground.  An alien Raider will descend from the top of the screen, pick up the Habitat, carry it back up to the top of the screen, and disappear forever.  Tragic!

<img src="Screenshot-8-Raider_Steals_Habitat.gif" />

And there's nothing you can do about it, either, because your ship has no weapons.  You just have to sit and watch as the people you swore to protect are abducted by aliens with clearly nefarious intent.

[To be continued.]
