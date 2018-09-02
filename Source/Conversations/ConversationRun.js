
function ConversationRun(defn)
{
	this.defn = defn;

	var talkNodeStart = this.defn.talkNodes[0];

	this.scopeCurrent = new ConversationScope
	(
		null, // parent
		talkNodeStart,
		// talkNodesForOptions
		[]
	);

	this.talkNodesForTranscript = [];
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

		//this.domElementUpdate();
	}

	// dom

	ConversationRun.prototype.domElementUpdate = function()
	{
		var d = document;

		var inputStatement = d.getElementById("inputStatement");
		inputStatement.value = this.scopeCurrent.displayTextCurrent;

		var selectResponses = d.getElementById("selectResponses");
		selectResponses.innerHTML = "";
		if (this.scopeCurrent.isPromptingForResponse == false)
		{
			d.getElementById("buttonNext").focus();
		}
		else
		{
			var talkNodesForOptions = this.scopeCurrent.talkNodesForOptions;
			for (var i = 0; i < talkNodesForOptions.length; i++)
			{
				var talkNode = talkNodesForOptions[i];
				if (talkNode.isActive == true)
				{
					var talkNodeAsOption = d.createElement("option");
					talkNodeAsOption.innerHTML = talkNode.parameters[1];
					talkNodeAsOption.value = talkNode.name;
					selectResponses.appendChild(talkNodeAsOption);
				}
			}
			selectResponses.focus();
		}
	}

	// controls

	ConversationRun.prototype.toControl = function(size, universe)
	{
		var conversationRun = this;

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
			size.y - labelHeight - buttonHeight - marginSize.y * 4
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
						marginSize.y
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
						marginSize.y * 2 + labelHeight
					),
					listSize,
					// items
					new DataBinding
					(
						conversationRun,
						"scopeCurrent.talkNodesForOptionsActive()"
					),
					"text()", // bindingExpressionForItemText
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
						marginSize.y * 3 + labelHeight + listSize.y
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
					"textForTranscript()", // bindingExpressionForItemText
					fontHeightShort
				),
			]
		);

		return returnValue;
	}
}
