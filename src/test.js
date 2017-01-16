
function test()
{
	var testAlwaysPass = new Test
	(
		"Always Pass",
		function() { return true; }
	);

	var testAlwaysFail = new Test
	(
		"Always Fail",
		function() { return false; }
	);
	
	var tests = 
	[
		testAlwaysPass,
		//testAlwaysFail,
		testSerializer,
	];

	new TestFixture(tests).runTests();	
}

// classes

function TestFixture(tests)
{
	this.tests = tests;
}
{
	// methods
	
	TestFixture.prototype.runTests = function()
	{		
		var testsFailed = [];
	
		for (var i = 0; i < this.tests.length; i++)
		{
			var testToRun = this.tests[i];
			var testResult = testToRun.run();
			if (testResult != true)
			{
				testsFailed.push(testToRun);
			}
		}
		
		if (testsFailed.length == 0)
		{
			document.write("All tests passed!")
		}
		else
		{
			document.write("Failed tests:");
			for (var i = 0; i < testsFailed.length; i++)
			{
				var testFailed = testsFailed[i];
				document.write(testFailed.name);
			}
		}
	}
}

function Test(name, run)
{
	this.name = name;
	this.run = run;
}

// tests

var testSerializer = new Test
(
	"Serializer Test",
	function()
	{
		function ObjectForLookup(name, value)
		{
			this.name = name;
			this.value = value;
		}
		
		function ObjectContainer(name, objectsForLookup, functionToWrap)
		{
			this.name = name;
			this.objectsForLookup = objectsForLookup;
			this.objectsForLookup.addLookups("name");
		}
		
		var objectToSerialize = new ObjectContainer
		(
			"Test",
			// objectsForLookup
			[
				new ObjectForLookup("zero", 0),
				new ObjectForLookup("one", 1),
				new ObjectForLookup("two", 2),
				new ObjectForLookup("three", 3),				
			],
			// functionToWrap
			function(one, two)
			{
				return one + two;
			}
		); 
		
		var serializer = new Serializer([ObjectContainer, ObjectForLookup]);
	
		var objectSerialized = serializer.serialize(objectToSerialize);
		var objectDeserialized = serializer.deserialize(objectSerialized);
		var objectReserialized = serializer.serialize(objectDeserialized);
		
		var result = (objectSerialized == objectReserialized);
				
		return result;
	}
);