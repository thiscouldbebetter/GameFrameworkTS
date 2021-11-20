
namespace ThisCouldBeBetter.GameFramework
{

export class Transform_Camera implements Transform<Transform_Camera>
{
	_camera: Camera;

	transformTranslateInvert: Transform_TranslateInvert;
	transformOrientForCamera: Transform_OrientForCamera;
	transformPerspective: Transform_Perspective;
	transformViewCenter: Transform_Translate;

	constructor(camera: Camera)
	{
		this._camera = camera;

		this.transformTranslateInvert = new Transform_TranslateInvert
		(
			camera.loc.pos
		);
		this.transformOrientForCamera = new Transform_OrientForCamera
		(
			camera.loc.orientation
		);
		this.transformPerspective = new Transform_Perspective
		(
			camera.focalLength
		);
		this.transformViewCenter = new Transform_Translate
		(
			camera.viewSizeHalf
		);
	}

	clone(): Transform_Camera { return this; } // todo

	overwriteWith(other: Transform_Camera): Transform_Camera
	{
		return this; // todo
	}

	transform(transformable: TransformableBase): TransformableBase
	{
		return transformable; // todo
	}

	transformCoords(coordsToTransform: Coords)
	{
		this.transformTranslateInvert.transformCoords(coordsToTransform);
		this.transformOrientForCamera.transformCoords(coordsToTransform);
		this.transformPerspective.transformCoords(coordsToTransform);
		this.transformViewCenter.transformCoords(coordsToTransform);
		return coordsToTransform;
	}
}

}
