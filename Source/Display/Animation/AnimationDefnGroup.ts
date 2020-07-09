
class AnimationDefnGroup
{
	name: string;
	animationDefns: AnimationDefn[];
	animationDefnsByName: any;

	constructor(name: string, animationDefns: AnimationDefn[])
	{
		this.name = name;
		this.animationDefns = animationDefns;
		this.animationDefnsByName = ArrayHelper.addLookupsByName(this.animationDefns);
	}
}
