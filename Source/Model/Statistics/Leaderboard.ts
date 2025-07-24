

namespace ThisCouldBeBetter.GameFramework
{

export class Leaderboard
{
	playerScores: Leaderboard_PlayerScore[];

	constructor(playerScores: Leaderboard_PlayerScore[])
	{
		this.playerScores = playerScores || [];
	}

	static create(): Leaderboard
	{
		return new Leaderboard(null);
	}

	// Controllable.

	toControl(uwpe: UniverseWorldPlaceEntities): ControlBase
	{
		var textLines = [];

		textLines.push("High Scores:");
		textLines.push("");

		for (var i = 0; i < this.playerScores.length; i++)
		{
			var playerScore = this.playerScores[i];
			var playerScoreAsTextLine = playerScore.toString();
			textLines.push(playerScoreAsTextLine);
		}

		var newline = "\n";
		var text = textLines.join(newline);

		var container = ControlContainer.fromPosSizeAndChildren
		(
			Coords.zeroes(),
			uwpe.universe.display.sizeInPixels,
			[
				ControlLabel.fromPosAndText
				(
					Coords.fromXY(0, 0),
					DataBinding.fromGet
					(
						() => text
					)
				)
			]
		).toControlContainerTransparent();

		return container;
	}
}

class Leaderboard_PlayerScore
{
	playerName: string;
	score: number;
	timeEntered: Date;

	constructor(playerName: string, score: number, timeEntered: Date)
	{
		this.playerName = playerName;
		this.score = score;
		this.timeEntered = timeEntered || new Date();
	}

	static fromPlayerNameAndScore(playerName: string, score: number): Leaderboard_PlayerScore
	{
		return new Leaderboard_PlayerScore(playerName, score, null);
	}

	toString(): string
	{
		return this.playerName + " " + this.score;
	}
}

}
