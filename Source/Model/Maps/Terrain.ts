
class Terrain
{
	name: string;
	codeChar: string;
	level: number;
	isBlocking: boolean;
	visuals: Visual[];

	constructor(name: string, codeChar: string, level: number, isBlocking: boolean, visuals: Visual[])
	{
		this.name = name;
		this.codeChar = codeChar;
		this.level = level;
		this.isBlocking = isBlocking;
		this.visuals = visuals;
	}
}
