
namespace ThisCouldBeBetter.GameFramework
{

export class ConversationRun
{
	defn: ConversationDefn;
	_quit: () => void;
	entityPlayer: Entity;
	entityTalker: Entity;
	contentsById: Map<string, string>;

	scopeCurrent: ConversationScope;
	talkNodesForTranscript: TalkNode[];
	variablesByName: Map<string, unknown>;

	p: Entity;
	t: Entity;
	vars: Map<string, unknown>;

	constructor
	(
		defn: ConversationDefn,
		quit: () => void,
		entityPlayer: Entity,
		entityTalker: Entity,
		contentsById: Map<string, string>
	)
	{
		this.defn = defn;
		this._quit = quit;
		this.entityPlayer = entityPlayer;
		this.entityTalker = entityTalker;
		this.contentsById = contentsById || new Map<string, string>();

		var talkNodeStart = this.defn.talkNodes[0];

		this.scopeCurrent = new ConversationScope
		(
			null, // parent
			talkNodeStart,
			// talkNodesForOptions
			[]
		);

		this.talkNodesForTranscript = [];

		this.variablesByName = new Map<string, unknown>();

		// Abbreviate for scripts.
		this.p = this.entityPlayer;
		this.t = this.entityTalker;
		this.vars = this.variablesByName;
	}

	// Instance methods.

	disable(talkNodeToDisableName: string): void
	{
		this.enableOrDisable(talkNodeToDisableName, true);
	}

	enable(talkNodeToActivateName: string): void
	{
		this.enableOrDisable(talkNodeToActivateName, false);
	}

	enableOrDisable
	(
		talkNodeToEnableOrDisableName: string,
		isDisabledValueToSet: boolean
	): void
	{
		var conversationDefn = this.defn;
		var talkNodeToSet =
			conversationDefn.talkNodesByName.get(talkNodeToEnableOrDisableName);
		talkNodeToSet._isDisabled = () => isDisabledValueToSet;
	}

	goto(talkNodeNameNext: string, universe: Universe): void
	{
		// This convenience method is tersely named for use in scripts.
		var scope = this.scopeCurrent;
		scope.talkNodeCurrent = this.defn.talkNodeByName
		(
			talkNodeNameNext
		);
		this.update(universe);
	}

	initialize(universe: Universe): void
	{
		this.next(universe);
	}

	next(universe: Universe): void
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

	nextUntilPrompt(universe: Universe): void
	{
		var prompt = TalkNodeDefn.Instances().Prompt.name;
		var quit = TalkNodeDefn.Instances().Quit.name;

		var nodeDefnName = this.talkNodeCurrent().defnName;
		if (nodeDefnName == prompt)
		{
			this.next(universe);
		}

		while (this.talkNodeCurrent().defnName != prompt)
		{
			this.next(universe);

			if (this.talkNodeCurrent().defnName == quit)
			{
				this.next(universe);
				break;
			}
		}
	}

	nodesByPrefix(nodeNamePrefix: string): TalkNode[]
	{
		// This convenience method is tersely named for use in scripts.
		var nodesStartingWithPrefix = this.defn.talkNodes.filter
		(
			x => x.name.startsWith(nodeNamePrefix)
		);
		return nodesStartingWithPrefix;
	}

	optionSelectByNext(nextToMatch: string): TalkNode
	{
		return this.scopeCurrent.optionSelectByNext(nextToMatch);
	}

	optionSelectNext(): TalkNode
	{
		return this.scopeCurrent.optionSelectNext();
	}

	optionsAvailable(): TalkNode[]
	{
		return this.scopeCurrent.talkNodesForOptions;
	}

	optionsAvailableAsStrings(): string[]
	{
		return this.optionsAvailable().map(x => x.content);
	}

	player(): Entity
	{
		// This convenience method is tersely named for use in scripts.
		return this.entityPlayer;
	}

	quit(universe: Universe): void
	{
		var nodeNamedFinalize = this.defn.talkNodes.find(x => x.name == "Finalize");
		if (nodeNamedFinalize != null)
		{
			this.scopeCurrent.talkNodeCurrent = nodeNamedFinalize;
			this.scopeCurrent.talkNodeAdvance(universe, this);
			while (this.scopeCurrent.talkNodeCurrent != null)
			{
				this.next(universe);
			}
		}
		this._quit();
	}

	scope(): ConversationScope
	{
		// This convenience method is tersely named for use in scripts.
		return this.scopeCurrent;
	}

	talkNodeCurrent(): TalkNode
	{
		return this.scopeCurrent.talkNodeCurrent;
	}

	talker(): Entity
	{
		// This convenience method is tersely named for use in scripts.
		return this.entityTalker;
	}

	toVenue(universe: Universe): Venue
	{
		return this.toControl(universe.display.sizeInPixels, universe).toVenue();
	}

	update(universe: Universe): void
	{
		this.scopeCurrent.update(universe, this);
	}

	varGet(variableName: string): unknown
	{
		// This convenience method is tersely named for use in scripts.
		return this.variableByName(variableName);
	}

	varSet(variableName: string, variableValue: unknown): unknown
	{
		// This convenience method is tersely named for use in scripts.
		return this.variableSet(variableName, variableValue);
	}

	variableByName(variableName: string): unknown
	{
		return this.variablesByName.get(variableName);
	}

	variableSet(variableName: string, variableValue: unknown): void
	{
		this.variablesByName.set(variableName, variableValue);
	}

	// controls

	toControl(size: Coords, universe: Universe): ControlBase
	{
		var conversationRun = this;
		var conversationDefn = conversationRun.defn;

		var fontHeight = 15;
		var fontHeightShort = fontHeight; // todo
		var marginWidth = 15;
		var buttonHeight = 20;
		var marginSize = Coords.fromXY(1, 1).multiplyScalar(marginWidth);
		var buttonSize = Coords.fromXY(2, 1).multiplyScalar(buttonHeight);
		var portraitSize = Coords.fromXY(4, 4).multiplyScalar(buttonHeight);
		var listSize = Coords.fromXY
		(
			size.x - marginSize.x * 3 - buttonSize.x,
			size.y - portraitSize.y - marginSize.y * 4
		);

		var next = () =>
		{
			conversationRun.next(universe);
		};

		var back = () => this.quit(universe);

		var viewLog = () =>
		{
			var venueCurrent = universe.venueCurrent;
			var transcriptAsControl = conversationRun.toControlTranscript
			(
				size, universe, venueCurrent
			);
			var venueNext: Venue = transcriptAsControl.toVenue();
			universe.venueTransitionTo(venueNext);
		};

		var buttonNext = ControlButton.from8
		(
			"buttonNext",
			Coords.fromXY
			(
				size.x - marginSize.x - buttonSize.x,
				size.y - marginSize.y * 3 - buttonSize.y * 3
			),
			buttonSize.clone(),
			"Next",
			fontHeight,
			true, // hasBorder
			DataBinding.fromTrue(), // isEnabled
			next // click
		);

		var buttonTranscript =ControlButton.from8
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
			DataBinding.fromTrue(), // isEnabled
			viewLog // click
		);

		var buttons =
		[
			buttonNext,
			buttonTranscript
		];

		if (this._quit != null)
		{
			var buttonLeave = ControlButton.from8
			(
				"buttonLeave",
				Coords.fromXY
				(
					size.x - marginSize.x - buttonSize.x,
					size.y - marginSize.y - buttonSize.y
				),
				buttonSize.clone(),
				"Leave",
				fontHeight,
				true, // hasBorder
				DataBinding.fromTrue(), // isEnabled
				back // click
			);

			buttons.push(buttonLeave);
		}

		var containerButtonsSize = Coords.fromXY
		(
			buttonSize.x,
			buttonSize.y * (buttons.length + 1) + marginSize.y * (buttons.length)
		);

		var containerButtonsInner = ControlContainer.from4
		(
			"containerButtons",
			Coords.fromXY
			(
				size.x - marginSize.x * 2 - buttonSize.x,
				size.y - marginSize.y * 4 - buttonSize.y * 3
			), // pos
			containerButtonsSize,
			// children
			buttons
		)

		containerButtonsInner.childrenLayOutWithSpacingVertically
		(
			marginSize
		);

		var containerButtons =
			containerButtonsInner.toControlContainerTransparent();

		var returnValue = new ControlContainer
		(
			"containerConversation",
			Coords.create(), // pos
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
						marginSize.y,
						0
					), // pos
					Coords.fromXY
					(
						size.x - marginWidth * 3 - portraitSize.x,
						portraitSize.y
					), // size
					false, // isTextCenteredHorizontally
					true, // isTextCenteredVertically
					DataBinding.fromContextAndGet
					(
						conversationRun,
						(c: ConversationRun) =>
							c.scopeCurrent.displayTextCurrent
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
					false, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext("Response:"),
					fontHeight
				),

				ControlList.from10
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
					DataBinding.fromContextAndGet
					(
						conversationRun,
						(c: ConversationRun) =>
							c.scopeCurrent.talkNodesForOptionsActive(universe, c)
					),
					// bindingForItemText
					DataBinding.fromGet
					(
						(c: TalkNode) => c.content
					),
					fontHeightShort,
					new DataBinding
					(
						conversationRun,
						(c: ConversationRun) =>
							c.scopeCurrent.talkNodeForOptionSelected,
						(c: ConversationRun, v: TalkNode) =>
							c.scopeCurrent.talkNodeForOptionSelected = v
					), // bindingForItemSelected
					DataBinding.fromGet
					(
						(c: TalkNode) => c.name
					), // bindingForItemValue
					DataBinding.fromTrue(), // isEnabled
					(universe: Universe) => // confirm
					{
						next();
					}
				),

				containerButtons

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

	toControlTranscript
	(
		size: Coords, universe: Universe, venueToReturnTo: Venue
	): ControlBase
	{
		var conversationRun = this;

		venueToReturnTo = universe.venueCurrent;
		var fontHeight = 20;
		var fontHeightShort = fontHeight * .6;
		var marginWidth = 25;
		var labelHeight = fontHeight;
		var buttonHeight = 25;
		var marginSize = Coords.fromXY(1, 1).multiplyScalar(marginWidth);
		var listSize = Coords.fromXY
		(
			size.x * .75,
			size.y - labelHeight - marginSize.y * 3
		);

		var returnValue = ControlContainer.from4
		(
			"containerConversation",
			Coords.create(), // pos
			size,
			// children
			[
				new ControlLabel
				(
					"labelTranscript",
					Coords.fromXY
					(
						0, marginSize.y
					), // pos
					Coords.fromXY(size.x, fontHeight), // size
					true, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext("Transcript"),
					fontHeight
				),

				ControlButton.from8
				(
					"buttonBack",
					marginSize, // pos
					Coords.fromXY(1, 1).multiplyScalar(buttonHeight), // size
					"<",
					fontHeight,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					() => // click
					{
						universe.venueTransitionTo(venueToReturnTo);
					}
				),

				ControlList.from6
				(
					"listEntries",
					Coords.fromXY
					(
						(size.x - listSize.x) / 2,
						marginSize.y * 2 + labelHeight
					),
					listSize,
					// items
					DataBinding.fromContextAndGet
					(
						conversationRun,
						(c: ConversationRun) => c.talkNodesForTranscript
					),
					DataBinding.fromGet
					(
						(c: TalkNode) => c.textForTranscript(conversationRun)
					), // bindingForItemText
					fontHeightShort
				),
			]
		);

		return returnValue;
	}
}

}
