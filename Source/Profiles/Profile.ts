
class Profile
{
	name: string;
	worlds: World[];

	worldSelected: World;

	constructor(name: string, worlds: World[])
	{
		this.name = name;
		this.worlds = worlds;

		this.worldSelected = null;
	}
}
