
class PlaceStub extends Place
{
	constructor()
	{
		super
		(
			PlaceStub.name,
			PlaceStub.defnBuild().name,
			Coords.fromXY(400, 300), // size
			 // entities
			[
				new UserInputListener()
			]
		);
	}

	static defnBuild(): PlaceDefn
	{
		var actionDisplayRecorderStartStop = DisplayRecorder.actionStartStop();
		var actionShowMenu = Action.Instances().ShowMenuSettings;

		var actions =
		[
			actionDisplayRecorderStartStop,
			actionShowMenu
		];

		var inputNames = Input.Names();

		var actionToInputsMappings =
		[
			new ActionToInputsMapping
			(
				actionDisplayRecorderStartStop.name, [ "~" ], true // inactivate
			),

			ActionToInputsMapping.fromActionNameAndInputName
			(
				actionShowMenu.name, inputNames.Escape
			)
		];

		var entityPropertyNamesToProcess: string[] =
		[
			Actor.name,
			Collidable.name,
			Constrainable.name,
			Locatable.name
		];

		return PlaceDefn.from4
		(
			PlaceStub.name,
			actions,
			actionToInputsMappings,
			entityPropertyNamesToProcess
		);
	}
}
