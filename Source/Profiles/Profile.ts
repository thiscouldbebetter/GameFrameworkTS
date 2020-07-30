
class Profile
{
	name: string;
	worldNames: string[];
	worldNameSelected: string;

	constructor(name: string, worldNames: string[])
	{
		this.name = name;
		this.worldNames = worldNames;
		this.worldNameSelected = null;
	}
}
