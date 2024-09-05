
namespace ThisCouldBeBetter.GameFramework
{

export class TalkNode //
{
	name: string;
	defnName: string;
	content: string;
	next: string;
	_isDisabled: (u: Universe, cr: ConversationRun) => boolean;

	constructor
	(
		name: string,
		defnName: string,
		content: string,
		next: string,
		isDisabled: (u: Universe, cr: ConversationRun) => boolean
	)
	{
		this.name = ( (name == null || name == "") ? TalkNode.idNext() : name);
		this.defnName = defnName;
		this.content = content == "" ? null : content;
		this.next = next == "" ? null : next;
		this._isDisabled = isDisabled;
	}

	static fromLinePipeSeparatedValues(talkNodeAsLinePsv: string): TalkNode
	{
		var fields = talkNodeAsLinePsv.split("|");

		var isDisabledAsText = fields[4];

		var isDisabled: any;
		if (isDisabledAsText == null)
		{
			isDisabled = null;
		}
		else
		{
			var scriptToRunAsString = "( (u, cr) => " + isDisabledAsText + " )";
			isDisabled = eval(scriptToRunAsString);
		}

		var returnValue = new TalkNode
		(
			fields[0], // name
			fields[1], // defnName
			fields[2], // content
			fields[3], // next
			isDisabled
		);
		return returnValue;
	}

	// static methods

	static _idNext = 0;
	static idNext()
	{
		var returnValue = "_" + TalkNode._idNext;
		TalkNode._idNext++;
		return returnValue;
	}

	// Types.

	static display(name: string, content: string): TalkNode
	{
		return new TalkNode
		(
			name,
			TalkNodeDefn.Instances().Display.name,
			content,
			null, // next
			null // isDisabled
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
			null // isDisabled
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
			null // isDisabled
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
			null // isDisabled
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
			null // isDisabled
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
			null // isDisabled
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
			null // isDisabled
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
			null // isDisabled
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
			null // isDisabled
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
			null // isDisabled
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
			null // isDisabled
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
			null // isDisabled
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
			null // isDisabled
		);
	}

	// instance methods

	contentVariablesSubstitute(conversationRun: ConversationRun): void
	{
		var content = this.content;
		if (content.indexOf("^") > 0)
		{
			var contentParts = content.split("^");

			for (var i = 1; i < contentParts.length; i += 2)
			{
				var variableName = contentParts[i];
				var variableValue = conversationRun.variableByName(variableName);
				contentParts[i] = variableValue.toString();
			}

			this.content = contentParts.join("");
		}
	}

	defn(conversationDefn: ConversationDefn): TalkNodeDefn
	{
		return conversationDefn.talkNodeDefnsByName.get(this.defnName);
	}

	disable(): TalkNode
	{
		this._isDisabled = () => true;
		return this;
	}

	enable(): TalkNode
	{
		this._isDisabled = () => false;
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
		defn.execute(universe, conversationRun);
	}

	isEnabled(u: Universe, cr: ConversationRun): boolean
	{
		return this.isEnabledForUniverseAndConversationRun(u, cr);
	}

	isEnabledForUniverseAndConversationRun(u: Universe, cr: ConversationRun): boolean
	{
		var returnValue =
		(
			this._isDisabled == null
			? true
			: this._isDisabled(u, cr) == false
		);

		return returnValue;
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
			this._isDisabled
		);
	}

	overwriteWith(other: TalkNode): TalkNode
	{
		this.name = other.name;
		this.defnName = other.defnName;
		this.content = other.content;
		this.next = other.next;
		this._isDisabled = other._isDisabled;
		return this;
	}

	// String.

	toString(): string
	{
		return this.content;
	}
}

}
