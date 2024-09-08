
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
		this.Disable = new TalkNodeDefn
		(
			"Disable",
			(
				universe: Universe,
				conversationRun: ConversationRun
			) => // execute
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
		);

		this.Display = new TalkNodeDefn
		(
			"Display",
			(
				universe: Universe,
				conversationRun: ConversationRun
			) => // execute
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
		);

		this.DoNothing = new TalkNodeDefn
		(
			"DoNothing",
			(
				universe: Universe,
				conversationRun: ConversationRun
			) => // execute
			{
				conversationRun.talkNodeAdvance(universe);
				conversationRun.talkNodeCurrentExecute(universe);
			}
		);

		this.Enable = new TalkNodeDefn
		(
			"Enable",
			(
				universe: Universe,
				conversationRun: ConversationRun
			) => // execute
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
		);

		this.Goto = new TalkNodeDefn
		(
			"Goto",
			(
				universe: Universe,
				conversationRun: ConversationRun
			) => // execute
			{
				var talkNode = conversationRun.talkNodeCurrent();
				var talkNodeNameNext = talkNode.next;
				conversationRun.goto(talkNodeNameNext, universe);
			}
		);

		this.JumpIfFalse = new TalkNodeDefn
		(
			"JumpIfFalse",
			(
				universe: Universe,
				conversationRun: ConversationRun
			) => // execute
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
		);

		this.JumpIfTrue = new TalkNodeDefn
		(
			"JumpIfTrue",
			(
				universe: Universe,
				conversationRun: ConversationRun
			) => // execute
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
		);

		this.Option = new TalkNodeDefn
		(
			"Option",
			(
				universe: Universe,
				conversationRun: ConversationRun
			) => // execute
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
		);

		this.OptionsClear = new TalkNodeDefn
		(
			"OptionsClear",
			(
				universe: Universe,
				conversationRun: ConversationRun
			) => // execute
			{
				var scope = conversationRun.scopeCurrent;

				var talkNodesForOptions = scope.talkNodesForOptions;
				talkNodesForOptions.length = 0;

				conversationRun.talkNodeAdvance(universe);
				conversationRun.talkNodeCurrentExecute(universe);
			}
		);

		this.Pop = new TalkNodeDefn
		(
			"Pop",
			(
				universe: Universe,
				conversationRun: ConversationRun
			) => // execute
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
		);

		this.Prompt = new TalkNodeDefn
		(
			"Prompt",
			(
				universe: Universe,
				conversationRun: ConversationRun
			) => // execute
			{
				var scope = conversationRun.scopeCurrent;
				scope.isPromptingForResponse = true;
			}
		);

		this.Push = new TalkNodeDefn
		(
			"Push",
			(
				universe: Universe,
				conversationRun: ConversationRun
			) => // execute
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
		);

		this.Quit = new TalkNodeDefn
		(
			"Quit",
			(
				universe: Universe,
				conversationRun: ConversationRun
			) => // execute
			{
				conversationRun.quit(universe);
			}
		);

		this.Script = new TalkNodeDefn
		(
			"Script",
			(
				universe: Universe,
				conversationRun: ConversationRun
			) => // execute
			{
				var talkNode = conversationRun.talkNodeCurrent();
				var scriptToRunAsString = "( (u, cr) => " + talkNode.content + ")";
				var scriptToRun = eval(scriptToRunAsString);
				scriptToRun(universe, conversationRun);
				conversationRun.talkNodeGoToNext(universe);
				conversationRun.talkNodeCurrentExecute(universe); // hack
			}
		);

		this.Switch = new TalkNodeDefn
		(
			"Switch",
			(
				universe: Universe,
				conversationRun: ConversationRun
			) => // execute
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
		);

		this.VariableLoad = new TalkNodeDefn
		(
			"VariableLoad",
			(
				universe: Universe,
				conversationRun: ConversationRun
			) => // execute
			{
				var talkNode = conversationRun.talkNodeCurrent();
				var variableName = talkNode.content;
				var scriptExpression = talkNode.next;

				conversationRun.variableLoad(universe, variableName, scriptExpression);

				conversationRun.talkNodeAdvance(universe);
				conversationRun.talkNodeCurrentExecute(universe); // hack
			}
		);

		this.VariableSet = new TalkNodeDefn
		(
			"VariableSet",
			(
				universe: Universe,
				conversationRun: ConversationRun
			) => // execute
			{
				var talkNode = conversationRun.talkNodeCurrent();
				var variableName = talkNode.content;
				var variableValue = talkNode.next;

				conversationRun.variableSet(variableName, variableValue);

				conversationRun.talkNodeAdvance(universe);
				conversationRun.talkNodeCurrentExecute(universe); // hack
			}
		);

		this.VariableStore = new TalkNodeDefn
		(
			"VariableStore",
			(
				universe: Universe,
				conversationRun: ConversationRun
			) => // execute
			{
				var talkNode = conversationRun.talkNodeCurrent();
				var variableName = talkNode.content;
				var scriptExpression = talkNode.next;

				conversationRun.variableStore(universe, variableName, scriptExpression);

				conversationRun.talkNodeAdvance(universe);
				conversationRun.talkNodeCurrentExecute(universe); // hack
			}
		);

		this.VariablesExport = new TalkNodeDefn
		(
			"VariablesExport",
			(
				universe: Universe,
				conversationRun: ConversationRun
			) => // execute
			{
				var talkNode = conversationRun.talkNodeCurrent();
				var variableLookupToExportToName = talkNode.content;

				conversationRun.variablesExport(universe, variableLookupToExportToName);

				conversationRun.talkNodeAdvance(universe);
				conversationRun.talkNodeCurrentExecute(universe); // hack
			}
		);

		this.VariablesImport = new TalkNodeDefn
		(
			"VariablesImport",
			(
				universe: Universe,
				conversationRun: ConversationRun
			) => // execute
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
		);

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
}

}
