
function Transform()
{}
{
	Transform.applyTransformToCoordsArrays = function
	(
		transformToApply, 
		coordsArraysToTransform
	)
	{
		if (coordsArraysToTransform == null)
		{
			return;
		}

		for (var i = 0; i < coordsArraysToTransform.length; i++)
		{
			var coordsArray = coordsArraysToTransform[i];
			Transform.applyTransformToCoordsMany(transformToApply, coordsArray);
		}
	}

	Transform.applyTransformToCoordsMany = function(transformToApply, coordsSetToTransform)
	{
		for (var i = 0; i < coordsSetToTransform.length; i++)
		{
			transformToApply.transformCoords(coordsSetToTransform[i]);
		}
	}
}
