
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

	static maximal(): ProfileHelper
	{
		return new ProfileHelper(true, true);
	}

	static minimal(): ProfileHelper
	{
		return new ProfileHelper(false, false);
	}

	static fromGameCanBeSavedAndProfilesMultipleAreAllowed
	(
		gameCanBeSaved: boolean,
		profilesMultipleAreAllowed: boolean
	): ProfileHelper
	{
		return new ProfileHelper(gameCanBeSaved, profilesMultipleAreAllowed);
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