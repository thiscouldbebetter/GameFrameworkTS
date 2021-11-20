
namespace ThisCouldBeBetter.GameFramework
{

export class Terrain
{
	name: string;
	code: string;
	level: number;
	traversable: Traversable;
	visual: VisualBase;

	constructor
	(
		name: string,
		code: string,
		level: number,
		traversable: Traversable,
		visual: VisualBase
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
