
namespace ThisCouldBeBetter.GameFramework
{

export class Talker implements EntityProperty<Talker>
{
	conversationDefnName: string;
	quit: () => void;
	_toControl: (cr: ConversationRun, size: Coords, universe: Universe) => ControlBase;

	conversationRun: ConversationRun;

	constructor
	(
		conversationDefnName: string,
		quit: () => void,
		toControl: (cr: ConversationRun, size: Coords, universe: Universe) => ControlBase
	)
	{
		this.conversationDefnName = conversationDefnName;
		this.quit = quit;
		this._toControl = toControl;
	}

	static fromConversationDefnName(conversationDefnName: string): Talker
	{
		return new Talker(conversationDefnName, null, null);
	}

	conversationRunSet(value: ConversationRun): Talker
	{
		this.conversationRun = value;
		return this;
	}

	talk(uwpe: UniverseWorldPlaceEntities): void
	{
		var universe = uwpe.universe;
		var entityTalker = uwpe.entity;
		var entityTalkee = uwpe.entity2;

		var mediaLibrary = universe.mediaLibrary;
		var conversationDefnAsText =
			mediaLibrary.textStringGetByName(this.conversationDefnName).value;
		var conversationDefn = ConversationDefn.deserialize(conversationDefnAsText);

		var contentTextStringName = conversationDefn.contentTextStringName;
		var contentTextString =
			contentTextStringName == null
			? null
			: mediaLibrary.textStringGetByName(contentTextStringName);
		if (contentTextString != null)
		{
			// hack - For a specific content tag format in a downstream project.
			var contentText = contentTextString.value.split("\n#").join("\n\n#");
			contentText = contentText.split("\n\n\n").join("\n\n");

			var contentBlocks = contentText.split("\n\n");

			var contentsById = new Map
			(
				contentBlocks.map
				(
					nodeAsBlock =>
					{
						var indexOfNewlineFirst = nodeAsBlock.indexOf("\n");
						var contentIdLine = nodeAsBlock.substr
						(
							0, indexOfNewlineFirst
						);
						var regexWhitespace = /\s+/;
						var contentId = contentIdLine.split(regexWhitespace)[0];
						var restOfBlock = nodeAsBlock.substr(indexOfNewlineFirst + 1);
						return [ contentId, restOfBlock ];
					}
				)
			);
			conversationDefn.contentSubstitute(contentsById);
			//conversationDefn.displayNodesExpandByLines();
		}

		var conversationQuit = this.quit;
		if (conversationQuit == null)
		{
			var venueToReturnTo = universe.venueCurrent();
			conversationQuit = () => // quit
			{
				if (universe.venueNext() == null) // May be set or not based on the conversation.
				{
					universe.venueTransitionTo(venueToReturnTo);
				}
			};
		}
		var conversationRun = new ConversationRun
		(
			conversationDefn,
			conversationQuit,
			entityTalkee,
			entityTalker, // entityTalker
			null // contentsById
		);
		this.conversationRunSet(conversationRun);
		this.conversationRun.talkNodeCurrentExecute(universe);
		var conversationSize = universe.display.sizeDefault().clone();
		var conversationAsControl =
			this.toControl(this.conversationRun, conversationSize, universe);

		var venueNext = conversationAsControl.toVenue();

		universe.venueTransitionTo(venueNext);
	}

	toControl(conversationRun: ConversationRun, size: Coords, universe: Universe): ControlBase
	{
		var returnValue: ControlBase = null;

		if (this._toControl == null)
		{
			returnValue = conversationRun.toControl(size, universe);
		}
		else
		{
			returnValue = this._toControl(conversationRun, size, universe);
		}

		return returnValue;
	}

	// Clonable.

	clone(): Talker
	{
		return this;
	}

	overwriteWith(other: Talker): Talker
	{
		return this;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	propertyName(): string { return Talker.name; }
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable

	equals(other: Talker): boolean { return false; } // todo

}

}
