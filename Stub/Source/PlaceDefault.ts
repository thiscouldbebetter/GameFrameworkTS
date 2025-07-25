
class PlaceDefault extends PlaceBase
{
	constructor()
	{
		super
		(
			PlaceDefault.name,
			PlaceDefault.defnBuild().name,
			null, // parentName
			Coords.fromXY(400, 300), // size
			 // entities
			[
				new UserInputListener()
			]
		);
	}

	static defnBuild(): PlaceDefn
	{
		var actionDisplayRecorderStartStop =
			DisplayRecorder.actionStartStop();
		var actionShowMenu =
			Action.Instances().ShowMenuSettings;

		var actions =
		[
			actionDisplayRecorderStartStop,
			actionShowMenu
		];

		var inputNames = Input.Names();

		var actionToInputsMappings =
		[
			ActionToInputsMapping.fromActionNameAndInputName
			(
				actionDisplayRecorderStartStop.name,
				inputNames.Tilde
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
			Ephemeral.name,
			Killable.name,
			Locatable.name,
			Movable.name
		];

		return PlaceDefn.fromNameMusicActionsMappingsAndPropertyNames
		(
			PlaceDefault.name,
			"Music__Default", // soundForMusicName
			actions,
			actionToInputsMappings,
			entityPropertyNamesToProcess
		);
	}
}
