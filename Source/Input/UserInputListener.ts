
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
}

}
