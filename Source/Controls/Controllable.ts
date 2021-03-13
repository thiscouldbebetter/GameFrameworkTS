
namespace ThisCouldBeBetter.GameFramework
{

export class Controllable extends EntityProperty
{
	toControl: any;

	constructor(toControl: any)
	{
		super();
		this.toControl = toControl;
	}
}

}
