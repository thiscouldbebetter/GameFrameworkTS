
namespace ThisCouldBeBetter.GameFramework
{

export class TalkNode
{
	name: string;
	defnName: string;
	content: string;
	next: string;
	isDisabled: boolean;

	constructor
	(
		name: string,
		defnName: string,
		content: string,
		next: string,
		isDisabled: boolean
	)
	{
		this.name = (name == null ? TalkNode.idNext() : name);
		this.defnName = defnName;
		this.content = content;
		this.next = next;
		this.isDisabled = (isDisabled == null ? false : isDisabled);
	}
	// static methods

	static _idNext = 0;
	static idNext()
	{
		var returnValue = "_" + TalkNode._idNext;
		TalkNode._idNext++;
		return returnValue;
	}

	static display(name: string, content: string): TalkNode
	{
		return new TalkNode
		(
			name,
			TalkNodeDefn.Instances().Display.name,
			content,
			null, // next
			false // isDisabled
		);
	}

	static doNothing(name: string): TalkNode
	{
		return new TalkNode
		(
			name,
			TalkNodeDefn.Instances().DoNothing.name,
			null, // content
			null, // next
			false // isDisabled
		);
	}

	static option(name: string, content: string, next: string): TalkNode
	{
		return new TalkNode
		(
			name,
			TalkNodeDefn.Instances().Option.name,
			content,
			next,
			false // isDisabled
		);
	}

	static goto(next: string): TalkNode
	{
		return new TalkNode
		(
			null, // name,
			TalkNodeDefn.Instances().Goto.name,
			null, // content
			next,
			false // isDisabled
		);
	}

	static pop(): TalkNode
	{
		return new TalkNode
		(
			null, // name,
			TalkNodeDefn.Instances().Pop.name,
			null, // content
			null, // next
			false // isDisabled
		);
	}

	static prompt(): TalkNode
	{
		return new TalkNode
		(
			null, // name,
			TalkNodeDefn.Instances().Prompt.name,
			null, // content
			null, // next
			false // isDisabled
		);
	}

	static push(next: string): TalkNode
	{
		return new TalkNode
		(
			null, // name,
			TalkNodeDefn.Instances().Push.name,
			null, // content
			next,
			false // isDisabled
		);
	}

	static quit(): TalkNode
	{
		return new TalkNode
		(
			null, // name,
			TalkNodeDefn.Instances().Quit.name,
			null, // content
			null, // next
			false // isDisabled
		);
	}

	static script(code: string): TalkNode
	{
		return new TalkNode
		(
			null, // name,
			TalkNodeDefn.Instances().Script.name,
			code,
			null, // next
			false // isDisabled
		);
	}

	static _switch // "switch" is a keyword.
	(
		variableName: string,
		variableValueNodeNextNamePairs: string[][]
	): TalkNode
	{
		var next = variableValueNodeNextNamePairs.map
		(
			pair => pair.join(":")
		).join(";");

		return new TalkNode
		(
			null, // name,
			TalkNodeDefn.Instances().Switch.name,
			variableName, // content
			next,
			false // isDisabled
		);
	}

	static variableLoad
	(
		name: string, variableName: string, variableExpression: string
	): TalkNode
	{
		return new TalkNode
		(
			name,
			TalkNodeDefn.Instances().VariableLoad.name,
			variableName, // content
			variableExpression, // next
			false // isDisabled
		);
	}

	static variableSet
	(
		variableName: string, variableValueToSet: string
	): TalkNode
	{
		return new TalkNode
		(
			null, // name,
			TalkNodeDefn.Instances().VariableSet.name,
			variableName, // content
			variableValueToSet, // next
			false // isDisabled
		);
	}

	static variableStore
	(
		name: string, variableName: string, variableExpression: string
	): TalkNode
	{
		return new TalkNode
		(
			name,
			TalkNodeDefn.Instances().VariableStore.name,
			variableName, // content
			variableExpression, // next
			false // isDisabled
		);
	}

	// instance methods

	activate(conversationRun: ConversationRun, scope: ConversationScope): void
	{
		var defn = this.defn(conversationRun.defn);
		if (defn.activate != null)
		{
			defn.activate(conversationRun, scope, this);
		}
	}

	defn(conversationDefn: ConversationDefn): TalkNodeDefn
	{
		return conversationDefn.talkNodeDefnsByName.get(this.defnName);
	}

	disable(): TalkNode
	{
		this.isDisabled = true;
		return this;
	}

	execute
	(
		universe: Universe,
		conversationRun: ConversationRun,
		scope: ConversationScope
	): void
	{
		var defn = this.defn(conversationRun.defn);
		defn.execute(universe, conversationRun, scope, this);
	}

	isEnabled(): boolean
	{
		return (this.isDisabled == false);
	}

	textForTranscript(conversationRun: ConversationRun): string
	{
		var speakerName =
		(
			this.defnName == "Option"
			? conversationRun.entityPlayer.name
			: conversationRun.entityTalker.name
		);
		var returnValue = speakerName + ": " + this.content;
		return returnValue;
	}

	// Clonable.

	clone(): TalkNode
	{
		return new TalkNode
		(
			this.name,
			this.defnName,
			this.content,
			this.next,
			this.isDisabled
		);
	}
}

}
