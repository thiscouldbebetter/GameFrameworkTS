
class Input
{
	constructor(name)
	{
		this.name = name;

		this.isActive = true;
		this.ticksActive = 0;
	}

	static Names()
	{
		if (Input._names == null)
		{
			function Input_Names()
			{
				this.ArrowDown = "ArrowDown";
				this.ArrowLeft = "ArrowLeft";
				this.ArrowRight = "ArrowRight";
				this.ArrowUp = "ArrowUp";
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
			}

			Input._names = new Input_Names();
		}

		return Input._names;
	}
}
