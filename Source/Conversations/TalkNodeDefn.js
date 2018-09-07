
function TalkNodeDefn(name, execute, activate, textForTalkNode)
{
	this.name = name;
	this.execute = execute;
	this.activate = activate;
	this.textForTalkNode = textForTalkNode;
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
	}

	function TalkNodeDefn_Instances()
	{
		this.Activate = new TalkNodeDefn
		(
			"Activate",
			function execute(conversationRun, scope, talkNode)
			{
				var talkNodeToActivateName = talkNode.parameters[0];
				var isActiveValueToSet = talkNode.parameters[1];

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
			// execute
			function(conversationRun, scope, talkNode)
			{
				scope.displayTextCurrent = talkNode.parameters;
				scope.talkNodeAdvance(conversationRun);

				conversationRun.talkNodesForTranscript.push(talkNode);
			},
			null, // activate
			function textForTalkNode(talkNode)
			{
				return talkNode.parameters;
			}
		);

		this.Goto = new TalkNodeDefn
		(
			"Goto",
			// execute
			function(conversationRun, scope, talkNode)
			{
				var talkNodeNameNext = talkNode.parameters;
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
			// execute
			function(conversationRun, scope, talkNode)
			{
				var variableName = talkNode.parameters[0];
				var talkNodeNameToJumpTo = talkNode.parameters[1];
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
			// execute
			function(conversationRun, scope, talkNode)
			{
				var variableName = talkNode.parameters[0];
				var talkNodeNameToJumpTo = talkNode.parameters[1];
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
			function execute(conversationRun, scope, talkNode)
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

				var nameOfTalkNodeNext = talkNode.parameters[0];
				var talkNodeNext = conversationRun.defn.talkNodeByName(nameOfTalkNodeNext);
				scope.talkNodeCurrent = talkNodeNext;

				conversationRun.talkNodesForTranscript.push(talkNode);
			},
			function textForTalkNode(talkNode)
			{
				return talkNode.parameters[1];
			}
		);

		this.Pop = new TalkNodeDefn
		(
			"Pop",
			function execute(conversationRun, scope, talkNode)
			{
				var scope = scope.parent;
				conversationRun.scopeCurrent = scope;
				scope.talkNodeCurrent = conversationRun.defn.talkNodeByName
				(
					talkNode.parameters
				);
				conversationRun.update();
			}
		);

		this.Prompt = new TalkNodeDefn
		(
			"Prompt",
			function execute(conversationRun, scope, talkNode)
			{
				scope.isPromptingForResponse = true;
			},
			function activate(conversationRun, scope, talkNode)
			{
				var shouldClearOptions = talkNode.parameters;
				if (shouldClearOptions == true)
				{
					scope.talkNodesForOptions.length = 0;
				}
			}
		);

		this.Push = new TalkNodeDefn
		(
			"Push",
			function execute(conversationRun, scope, talkNode)
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
				conversationRun.update();
			}
		);

		this.Script = new TalkNodeDefn
		(
			"Script",
			function execute(conversationRun, scope, talkNode)
			{
				var scriptToRunAsString = "(" + talkNode.parameters + ")";
				var scriptToRun = eval(scriptToRunAsString);
				scriptToRun(conversationRun);
				scope.talkNodeAdvance(conversationRun);
				conversationRun.update(); // hack
			}
		);

		this.Quit = new TalkNodeDefn
		(
			"Quit",
			function execute(conversationRun, scope, talkNode)
			{
				conversationRun.quit();
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
			this.Script,
			this.Quit,
		].addLookups("name");
	}
}
