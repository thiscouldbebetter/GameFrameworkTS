
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

	static scriptParse(scriptAsString: string): Script
	{
		scriptAsString =
			//"( (u, cr) => " + scriptAsString + ")";
			"return " + scriptAsString;

		// return ScriptUsingEval.fromCodeAsString(scriptAsString); // Not possible to catch eval() errors here!

		var returnValue =
			ScriptUsingFunctionConstructor.fromParameterNamesAndCodeAsString
			(
				[ "u", "cr" ],
				scriptAsString
			);
		return returnValue;
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
	DoNextInCycle: TalkNodeDefn;
	DoNextInSequence: TalkNodeDefn;
	DoNothing: TalkNodeDefn;
	DoRandomSelection: TalkNodeDefn;
	Enable: TalkNodeDefn;
	Goto: TalkNodeDefn;
	JumpIfFalse: TalkNodeDefn;
	JumpIfTrue: TalkNodeDefn;
	Option: TalkNodeDefn;
	OptionRemove: TalkNodeDefn;
	OptionsClear: TalkNodeDefn;
	Pop: TalkNodeDefn;
	Prompt: TalkNodeDefn;
	Push: TalkNodeDefn;
	Quit: TalkNodeDefn;
	ScriptFromName: TalkNodeDefn;
	ScriptUsingEval: TalkNodeDefn;
	ScriptUsingFunctionConstructor: TalkNodeDefn;
	SpeakerSet: TalkNodeDefn;
	Switch: TalkNodeDefn;
	VariableAdd: TalkNodeDefn;
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
		this.DoNextInCycle 		= tnd("DoNextInCycle", this.doNextInCycle);
		this.DoNextInSequence 	= tnd("DoNextInSequence", this.doNextInSequence);
		this.DoNothing 			= tnd("DoNothing", this.doNothing);
		this.DoRandomSelection 	= tnd("DoRandomSelection", this.doRandomSelection);
		this.Enable 			= tnd("Enable", this.enable);
		this.Goto 				= tnd("Goto", this.goto);
		this.JumpIfFalse 		= tnd("JumpIfFalse", this.jumpIfFalse);
		this.JumpIfTrue 		= tnd("JumpIfTrue", this.jumpIfTrue);
		this.Option 			= tnd("Option", this.option);
		this.OptionRemove 		= tnd("OptionRemove", this.optionRemove);
		this.OptionsClear 		= tnd("OptionsClear", this.optionsClear);
		this.Pop 				= tnd("Pop", this.pop);
		this.Prompt 			= tnd("Prompt", this.prompt);
		this.Push 				= tnd("Push", this.push);
		this.Quit 				= tnd("Quit", this.quit);
		this.ScriptFromName 	= tnd("ScriptFromName", this.scriptFromName);
		this.ScriptUsingEval 	= tnd("ScriptUsingEval", this.scriptUsingEval);
		this.ScriptUsingFunctionConstructor
			= tnd("Script", this.scriptUsingFunctionConstructor);
		this.SpeakerSet 		= tnd("SpeakerSet", this.speakerSet);
		this.Switch 			= tnd("Switch", this._switch);
		this.VariableAdd 		= tnd("VariableAdd", this.variableAdd);
		this.VariableLoad 		= tnd("VariableLoad", this.variableLoad);
		this.VariableSet 		= tnd("VariableSet", this.variableSet);
		this.VariableStore 		= tnd("VariableStore", this.variableStore);
		this.VariablesExport 	= tnd("VariablesExport", this.variablesExport);
		this.VariablesImport 	= tnd("VariablesImport", this.variablesImport);

		this._All =
		[
			this.Disable,
			this.Display,
			this.DoNextInCycle,
			this.DoNextInSequence,
			this.DoNothing,
			this.DoRandomSelection,
			this.Enable,
			this.Goto,
			this.JumpIfFalse,
			this.JumpIfTrue,
			this.Option,
			this.OptionRemove,
			this.OptionsClear,
			this.Pop,
			this.Prompt,
			this.Push,
			this.Quit,
			this.ScriptFromName,
			this.ScriptUsingEval,
			this.ScriptUsingFunctionConstructor,
			this.SpeakerSet,
			this.Switch,
			this.VariableAdd,
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

	doNextInCycle(universe: Universe, conversationRun: ConversationRun): void
	{
		var talkNode = conversationRun.talkNodeCurrent();
		var talkNodeNextNamesJoined = talkNode.next;
		const delimiter = ";"
		var talkNodeNextNames = talkNodeNextNamesJoined.split(delimiter);
		var talkNodeCount = talkNodeNextNames.length;

		for (var i = 0; i < talkNodeCount; i++)
		{
			var talkNodeToDisableName = talkNodeNextNames[i];
			conversationRun.disableTalkNodeWithName(talkNodeToDisableName);
		}

		var variableName = talkNode.content ?? talkNodeNextNamesJoined;
		var indexOfCurrentNodeOfCycle =
			conversationRun.variableGetWithDefault(variableName, 0) as number;

		var talkNodeNextName = talkNodeNextNames[indexOfCurrentNodeOfCycle];
		conversationRun.enableTalkNodeWithName(talkNodeNextName);

		indexOfCurrentNodeOfCycle++;
		if (indexOfCurrentNodeOfCycle >= talkNodeCount)
		{
			indexOfCurrentNodeOfCycle = 0;
		}
		conversationRun.variableSet(variableName, indexOfCurrentNodeOfCycle);

		conversationRun.talkNodeAdvance(universe);
		conversationRun.talkNodeCurrentExecute(universe);
	}

	doNextInSequence(universe: Universe, conversationRun: ConversationRun): void
	{
		// Like .doNextInCycle(), but stays on last node forever after.

		var talkNode = conversationRun.talkNodeCurrent();
		var talkNodeNextNamesJoined = talkNode.next;
		const delimiter = ";"
		var talkNodeNextNames = talkNodeNextNamesJoined.split(delimiter);
		var talkNodeCount = talkNodeNextNames.length;

		for (var i = 0; i < talkNodeCount; i++)
		{
			var talkNodeToDisableName = talkNodeNextNames[i];
			conversationRun.disableTalkNodeWithName(talkNodeToDisableName);
		}

		var variableName = talkNode.content ?? talkNodeNextNamesJoined;
		var indexOfCurrentNodeOfCycle =
			conversationRun.variableGetWithDefault(variableName, 0) as number;

		var talkNodeNextName = talkNodeNextNames[indexOfCurrentNodeOfCycle];
		conversationRun.enableTalkNodeWithName(talkNodeNextName);

		indexOfCurrentNodeOfCycle++;
		if (indexOfCurrentNodeOfCycle >= talkNodeCount)
		{
			indexOfCurrentNodeOfCycle = talkNodeCount - 1;
		}
		conversationRun.variableSet(variableName, indexOfCurrentNodeOfCycle);

		conversationRun.talkNodeAdvance(universe);
		conversationRun.talkNodeCurrentExecute(universe);
	}

	doNothing(universe: Universe, conversationRun: ConversationRun): void
	{
		conversationRun.talkNodeAdvance(universe);
		conversationRun.talkNodeCurrentExecute(universe);
	}

	doRandomSelection(universe: Universe, conversationRun: ConversationRun): void
	{
		// Like .doNextInCycle() and .doNextInSequence(), but random.

		var talkNode = conversationRun.talkNodeCurrent();
		var talkNodeNextNamesJoined = talkNode.next;
		const delimiter = ";"
		var talkNodeNextNames = talkNodeNextNamesJoined.split(delimiter);
		var talkNodeCount = talkNodeNextNames.length;

		for (var i = 0; i < talkNodeCount; i++)
		{
			var talkNodeToDisableName = talkNodeNextNames[i];
			conversationRun.disableTalkNodeWithName(talkNodeToDisableName);
		}

		var randomizer = universe.randomizer;
		var indexRandom = randomizer.integerLessThan(talkNodeCount);

		var talkNodeNextName = talkNodeNextNames[indexRandom];
		conversationRun.enableTalkNodeWithName(talkNodeNextName);

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
		var talkNodeNextName = talkNode.next;
		conversationRun.goto(talkNodeNextName, universe);
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
		var variableValueAsString =
			variableValue == null ? null : variableValue.toString();
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

	optionRemove(universe: Universe, conversationRun: ConversationRun): void
	{
		var scope = conversationRun.scopeCurrent;
		var talkNode = conversationRun.talkNodeCurrent();

		var talkNodesForOptions = scope.talkNodesForOptions;
		var optionToRemoveName = talkNode.next;
		var optionToRemove = talkNodesForOptions.find(x => x.name == optionToRemoveName);
		if (optionToRemove != null)
		{
			var indexToRemoveAt = talkNodesForOptions.indexOf(optionToRemove);
			if (indexToRemoveAt >= 0)
			{
				talkNodesForOptions.splice(indexToRemoveAt, 1);
				scope.talkNodesForOptionsByName.delete(optionToRemove.name);
			}
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

	scriptFromName(universe: Universe, conversationRun: ConversationRun): void
	{
		var world = universe.world;
		var worldDefn = world.defn;
		var talkNode = conversationRun.talkNodeCurrent();
		var scriptName = talkNode.content;
		var scriptToRun = worldDefn.scriptByName(scriptName);
		scriptToRun.runWithParams2(universe, conversationRun);
		conversationRun.talkNodeGoToNext(universe);
		conversationRun.talkNodeCurrentExecute(universe); // hack
	}

	scriptUsingEval(universe: Universe, conversationRun: ConversationRun): void
	{
		var talkNode = conversationRun.talkNodeCurrent();
		var scriptToRunAsString = "( (u, cr) => " + talkNode.content + ")";
		var scriptToRun = ScriptUsingEval.fromCodeAsString(scriptToRunAsString);
		scriptToRun.runWithParams2(universe, conversationRun);
		conversationRun.talkNodeGoToNext(universe);
		conversationRun.talkNodeCurrentExecute(universe); // hack
	}

	scriptUsingFunctionConstructor
	(
		universe: Universe, conversationRun: ConversationRun
	): void
	{
		var talkNode = conversationRun.talkNodeCurrent();
		var scriptBodyToRunAsString = talkNode.content;
		var scriptToRun = TalkNodeDefn.scriptParse(scriptBodyToRunAsString);
		scriptToRun.runWithParams2(universe, conversationRun);
		conversationRun.talkNodeGoToNext(universe);
		conversationRun.talkNodeCurrentExecute(universe); // hack
	}

	speakerSet(universe: Universe, conversationRun: ConversationRun): void
	{
		// todo - Set the character portrait and possibly the font.
		var talkNode = conversationRun.talkNodeCurrent();
		var speakerName = talkNode.content;
		speakerName =
			speakerName == ""
			? null
			: speakerName;
		conversationRun.speakerNameSet(speakerName);
		conversationRun.talkNodeAdvance(universe);
		conversationRun.talkNodeCurrentExecute(universe);
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

	variableAdd(universe: Universe, conversationRun: ConversationRun): void
	{
		var talkNode = conversationRun.talkNodeCurrent();
		var variableName = talkNode.content;
		var variableIncrementAsString = talkNode.next;
		var variableIncrement = parseFloat(variableIncrementAsString);
		if (isNaN(variableIncrement) )
		{
			variableIncrement = 1;
		}

		var variableValueBeforeIncrementAsUnknown =
			conversationRun.variableGetWithDefault(variableName, 0);
		var variableValueBeforeIncrement = variableValueBeforeIncrementAsUnknown as number;
		var variableValueAfterIncrement =
			variableValueBeforeIncrement + variableIncrement;

		conversationRun.variableSet(variableName, variableValueAfterIncrement);

		conversationRun.talkNodeAdvance(universe);
		conversationRun.talkNodeCurrentExecute(universe); // hack
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
		var variableExpression = talkNode.next;
		var variableAsCode =
			// "(u, cr) => " + variableExpression;
			variableExpression;
		var variableScript =
			// ScriptUsingEval.fromCodeAsString(variableAsCode);
			TalkNodeDefn.scriptParse(variableAsCode);
		var variableValue = variableScript.runWithParams2(universe, conversationRun);

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
