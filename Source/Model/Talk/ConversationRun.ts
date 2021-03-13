
namespace ThisCouldBeBetter.GameFramework
{

export class ConversationRun
{
	defn: ConversationDefn;
	quit: () => void;
	entityPlayer: Entity;
	entityTalker: Entity;
 
	scopeCurrent: ConversationScope;
	talkNodesForTranscript: TalkNode[];
	variableLookup: Map<string, any>;

	p: Entity;
	t: Entity;
	vars: Map<string, any>;

	constructor
	(
		defn: ConversationDefn,
		quit: () => void,
		entityPlayer: Entity,
		entityTalker: Entity
	)
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

		this.variableLookup = new Map<string, any>();

		this.next(null);

		// Abbreviate for scripts.
		this.p = this.entityPlayer;
		this.t = this.entityTalker;
		this.vars = this.variableLookup;
	}

	// instance methods

	next(universe: Universe)
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
	}

	update(universe: Universe)
	{
		this.scopeCurrent.update(universe, this);
	}

	// controls

	toControl(size: Coords, universe: Universe)
	{
		var conversationRun = this;
		var conversationDefn = conversationRun.defn;

		var venueToReturnTo = universe.venueCurrent;

		var fontHeight = 15;
		var fontHeightShort = fontHeight; // todo
		var marginWidth = 15;
		var labelHeight = fontHeight;
		var buttonHeight = 20;
		var marginSize = new Coords(1, 1, 0).multiplyScalar(marginWidth);
		var buttonSize = new Coords(2, 1, 0).multiplyScalar(buttonHeight);
		var portraitSize = new Coords(4, 4, 0).multiplyScalar(buttonHeight);
		var listSize = new Coords
		(
			size.x - marginSize.x * 3 - buttonSize.x,
			size.y - portraitSize.y - marginSize.y * 4,
			0
		);

		var next = () =>
		{
			conversationRun.next(universe);
		};

		var back = () =>
		{
			var venueNext = venueToReturnTo;
			venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
			universe.venueNext = venueNext;
		};

		var viewLog = () =>
		{
			var venueCurrent = universe.venueCurrent;
			var transcriptAsControl = conversationRun.toControlTranscript
			(
				size, universe, venueCurrent
			);
			var venueNext: Venue = new VenueControls(transcriptAsControl, false);
			venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
			universe.venueNext = venueNext;
		};

		var returnValue = new ControlContainer
		(
			"containerConversation",
			new Coords(0, 0, 0), // pos
			size,
			// children
			[
				new ControlVisual
				(
					"visualPortrait",
					marginSize.clone(),
					portraitSize, // size
					DataBinding.fromContext(conversationDefn.visualPortrait),
					Color.byName("Black"), // colorBackground
					null // colorBorder
				),

				new ControlLabel
				(
					"labelSpeaker",
					new Coords
					(
						marginSize.x * 2 + portraitSize.x,
						marginSize.y + portraitSize.y / 2 - labelHeight / 2,
						0
					), // pos
					size, // size
					false, // isTextCentered
					new DataBinding
					(
						conversationRun,
						(c: ConversationRun) => { return c.scopeCurrent.displayTextCurrent; },
						null
					),
					fontHeight
				),

				new ControlLabel
				(
					"labelResponse",
					new Coords
					(
						marginSize.x,
						marginSize.y * 2 + portraitSize.y - fontHeight / 2,
						0
					),
					size, // size
					false, // isTextCentered
					"Response:",
					fontHeight
				),

				new ControlList
				(
					"listResponses",
					new Coords
					(
						marginSize.x,
						marginSize.y * 3 + portraitSize.y,
						0
					),
					listSize,
					// items
					new DataBinding
					(
						conversationRun,
						(c: ConversationRun) => { return c.scopeCurrent.talkNodesForOptionsActive(); },
						null
					),
					// bindingForItemText
					new DataBinding
					(
						null, // context
						(c: TalkNode) => { return c.text; },
						null
					),
					fontHeightShort,
					new DataBinding
					(
						conversationRun,
						(c: ConversationRun) => c.scopeCurrent.talkNodeForOptionSelected,
						(c: ConversationRun, v: TalkNode) => { c.scopeCurrent.talkNodeForOptionSelected = v; }
					), // bindingForItemSelected
					new DataBinding(null, null, null), // bindingForItemValue
					DataBinding.fromContext(true), // isEnabled
					(universe: Universe) => // confirm
					{
						next();
					},
					null
				),

				new ControlButton
				(
					"buttonNext",
					new Coords
					(
						size.x - marginSize.x - buttonSize.x,
						size.y - marginSize.y * 3 - buttonSize.y * 3,
						0
					),
					buttonSize.clone(),
					"Next",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					next, // click
					null, null
				),

				new ControlButton
				(
					"buttonTranscript",
					new Coords
					(
						size.x - marginSize.x - buttonSize.x,
						size.y - marginSize.y * 2 - buttonSize.y * 2,
						0
					),
					buttonSize.clone(),
					"Log",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					viewLog, // click
					null, null
				),

				new ControlButton
				(
					"buttonDone",
					new Coords
					(
						size.x - marginSize.x - buttonSize.x,
						size.y - marginSize.y - buttonSize.y,
						0
					),
					buttonSize.clone(),
					"Done",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					back, // click
					null, null
				),

			], // children

			[
				new Action("Back", back),
				new Action("ViewLog", viewLog)
			],

			[
				new ActionToInputsMapping( "Back", [ Input.Names().Escape ], true ),
				new ActionToInputsMapping( "ViewLog", [ Input.Names().Space ], true )
			]
		);

		returnValue.focusGain();

		return returnValue;
	}

	toControlTranscript(size: Coords, universe: Universe, venueToReturnTo: Venue)
	{
		var conversationRun = this;
		var conversationDefn = conversationRun.defn;

		venueToReturnTo = universe.venueCurrent;
		var fontHeight = 20;
		var fontHeightShort = fontHeight * .6;
		var marginWidth = 25;
		var labelHeight = fontHeight;
		var buttonHeight = 25;
		var marginSize = new Coords(1, 1, 0).multiplyScalar(marginWidth);
		var listSize = new Coords
		(
			size.x * .75,
			size.y - labelHeight - marginSize.y * 3,
			0
		);

		var returnValue = new ControlContainer
		(
			"containerConversation",
			new Coords(0, 0, 0), // pos
			size,
			// children
			[
				new ControlButton
				(
					"buttonBack",
					marginSize, // pos
					new Coords(1, 1, 0).multiplyScalar(buttonHeight), // size
					"<",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					(universe: Universe) => // click
					{
						var venueNext = venueToReturnTo;
						venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
						universe.venueNext = venueNext;
					},
					null, null
				),

				new ControlLabel
				(
					"labelTranscript",
					new Coords
					(
						size.x / 2, marginSize.y, 0
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
						marginSize.y * 2 + labelHeight,
						0
					),
					listSize,
					// items
					new DataBinding
					(
						conversationRun,
						(c: ConversationRun) => { return c.talkNodesForTranscript; },
						null
					),
					new DataBinding
					(
						null,
						(c: TalkNode) => { return c.textForTranscript(conversationDefn); },
						null
					), // bindingForItemText
					fontHeightShort,
					null, null, null, null, null
				),
			],
			null, null
		);

		return returnValue;
	}
}

}
