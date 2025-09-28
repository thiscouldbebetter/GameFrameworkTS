
namespace ThisCouldBeBetter.GameFramework
{

export class ControlTimer extends ControlBase
{
	name: string;
	secondsToWait: number;
	_elapsed: (universe: Universe) => void;

	hasElapsed: boolean;
	timeStarted: Date;

	constructor
	(
		name: string,
		secondsToWait: number,
		elapsed: (universe: Universe) => void
	)
	{
		super(name, Coords.create(), Coords.create(), null);

		this.name = name;
		this.secondsToWait = secondsToWait;
		this._elapsed = elapsed;

		this.hasElapsed = false;
		this.timeStarted = null;
	}

	static fromNameSecondsToWaitAndElapsed
	(
		name: string,
		secondsToWait: number,
		elapsed: (universe: Universe) => void
	): ControlTimer
	{
		return new ControlTimer(name, secondsToWait, elapsed);
	}

	actionHandle(actionName: string): boolean
	{
		return false; // wasActionHandled
	}

	elapsed(universe: Universe): void
	{
		this._elapsed(universe);
	}

	initialize(universe: Universe): void
	{
		this.timerStartOrRestart();
	}

	initializeIsComplete(universe: Universe): boolean
	{
		return true;
	}

	isEnabled(): boolean
	{
		return false;
	}

	mouseClick(pos: Coords): boolean
	{
		return false;
	}

	timerStartOrRestart(): void
	{
		this.timeStarted = new Date();
	}

	// Drawing.

	draw
	(
		universe: Universe,
		display: Display,
		drawLoc: Disposition,
		style: ControlStyle
	): void
	{
		// Obviously, this isn't really drawing anything.

		if (this.hasElapsed == false)
		{
			if (this.timeStarted != null)
			{
				var now = new Date();
				var millisecondsSinceStarted =
					now.getTime() - this.timeStarted.getTime();
				var secondsSinceStarted =
					Math.floor(millisecondsSinceStarted / 1000);
				if (secondsSinceStarted >= this.secondsToWait)
				{
					this.hasElapsed = true;
					this.elapsed(universe);
				}
			}
		}
	}
}

}
