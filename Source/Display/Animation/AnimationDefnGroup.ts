
class AnimationDefnGroup
{
	name: string;
	animationDefns: AnimationDefn[];
	animationDefnsByName: any;

	constructor(name, animationDefns)
	{
		this.name = name;
		this.animationDefns = animationDefns;
		this.animationDefnsByName = ArrayHelper.addLookupsByName(this.animationDefns);
	}
}
