
class Profile
{
	name: string;
	saveStates: SaveState[];
	saveStateNameSelected: string;

	constructor(name: string, saveStates: SaveState[])
	{
		this.name = name;
		this.saveStates = saveStates;
		this.saveStateNameSelected = null;
	}

	saveStateSelected()
	{
		return this.saveStates.filter(x => x.name == this.saveStateNameSelected)[0];
	}
}
