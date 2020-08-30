
class Terrain
{
	name: string;
	codeChar: string;
	level: number;
	traversable: Traversable;
	visuals: Visual[];

	constructor(name: string, codeChar: string, level: number, traversable: Traversable, visuals: Visual[])
	{
		this.name = name;
		this.codeChar = codeChar;
		this.level = level;
		this.traversable = traversable;
		this.visuals = visuals;
	}
}
