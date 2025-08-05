
namespace ThisCouldBeBetter.GameFramework
{

export class Modellable<TModel> extends EntityPropertyBase<Modellable<TModel>>
{
	model: TModel;

	constructor(model: TModel)
	{
		super();

		this.model = model;
	}

	// Clonable.

	clone(): Modellable<TModel> { return this; }
}

}

