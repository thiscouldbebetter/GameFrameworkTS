
namespace ThisCouldBeBetter.GameFramework
{

export class ControlNone extends ControlBase
{
	constructor()
	{
		super(null, null, null, null);
	}

	static create(): ControlNone
	{
		return new ControlNone();
	}
}

}
