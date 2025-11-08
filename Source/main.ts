
class Program
{
	start()
	{
		var testRunner = new TestRunner();
		testRunner.runThen
		(
			() =>
			{
				var configuration = Configuration.Instance();
				GameDemo.fromConfiguration(configuration).start();
			}
		);

	}
}

new Program().start();
