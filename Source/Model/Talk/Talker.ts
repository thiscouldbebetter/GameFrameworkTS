
namespace ThisCouldBeBetter.GameFramework
{

export class Talker implements EntityProperty<Talker>
{
	conversationDefnName: string;
	quit: () => void;

	conversationRun: ConversationRun;

	constructor(conversationDefnName: string, quit: () => void)
	{
		this.conversationDefnName = conversationDefnName;
		this.quit = quit;
	}

	static fromConversationDefnName(conversationDefnName: string): Talker
	{
		return new Talker(conversationDefnName, null);
	}

	talk(uwpe: UniverseWorldPlaceEntities): void
	{
		var universe = uwpe.universe;
		var entityTalker = uwpe.entity;
		var entityTalkee = uwpe.entity2;

		var mediaLibrary = universe.mediaLibrary;
		var conversationDefnAsJSON =
			mediaLibrary.textStringGetByName(this.conversationDefnName).value;
		var conversationDefn = ConversationDefn.deserialize(conversationDefnAsJSON);

		var contentTextStringName = this.conversationDefnName + "-Content";
		var contentTextString = mediaLibrary.textStringGetByName(contentTextStringName);
		if (contentTextString != null)
		{
			var contentBlocks = contentTextString.value.split("\n\n");

			var contentsById = new Map
			(
				contentBlocks.map
				(
					nodeAsBlock =>
					{
						var indexOfNewlineFirst = nodeAsBlock.indexOf("\n");
						var contentId = nodeAsBlock.substr
						(
							0, indexOfNewlineFirst
						).split("\t")[0];
						var restOfBlock = nodeAsBlock.substr(indexOfNewlineFirst + 1);
						return [ contentId, restOfBlock ];
					}
				)
			);
			conversationDefn.contentSubstitute(contentsById);
			conversationDefn.displayNodesExpandByLines();
		}

		var conversationQuit = this.quit;
		if (conversationQuit == null)
		{
			var venueToReturnTo = universe.venueCurrent;
			conversationQuit = () => // quit
			{
				if (universe.venueNext == null) // May be set or not based on the conversation.
				{
					universe.venueNext = venueToReturnTo;
				}
			};
		}
		this.conversationRun = new ConversationRun
		(
			conversationDefn,
			conversationQuit,
			entityTalkee,
			entityTalker, // entityTalker
			null // contentsById
		);
		this.conversationRun.talkNodeCurrentExecute(universe);
		var conversationSize = universe.display.sizeDefault().clone();
		var conversationAsControl =
			this.conversationRun.toControl(conversationSize, universe);

		var venueNext = conversationAsControl.toVenue();

		universe.venueNext = venueNext;
	}

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable

	equals(other: Talker): boolean { return false; } // todo

}

}
