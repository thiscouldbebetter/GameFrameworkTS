
namespace ThisCouldBeBetter.GameFramework
{

export class Input
{
	name: string;

	isActive: boolean;
	ticksActive: number;

	constructor(name: string)
	{
		this.name = name;

		this.isActive = true;
		this.ticksActive = 0;
	}

	static _names: Input_Names;
	static Names()
	{
		if (Input._names == null)
		{
			Input._names = new Input_Names();
		}

		return Input._names;
	}
}

class Input_Names
{
	ArrowDown: string;
	ArrowLeft: string;
	ArrowRight: string;
	ArrowUp: string;
	Backspace: string;
	Control: string;
	Enter: string;
	Escape: string;
	GamepadButton0: string;
	GamepadButton1: string;
	GamepadMoveDown: string;
	GamepadMoveLeft: string;
	GamepadMoveRight: string;
	GamepadMoveUp: string;
	MouseClick: string;
	MouseMove: string;
	Shift: string;
	Space: string;
	Tab: string;

	_All: string[];
	_AllByName: any;

	constructor()
	{
		this.ArrowDown = "ArrowDown";
		this.ArrowLeft = "ArrowLeft";
		this.ArrowRight = "ArrowRight";
		this.ArrowUp = "ArrowUp";
		this.Backspace = "Backspace";
		this.Control = "Control";
		this.Enter = "Enter";
		this.Escape = "Escape";
		this.GamepadButton0 = "GamepadButton0_";
		this.GamepadButton1 = "GamepadButton1_";
		this.GamepadMoveDown = "GamepadMoveDown_";
		this.GamepadMoveLeft = "GamepadMoveLeft_";
		this.GamepadMoveRight = "GamepadMoveRight_";
		this.GamepadMoveUp = "GamepadMoveUp_";
		this.MouseClick = "MouseClick";
		this.MouseMove = "MouseMove";
		this.Shift = "Shift";
		this.Space = "_";
		this.Tab = "Tab";

		this._All =
		[
			this.ArrowDown,
			this.ArrowLeft,
			this.ArrowRight,
			this.ArrowUp,
			this.Backspace,
			this.Control,
			this.Enter,
			this.Escape,
			this.GamepadButton0,
			this.GamepadButton1,
			this.GamepadMoveDown,
			this.GamepadMoveLeft,
			this.GamepadMoveRight,
			this.GamepadMoveUp,
			this.MouseClick,
			this.MouseMove,
			this.Shift,
			this.Space,
			this.Tab
		];

		this._AllByName = ArrayHelper.addLookups(this._All, (x: string) => x);
	}
}

}
