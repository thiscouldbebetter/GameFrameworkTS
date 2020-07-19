"use strict";
class TalkNodeDefn {
    constructor(name, execute, activate) {
        this.name = name;
        this.execute = execute;
        this.activate = activate;
    }
    static Instances() {
        if (TalkNodeDefn._instances == null) {
            TalkNodeDefn._instances = new TalkNodeDefn_Instances();
        }
        return TalkNodeDefn._instances;
    }
    ;
}
class TalkNodeDefn_Instances {
    constructor() {
        this.Activate = new TalkNodeDefn("Activate", (universe, conversationRun, scope, talkNode) => // execute
         {
            var talkNodeToActivateName = talkNode.next;
            var isActiveValueToSet = (talkNode.text == "true");
            var conversationDefn = conversationRun.defn;
            var talkNodeToActivate = conversationDefn.talkNodesByName.get(talkNodeToActivateName);
            talkNodeToActivate.isActive = isActiveValueToSet;
            scope.talkNodeAdvance(conversationRun);
            conversationRun.update(universe);
        }, null // activate
        );
        this.Display = new TalkNodeDefn("Display", (universe, conversationRun, scope, talkNode) => // execute
         {
            scope.displayTextCurrent = talkNode.text;
            scope.talkNodeAdvance(conversationRun);
            conversationRun.talkNodesForTranscript.push(talkNode);
        }, null // activate
        );
        this.Goto = new TalkNodeDefn("Goto", (universe, conversationRun, scope, talkNode) => // execute
         {
            var talkNodeNameNext = talkNode.next;
            scope.talkNodeCurrent = conversationRun.defn.talkNodeByName(talkNodeNameNext);
            conversationRun.update(universe);
        }, null // activate
        );
        this.JumpIfFalse = new TalkNodeDefn("JumpIfFalse", (universe, conversationRun, scope, talkNode) => // execute
         {
            var variableName = talkNode.text;
            var talkNodeNameToJumpTo = talkNode.next;
            var variableValue = conversationRun.variableLookup.get(variableName);
            if (variableValue == true) {
                scope.talkNodeAdvance(conversationRun);
            }
            else {
                scope.talkNodeCurrent = conversationRun.defn.talkNodeByName(talkNodeNameToJumpTo);
            }
            conversationRun.update(universe);
        }, null // activate
        );
        this.JumpIfTrue = new TalkNodeDefn("JumpIfTrue", (universe, conversationRun, scope, talkNode) => // execute
         {
            var variableName = talkNode.text;
            var talkNodeNameToJumpTo = talkNode.next;
            var variableValue = conversationRun.variableLookup.get(variableName);
            if (variableValue == true) {
                scope.talkNodeCurrent = conversationRun.defn.talkNodeByName(talkNodeNameToJumpTo);
            }
            else {
                scope.talkNodeAdvance(conversationRun);
            }
            conversationRun.update(universe);
        }, null // activate
        );
        this.Option = new TalkNodeDefn("Option", (universe, conversationRun, scope, talkNode) => // execute
         {
            var talkNodesForOptions = scope.talkNodesForOptions;
            if (talkNodesForOptions.indexOf(talkNode) == -1) {
                talkNodesForOptions.push(talkNode);
                scope.talkNodesForOptionsByName.set(talkNode.name, talkNode);
            }
            scope.talkNodeAdvance(conversationRun);
            conversationRun.update(universe);
        }, (conversationRun, scope, talkNode) => // activate
         {
            scope.isPromptingForResponse = false;
            //scope.talkNodesForOptions.length = 0;
            var nameOfTalkNodeNext = talkNode.next;
            var talkNodeNext = conversationRun.defn.talkNodeByName(nameOfTalkNodeNext);
            scope.talkNodeCurrent = talkNodeNext;
            conversationRun.talkNodesForTranscript.push(talkNode);
        });
        this.Pop = new TalkNodeDefn("Pop", (universe, conversationRun, scope, talkNode) => // execute
         {
            var scope = scope.parent;
            conversationRun.scopeCurrent = scope;
            scope.talkNodeCurrent = conversationRun.defn.talkNodeByName(talkNode.next);
            conversationRun.update(universe);
        }, null // activate
        );
        this.Prompt = new TalkNodeDefn("Prompt", (universe, conversationRun, scope, talkNode) => // execute
         {
            scope.isPromptingForResponse = true;
        }, (conversationRun, scope, talkNode) => // activate
         {
            var shouldClearOptions = talkNode.text;
            if (shouldClearOptions == "true") {
                scope.talkNodesForOptions.length = 0;
            }
        });
        this.Push = new TalkNodeDefn("Push", (universe, conversationRun, scope, talkNode) => // execute
         {
            var runDefn = conversationRun.defn;
            var talkNodeIndex = runDefn.talkNodes.indexOf(talkNode);
            var talkNodeNext = runDefn.talkNodes[talkNodeIndex + 1];
            conversationRun.scopeCurrent = new ConversationScope(scope, // parent
            talkNodeNext, [] // options
            );
            conversationRun.update(universe);
        }, null // activate
        );
        this.Quit = new TalkNodeDefn("Quit", (universe, conversationRun, scope, talkNode) => // execute
         {
            conversationRun.quit();
        }, null // activate
        );
        this.Script = new TalkNodeDefn("Script", (universe, conversationRun, scope, talkNode) => // execute
         {
            var scriptToRunAsString = "(" + talkNode.text + ")";
            var scriptToRun = eval(scriptToRunAsString);
            scriptToRun(universe, conversationRun);
            scope.talkNodeAdvance(conversationRun);
            conversationRun.update(universe); // hack
        }, null // activate
        );
        this.VariableLoad = new TalkNodeDefn("VariableLoad", (universe, conversationRun, scope, talkNode) => // execute
         {
            var variableName = talkNode.text;
            var scriptExpression = talkNode.next;
            var scriptToRunAsString = "( function(u, cr) { return " + scriptExpression + "; } )";
            var scriptToRun = eval(scriptToRunAsString);
            var scriptResult = scriptToRun(conversationRun);
            conversationRun.variableLookup.set(variableName, scriptResult);
            scope.talkNodeAdvance(conversationRun);
            conversationRun.update(universe); // hack
        }, null // activate
        );
        this.VariableSet = new TalkNodeDefn("VariableSet", (universe, conversationRun, scope, talkNode) => // execute
         {
            var variableName = talkNode.text;
            var variableValue = talkNode.next;
            conversationRun.variableLookup.set(variableName, variableValue);
            scope.talkNodeAdvance(conversationRun);
            conversationRun.update(universe); // hack
        }, null // activate
        );
        this.VariableStore = new TalkNodeDefn("VariableStore", (universe, conversationRun, scope, talkNode) => // execute
         {
            var variableName = talkNode.text;
            var variableValue = conversationRun.variableLookup.get(variableName);
            var scriptExpression = talkNode.next;
            var scriptToRunAsString = "( function(u, cr) { " + scriptExpression + " = " + variableValue + "; } )";
            var scriptToRun = eval(scriptToRunAsString);
            scriptToRun(conversationRun);
            scope.talkNodeAdvance(conversationRun);
            conversationRun.update(universe); // hack
        }, null // activate
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
