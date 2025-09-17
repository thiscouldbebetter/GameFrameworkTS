class Program
{
	start()
	{
		var name = "GameStub";
		var contentDirectoryPath = Configuration.Instance().contentDirectoryPath;
		new Game(name, contentDirectoryPath).start();
	}
}

new Program().start();
