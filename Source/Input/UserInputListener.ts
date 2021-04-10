
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
					ActivityDefn.Instances().HandleUserInput.name
				)
			]
		);
	}

	static activityDefnHandleUserInput(): ActivityDefn
	{
		return new ActivityDefn
		(
			"HandleUserInput",
			UserInputListener.activityDefnHandleUserInputPerform
		);
	}

	static activityDefnHandleUserInputPerform
	(
		universe: Universe, world: World, place: Place, entity: Entity
	): void
	{
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
			action.perform(universe, world, place, entity);
		}
	}

}

}
