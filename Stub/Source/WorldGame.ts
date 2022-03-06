
class WorldGame extends World
{
	constructor()
	{
		super
		(
			"GameStub",
			DateTime.now(),
			WorldGame.defnBuild(),
			[ new PlaceStub() ]
		);
	}

	static defnBuild(): WorldDefn
	{
		return new WorldDefn
		([
			[
				UserInputListener.activityDefn()
			],
			[
				PlaceStub.defnBuild()
			]
		]);
	}

	toControl(): ControlBase
	{
		return new ControlNone();
	}
}
