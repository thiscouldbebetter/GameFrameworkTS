
namespace ThisCouldBeBetter.GameFramework
{

export class WordBubble
{
	visualForPortrait: VisualBase;
	statements: string[];

	statementIndexCurrent: number;

	constructor(visualForPortrait: VisualBase, statements: string[])
	{
		this.visualForPortrait = visualForPortrait;
		this.statements = statements;

		this.statementIndexCurrent = 0;
	}

	statementCurrent()
	{
		return this.statements[this.statementIndexCurrent];
	}

	statementAdvance(universe: Universe)
	{
		this.statementIndexCurrent++;
		if (this.statementIndexCurrent >= this.statements.length)
		{
			var venue = universe.venueCurrent as VenueLayered; // ?
			universe.venueNext = venue.children[0];
		}
	}

	// Controllable.

	toControl(universe: Universe)
	{
		var size = universe.display.sizeInPixels;
		var sizeBase = size.clone();

		var margin = 8;
		var marginSize = Coords.fromXY(1, 1).multiplyScalar(margin);
		var containerSize = Coords.fromXY
		(
			sizeBase.x - margin * 2,
			(sizeBase.y - margin * 4) / 3
		);

		var portraitSize = Coords.fromXY(1, 1).multiplyScalar
		(
			containerSize.y - margin * 2
		);

		var wordPaneSize = Coords.fromXY
		(
			containerSize.x - portraitSize.x - margin * 3,
			portraitSize.y
		);

		var fontHeight = margin;

		var buttonSize = Coords.fromXY(3, 1.2).multiplyScalar(fontHeight);

		var wordBubble = this;

		var containerWordBubble = ControlContainer.from4
		(
			"containerWordBubble",
			Coords.fromXY
			(
				margin,
				sizeBase.y - margin - containerSize.y
			), // pos
			containerSize,
			// children
			[
				new ControlVisual
				(
					"visualPortrait",
					marginSize,
					portraitSize, // size
					DataBinding.fromContext(this.visualForPortrait),
					Color.byName("Black"), // colorBackground
					null // colorBorder
				),

				new ControlLabel
				(
					"labelSlideText",
					Coords.fromXY
					(
						portraitSize.x + margin, 0
					).add
					(
						marginSize
					),
					wordPaneSize, // size
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContextAndGet
					(
						this,
						(c: WordBubble) => c.statementCurrent()
					),
					fontHeight
				),

				ControlButton.from8
				(
					"buttonNext",
					Coords.fromXY
					(
						containerSize.x - marginSize.x - buttonSize.x,
						containerSize.y - marginSize.y - buttonSize.y
					),
					buttonSize,
					"Next",
					fontHeight,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => wordBubble.statementAdvance(universe)
				)
			]
		);

		return containerWordBubble;
	}
}

}
