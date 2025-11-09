
namespace ThisCouldBeBetter.GameFramework
{

export class Script
{
	name: string;

	constructor(name: string)
	{
		this.name = name;
	}

	static _instances: Script_Instances;
	static Instances(): Script_Instances
	{
		if (this._instances == null)
		{
			this._instances = new Script_Instances();
		}
		return this._instances;
	}

	static byName(name: string): Script
	{
		return this.Instances().byName(name);
	}

	runWithParams0(): any
	{
		throw new Error("Must be implemented in subclass!");
	}

	runWithParams1(param0: any): any
	{
		throw new Error("Must be implemented in subclass!");
	}

	runWithParams2(param0: any, param1: any): any
	{
		throw new Error("Must be implemented in subclass!");
	}
}

export class Script_Instances
{
	_DoNothing: Script;

	ReturnFalse: Script;
	ReturnTrue: Script;

	_All: Script[];

	constructor()
	{
		var sfrn =
			(n: string, r: any) =>
				new ScriptFromRunFunction(n, r);

		this._DoNothing = sfrn("DoNothing", () => {} );

		this.ReturnFalse = sfrn("ReturnFalse", () => false);
		this.ReturnTrue = sfrn("ReturnTrue", () => true);

		this._All =
		[
			this._DoNothing,
			this.ReturnFalse,
			this.ReturnTrue
		];
	}

	byName(name: string): Script
	{
		return this._All.find(x => x.name == name);
	}
}

export class ScriptFromRunFunction extends Script
{
	_run: (a: any, b: any) => any;

	constructor(name: string, run: (a: any, b: any) => any)
	{
		super(name);
		this._run = run;
	}

	runWithParams0(): any
	{
		return this._run(null, null);
	}

	runWithParams1(param0: any): any
	{
		return this._run(param0, null);
	}

	runWithParams2(param0: any, param1: any): any
	{
		return this._run(param0, param1);
	}
}

export class ScriptUsingEval extends Script
{
	codeAsString: string;

	_codeAsFunction: any;

	constructor(name: string, codeAsString: string)
	{
		super(name);
		this.codeAsString = codeAsString;
	}

	static fromCodeAsString(codeAsString: string): ScriptUsingEval
	{
		return new ScriptUsingEval(null, codeAsString);
	}

	static fromFunction(codeAsFunction: any): ScriptUsingEval
	{
		var script = new ScriptUsingEval(null, null);
		script._codeAsFunction = codeAsFunction;
		return script;
	}

	codeAsFunction(): any
	{
		if (this._codeAsFunction == null)
		{
			this._codeAsFunction = eval(this.codeAsString);
			// It'd be nice to catch errors here,
			// but because of how eval() works,
			// it's seemingly not possible.
		}
		return this._codeAsFunction;
	}

	runWithParams0(): any
	{
		return this.runWithParams2(null, null);
	}

	runWithParams1(param0: any): any
	{
		return this.runWithParams2(param0, null);
	}

	runWithParams2(param0: any, param1: any): any
	{
		var codeParsed = this.codeAsFunction();
		var returnValue = codeParsed.call(this, param0, param1);
		return returnValue;
	}
}

export class ScriptUsingFunctionConstructor extends Script
{
	parameterNames: string[];
	codeAsString: string;

	_codeAsFunction: any;

	constructor
	(
		name: string,
		parameterNames: string[],
		codeAsString: string
	)
	{
		super(name);
		this.parameterNames =
			parameterNames || [];
		this.codeAsString = codeAsString;
	}

	static fromCodeAsString(codeAsString: string): ScriptUsingFunctionConstructor
	{
		return new ScriptUsingFunctionConstructor(null, null, codeAsString);
	}

	static fromParameterNamesAndCodeAsString
	(
		parameterNames: string[],
		codeAsString: string
	): ScriptUsingFunctionConstructor
	{
		return new ScriptUsingFunctionConstructor(null, parameterNames, codeAsString);
	}

	codeAsFunction(): any
	{
		if (this._codeAsFunction == null)
		{
			var codeAsFunction = new Function
			(
				this.parameterNames[0] || "param0",
				this.parameterNames[1] || "param1",
				this.codeAsString
			);

			this._codeAsFunction = codeAsFunction;
		}
		return this._codeAsFunction;
	}

	runWithParams0(): any
	{
		return this.runWithParams2(null, null);
	}

	runWithParams1(param0: any): any
	{
		return this.runWithParams2(param0, null);
	}

	runWithParams2(param0: any, param1: any): any
	{
		var codeParsed = this.codeAsFunction();
		var returnValue = codeParsed.call(this, param0, param1);
		return returnValue;
	}
}

}