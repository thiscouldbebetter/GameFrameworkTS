
namespace ThisCouldBeBetter.GameFramework
{

export class TalkNodeDefn
{
	name: string;
	execute: (u: Universe, r: ConversationRun, s: ConversationScope, n: TalkNode) => void;

	constructor
	(
		name: string,
		execute: (u: Universe, r: ConversationRun, s: ConversationScope, n: TalkNode) => void,
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
	Pop: TalkNodeDefn;
	Prompt: TalkNodeDefn;
	Push: TalkNodeDefn;
	Random: TalkNodeDefn;
	Quit: TalkNodeDefn;
	Script: TalkNodeDefn;
	Switch: TalkNodeDefn;
	VariableLoad: TalkNodeDefn;
	VariableSet: TalkNodeDefn;
	VariableStore: TalkNodeDefn;

	_All: TalkNodeDefn[];
	_AllByName: Map<string, TalkNodeDefn>;

	constructor()
	{
		this.Disable = new TalkNodeDefn
		(
			"Disable",
			(
				universe: Universe,
				conversationRun: ConversationRun,
				scope: ConversationScope,
				talkNode: TalkNode
			) => // execute
			{
				var talkNodesToDisablePrefixesJoined =
					talkNode.content;

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
				conversationRun: ConversationRun,
				scope: ConversationScope,
				talkNode: TalkNode
			) => // execute
			{
				scope.displayTextCurrent =
					talkNode.content;
				conversationRun.talkNodeGoToNext(universe);

				conversationRun.talkNodesForTranscript.push(talkNode);
			}
		);

		this.DoNothing = new TalkNodeDefn
		(
			"DoNothing",
			(
				universe: Universe,
				conversationRun: ConversationRun,
				scope: ConversationScope,
				talkNode: TalkNode
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
				conversationRun: ConversationRun,
				scope: ConversationScope,
				talkNode: TalkNode
			) => // execute
			{
				var talkNodesToEnablePrefixesJoined =
					talkNode.content;

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
				conversationRun: ConversationRun,
				scope: ConversationScope,
				talkNode: TalkNode
			) => // execute
			{
				var talkNodeNameNext = talkNode.next;
				conversationRun.goto(talkNodeNameNext, universe);
			}
		);

		this.JumpIfFalse = new TalkNodeDefn
		(
			"JumpIfFalse",
			(
				universe: Universe,
				conversationRun: ConversationRun,
				scope: ConversationScope,
				talkNode: TalkNode
			) => // execute
			{
				var variableName = talkNode.content;
				var talkNodeNameToJumpTo = talkNode.next;
				var variableValue = conversationRun.variableByName(variableName);
				if ((variableValue as boolean) == true)
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
				conversationRun: ConversationRun,
				scope: ConversationScope,
				talkNode: TalkNode
			) => // execute
			{
				var variableName = talkNode.content;
				var talkNodeNameToJumpTo = talkNode.next;
				var variableValue = conversationRun.variableByName(variableName);
				if ((variableValue as boolean) == true)
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
				conversationRun: ConversationRun,
				scope: ConversationScope,
				talkNode: TalkNode
			) => // execute
			{
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

		this.Pop = new TalkNodeDefn
		(
			"Pop",
			(
				universe: Universe,
				conversationRun: ConversationRun,
				scope: ConversationScope,
				talkNode: TalkNode
			) => // execute
			{
				var scope = scope.parent;
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
				conversationRun: ConversationRun,
				scope: ConversationScope,
				talkNode: TalkNode
			) => // execute
			{
				scope.isPromptingForResponse = true;
			}
		);

		this.Push = new TalkNodeDefn
		(
			"Push",
			(
				universe: Universe,
				conversationRun: ConversationRun,
				scope: ConversationScope,
				talkNode: TalkNode
			) => // execute
			{
				var talkNodeToPushTo = conversationRun.talkNodeNext();

				var talkNodeToReturnTo = conversationRun.talkNodePrev();
				scope.talkNodeCurrentSet(talkNodeToReturnTo);

				conversationRun.scopeCurrent = new ConversationScope
				(
					scope, // parent
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
				conversationRun: ConversationRun,
				scope: ConversationScope,
				talkNode: TalkNode
			) => // execute
			{
				conversationRun.quit(universe);
			}
		);

		this.Random = new TalkNodeDefn
		(
			"Random",
			(
				universe: Universe,
				conversationRun: ConversationRun,
				scope: ConversationScope,
				talkNode: TalkNode
			) => // execute
			{
				conversationRun.talkNodeAdvance(universe);

				var node = conversationRun.talkNodeCurrent();
				var nodeDefnName = node.defnName;
				var nodeDefnNameFirst = nodeDefnName;
				var nodesToChooseBetween = [];
				while (nodeDefnName == nodeDefnNameFirst)
				{
					nodesToChooseBetween.push(node);

					conversationRun.talkNodeAdvance(universe);
					node = conversationRun.talkNodeCurrent();
					nodeDefnName = node.defnName;
				}

				var nodeNextAfterNodesToChooseBetween = node;

				var randomNumber = universe.randomizer.getNextRandom();
				var nodeIndex = Math.floor(randomNumber * nodesToChooseBetween.length);
				var nodeChosenAtRandom = nodesToChooseBetween[nodeIndex];
				conversationRun.talkNodeCurrentSet(nodeChosenAtRandom);

				nodeChosenAtRandom.execute(universe, conversationRun, scope);

				conversationRun.talkNodeCurrentSet(nodeNextAfterNodesToChooseBetween);

				conversationRun.talkNodeCurrentExecute(universe);
				//scope.talkNodeGoToNext(universe, conversationRun);
			}
		);

		this.Script = new TalkNodeDefn
		(
			"Script",
			(
				universe: Universe,
				conversationRun: ConversationRun,
				scope: ConversationScope,
				talkNode: TalkNode
			) => // execute
			{
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
				conversationRun: ConversationRun,
				scope: ConversationScope,
				talkNode: TalkNode
			) => // execute
			{
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
				conversationRun: ConversationRun,
				scope: ConversationScope,
				talkNode: TalkNode
			) => // execute
			{
				var variableName = talkNode.content;
				var scriptExpression = talkNode.next;
				var scriptToRunAsString = "( (u, cr) => " + scriptExpression + " )";
				var scriptToRun = eval(scriptToRunAsString);
				var scriptResult = scriptToRun(universe, conversationRun);
				conversationRun.variableSet(variableName, scriptResult);
				conversationRun.talkNodeAdvance(universe);
				conversationRun.talkNodeCurrentExecute(universe); // hack
			}
		);

		this.VariableSet = new TalkNodeDefn
		(
			"VariableSet",
			(
				universe: Universe,
				conversationRun: ConversationRun,
				scope: ConversationScope,
				talkNode: TalkNode
			) => // execute
			{
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
				conversationRun: ConversationRun,
				scope: ConversationScope,
				talkNode: TalkNode
			) => // execute
			{
				var variableName = talkNode.content;
				var variableValue = conversationRun.variableByName(variableName).toString();
				var scriptExpression = talkNode.next;
				var scriptExpressionWithValue =
					scriptExpression.split("[value]").join(variableValue);
				var scriptToRunAsString =
					"( (u, cr) => { " + scriptExpressionWithValue + "; } )";
				var scriptToRun = eval(scriptToRunAsString);
				scriptToRun(universe, conversationRun);
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
			this.Pop,
			this.Prompt,
			this.Push,
			this.Quit,
			this.Random,
			this.Script,
			this.Switch,
			this.VariableLoad,
			this.VariableSet,
			this.VariableStore,
		];

		this._AllByName = ArrayHelper.addLookupsByName(this._All);
	}
}

}
