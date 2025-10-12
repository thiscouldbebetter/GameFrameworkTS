
namespace ThisCouldBeBetter.GameFramework
{

export class TalkNode //
{
	name: string;
	defnName: string;
	content: string;
	next: string;
	_isEnabled: Script;

	constructor
	(
		name: string,
		defnName: string,
		content: string,
		next: string,
		isEnabled: Script
	)
	{
		this.name = name;

		if (defnName == TalkNodeDefn.Instances().Option.name)
		{
			// todo
			// Doing this for nodes with types other than "Option"
			// causes mysterious errors.
			if (this.name == null || this.name == "")
			{
				this.name = content;
			}
		}

		if (this.name == null || this.name == "")
		{
			this.name = TalkNode.idNext();
		}

		this.defnName = defnName;
		this.content = content == "" ? null : content;
		this.next = next == "" ? null : next;
		this._isEnabled = isEnabled;
	}

	static fromDefnName(defnName: string): TalkNode
	{
		return new TalkNode(null, defnName, null, null, null);
	}

	static fromNameDefnNameContentNextAndEnabled
	(
		name: string,
		defnName: string,
		content: string,
		next: string,
		isEnabled: Script
	)
	{
		return new TalkNode
		(
			name, defnName, content, next, isEnabled
		);
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
			null // isEnabled
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
			null // isEnabled
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
			null // isEnabled
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
			null // isEnabled
		);
	}

	static pop(): TalkNode
	{
		return TalkNode.fromDefnName
		(
			TalkNodeDefn.Instances().Pop.name,
		);
	}

	static prompt(): TalkNode
	{
		return TalkNode.fromDefnName
		(
			TalkNodeDefn.Instances().Prompt.name,
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
			null // isEnabled
		);
	}

	static quit(): TalkNode
	{
		return TalkNode.fromDefnName
		(
			TalkNodeDefn.Instances().Quit.name,
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
			null // isEnabled
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
			null // isEnabled
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
			null // isEnabled
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
			null // isEnabled
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
			null // isEnabled
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
		this._isEnabled = Script.fromCodeAsString( "() => false" );
		return this;
	}

	enable(): TalkNode
	{
		this._isEnabled = Script.fromCodeAsString( "() => true" );
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

	isDisabled(u: Universe, cr: ConversationRun): boolean
	{
		return (this.isEnabled(u, cr) == false);
	}

	isEnabled(u: Universe, cr: ConversationRun): boolean
	{
		return this.isEnabledForUniverseAndConversationRun(u, cr);
	}

	isEnabledForUniverseAndConversationRun(u: Universe, cr: ConversationRun): boolean
	{
		var returnValue =
		(
			this._isEnabled == null
			? true
			: this._isEnabled.runWithParams2(u, cr)
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
			this._isEnabled
		);
	}

	overwriteWith(other: TalkNode): TalkNode
	{
		this.name = other.name;
		this.defnName = other.defnName;
		this.content = other.content;
		this.next = other.next;
		this._isEnabled = other._isEnabled;
		return this;
	}

	// Serialization.

	static fromLinePipeSeparatedValues(talkNodeAsLinePsv: string): TalkNode
	{
		var fields = talkNodeAsLinePsv.split("|");

		var isEnabledAsText = fields[4];

		var isEnabled: any;
		if (isEnabledAsText == null)
		{
			isEnabled = null;
		}
		else
		{
			var scriptToRunAsString =
				"( (u, cr) => " + isEnabledAsText + " )";
			try
			{
				isEnabled = Script.fromCodeAsString(scriptToRunAsString);
			}
			catch (err)
			{
				throw err;
			}
		}

		var returnValue = TalkNode.fromNameDefnNameContentNextAndEnabled
		(
			fields[0],
			fields[1],
			fields[2],
			fields[3],
			isEnabled
		);
		return returnValue;
	}

	toPipeSeparatedValues(): string
	{
		var returnValue =
		[
			this.name,
			this.defnName,
			this.content,
			this.next,
			this._isEnabled == null ? null : this._isEnabled.toString()
		].join("|");


		while (returnValue.endsWith("|") )
		{
			returnValue = returnValue.substr(0, returnValue.length - 1);
		}

		return returnValue;

	}

	// String.

	toString(): string
	{
		return this.content;
	}
}

}
