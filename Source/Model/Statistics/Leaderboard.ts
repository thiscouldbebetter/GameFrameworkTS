

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

	static createWithFakeScores(): Leaderboard
	{
		var ps = (n: string, s: number) =>
			Leaderboard_PlayerScore.fromPlayerNameAndScore(n, s);

		return new Leaderboard
		([
			ps("AAA", 100000),
			ps("BBB", 50000),
			ps("CCC", 20000),
			ps("DDD", 10000),
			ps("EEE", 5000),
			ps("FFF", 2000),
			ps("GGG", 1000),
			ps("HHH", 500),
			ps("III", 200),
			ps("JJJ", 100)
		]);
	}

	// Controllable.

	toControl(uwpe: UniverseWorldPlaceEntities): ControlBase
	{
		var textLines = [];

		textLines.push("High Scores");
		textLines.push("-----------");

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

		var universe = uwpe.universe;
		var sizeInPixels = universe.display.sizeInPixels;
		var fontNameAndHeight = FontNameAndHeight.default();
		var controlBuilder = universe.controlBuilder;

		var controlLeaderboard = controlBuilder.message
		(
			universe,
			sizeInPixels,
			DataBinding.fromContext(text),
			() => { this.toControl_Finished(universe) },
			true, // showMessageOnly
			fontNameAndHeight
		);

		return controlLeaderboard;
	}

	toControl_Finished(universe: Universe): void
	{
		universe.venueTransitionTo
		(
			universe.controlBuilder.title
			(
				universe, universe.display.sizeInPixels,
			).toVenue()
		);
	}

	toVenue(uwpe: UniverseWorldPlaceEntities): Venue
	{
		var thisAsControl = this.toControl(uwpe);
		var thisAsVenue = thisAsControl.toVenue();
		return thisAsVenue;
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
		var scoreLengthMax = 9;
		var scoreAsString = ("" + this.score).padStart(scoreLengthMax, " ");
		var returnValue = this.playerInitials + scoreAsString;
		return returnValue;
	}
}

}
