
namespace ThisCouldBeBetter.GameFramework
{

export class AnimationDefnGroup
{
	name: string;
	animationDefns: AnimationDefn[];
	animationDefnsByName: Map<string, AnimationDefn>;

	constructor(name: string, animationDefns: AnimationDefn[])
	{
		this.name = name;
		this.animationDefns = animationDefns;
		this.animationDefnsByName = ArrayHelper.addLookupsByName(this.animationDefns);
	}
}

}
