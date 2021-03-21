
namespace ThisCouldBeBetter.GameFramework
{

export class TalkNodeDefn
{
	name: string;
	execute: (u: Universe, r: ConversationRun, s: ConversationScope, n: TalkNode) => void;
	activate: (r: ConversationRun, s: ConversationScope, n: TalkNode) => void;

	constructor
	(
		name: string,
		execute: (u: Universe, r: ConversationRun, s: ConversationScope, n: TalkNode) => void,
		activate: (r: ConversationRun, s: ConversationScope, n: TalkNode) => void
	)
	{
		this.name = name;
		this.execute = execute;
		this.activate = activate;
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
	};
}

class TalkNodeDefn_Instances
{
	Activate: TalkNodeDefn;
	Display: TalkNodeDefn;
	Goto: TalkNodeDefn;
	JumpIfFalse: TalkNodeDefn;
	JumpIfTrue: TalkNodeDefn;
	Option: TalkNodeDefn;
	Pop: TalkNodeDefn;
	Prompt: TalkNodeDefn;
	Push: TalkNodeDefn;
	Quit: TalkNodeDefn;
	Script: TalkNodeDefn;
	VariableLoad: TalkNodeDefn;
	VariableSet: TalkNodeDefn;
	VariableStore: TalkNodeDefn;

	_All: TalkNodeDefn[];
	_AllByName: Map<string, TalkNodeDefn>;

	constructor()
	{
		this.Activate = new TalkNodeDefn
		(
			"Activate",
			(universe: Universe, conversationRun: ConversationRun, scope: ConversationScope, talkNode: TalkNode) => // execute
			{
				var talkNodeToActivateName = talkNode.next;
				var isActiveValueToSet = (talkNode.text == "true");

				var conversationDefn = conversationRun.defn;
				var talkNodeToActivate
					= conversationDefn.talkNodesByName.get(talkNodeToActivateName);
				talkNodeToActivate.isActive = isActiveValueToSet;
				scope.talkNodeAdvance(conversationRun);
				conversationRun.update(universe);
			},
			null // activate
		);

		this.Display = new TalkNodeDefn
		(
			"Display",
			(universe: Universe, conversationRun: ConversationRun, scope: ConversationScope, talkNode: TalkNode) => // execute
			{
				scope.displayTextCurrent = talkNode.text;
				scope.talkNodeAdvance(conversationRun);

				conversationRun.talkNodesForTranscript.push(talkNode);
			},
			null // activate
		);

		this.Goto = new TalkNodeDefn
		(
			"Goto",
			(universe: Universe, conversationRun: ConversationRun, scope: ConversationScope, talkNode: TalkNode) => // execute
			{
				var talkNodeNameNext = talkNode.next;
				scope.talkNodeCurrent = conversationRun.defn.talkNodeByName
				(
					talkNodeNameNext
				);
				conversationRun.update(universe);
			},
			null // activate
		);

		this.JumpIfFalse = new TalkNodeDefn
		(
			"JumpIfFalse",
			(universe: Universe, conversationRun: ConversationRun, scope: ConversationScope, talkNode: TalkNode) => // execute
			{
				var variableName = talkNode.text;
				var talkNodeNameToJumpTo = talkNode.next;
				var variableValue = conversationRun.variableByName(variableName);
				if (variableValue == true)
				{
					scope.talkNodeAdvance(conversationRun);
				}
				else
				{
					scope.talkNodeCurrent = conversationRun.defn.talkNodeByName
					(
						talkNodeNameToJumpTo
					);
				}

				conversationRun.update(universe);
			},
			null // activate
		);

		this.JumpIfTrue = new TalkNodeDefn
		(
			"JumpIfTrue",
			(universe: Universe, conversationRun: ConversationRun, scope: ConversationScope, talkNode: TalkNode) => // execute
			{
				var variableName = talkNode.text;
				var talkNodeNameToJumpTo = talkNode.next;
				var variableValue = conversationRun.variableByName(variableName);
				if (variableValue == true)
				{
					scope.talkNodeCurrent = conversationRun.defn.talkNodeByName
					(
						talkNodeNameToJumpTo
					);
				}
				else
				{
					scope.talkNodeAdvance(conversationRun);
				}

				conversationRun.update(universe);
			},
			null // activate
		);

		this.Option = new TalkNodeDefn
		(
			"Option",
			(universe: Universe, conversationRun: ConversationRun, scope: ConversationScope, talkNode: TalkNode) => // execute
			{
				var talkNodesForOptions = scope.talkNodesForOptions;
				if (talkNodesForOptions.indexOf(talkNode) == -1)
				{
					talkNodesForOptions.push(talkNode);
					scope.talkNodesForOptionsByName.set(talkNode.name, talkNode);
				}
				scope.talkNodeAdvance(conversationRun);
				conversationRun.update(universe);
			},
			(conversationRun: ConversationRun, scope: ConversationScope, talkNode: TalkNode) => // activate
			{
				scope.isPromptingForResponse = false;
				//scope.talkNodesForOptions.length = 0;

				var nameOfTalkNodeNext = talkNode.next;
				var talkNodeNext = conversationRun.defn.talkNodeByName(nameOfTalkNodeNext);
				scope.talkNodeCurrent = talkNodeNext;

				conversationRun.talkNodesForTranscript.push(talkNode);
			}
		);

		this.Pop = new TalkNodeDefn
		(
			"Pop",
			(universe: Universe, conversationRun: ConversationRun, scope: ConversationScope, talkNode: TalkNode) => // execute
			{
				var scope = scope.parent;
				conversationRun.scopeCurrent = scope;
				scope.talkNodeCurrent = conversationRun.defn.talkNodeByName
				(
					talkNode.next
				);
				conversationRun.update(universe);
			},
			null // activate
		);

		this.Prompt = new TalkNodeDefn
		(
			"Prompt",
			(universe: Universe, conversationRun: ConversationRun, scope: ConversationScope, talkNode: TalkNode) => // execute
			{
				scope.isPromptingForResponse = true;
			},
			(conversationRun: ConversationRun, scope: ConversationScope, talkNode: TalkNode) => // activate
			{
				var shouldClearOptions = talkNode.text;
				if (shouldClearOptions == "true")
				{
					scope.talkNodesForOptions.length = 0;
				}
			}
		);

		this.Push = new TalkNodeDefn
		(
			"Push",
			(universe: Universe, conversationRun: ConversationRun, scope: ConversationScope, talkNode: TalkNode) => // execute
			{
				var runDefn = conversationRun.defn;
				var talkNodeIndex = runDefn.talkNodes.indexOf(talkNode);
				var talkNodeNext = runDefn.talkNodes[talkNodeIndex + 1];
				conversationRun.scopeCurrent = new ConversationScope
				(
					scope, // parent
					talkNodeNext,
					[] // options
				);
				conversationRun.update(universe);
			},
			null // activate
		);

		this.Quit = new TalkNodeDefn
		(
			"Quit",
			(universe: Universe, conversationRun: ConversationRun, scope: ConversationScope, talkNode: TalkNode) => // execute
			{
				conversationRun.quit();
			},
			null // activate
		);

		this.Script = new TalkNodeDefn
		(
			"Script",
			(universe: Universe, conversationRun: ConversationRun, scope: ConversationScope, talkNode: TalkNode) => // execute
			{
				var scriptToRunAsString = "(" + talkNode.text + ")";
				var scriptToRun = eval(scriptToRunAsString);
				scriptToRun(universe, conversationRun);
				scope.talkNodeAdvance(conversationRun);
				conversationRun.update(universe); // hack
			},
			null // activate
		);

		this.VariableLoad = new TalkNodeDefn
		(
			"VariableLoad",
			(universe: Universe, conversationRun: ConversationRun, scope: ConversationScope, talkNode: TalkNode) => // execute
			{
				var variableName = talkNode.text;
				var scriptExpression = talkNode.next;
				var scriptToRunAsString = "( function(u, cr) { return " + scriptExpression + "; } )";
				var scriptToRun = eval(scriptToRunAsString);
				var scriptResult = scriptToRun(conversationRun);
				conversationRun.variableSet(variableName, scriptResult);
				scope.talkNodeAdvance(conversationRun);
				conversationRun.update(universe); // hack
			},
			null // activate
		);

		this.VariableSet = new TalkNodeDefn
		(
			"VariableSet",
			(universe: Universe, conversationRun: ConversationRun, scope: ConversationScope, talkNode: TalkNode) => // execute
			{
				var variableName = talkNode.text;
				var variableValue = talkNode.next;
				conversationRun.variableSet(variableName, variableValue);
				scope.talkNodeAdvance(conversationRun);
				conversationRun.update(universe); // hack
			},
			null // activate
		);

		this.VariableStore = new TalkNodeDefn
		(
			"VariableStore",
			(universe: Universe, conversationRun: ConversationRun, scope: ConversationScope, talkNode: TalkNode) => // execute
			{
				var variableName = talkNode.text;
				var variableValue = conversationRun.variableByName(variableName);
				var scriptExpression = talkNode.next;
				var scriptToRunAsString = "( function(u, cr) { " + scriptExpression + " = " + variableValue + "; } )";
				var scriptToRun = eval(scriptToRunAsString);
				scriptToRun(conversationRun);
				scope.talkNodeAdvance(conversationRun);
				conversationRun.update(universe); // hack
			},
			null // activate
		);

		this._All =
		[
			this.Activate,
			this.Display,
			this.Goto,
			this.JumpIfFalse,
			this.JumpIfTrue,
			this.Option,
			this.Pop,
			this.Prompt,
			this.Push,
			this.Quit,
			this.Script,
			this.VariableLoad,
			this.VariableSet,
			this.VariableStore,
		];

		this._AllByName = ArrayHelper.addLookupsByName(this._All);
	}
}

}
