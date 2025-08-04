

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

		textLines.push("High Scores");
		textLines.push("");

		var playerScoresAsTextLines: string[] = [];

		for (var i = 0; i < this.playerScores.length; i++)
		{
			var playerScore = this.playerScores[i];
			var playerScoreAsTextLine = playerScore.toString();
			playerScoresAsTextLines.push(playerScoreAsTextLine);
		}

		textLines.push(...playerScoresAsTextLines);

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
	playerInitials: string;
	score: number;
	timeEntered: Date;

	constructor(playerInitials: string, score: number, timeEntered: Date)
	{
		this.playerInitials = playerInitials;
		this.score = score;
		this.timeEntered = timeEntered || new Date();
	}

	static fromPlayerNameAndScore(playerName: string, score: number): Leaderboard_PlayerScore
	{
		return new Leaderboard_PlayerScore(playerName, score, null);
	}

	toString(): string
	{
		var scoreLengthMax = 7;
		var scoreAsString = ("" + this.score).padStart(scoreLengthMax, " ");
		var returnValue = this.playerInitials + scoreAsString;
		return returnValue;
	}
}

}
