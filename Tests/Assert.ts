
class Assert
{
	static areEqual(objectExpected: any, objectActual: any): void
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

		if (areExpectedAndActualEqual == false)
		{
			var errorMessage = 
				"Expected: " + JSON.stringify(objectExpected)
				+ ", but was: " + JSON.stringify(objectActual) + "."

			throw(errorMessage);
		}
	}

	static isNotNull(valueToTest: any): void
	{
		if (valueToTest == null)
		{
			throw("Expected: not null, but was: null.");
		}
	}

	static isTrue(valueToTest: boolean): void
	{
		if (valueToTest != true)
		{
			throw("Expected: true, but was: " + valueToTest + ".");
		}
	}
}
