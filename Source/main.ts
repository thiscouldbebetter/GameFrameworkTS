
class Program
{
	start()
	{
		var testRunner = new TestRunner();
		testRunner.runThen
		(
			() =>
			{
				GameDemo.create().start();
			}
		);

	}
}

new Program().start();
