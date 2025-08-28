
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

		var inputs = Input.Instances();

		var actionToInputsMappings =
		[
			ActionToInputsMapping.fromActionNameAndInputName
			(
				actionDisplayRecorderStartStop.name,
				inputs.Tilde.name
			),

			ActionToInputsMapping.fromActionNameAndInputName
			(
				actionShowMenu.name, inputs.Escape.name
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
