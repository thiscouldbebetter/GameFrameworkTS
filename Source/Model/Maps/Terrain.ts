
class Terrain
{
	name: string;
	codeChar: string;
	level: number;
	isBlocking: boolean;
	visuals: any;

	constructor(name, codeChar, level, isBlocking, visuals)
	{
		this.name = name;
		this.codeChar = codeChar;
		this.level = level;
		this.isBlocking = isBlocking;
		this.visuals = visuals;
	}
}
