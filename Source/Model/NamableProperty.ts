
namespace ThisCouldBeBetter.GameFramework
{

export class NamableProperty extends EntityPropertyBase<NamableProperty>
{
	name: string;

	constructor(name: string)
	{
		super();

		this.name = name;
	}

	static of(entity: Entity): NamableProperty
	{
		return entity.propertyByName(NamableProperty.name) as NamableProperty;
	}

	// Clonable.

	clone(): NamableProperty { return this; }
}

}
