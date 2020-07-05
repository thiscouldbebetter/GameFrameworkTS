
class Transform_Overwrite
{
	transformableToOverwriteWith: any;

	constructor(transformableToOverwriteWith)
	{
		this.transformableToOverwriteWith = transformableToOverwriteWith;
	}

	transform(transformable)
	{
		return transformable.overwriteWith(this.transformableToOverwriteWith);
	};
}
