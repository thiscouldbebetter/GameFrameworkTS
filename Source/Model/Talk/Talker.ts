
namespace ThisCouldBeBetter.GameFramework
{

export class Talker extends EntityPropertyBase<Talker>
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
		super();

		this.conversationDefnName = conversationDefnName;
		this.quit = quit;
		this._toControl = toControl;
	}

	static fromConversationDefnName(conversationDefnName: string): Talker
	{
		return new Talker(conversationDefnName, null, null);
	}

	static of(entity: Entity): Talker
	{
		return entity.propertyByName(Talker.name) as Talker;
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

		var venueNext = new VenueConversationRun(conversationRun, universe);

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
}

}
