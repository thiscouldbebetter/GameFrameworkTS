
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
		var conversationRun = this.toConversationRun(uwpe);

		this.conversationRunSet(conversationRun);

		var universe = uwpe.universe;
		var venueNext = new VenueConversationRun(conversationRun, universe);

		universe.venueTransitionTo(venueNext);
	}

	toConversationRun(uwpe: UniverseWorldPlaceEntities): ConversationRun
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
			: mediaLibrary.textStringGetByName(contentTextStringName).value;

		conversationDefn.contentSubstituteFromString(contentTextString);

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

		var conversationRun = ConversationRun.fromDefnQuitTalkeeAndTalker
		(
			conversationDefn,
			conversationQuit,
			entityTalkee,
			entityTalker
		);

		return conversationRun;
	}

	// Controllable.

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
