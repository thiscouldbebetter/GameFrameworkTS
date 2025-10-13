
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

	static fromDefn(defn: TalkNodeDefn): TalkNode
	{
		return new TalkNode(null, defn.name, null, null, null);
	}

	static fromDefnAndContent
	(
		defn: TalkNodeDefn,
		content: string
	): TalkNode
	{
		return new TalkNode
		(
			null, defn.name, content, null, null
		);
	}

	static fromDefnContentAndNext
	(
		defn: TalkNodeDefn,
		content: string,
		next: string
	): TalkNode
	{
		return new TalkNode
		(
			null, defn.name, content, next, null
		);
	}

	static fromNameAndDefn
	(
		name: string,
		defn: TalkNodeDefn,
	): TalkNode
	{
		return new TalkNode
		(
			name, defn.name, null, null, null
		);
	}

	static fromNameDefnAndContent
	(
		name: string,
		defn: TalkNodeDefn,
		content: string
	): TalkNode
	{
		return new TalkNode
		(
			name, defn.name, content, null, null
		);
	}

	static fromNameDefnContentAndNext
	(
		name: string,
		defn: TalkNodeDefn,
		content: string,
		next: string
	): TalkNode
	{
		return new TalkNode
		(
			name, defn.name, content, next, null
		);
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
		return TalkNode.fromNameDefnAndContent
		(
			name,
			TalkNodeDefn.Instances().Display,
			content
		);
	}

	static doNothing(name: string): TalkNode
	{
		return TalkNode.fromNameAndDefn
		(
			name,
			TalkNodeDefn.Instances().DoNothing
		);
	}

	static option(name: string, content: string, next: string): TalkNode
	{
		return TalkNode.fromNameDefnContentAndNext
		(
			name,
			TalkNodeDefn.Instances().Option,
			content,
			next
		);
	}

	static goto(next: string): TalkNode
	{
		return TalkNode.fromDefnContentAndNext
		(
			TalkNodeDefn.Instances().Goto,
			null, // content
			next
		);
	}

	static pop(): TalkNode
	{
		return TalkNode.fromDefn
		(
			TalkNodeDefn.Instances().Pop,
		);
	}

	static prompt(): TalkNode
	{
		return TalkNode.fromDefn
		(
			TalkNodeDefn.Instances().Prompt,
		);
	}

	static push(next: string): TalkNode
	{
		return TalkNode.fromDefnContentAndNext
		(
			TalkNodeDefn.Instances().Push,
			null, // content
			next
		);
	}

	static quit(): TalkNode
	{
		return TalkNode.fromDefn
		(
			TalkNodeDefn.Instances().Quit,
		);
	}

	static scriptFromName(name: string): TalkNode
	{
		return TalkNode.fromDefnAndContent
		(
			TalkNodeDefn.Instances().ScriptFromName,
			name
		);
	}

	static scriptUsingEval(code: string): TalkNode
	{
		return TalkNode.fromDefnAndContent
		(
			TalkNodeDefn.Instances().ScriptUsingEval,
			code
		);
	}

	static scriptUsingFunctionConstructor(code: string): TalkNode
	{
		return TalkNode.fromDefnAndContent
		(
			TalkNodeDefn.Instances().ScriptUsingFunctionConstructor,
			code
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

		return TalkNode.fromDefnContentAndNext
		(
			TalkNodeDefn.Instances().Switch,
			variableName, // content
			next
		);
	}

	static variableLoad
	(
		name: string, variableName: string, variableExpression: string
	): TalkNode
	{
		return TalkNode.fromNameDefnContentAndNext
		(
			name,
			TalkNodeDefn.Instances().VariableLoad,
			variableName, // content
			variableExpression
		);
	}

	static variableSet
	(
		variableName: string, variableValueToSet: string
	): TalkNode
	{
		return TalkNode.fromDefnContentAndNext
		(
			TalkNodeDefn.Instances().VariableSet,
			variableName,
			variableValueToSet
		);
	}

	static variableStore
	(
		name: string, variableName: string, variableExpression: string
	): TalkNode
	{
		return TalkNode.fromNameDefnContentAndNext
		(
			name,
			TalkNodeDefn.Instances().VariableStore,
			variableName,
			variableExpression
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
		this._isEnabled = Script.Instances().ReturnFalse;
		return this;
	}

	enable(): TalkNode
	{
		this._isEnabled = Script.Instances().ReturnTrue;
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
				isEnabled = ScriptUsingEval.fromCodeAsString(scriptToRunAsString);
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
