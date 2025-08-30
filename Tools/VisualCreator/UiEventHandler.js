
class UiEventHandlerVc // "VC" = "VisualCreator".
{
	// UI events.

	static selectDemo_Changed(selectDemo)
	{
		var d = document;
		var demoName = selectDemo.value;
		var textareaVisualAsJavaScript =
			d.getElementById("textareaVisualAsJavaScript");

		var visualAsFunction;
		if (demoName == "[none]")
		{
			visualAsFunction =
				function() { return ""; }
		}
		else if (demoName == "Circle")
		{
			visualAsFunction = this.visualDemoCreateCircle;
		}
		else if (demoName == "Ellipse")
		{
			visualAsFunction = this.visualDemoCreateEllipse;
		}
		else if (demoName == "Fan")
		{
			visualAsFunction = this.visualDemoCreateFan;
		}
		else if (demoName == "Figure")
		{
			visualAsFunction = this.visualDemoCreateFigure;
		}
		else if (demoName == "Path")
		{
			visualAsFunction = this.visualDemoCreatePath;
		}
		else if (demoName == "Rectangle")
		{
			visualAsFunction = this.visualDemoCreateRectangle;
		}
		else if (demoName == "Text")
		{
			visualAsFunction = this.visualDemoCreateText;
		}
		else
		{
			visualAsFunction =
				function() { return "[ERROR: Demo name not recognized.]" };
		}

		var visualAsJavaScript =
			"function "
			+ visualAsFunction.toString();

		var functionName =
			visualAsJavaScript
				.split("function ")[1]
				.split("(")[0];

		var newline = "\n"
		var suffix =
			newline
			+ functionName + "();";
		visualAsJavaScript += suffix;

		textareaVisualAsJavaScript.value =
			visualAsJavaScript;
	}

	static buttonRender_Clicked()
	{
		var d = document;
		var divMain = d.getElementById("divMain");
		divMain.innerHTML = "";
		var display = Display2D.default();
		display.initialize(null);
		var entityLoc = Disposition.default();
		var entityPos = entityLoc.pos;
		entityPos.overwriteWith(display.sizeInPixelsHalf)
		var entity = Entity.fromNameAndProperties
		(
			"Drawable",
			[
				Animatable2.default(),
				EquipmentUser.default(),
				Locatable.fromLoc(entityLoc)
			]
		);
		display.colorBackSet(Color.Instances().Black);
		var universe = new Universe();
		var world = new World();
		var place = new PlaceBase();
		var uwpe = new UniverseWorldPlaceEntities
		(
			universe,
			world,
			place,
			entity,
			null
		);
		var textareaVisualAsJavaScript =
			d.getElementById("textareaVisualAsJavaScript");
		var visualAsJavaScript = textareaVisualAsJavaScript.value;
		var visual = eval(visualAsJavaScript);

		var updateForTimerTick = () =>
		{
			uwpe.world.timerTicksSoFar++;
			display.drawBackground();
			visual.draw(uwpe, display);
		}

		var ticksPerSecond = 25;
		var millisecondsPerTick = 1000 / ticksPerSecond;
		setInterval(updateForTimerTick, millisecondsPerTick);
	}

	// Visuals.

	static visualDemoCreateCircle()
	{
		return VisualCircle.fromRadius(20);
	}

	static visualDemoCreateEllipse()
	{
		return VisualEllipse.fromSemiaxesHorizontalAndVertical(20, 15);
	}

	static visualDemoCreateFan()
	{
		return VisualFan.fromRadiusAndAnglesStartAndSpanned(20, 0, .25);
	}

	static visualDemoCreateFigure()
	{
		var visualBuilder = new VisualBuilder();
		var colors = Color.Instances();
		var headLength = 12;
		var figure = visualBuilder.figureWithNameColorAndDefaultProportions
		(
			"Figure", colors.Gray, headLength
		);
		return figure;
	}

	static visualDemoCreatePath()
	{
		var scaleFactor = 20;
		var points =
		[
			Coords.fromXY(-1, 0),
			Coords.fromXY(-2, 1)
		].map(x => x.multiplyScalar(scaleFactor) );
		var path = Path.fromPoints(points);
		var color = Color.Instances().Cyan;
		var thickness = 2;
		var visualCircle = VisualCircle.fromRadius(scaleFactor);
		var visualPath = VisualPath.fromPathColorAndThicknessOpen
		(
			path, color, thickness
		);
		var visualGroup = VisualGroup.fromChildren
		([
			visualCircle,
			visualPath
		]);
		return visualGroup;
	}

	static visualDemoCreateRectangle()
	{
		return VisualRectangle.fromSize(Coords.fromXY(40, 30) );
	}

	static visualDemoCreateText()
	{
		var text = "The quick brown fox jumps over the lazy dog.";
		var font = Font.fromNameAndSourcePath("Font", "../../Content/Fonts/Font.ttf");
		font.load();
		var fontNameAndHeight =
			FontNameAndHeight.fromNameAndHeightInPixels(font.name, 10);
		var color = Color.Instances().White;
		var visualText = VisualText.fromTextImmediateFontAndColor
		(
			text,
			fontNameAndHeight,
			color
		);
		return visualText;
	}

}
