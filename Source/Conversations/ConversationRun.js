
function ConversationRun(defn, quit, universe)
{
	this.defn = defn;
	this.quit = quit;
	this.universe = universe; // hack

	var talkNodeStart = this.defn.talkNodes[0];

	this.scopeCurrent = new ConversationScope
	(
		null, // parent
		talkNodeStart,
		// talkNodesForOptions
		[]
	);

	this.talkNodesForTranscript = [];

	this.variableLookup = {};

	// Abbreviate for scripts.
	this.vars = this.variableLookup;
	this.uni = this.universe;
}

{
	// instance methods

	ConversationRun.prototype.next = function()
	{
		var responseSelected = this.scopeCurrent.talkNodeForOptionSelected;
		if (responseSelected != null)
		{
			responseSelected.activate(this, this.scopeCurrent);
			this.scopeCurrent.talkNodeForOptionSelected = null;
		}
		this.update();
	}

	ConversationRun.prototype.update = function()
	{
		this.scopeCurrent.update(this);
	}

	// controls

	ConversationRun.prototype.toControl = function(size, universe)
	{
		var conversationRun = this;
		var conversationDefn = conversationRun.defn;

		var venueToReturnTo = universe.venueCurrent;
		var fontHeight = 20;
		var fontHeightShort = fontHeight * .6;
		var marginWidth = 25;
		var labelHeight = fontHeight;
		var buttonHeight = 25;
		var marginSize = new Coords(1, 1).multiplyScalar(marginWidth);
		var listSize = new Coords
		(
			size.x / 2,
			size.y - labelHeight - buttonHeight - marginSize.y * 6 // hack - From 4.
		);
		var buttonSize = new Coords(listSize.x, buttonHeight);
		var buttonTranscriptSize = new Coords(2, 1).multiplyScalar(buttonHeight); // size

		var returnValue = new ControlContainer
		(
			"containerConversation",
			new Coords(0, 0), // pos
			size,
			// children
			[
				new ControlButton
				(
					"buttonBack",
					marginSize, // pos
					new Coords(1, 1).multiplyScalar(buttonHeight), // size
					"<",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var venueNext = venueToReturnTo;
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				),

				new ControlButton
				(
					"buttonTranscript",
					new Coords
					(
						size.x - marginSize.x - buttonTranscriptSize.x,
						marginSize.y
					),
					buttonTranscriptSize,
					"Log",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var venueCurrent = universe.venueCurrent;
						var transcriptAsControl = conversationRun.toControlTranscript
						(
							size, universe, venueCurrent
						);
						var venueNext = new VenueControls(transcriptAsControl);
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				),

				new ControlLabel
				(
					"labelSpeaker",
					new Coords
					(
						size.x / 2,
						size.y - marginSize.y * 3 - buttonSize.y - listSize.y - labelHeight
					), // pos
					size, // size
					true, // isTextCentered
					new DataBinding(conversationRun, "scopeCurrent.displayTextCurrent"),
					fontHeight
				),

				new ControlList
				(
					"listResponses",
					new Coords
					(
						(size.x - listSize.x) / 2,
						size.y - marginSize.y * 2 - buttonSize.y - listSize.y
					),
					listSize,
					// items
					new DataBinding
					(
						conversationRun,
						"scopeCurrent.talkNodesForOptionsActive()"
					),
					// bindingForItemText
					new DataBinding
					(
						null, // context
						"text(conversationDefn)", // bindingExpression
						{ "conversationDefn": conversationDefn } // argumentLookup
					),
					fontHeightShort,
					new DataBinding
					(
						conversationRun,
						"scopeCurrent.talkNodeForOptionSelected"
					) // bindingForItemSelected
				),

				new ControlButton
				(
					"buttonNext",
					new Coords
					(
						(size.x - listSize.x) / 2,
						size.y - marginSize.y - buttonSize.y
					), // pos
					buttonSize,
					"Next",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						conversationRun.next();
					},
					universe // context
				),
			]
		);

		return returnValue;
	}

	ConversationRun.prototype.toControlTranscript = function(size, universe, venueToReturnTo)
	{
		var conversationRun = this;
		var conversationDefn = conversationRun.defn;

		var venueToReturnTo = universe.venueCurrent;
		var fontHeight = 20;
		var fontHeightShort = fontHeight * .6;
		var marginWidth = 25;
		var labelHeight = fontHeight;
		var buttonHeight = 25;
		var marginSize = new Coords(1, 1).multiplyScalar(marginWidth);
		var listSize = new Coords
		(
			size.x * .75,
			size.y - labelHeight - marginSize.y * 3
		);

		var returnValue = new ControlContainer
		(
			"containerConversation",
			new Coords(0, 0), // pos
			size,
			// children
			[
				new ControlButton
				(
					"buttonBack",
					marginSize, // pos
					new Coords(1, 1).multiplyScalar(buttonHeight), // size
					"<",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					function click(universe)
					{
						var venueNext = venueToReturnTo;
						venueNext = new VenueFader(venueNext, universe.venueCurrent);
						universe.venueNext = venueNext;
					},
					universe // context
				),

				new ControlLabel
				(
					"labelTranscript",
					new Coords
					(
						size.x / 2,
						marginSize.y
					), // pos
					size, // size
					true, // isTextCentered
					"Transcript",
					fontHeight
				),

				new ControlList
				(
					"listEntries",
					new Coords
					(
						(size.x - listSize.x) / 2,
						marginSize.y * 2 + labelHeight
					),
					listSize,
					// items
					new DataBinding
					(
						conversationRun,
						"talkNodesForTranscript"
					),
					new DataBinding
					(
						null,
						"textForTranscript(conversationDefn)",
						{ "conversationDefn": conversationDefn }
					), // bindingForItemText
					fontHeightShort
				),
			]
		);

		return returnValue;
	}
}
