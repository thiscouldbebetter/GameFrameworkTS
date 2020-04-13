
class VisualBuilder
{
	static Instance()
	{
		if (VisualBuilder._instance == null)
		{
			VisualBuilder._instance = new VisualBuilder();
		}
		return VisualBuilder._instance;
	};

	circleWithEyes
	(
		circleRadius, circleColor, eyeRadius, visualEyes
	)
	{
		visualEyes = visualEyes || this.eyesBlinking(eyeRadius);

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

	eyesBlinking(visualEyeRadius)
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
