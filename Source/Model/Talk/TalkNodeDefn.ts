
namespace ThisCouldBeBetter.GameFramework
{

export class TalkNodeDefn
{
	name: string;
	execute: (u: Universe, r: ConversationRun) => void;

	constructor
	(
		name: string,
		execute: (u: Universe, r: ConversationRun) => void,
	)
	{
		this.name = name;
		this.execute = execute;
	}

	// instances

	static _instances: TalkNodeDefn_Instances;
	static Instances()
	{
		if (TalkNodeDefn._instances == null)
		{
			TalkNodeDefn._instances = new TalkNodeDefn_Instances();
		}
		return TalkNodeDefn._instances;
	}

	// Clonable.

	clone(): TalkNodeDefn
	{
		return new TalkNodeDefn
		(
			this.name,
			this.execute
		);
	}
}

class TalkNodeDefn_Instances
{
	Disable: TalkNodeDefn;
	Display: TalkNodeDefn;
	DoNothing: TalkNodeDefn;
	Enable: TalkNodeDefn;
	Goto: TalkNodeDefn;
	JumpIfFalse: TalkNodeDefn;
	JumpIfTrue: TalkNodeDefn;
	Option: TalkNodeDefn;
	OptionsClear: TalkNodeDefn;
	Pop: TalkNodeDefn;
	Prompt: TalkNodeDefn;
	Push: TalkNodeDefn;
	Quit: TalkNodeDefn;
	Script: TalkNodeDefn;
	Switch: TalkNodeDefn;
	VariableLoad: TalkNodeDefn;
	VariableSet: TalkNodeDefn;
	VariableStore: TalkNodeDefn;
	VariablesExport: TalkNodeDefn;
	VariablesImport: TalkNodeDefn;

	_All: TalkNodeDefn[];
	_AllByName: Map<string, TalkNodeDefn>;

	constructor()
	{
		var tnd = (n: string, e: (u: Universe, r: ConversationRun) => void) => new TalkNodeDefn(n, e);

		this.Disable 			= tnd("Disable", this.disable);
		this.Display 			= tnd("Display", this.display);
		this.DoNothing 			= tnd("DoNothing", this.doNothing);
		this.Enable 			= tnd("Enable", this.enable);
		this.Goto 				= tnd("Goto", this.goto);
		this.JumpIfFalse 		= tnd("JumpIfFalse", this.jumpIfFalse);
		this.JumpIfTrue 		= tnd("JumpIfTrue", this.jumpIfTrue);
		this.Option 			= tnd("Option", this.option);
		this.OptionsClear 		= tnd("OptionsClear", this.optionsClear);
		this.Pop 				= tnd("Pop", this.pop);
		this.Prompt 			= tnd("Prompt", this.prompt);
		this.Push 				= tnd("Push", this.push);
		this.Quit 				= tnd("Quit", this.quit);
		this.Script 			= tnd("Script", this.script);
		this.Switch 			= tnd("Switch", this._switch);
		this.VariableLoad 		= tnd("VariableLoad", this.variableLoad);
		this.VariableSet 		= tnd("VariableSet", this.variableSet);
		this.VariableStore 		= tnd("VariableStore", this.variableStore);
		this.VariablesExport 	= tnd("VariablesExport", this.variablesExport);
		this.VariablesImport 	= tnd("VariablesImport", this.variablesImport);

		this._All =
		[
			this.Disable,
			this.Display,
			this.DoNothing,
			this.Enable,
			this.Goto,
			this.JumpIfFalse,
			this.JumpIfTrue,
			this.Option,
			this.OptionsClear,
			this.Pop,
			this.Prompt,
			this.Push,
			this.Quit,
			this.Script,
			this.Switch,
			this.VariableLoad,
			this.VariableSet,
			this.VariableStore,
			this.VariablesExport,
			this.VariablesImport
		];

		this._AllByName = ArrayHelper.addLookupsByName(this._All);
	}

	disable(universe: Universe, conversationRun: ConversationRun): void
	{
		var talkNode = conversationRun.talkNodeCurrent();
		var talkNodesToDisablePrefixesJoined =
			talkNode.next;

		var talkNodesToDisablePrefixes =
			talkNodesToDisablePrefixesJoined.split(",");

		var talkNodesToDisableAsArrays = talkNodesToDisablePrefixes.map
		(
			prefix => conversationRun.nodesByPrefix(prefix)
		);

		var talkNodesToDisable =
			ArrayHelper.flattenArrayOfArrays(talkNodesToDisableAsArrays);

		talkNodesToDisable.forEach
		(
			talkNodeToDisable => 
				conversationRun.disable(talkNodeToDisable.name)
		);

		conversationRun.talkNodeAdvance(universe);
		conversationRun.talkNodeCurrentExecute(universe);
	}

	display(universe: Universe, conversationRun: ConversationRun): void
	{
		var scope = conversationRun.scopeCurrent;
		var talkNode = conversationRun.talkNodeCurrent();

		talkNode.contentVariablesSubstitute(conversationRun);

		if (scope.displayLinesCurrent == null)
		{
			scope.displayLinesCurrent = talkNode.content.split("\n");
		}

		scope.displayTextCurrentAdvance();

		var displayTextCurrent = scope.displayTextCurrent();
		if (displayTextCurrent == null)
		{
			scope.displayLinesCurrent = null;
			conversationRun.talkNodeGoToNext(universe);
			conversationRun.talkNodeCurrentExecute(universe);
		}
		else
		{
			var nodeForTranscript = TalkNode.display
			(
				null, displayTextCurrent
			)
			conversationRun.talkNodesForTranscript.push(nodeForTranscript);
		}
	}

	doNothing(universe: Universe, conversationRun: ConversationRun): void
	{
		conversationRun.talkNodeAdvance(universe);
		conversationRun.talkNodeCurrentExecute(universe);
	}

	enable(universe: Universe, conversationRun: ConversationRun): void
	{
		var talkNode = conversationRun.talkNodeCurrent();

		var talkNodesToEnablePrefixesJoined =
			talkNode.next;

		var talkNodesToEnablePrefixes =
			talkNodesToEnablePrefixesJoined.split(",");

		var talkNodesToEnableAsArrays = talkNodesToEnablePrefixes.map
		(
			prefix => conversationRun.nodesByPrefix(prefix)
		);

		var talkNodesToEnable =
			ArrayHelper.flattenArrayOfArrays(talkNodesToEnableAsArrays);

		talkNodesToEnable.forEach
		(
			talkNodeToEnable => 
				conversationRun.enable(talkNodeToEnable.name)
		);

		conversationRun.talkNodeAdvance(universe);
		conversationRun.talkNodeCurrentExecute(universe);
	}

	goto(universe: Universe, conversationRun: ConversationRun): void
	{
		var talkNode = conversationRun.talkNodeCurrent();
		var talkNodeNameNext = talkNode.next;
		conversationRun.goto(talkNodeNameNext, universe);
	}

	jumpIfFalse(universe: Universe, conversationRun: ConversationRun): void
	{
		var talkNode = conversationRun.talkNodeCurrent();
		var variableName = talkNode.content;
		var talkNodeNameToJumpTo = talkNode.next;
		var variableValue = conversationRun.variableByName(variableName);
		var variableValueAsString = variableValue == null ? null : variableValue.toString();
		if (variableValueAsString == "true")
		{
			conversationRun.talkNodeAdvance(universe);
		}
		else
		{
			var nodeNext = conversationRun.defn.talkNodeByName
			(
				talkNodeNameToJumpTo
			);
			conversationRun.talkNodeCurrentSet(nodeNext);
		}

		conversationRun.talkNodeCurrentExecute(universe);
	}

	jumpIfTrue(universe: Universe, conversationRun: ConversationRun): void
	{
		var talkNode = conversationRun.talkNodeCurrent();
		var variableName = talkNode.content;
		var talkNodeNameToJumpTo = talkNode.next;
		var variableValue = conversationRun.variableByName(variableName);
		var variableValueAsString = variableValue == null ? null : variableValue.toString();
		if (variableValueAsString == "true")
		{
			var nodeNext = conversationRun.defn.talkNodeByName
			(
				talkNodeNameToJumpTo
			);
			conversationRun.talkNodeCurrentSet(nodeNext);
		}
		else
		{
			conversationRun.talkNodeAdvance(universe);
		}

		conversationRun.talkNodeCurrentExecute(universe);
	}

	option(universe: Universe, conversationRun: ConversationRun): void
	{
		var scope = conversationRun.scopeCurrent;
		var talkNode = conversationRun.talkNodeCurrent();

		var talkNodesForOptions = scope.talkNodesForOptions;
		if (talkNodesForOptions.indexOf(talkNode) == -1)
		{
			talkNodesForOptions.push(talkNode);
			scope.talkNodesForOptionsByName.set(talkNode.name, talkNode);
		}
		conversationRun.talkNodeAdvance(universe);
		conversationRun.talkNodeCurrentExecute(universe);
	}

	optionsClear(universe: Universe, conversationRun: ConversationRun): void
	{
		var scope = conversationRun.scopeCurrent;

		var talkNodesForOptions = scope.talkNodesForOptions;
		talkNodesForOptions.length = 0;

		conversationRun.talkNodeAdvance(universe);
		conversationRun.talkNodeCurrentExecute(universe);
	}

	pop(universe: Universe, conversationRun: ConversationRun): void
	{
		var scope = conversationRun.scopeCurrent;
		var talkNode = conversationRun.talkNodeCurrent();

		scope = scope.parent;
		conversationRun.scopeCurrent = scope;
		if (talkNode.next != null)
		{
			var nodeNext = conversationRun.defn.talkNodeByName
			(
				talkNode.next
			);
			conversationRun.talkNodeCurrentSet(nodeNext);
		}
		conversationRun.talkNodeCurrentExecute(universe);
	}

	prompt(universe: Universe, conversationRun: ConversationRun): void
	{
		var scope = conversationRun.scopeCurrent;
		scope.isPromptingForResponse = true;
	}


	push(universe: Universe, conversationRun: ConversationRun): void
	{
		var talkNodeToPushTo = conversationRun.talkNodeNext();

		var talkNodeToReturnTo = conversationRun.talkNodePrev();
		conversationRun.talkNodeCurrentSet(talkNodeToReturnTo);

		conversationRun.scopeCurrent = new ConversationScope
		(
			conversationRun.scopeCurrent, // parent
			talkNodeToPushTo,
			[] // options
		);
		conversationRun.talkNodeCurrentExecute(universe);
	}

	quit(universe: Universe, conversationRun: ConversationRun): void
	{
		conversationRun.quit(universe);
	}

	script(universe: Universe, conversationRun: ConversationRun): void
	{
		var talkNode = conversationRun.talkNodeCurrent();
		var scriptToRunAsString = "( (u, cr) => " + talkNode.content + ")";
		var scriptToRun = eval(scriptToRunAsString);
		scriptToRun(universe, conversationRun);
		conversationRun.talkNodeGoToNext(universe);
		conversationRun.talkNodeCurrentExecute(universe); // hack
	}

	_switch(universe: Universe, conversationRun: ConversationRun): void
	{
		var talkNode = conversationRun.talkNodeCurrent();
		var variableName = talkNode.content;
		var variableValueActual =
			conversationRun.variableByName(variableName);
		var variableValueAndNodeNextNamePairs =
			talkNode.next.split(";").map(x => x.split(":"));

		var talkNodeNextName = variableValueAndNodeNextNamePairs.find
		(
			x => x[0] == variableValueActual
		)[1];

		conversationRun.goto(talkNodeNextName, universe);
	}

	variableLoad(universe: Universe, conversationRun: ConversationRun): void
	{
		var talkNode = conversationRun.talkNodeCurrent();
		var variableName = talkNode.content;
		var scriptExpression = talkNode.next;

		conversationRun.variableLoad(universe, variableName, scriptExpression);

		conversationRun.talkNodeAdvance(universe);
		conversationRun.talkNodeCurrentExecute(universe); // hack
	}

	variableSet(universe: Universe, conversationRun: ConversationRun): void
	{
		var talkNode = conversationRun.talkNodeCurrent();
		var variableName = talkNode.content;
		var variableValue = talkNode.next;

		conversationRun.variableSet(variableName, variableValue);

		conversationRun.talkNodeAdvance(universe);
		conversationRun.talkNodeCurrentExecute(universe); // hack
	}

	variableStore(universe: Universe, conversationRun: ConversationRun): void
	{
		var talkNode = conversationRun.talkNodeCurrent();
		var variableName = talkNode.content;
		var scriptExpression = talkNode.next;

		conversationRun.variableStore(universe, variableName, scriptExpression);

		conversationRun.talkNodeAdvance(universe);
		conversationRun.talkNodeCurrentExecute(universe); // hack
	}

	variablesExport(universe: Universe, conversationRun: ConversationRun): void
	{
		var talkNode = conversationRun.talkNodeCurrent();
		var variableLookupToExportToName = talkNode.content;

		conversationRun.variablesExport(universe, variableLookupToExportToName);

		conversationRun.talkNodeAdvance(universe);
		conversationRun.talkNodeCurrentExecute(universe); // hack
	}

	variablesImport(universe: Universe, conversationRun: ConversationRun): void
	{
		var talkNode = conversationRun.talkNodeCurrent();
		var variableLookupToImportFromExpression = talkNode.content;

		conversationRun.variablesImport
		(
			universe, variableLookupToImportFromExpression
		);

		conversationRun.talkNodeAdvance(universe);
		conversationRun.talkNodeCurrentExecute(universe); // hack
	}

}

}
