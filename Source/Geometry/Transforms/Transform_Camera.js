
function Transform_Camera(camera)
{
	this.camera = camera;	

	this.transformTranslateInvert = new Transform_TranslateInvert
	(
		this.camera.loc.pos
	);
	this.transformOrientForCamera = new Transform_OrientForCamera
	(
		this.camera.loc.orientation
	);
	this.transformPerspective = new Transform_Perspective
	(
		this.camera.focalLength
	);
	this.transformViewCenter = new Transform_Translate
	(
		this.camera.viewSizeHalf
	);
}

{
	Transform_Camera.prototype.applyToCoords = function(coordsToTransform)
	{
		this.transformTranslateInvert.applyToCoords(coordsToTransform);
		this.transformOrientForCamera.applyToCoords(coordsToTransform);
		this.transformPerspective.applyToCoords(coordsToTransform);
		this.transformViewCenter.applyToCoords(coordsToTransform);
		return coordsToTransform;
	}
}
