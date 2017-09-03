
function TransformTranslate(offset)
{
	this.offset = offset;
}
{
	TransformTranslate.prototype.transformCoords = function(coordsToTransform)
	{
		coordsToTransform.add(this.offset);
	}
}
