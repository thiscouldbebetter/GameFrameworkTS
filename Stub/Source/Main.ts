
class Program
{
	start()
	{
		var name = "GameStub";
		var contentDirectoryPath =
			Configuration.Instance().contentDirectoryPath;
		var game = Game.fromNameAndContentDirectoryPath
		(
			name, contentDirectoryPath
		);
		game.start();
	}
}

new Program().start();
