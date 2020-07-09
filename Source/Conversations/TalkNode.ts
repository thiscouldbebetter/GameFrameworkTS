
class TalkNode
{
	name: string;
	defnName: string;
	text: string;
	next: any;
	isActive: boolean;

	constructor(name: string, defnName: string, text: string, next: any, isActive: boolean)
	{
		this.name = (name == null ? TalkNode.idNext() : name);
		this.defnName = defnName;
		this.text = text;
		this.next = next;
		this.isActive = (isActive == null ? true : isActive);
	}
	// static methods

	static _idNext = 0;
	static idNext()
	{
		var returnValue = "_" + TalkNode._idNext;
		TalkNode._idNext++;
		return returnValue;
	};

	// instance methods

	activate(conversationRun: ConversationRun, scope: ConversationScope)
	{
		var defn = this.defn(conversationRun.defn);
		if (defn.activate != null)
		{
			defn.activate(conversationRun, scope, this);
		}
	};

	defn(conversationDefn: ConversationDefn)
	{
		return conversationDefn.talkNodeDefnsByName[this.defnName];
	};

	execute(universe: Universe, conversationRun: ConversationRun, scope: ConversationScope)
	{
		var defn = this.defn(conversationRun.defn);
		defn.execute(universe, conversationRun, scope, this);
	};

	textForTranscript(conversationDefn: ConversationDefn)
	{
		var speakerName = (this.defnName == "Option" ? "YOU" : "THEY" );
		var returnValue = speakerName + ": " + this.text;
		return returnValue;
	};
}
