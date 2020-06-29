
class AnimationDefnGroup
{
	constructor(name, animationDefns)
	{
		this.name = name;
		this.animationDefns = animationDefns;
		this.animationDefns.addLookupsByName();
	}
}
