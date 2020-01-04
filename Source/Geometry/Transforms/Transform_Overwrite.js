
function Transform_Overwrite(transformableToOverwriteWith)
{
	this.transformableToOverwriteWith = transformableToOverwriteWith;
}
{
	Transform_Overwrite.prototype.transform = function(transformable)
	{
		return transformable.overwriteWith(this.transformableToOverwriteWith);
	};
}
