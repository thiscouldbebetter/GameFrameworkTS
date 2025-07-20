
namespace ThisCouldBeBetter.GameFramework
{

export class DataBinding<TContext, TValue>
{
	context: TContext;
	_get: (context: TContext) => TValue;
	_set: (context: TContext, value: TValue) => void;

	constructor
	(
		context: TContext,
		get: (context: TContext) => TValue,
		set: (context: TContext, value: TValue) => void
	)
	{
		this.context = context;
		this._get = get;
		this._set = set;
	}

	static fromBooleanWithContext<TContext>
	(
		value: boolean,
		context: TContext
	): DataBinding<TContext,boolean>
	{
		return DataBinding.fromContextAndGet<TContext,boolean>
		(
			context,
			(context: TContext) => value
		);
	}

	static fromContext<TContext>
	(
		context: TContext
	): DataBinding<TContext, TContext>
	{
		return new DataBinding<TContext, TContext>
		(
			context, 
			(contextGet: TContext) => contextGet,
			null // set
		);
	}

	static fromContextAndGet<TContext, TValue>
	(
		context: TContext,
		get: (context: TContext) => TValue
	): DataBinding<TContext,TValue>
	{
		return new DataBinding(context, get, null);
	}

	static fromContextGetAndSet<TContext, TValue>
	(
		context: TContext,
		get: (context: TContext) => TValue,
		set: (context: TContext, value: TValue) => void
	)
	{
		return new DataBinding(context, get, set);
	}

	static fromFalse<TContext>(): DataBinding<TContext,boolean>
	{
		return DataBinding.fromBooleanWithContext<TContext>(false, null);
	}

	static fromFalseWithContext<TContext>
	(
		context: TContext
	): DataBinding<TContext,boolean>
	{
		return DataBinding.fromBooleanWithContext(false, context);
	}

	static fromGet<TContext, TValue>
	(
		get: (context: TContext) => TValue
	): DataBinding<TContext,TValue>
	{
		return new DataBinding(null, get, null);
	}

	static fromTrue<TContext>(): DataBinding<TContext,boolean>
	{
		return DataBinding.fromBooleanWithContext<TContext>(true, null);
	}

	static fromTrueWithContext<TContext>
	(
		context: TContext
	): DataBinding<TContext,boolean>
	{
		return DataBinding.fromBooleanWithContext(true, context);
	}

	contextSet(context: TContext): DataBinding<TContext, TValue>
	{
		this.context = context;
		return this;
	}

	get()
	{
		return this._get(this.context);
	}

	set(value: TValue)
	{
		if (this._set == null)
		{
			this.context = (value as any) as TContext;
		}
		else
		{
			this._set(this.context, value);
		}
	}
}

}
