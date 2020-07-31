
class Profile
{
	name: string;
	saveStateNames: string[];
	saveStateNameSelected: string;

	constructor(name: string, saveStateNames: string[])
	{
		this.name = name;
		this.saveStateNames = saveStateNames;
		this.saveStateNameSelected = null;
	}
}
