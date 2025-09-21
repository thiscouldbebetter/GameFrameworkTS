
namespace ThisCouldBeBetter.GameFramework
{

export class Terrain
{
	name: string;
	code: string;
	level: number;
	traversable: Traversable;
	visual: Visual;

	constructor
	(
		name: string,
		code: string,
		level: number,
		traversable: Traversable,
		visual: Visual
	)
	{
		this.name = name;
		this.code = code;
		this.level = level;
		this.traversable = traversable;
		this.visual = visual;
	}
}

}
