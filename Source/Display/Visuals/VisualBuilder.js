
function VisualBuilder()
{
	// Do nothing.
}
{
	VisualBuilder.prototype.circleWithEyes = function
	(
		circleRadius, circleColor, eyeRadius, visualEyes
	)
	{
		var visualEyesDirectional = new VisualDirectional
		(
			visualEyes, // visualForNoDirection
			[
				new VisualOffset(visualEyes, new Coords(1, 0).multiplyScalar(eyeRadius)),
				new VisualOffset(visualEyes, new Coords(0, 1).multiplyScalar(eyeRadius)),
				new VisualOffset(visualEyes, new Coords(-1, 0).multiplyScalar(eyeRadius)),
				new VisualOffset(visualEyes, new Coords(0, -1).multiplyScalar(eyeRadius))
			]
		);

		var circleWithEyes = new VisualGroup
		([
			new VisualCircle(circleRadius, circleColor),
			visualEyesDirectional
		]);

		return circleWithEyes;
	};

	VisualBuilder.prototype.eyesBlinking = function(visualEyeRadius)
	{
		var visualPupilRadius = visualEyeRadius / 2;

		var visualEye = new VisualGroup
		([
			new VisualCircle(visualEyeRadius, "White"),
			new VisualCircle(visualPupilRadius, "Black")
		]);

		var visualEyes = new VisualGroup
		([
			new VisualOffset
			(
				visualEye, new Coords(-visualEyeRadius, 0)
			),
			new VisualOffset
			(
				visualEye, new Coords(visualEyeRadius, 0)
			)
		]);

		var visualEyesBlinking = new VisualAnimation
		(
			"EyesBlinking",
			[ 50, 5 ], // ticksToHoldFrames
			[ visualEyes, new VisualNone() ],
		);

		return visualEyesBlinking;
	};
}
