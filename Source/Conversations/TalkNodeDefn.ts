
class TalkNodeDefn
{
	constructor(name, execute, activate)
	{
		this.name = name;
		this.execute = execute;
		this.activate = activate;
	}
}
{
	// instances

	TalkNodeDefn.Instances = function()
	{
		if (this._instances == null)
		{
			this._instances = new TalkNodeDefn_Instances();
		}
		return this._instances;
	};

	function TalkNodeDefn_Instances()
	{
		this.Activate = new TalkNodeDefn
		(
			"Activate",
			function execute(universe, conversationRun, scope, talkNode)
			{
				var talkNodeToActivateName = talkNode.next;
				var isActiveValueToSet = talkNode.text;

				var conversationDefn = conversationRun.defn;
				var talkNodeToActivate
					= conversationDefn.talkNodes[talkNodeToActivateName];
				talkNodeToActivate.isActive = isActiveValueToSet;
				scope.talkNodeAdvance(conversationRun);
				conversationRun.update();
			}
		);

		this.Display = new TalkNodeDefn
		(
			"Display",
			function execute(universe, conversationRun, scope, talkNode)
			{
				scope.displayTextCurrent = talkNode.text;
				scope.talkNodeAdvance(conversationRun);

				conversationRun.talkNodesForTranscript.push(talkNode);
			}
		);

		this.Goto = new TalkNodeDefn
		(
			"Goto",
			function execute(universe, conversationRun, scope, talkNode)
			{
				var talkNodeNameNext = talkNode.next;
				scope.talkNodeCurrent = conversationRun.defn.talkNodeByName
				(
					talkNodeNameNext
				);
				conversationRun.update();
			}
		);

		this.JumpIfFalse = new TalkNodeDefn
		(
			"JumpIfFalse",
			function execute(universe, conversationRun, scope, talkNode)
			{
				var variableName = talkNode.text;
				var talkNodeNameToJumpTo = talkNode.next;
				var variableValue = conversationRun.variableLookup[variableName];
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

				conversationRun.update();
			}
		);

		this.JumpIfTrue = new TalkNodeDefn
		(
			"JumpIfTrue",
			function execute(universe, conversationRun, scope, talkNode)
			{
				var variableName = talkNode.text;
				var talkNodeNameToJumpTo = talkNode.next;
				var variableValue = conversationRun.variableLookup[variableName];
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

				conversationRun.update();
			}
		);

		this.Option = new TalkNodeDefn
		(
			"Option",
			function execute(universe, conversationRun, scope, talkNode)
			{
				var talkNodesForOptions = scope.talkNodesForOptions;
				if (talkNodesForOptions.contains(talkNode) == false)
				{
					talkNodesForOptions.push(talkNode);
					talkNodesForOptions[talkNode.name] = talkNode;
				}
				scope.talkNodeAdvance(conversationRun);
				conversationRun.update();
			},
			function activate(conversationRun, scope, talkNode)
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
			function execute(universe, conversationRun, scope, talkNode)
			{
				var scope = scope.parent;
				conversationRun.scopeCurrent = scope;
				scope.talkNodeCurrent = conversationRun.defn.talkNodeByName
				(
					talkNode.next
				);
				conversationRun.update();
			}
		);

		this.Prompt = new TalkNodeDefn
		(
			"Prompt",
			function execute(universe, conversationRun, scope, talkNode)
			{
				scope.isPromptingForResponse = true;
			},
			function activate(conversationRun, scope, talkNode)
			{
				var shouldClearOptions = talkNode.text;
				if (shouldClearOptions == true)
				{
					scope.talkNodesForOptions.length = 0;
				}
			}
		);

		this.Push = new TalkNodeDefn
		(
			"Push",
			function execute(universe, conversationRun, scope, talkNode)
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
			}
		);

		this.Quit = new TalkNodeDefn
		(
			"Quit",
			function execute(universe, conversationRun, scope, talkNode)
			{
				conversationRun.quit();
			}
		);

		this.Script = new TalkNodeDefn
		(
			"Script",
			function execute(universe, conversationRun, scope, talkNode)
			{
				var scriptToRunAsString = "(" + talkNode.text + ")";
				var scriptToRun = eval(scriptToRunAsString);
				scriptToRun(universe, conversationRun);
				scope.talkNodeAdvance(conversationRun);
				conversationRun.update(); // hack
			}
		);

		this.VariableLoad = new TalkNodeDefn
		(
			"VariableLoad",
			function execute(universe, conversationRun, scope, talkNode)
			{
				var variableName = talkNode.text;
				var scriptExpression = talkNode.next;
				var scriptToRunAsString = "( function(u, cr) { return " + scriptExpression + "; } )";
				var scriptToRun = eval(scriptToRunAsString);
				var scriptResult = scriptToRun(conversationRun);
				conversationRun.variableLookup[variableName] = scriptResult;
				scope.talkNodeAdvance(conversationRun);
				conversationRun.update(universe); // hack
			}
		);

		this.VariableSet = new TalkNodeDefn
		(
			"VariableSet",
			function execute(universe, conversationRun, scope, talkNode)
			{
				var variableName = talkNode.text;
				var variableValue = talkNode.next;
				conversationRun.variableLookup[variableName] = variableValue;
				scope.talkNodeAdvance(conversationRun);
				conversationRun.update(universe); // hack
			}
		);

		this.VariableStore = new TalkNodeDefn
		(
			"VariableStore",
			function execute(universe, conversationRun, scope, talkNode)
			{
				var variableName = talkNode.text;
				var variableValue = conversationRun.variableLookup[variableName];
				var scriptExpression = talkNode.next;
				var scriptToRunAsString = "( function(u, cr) { " + scriptExpression + " = " + variableValue + "; } )";
				var scriptToRun = eval(scriptToRunAsString);
				scriptToRun(conversationRun);
				scope.talkNodeAdvance(conversationRun);
				conversationRun.update(universe); // hack
			}
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
		].addLookupsByName();
	}
}
