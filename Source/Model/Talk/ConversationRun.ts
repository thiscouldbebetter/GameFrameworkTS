
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
		var nodeNext = this.defn.talkNodeByName(talkNodeNameNext);
		scope.talkNodeCurrentSet(nodeNext);
		this.talkNodeCurrentExecute(universe);
	}

	initialize(universe: Universe): void
	{
		this.next(universe);
	}

	next(universe: Universe): void
	{
		var scope = this.scopeCurrent;

		if (this.talkNodeCurrent() == null)
		{
			// Do nothing.
		}
		else if (scope.isPromptingForResponse)
		{
			var responseSelected = scope.talkNodeForOptionSelected;
			if (responseSelected != null)
			{
				scope.talkNodeForOptionSelected = null;
				scope.isPromptingForResponse = false;

				var talkNodePrompt = this.talkNodeCurrent();

				var shouldClearOptions = talkNodePrompt.content;
				if (shouldClearOptions)
				{
					scope.talkNodesForOptions.length = 0;
				}

				var nameOfTalkNodeNext = responseSelected.next;
				var talkNodeNext = this.defn.talkNodeByName(nameOfTalkNodeNext);
				scope.talkNodeCurrentSet(talkNodeNext);

				this.talkNodesForTranscript.push(responseSelected);

				this.talkNodeCurrentExecute(universe);
			}
		}
		else
		{
			this.talkNodeCurrentExecute(universe);
		}
	}

	nextUntilPrompt(universe: Universe): void
	{
		var prompt = TalkNodeDefn.Instances().Prompt.name;
		var quit = TalkNodeDefn.Instances().Quit.name;

		var nodeDefnName = this.talkNodeCurrent().defnName;
		if (nodeDefnName == prompt || this.scopeCurrent.isPromptingForResponse)
		{
			this.next(universe);
		}

		var nodeCurrent = this.talkNodeCurrent();
		while (nodeCurrent.defnName != prompt && this.scopeCurrent.isPromptingForResponse == false)
		{
			this.next(universe);

			nodeCurrent = this.talkNodeCurrent();
			if (nodeCurrent.defnName == quit)
			{
				this.next(universe);
				break;
			}

			nodeCurrent = this.talkNodeCurrent();
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
		if
		(
			nodeNamedFinalize != null
			&& nodeNamedFinalize.isEnabled(universe, this)
		)
		{
			this.scopeCurrent.talkNodeCurrentSet(nodeNamedFinalize);
			this.scopeCurrent.talkNodeAdvance(universe, this);
			while (this.scopeCurrent.talkNodeCurrent() != null)
			{
				this.next(universe);
			}
			nodeNamedFinalize.disable();
		}
		this._quit();
	}

	scope(): ConversationScope
	{
		// This convenience method is tersely named for use in scripts.
		return this.scopeCurrent;
	}

	talkNodeAdvance(universe: Universe): void
	{
		this.scopeCurrent.talkNodeAdvance(universe, this);
	}

	talkNodeByName(nodeName: string): TalkNode
	{
		return this.defn.talkNodeByName(nodeName);
	}

	talkNodeCurrent(): TalkNode
	{
		return this.scopeCurrent.talkNodeCurrent();
	}

	talkNodeCurrentExecute(universe: Universe): void
	{
		this.scopeCurrent.talkNodeCurrentExecute(universe, this);
	}

	talkNodeCurrentSet(value: TalkNode): void
	{
		this.scopeCurrent.talkNodeCurrentSet(value);
	}

	talkNodeGoToNext(universe: Universe): TalkNode
	{
		return this.scopeCurrent.talkNodeGoToNext(universe, this);
	}

	talkNodeNext(): TalkNode
	{
		var nodeCurrent = this.talkNodeCurrent();
		var nodeNextName = nodeCurrent.next;
		var nodeNext = 
		(
			nodeNextName == null
			? this.defn.talkNodes[this.defn.talkNodes.indexOf(nodeCurrent) + 1]
			: this.talkNodeByName(nodeCurrent.next)
		);
		return nodeNext;
	}

	talkNodePrev(): TalkNode
	{
		return this.scopeCurrent.talkNodePrev();
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

	variableLoad
	(
		universe: Universe,
		variableName: string,
		variableExpression: string
	): void
	{
		var scriptText = "( (u, cr) => " + variableExpression + ")";
		var scriptToRun = eval(scriptText);
		var variableValue = scriptToRun(universe, this);
		this.variableSet(variableName, variableValue);
	}

	variableSet(variableName: string, variableValue: unknown): void
	{
		this.variablesByName.set(variableName, variableValue);
	}

	variableStore
	(
		universe: Universe,
		variableName: string,
		scriptExpression: string
	): void
	{
		var variableValue = this.variableByName(variableName).toString();
		var scriptExpressionWithValue =
			scriptExpression.split("$value").join(variableValue);
		var scriptToRunAsString =
			"( (u, cr) => { " + scriptExpressionWithValue + "; } )";
		var scriptToRun = eval(scriptToRunAsString);
		scriptToRun(universe, this);
	}

	// controls

	toControl(size: Coords, universe: Universe): ControlBase
	{
		return this.toControl_Layout_Default(size, universe);
	}

	toControl_Layout_Default(size: Coords, universe: Universe): ControlBase
	{
		var fontHeight = 15;

		var marginWidth = 15;
		var marginSize = Coords.fromXY(1, 1).multiplyScalar(marginWidth);

		var buttonHeight = 20;
		var buttonSize = Coords.fromXY(2, 1).multiplyScalar(buttonHeight);
		var containerButtonsMarginSize = marginSize;

		var containerButtonsPos = Coords.fromXY
		(
			size.x - marginSize.x * 2 - buttonSize.x,
			size.y - marginSize.y * 4 - buttonSize.y * 3
		);

		var portraitSize = Coords.fromXY(4, 4).multiplyScalar(buttonHeight);

		var portraitPos = marginSize.clone();

		var labelSpeakerSize = Coords.fromXY
		(
			size.x - marginSize.x * 3 - portraitSize.x,
			portraitSize.y
		);

		var labelSpeakerPos = Coords.fromXY
		(
			marginSize.x * 2 + portraitSize.x,
			marginSize.y
		);

		var listSize = Coords.fromXY
		(
			size.x - marginSize.x * 3 - buttonSize.x,
			size.y - portraitSize.y - marginSize.y * 4
		);

		var listPos = Coords.fromXY
		(
			marginSize.x,
			marginSize.y * 2 + portraitSize.y + fontHeight
		);

		var returnValue = this.toControl_WithCoords
		(
			size,
			universe,
			fontHeight,
			marginSize,
			containerButtonsPos,
			containerButtonsMarginSize,
			buttonSize,
			portraitPos,
			portraitSize,
			labelSpeakerPos,
			labelSpeakerSize,
			false, // labelSpeakerIsCenteredHorizontally
			true, // labelSpeakerIsCenteredVertically
			listPos,
			listSize
		);

		return returnValue;
	}

	toControl_Layout_2(size: Coords, universe: Universe): ControlBase
	{
		var fontHeight = 15;

		var marginWidth = 15;
		var marginSize = Coords.fromXY(1, 1).multiplyScalar(marginWidth);

		var portraitSize = Coords.fromXY
		(
			1,
			.44
		).multiplyScalar
		(
			size.x - marginSize.x * 2
		).round();

		var portraitPos = marginSize.clone();

		var labelSpeakerSize = portraitSize.clone().subtract(marginSize).subtract(marginSize);

		var labelSpeakerPos = portraitPos.clone().add(marginSize);

		var listSize = Coords.fromXY
		(
			portraitSize.x,
			size.y - portraitSize.y - fontHeight - marginSize.y * 3
		);

		var listPos = Coords.fromXY
		(
			marginSize.x,
			marginSize.y * 2 + portraitSize.y + fontHeight
		);

		var returnValue = this.toControl_WithCoords
		(
			size,
			universe,
			fontHeight,
			marginSize,
			null, // containerButtonsPos,
			null, // containerButtonsMarginSize,
			null, // buttonSize,
			portraitPos,
			portraitSize,
			labelSpeakerPos,
			labelSpeakerSize,
			true, // labelSpeakerIsCenteredHorizontally
			false, // labelSpeakerIsCenteredVertically
			listPos,
			listSize
		);

		return returnValue;
	}

	toControl_WithCoords
	(
		size: Coords,
		universe: Universe,
		fontHeight: number,
		marginSize: Coords,
		containerButtonsPos: Coords,
		containerButtonsMarginSize: Coords,
		buttonSize: Coords,
		portraitPos: Coords,
		portraitSize: Coords,
		labelSpeakerPos: Coords,
		labelSpeakerSize: Coords,
		labelSpeakerIsCenteredHorizontally: boolean,
		labelSpeakerIsCenteredVertically: boolean,
		listPos: Coords,
		listSize: Coords
	): ControlBase
	{
		var fontHeightShort = fontHeight; // todo

		var conversationRun = this;
		var conversationDefn = conversationRun.defn;

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

		var visualPortrait: VisualBase = conversationDefn.visualPortrait;
		if (visualPortrait.constructor.name.startsWith("VisualImage"))
		{
			visualPortrait = new VisualImageScaled
			(
				(visualPortrait as VisualImage), portraitSize
			);
		}

		var childControls: ControlBase[] =
		[
			ControlButton.from8
			(
				"buttonNextUnderPortrait",
				portraitPos,
				portraitSize,
				"Next",
				fontHeight,
				true, // hasBorder
				DataBinding.fromTrue(), // isEnabled
				next // click
			),

			new ControlVisual
			(
				"visualPortrait",
				portraitPos,
				portraitSize,
				DataBinding.fromContext(visualPortrait),
				Color.byName("Black"), // colorBackground
				null // colorBorder
			),

			new ControlLabel
			(
				"labelSpeaker",
				labelSpeakerPos,
				labelSpeakerSize,
				labelSpeakerIsCenteredHorizontally,
				labelSpeakerIsCenteredVertically,
				DataBinding.fromContextAndGet
				(
					conversationRun,
					(c: ConversationRun) =>
						c.scopeCurrent.displayTextCurrent()
				),
				fontHeight
			),

			new ControlLabel
			(
				"labelResponse",
				Coords.fromXY
				(
					marginSize.x,
					marginSize.y * 2 + portraitSize.y - fontHeight / 2
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
				listPos,
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
			)

		]; // children

		if (containerButtonsPos != null)
		{
			var buttonNext = ControlButton.from8
			(
				"buttonNext",
				Coords.fromXY
				(
					containerButtonsMarginSize.x,
					containerButtonsMarginSize.y
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
				Coords.fromXY
				(
					containerButtonsMarginSize.x,
					containerButtonsMarginSize.y * 2 + buttonSize.y
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
						containerButtonsMarginSize.x,
						containerButtonsMarginSize.y * 3 + buttonSize.y * 2
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
				buttonSize.y * (buttons.length) + marginSize.y * (buttons.length + 1)
			);

			var containerButtonsInner = ControlContainer.from4
			(
				"containerButtons",
				containerButtonsPos,
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

			childControls.push(containerButtons);
		}

		var returnValue = new ControlContainer
		(
			"containerConversation",
			Coords.create(), // pos
			size,

			childControls,

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
