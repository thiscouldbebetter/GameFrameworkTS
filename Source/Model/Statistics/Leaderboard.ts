

namespace ThisCouldBeBetter.GameFramework
{

export class Leaderboard
{
	secondsToShow: number
	playerScoresCount: number;
	playerScores: LeaderboardPlayerScore[];

	scoreBeingEntered: LeaderboardPlayerScore;

	constructor
	(
		secondsToShow: number,
		playerScoresCount: number,
		playerScores: LeaderboardPlayerScore[]
	)
	{
		this.secondsToShow = secondsToShow;
		this.playerScoresCount = playerScoresCount || 10;
		this.playerScores = playerScores || [];

		this.scoreBeingEntered = null;
	}

	static create(): Leaderboard
	{
		return new Leaderboard(null, null, null);
	}

	static createWithFakeScores(): Leaderboard
	{
		var ps = (n: string, s: number) =>
			LeaderboardPlayerScore.fromPlayerNameAndScore(n, s);

		var playerScoresFake =
		[
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
		];

		return new Leaderboard(30, playerScoresFake.length, playerScoresFake);
	}

	static fromStorageHelper(storageHelper: StorageHelper): Leaderboard
	{
		var leaderboard = storageHelper.load<Leaderboard>(Leaderboard.name);

		if (leaderboard == null)
		{
			leaderboard = Leaderboard.createWithFakeScores();
			storageHelper.save<Leaderboard>(Leaderboard.name, leaderboard);
		}

		return leaderboard;
	}

	scoreBeingEnteredSet(value: number): void
	{
		for (var i = 0; i < this.playerScores.length; i++)
		{
			var playerScoreExisting = this.playerScores[i].score;
			if (value > playerScoreExisting)
			{
				this.scoreBeingEntered =
					LeaderboardPlayerScore.fromScore(value);
				this.playerScores.splice(i, 0, this.scoreBeingEntered);
				this.playerScores.length = this.playerScoresCount;
				break;
			}
		}
	}

	// Controllable.

	toControl(uwpe: UniverseWorldPlaceEntities): ControlBase
	{
		var control =
			this.scoreBeingEntered == null
			? this.toControl_ScoresAllShow(uwpe)
			: this.toControl_PlayerIntialsEnter(uwpe);

		return control;
	}

	toControl_PlayerIntialsEnter(uwpe: UniverseWorldPlaceEntities): ControlBase
	{
		var textAsLines =
		[
			"Your score is among ",
			"the top " + this.playerScoresCount,
			"of all time!",
			" ",
			"Enter your initials:",
			" ",
			" ",
			" "
		];

		var text = textAsLines.join("\n");

		var universe = uwpe.universe;
		var controlBuilder = universe.controlBuilder;
		var sizeInPixels = universe.display.sizeInPixels;
		var fontNameAndHeight = FontNameAndHeight.default();

		var controlRoot = controlBuilder.message
		(
			universe,
			sizeInPixels,
			DataBinding.fromContext(text),
			() => this.toControl_PlayerInitialsEnter_Finished(uwpe), // acknowledge
			true, // showMessageOnly
			fontNameAndHeight,
			this.secondsToShow
		) as ControlContainerTransparent;

		controlRoot.containerInner.indexOfChildWithFocusCannotBeNullSet(true);

		var textBoxInitials = ControlTextBox.fromNamePosSizeAndTextBinding
		(
			"textBoxInitials",
			Coords.fromXY(150, 200), // pos
			Coords.fromXY(100, 40), // size
			DataBinding.fromContextGetAndSet
			(
				this.scoreBeingEntered,
				(c: LeaderboardPlayerScore) => c.playerInitials,
				(c: LeaderboardPlayerScore, v: string) => c.playerInitials = v
			)
		).charsMaxSet(3);

		textBoxInitials.fontHeightInPixelsSet(fontNameAndHeight.heightInPixels * 2);

		controlRoot
			.childAdd(textBoxInitials)
			.childFocusNextInDirection(1);

		return controlRoot;
	}

	toControl_PlayerInitialsEnter_Finished(uwpe: UniverseWorldPlaceEntities): void
	{
		var control = this.toControl_ScoresAllShow(uwpe);
		var venueNext = control.toVenue();
		var universe = uwpe.universe;
		universe.venueTransitionTo(venueNext);
	}

	toControl_ScoresAllShow(uwpe: UniverseWorldPlaceEntities): ControlBase
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
			() => { this.toControl_ScoresAllShow_Finished(universe) },
			true, // showMessageOnly
			fontNameAndHeight,
			this.secondsToShow
		);

		return controlLeaderboard;
	}

	toControl_ScoresAllShow_Finished(universe: Universe): void
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

export class LeaderboardPlayerScore
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

	static fromPlayerNameAndScore
	(
		playerName: string, score: number
	): LeaderboardPlayerScore
	{
		return new LeaderboardPlayerScore(playerName, score, null);
	}

	static fromScore(score: number): LeaderboardPlayerScore
	{
		return new LeaderboardPlayerScore("", score, null);
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
