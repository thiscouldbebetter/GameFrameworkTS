
class Assert
{
	static areEqual(objectExpected: any, objectActual: any): void
	{
		var areExpectedAndActualEqual = this.areObjectsEqual
		(
			objectExpected, objectActual
		);
		if (areExpectedAndActualEqual == false)
		{
			var errorMessage = 
				"Expected: " + JSON.stringify(objectExpected)
				+ ", but was: " + JSON.stringify(objectActual) + "."

			throw new Error(errorMessage);
		}
	}

	static areNotEqual(objectExpected: any, objectActual: any): void
	{
		var areExpectedAndActualEqual = this.areObjectsEqual
		(
			objectExpected, objectActual
		);
		if (areExpectedAndActualEqual)
		{
			var errorMessage = 
				"The objects were equal, which was not expected.";
			throw(errorMessage);
		}
	}

	static isFalse(valueToTest: boolean): void
	{
		if (valueToTest != false)
		{
			throw new Error("Expected: false, but was: " + valueToTest + ".");
		}
	}

	static isNotNull(valueToTest: any): void
	{
		if (valueToTest == null)
		{
			throw new Error("Expected: not null, but was: null.");
		}
	}

	static isNull(valueToTest: any): void
	{
		if (valueToTest != null)
		{
			throw new Error("Expected: null, but was: not null.");
		}
	}

	static isTrue(valueToTest: boolean): void
	{
		if (valueToTest != true)
		{
			throw new Error("Expected: true, but was: " + valueToTest + ".");
		}
	}

	static throwsError(functionToTest: Function): void
	{
		try
		{
			functionToTest();
			throw new Error("Expected an error to be thrown, but none was.")
		}
		catch (ex)
		{
			// Do nothing.
		}
	}

	// Helper methods.

	private static areObjectsEqual(objectExpected: any, objectActual: any): boolean
	{
		var areExpectedAndActualEqual;

		if (objectExpected == objectActual)
		{
			areExpectedAndActualEqual = true;
		}
		else if
		(
			objectExpected.equals != null
			&& objectActual.equals != null
			&& objectExpected.equals(objectActual)
		)
		{
			areExpectedAndActualEqual = true;
		}
		else
		{
			var objectExpectedAsJson = JSON.stringify(objectExpected);
			var objectActualAsJson = JSON.stringify(objectActual);

			areExpectedAndActualEqual =
				(objectExpectedAsJson == objectActualAsJson);
		}

		return areExpectedAndActualEqual;
	}
}
