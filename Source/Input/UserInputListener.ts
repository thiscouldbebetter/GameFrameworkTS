
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
					UserInputListener.activityDefnHandleUserInputBuild().name
				),

				Drawable.fromVisual
				(
					UserInputListener.visualBuild()
				),

				Selector.fromCursorDimension(20)
			]
		);
	}

	static activityDefnHandleUserInputBuild(): ActivityDefn
	{
		return new ActivityDefn
		(
			"HandleUserInput",
			UserInputListener.activityDefnHandleUserInputPerform
		);
	}

	static activityDefnHandleUserInputPerform
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

	static visualBuild(): Visual
	{
		var returnValue = new VisualSelect
		(
			// childrenByNames
			new Map<string, Visual>
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
