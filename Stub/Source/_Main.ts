class Program
{
	start()
	{
		var name = "GameStub";
		var contentDirectoryPath = "../Content/";
		new Game(name, contentDirectoryPath).start();
	}
}

new Program().start();
