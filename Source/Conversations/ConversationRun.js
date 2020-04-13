
class ConversationRun
{
	constructor(defn, quit, entityPlayer, entityTalker)
	{
		this.defn = defn;
		this.quit = quit;
		this.entityPlayer = entityPlayer;
		this.entityTalker = entityTalker;

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

		this.next();

		// Abbreviate for scripts.
		this.p = this.entityPlayer;
		this.t = this.entityTalker;
		this.vars = this.variableLookup;
	}

	// instance methods

	next(universe)
	{
		var responseSelected = this.scopeCurrent.talkNodeForOptionSelected;
		if (responseSelected != null)
		{
			var talkNodePrompt = this.scopeCurrent.talkNodeCurrent;
			talkNodePrompt.activate(this, this.scopeCurrent);
			responseSelected.activate(this, this.scopeCurrent);
			this.scopeCurrent.talkNodeForOptionSelected = null;
		}
		this.update(universe);
	};

	update(universe)
	{
		this.scopeCurrent.update(universe, this);
	};

	// controls

	toControl(size, universe)
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
			size.x * .6,
			size.y - buttonHeight - labelHeight - marginSize.y * 4
		);
		var buttonSize = new Coords(listSize.x, buttonHeight);
		var buttonTranscriptSize = new Coords(2, 1).multiplyScalar(buttonHeight); // size

		var next = function()
		{
			conversationRun.next(universe);
		};

		var back = function()
		{
			var venueNext = venueToReturnTo;
			venueNext = new VenueFader(venueNext, universe.venueCurrent);
			universe.venueNext = venueNext;
		};

		var viewLog = function()
		{
			var venueCurrent = universe.venueCurrent;
			var transcriptAsControl = conversationRun.toControlTranscript
			(
				size, universe, venueCurrent
			);
			var venueNext = new VenueControls(transcriptAsControl);
			venueNext = new VenueFader(venueNext, universe.venueCurrent);
			universe.venueNext = venueNext;
		};

		var returnValue = new ControlContainer
		(
			"containerConversation",
			new Coords(0, 0), // pos
			size,
			// children
			[
				new ControlLabel
				(
					"labelSpeaker",
					new Coords
					(
						size.x / 2,
						marginSize.y * 2 + buttonSize.y
					), // pos
					size, // size
					true, // isTextCentered
					new DataBinding
					(
						conversationRun,
						function get(c) { return c.scopeCurrent.displayTextCurrent; }
					),
					fontHeight
				),

				new ControlList
				(
					"listResponses",
					new Coords
					(
						(size.x - listSize.x) / 2,
						marginSize.y * 3 + buttonSize.y + labelHeight
					),
					listSize,
					// items
					new DataBinding
					(
						conversationRun,
						function get(c) { return c.scopeCurrent.talkNodesForOptionsActive(); }
					),
					// bindingForItemText
					new DataBinding
					(
						null, // context
						function get(c) { return c.text; }
					),
					fontHeightShort,
					new DataBinding
					(
						conversationRun,
						function get(c) { return c.scopeCurrent.talkNodeForOptionSelected; },
						function set(c, v) { c.scopeCurrent.talkNodeForOptionSelected = v; }
					), // bindingForItemSelected
					new DataBinding(), // bindingForItemValue
					true, // isEnabled
					function confirm(context, universe)
					{
						next();
					}
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
					viewLog
				),

				new ControlButton
				(
					"buttonBack",
					marginSize, // pos
					new Coords(1, 1).multiplyScalar(buttonHeight), // size
					"<",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					back
				),

			], // children

			[
				new Action("Back", back),
				new Action("ViewLog", viewLog)
			],

			[
				new ActionToInputsMapping( "Back", [ universe.inputHelper.inputNames.Escape ], true ),
				new ActionToInputsMapping( "ViewLog", [ Input.Names().Space ], true )
			]
		);

		returnValue.focusGain();

		return returnValue;
	};

	toControlTranscript(size, universe, venueToReturnTo)
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
						function get(c) { return c.talkNodesForTranscript; }
					),
					new DataBinding
					(
						null,
						function get(c) { return c.textForTranscript(conversationDefn); }
					), // bindingForItemText
					fontHeightShort
				),
			]
		);

		return returnValue;
	};
}
