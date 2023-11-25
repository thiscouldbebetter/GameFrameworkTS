
namespace ThisCouldBeBetter.GameFramework
{

export class Stack<T>
{
	items: Array<T>;

	constructor()
	{
		this.items = new Array<T>();
	}

	static fromArray<T>(array: T[]): Stack<T>
	{
		var returnStack = new Stack<T>();
		returnStack.pushMany(array);
		return returnStack;
	}

	hasMoreItems()
	{
		return this.size() > 0;
	}

	peek(): T
	{
		return this.items[0];
	}

	pop(): T
	{
		var returnValue = null;

		if (this.items.length > 0)
		{
			returnValue = this.items[0];
			this.items.splice(0, 1);
		}

		return returnValue;
	}

	popThenPeek(): T
	{
		this.pop();
		return this.peek();
	}

	push(itemToPush: T): void
	{
		this.items.splice(0, 0, itemToPush);
	}

	pushMany(itemsToPush: T[]): void
	{
		itemsToPush.forEach(x => this.items.push(x) );
	}

	size(): number
	{
		return this.items.length;
	}
}

}
