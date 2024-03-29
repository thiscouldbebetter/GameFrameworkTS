
namespace ThisCouldBeBetter.GameFramework
{

export class UserInputListener extends Entity
{
	constructor()
	{
		super
		(
			UserInputListener.name,
			[
				Actor.fromActivityDefnName
				(
					UserInputListener.activityDefn().name
				),

				Drawable.fromVisual
				(
					UserInputListener.visualBuild()
				),

				Selector.fromCursorDimension(20)
			]
		);
	}

	static activityDefn(): ActivityDefn
	{
		return new ActivityDefn
		(
			"HandleUserInput",
			UserInputListener.activityDefnPerform
		);
	}

	static activityDefnPerform
	(
		uwpe: UniverseWorldPlaceEntities
	): void
	{
		var universe = uwpe.universe;
		var world = uwpe.world;
		var place = uwpe.place;

		var inputHelper = universe.inputHelper;

		var placeDefn = place.defn(world);
		var actionsByName = placeDefn.actionsByName;
		var actionToInputsMappingsByInputName =
			placeDefn.actionToInputsMappingsByInputName;

		var actionsToPerform = inputHelper.actionsFromInput
		(
			actionsByName, actionToInputsMappingsByInputName
		);

		for (var i = 0; i < actionsToPerform.length; i++)
		{
			var action = actionsToPerform[i];
			action.perform(uwpe);
		}
	}

	static visualBuild(): VisualBase
	{
		var returnValue = new VisualSelect
		(
			// childrenByNames
			new Map<string, VisualBase>
			([
				[ "None", new VisualNone() ]
			]),
			// selectChildNames
			(uwpe: UniverseWorldPlaceEntities, d: Display) =>
			{
				return [ "None" ];
			}
		);

		return returnValue;
	}
}

}
