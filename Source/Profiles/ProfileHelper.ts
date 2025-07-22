
namespace ThisCouldBeBetter.GameFramework
{

export class ProfileHelper
{
	gameCanBeSaved: boolean;
	profilesMultipleAreAllowed: boolean;

	constructor
	(
		gameCanBeSaved: boolean,
		profilesMultipleAreAllowed: boolean
	)
	{
		this.gameCanBeSaved = gameCanBeSaved || false;
		this.profilesMultipleAreAllowed = profilesMultipleAreAllowed || false;
	}

	static default(): ProfileHelper
	{
		return new ProfileHelper(null, null);
	}

	gameCanBeSavedSet(value: boolean): ProfileHelper
	{
		this.gameCanBeSaved = value;
		return this;
	}

	profilesMultipleAreAllowedSet(value: boolean): ProfileHelper
	{
		this.profilesMultipleAreAllowed = value;
		return this;
	}
}

}