

namespace ThisCouldBeBetter.GameFramework
{

export class Leaderboard
{
	playerScoresCount: number;
	playerScores: LeaderboardPlayerScore[];

	playerScoreBeingEntered: LeaderboardPlayerScore;
	cursorOffsetInChars: number;

	constructor
	(
		playerScoresCount: number,
		playerScores: LeaderboardPlayerScore[]
	)
	{
		this.playerScoresCount = playerScoresCount || 10;
		this.playerScores = playerScores || [];

		this.playerScoreBeingEntered = null;
		this.cursorOffsetInChars = 0;
	}

	static create(): Leaderboard
	{
		return new Leaderboard(null, null);
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

		return new Leaderboard(playerScoresFake.length, playerScoresFake);
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

	scoreInsert(scoreToInsert: number): void
	{
		this.playerScoreBeingEntered = null;

		for (var i = 0; i < this.playerScores.length; i++)
		{
			var playerScoreExisting = this.playerScores[i].score;
			if (scoreToInsert > playerScoreExisting)
			{
				var playerScoreToInsert =
					LeaderboardPlayerScore.fromScore(scoreToInsert);
				this.playerScores.splice(i, 0, playerScoreToInsert);
				this.playerScores.length = this.playerScoresCount;
				this.playerScoreBeingEntered = playerScoreToInsert;
				this.cursorOffsetInChars = 0;
				break;
			}
		}
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

		/*
		var fontHeight = fontNameAndHeight.heightInPixels;

		var controlTextBox =
			ControlTextBox.fromPosSizeAndTextImmediate
			(
				Coords.fromXY(0, 0),
				Coords.fromXY(100, fontHeight * 2),
				""
			).charsMaxSet(3);
		controlLeaderboard.childAdd(controlTextBox);
		*/

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

	static toControlGetInitials(uwpe: UniverseWorldPlaceEntities): ControlBase
	{
		var universe = uwpe.universe;

		 var size = universe.display.sizeDefault().clone();

		var controlBuilder = universe.controlBuilder;
		var sizeBase = controlBuilder.sizeBase;
		var scaleMultiplier = size.clone().divide(sizeBase);
		var fontNameAndHeight = controlBuilder.fontBase;
		var buttonHeightBase = controlBuilder.buttonHeightBase;

		var controls =
		[
			ControlLabel.fromPosSizeTextFontCentered
			(
				Coords.fromXY(50, 15), // pos
				Coords.fromXY(100, 15), // size
				DataBinding.fromContext("Your Score:"),
				fontNameAndHeight
			),

			ControlLabel.fromPosSizeTextFontCentered
			(
				Coords.fromXY(50, 35), // pos
				Coords.fromXY(100, 15), // size
				DataBinding.fromContext("Enter your initials:"),
				fontNameAndHeight
			),

			ControlTextBox.fromNamePosSizeAndTextBinding
			(
				"textBoxInitials",
				Coords.fromXY(50, 50), // pos
				Coords.fromXY(100, 20), // size
				DataBinding.fromContextGetAndSet
				(
					universe.profile,
					(c: Profile) => c.name,
					(c: Profile, v: string) => c.name = v
				)
			).charsMaxSet(3),

			ControlButton.fromPosSizeTextFontClick<Profile>
			(
				Coords.fromXY(50, 80), // pos
				Coords.fromXY(45, buttonHeightBase), // size
				"Submit",
				fontNameAndHeight,
				() => this.toControlGetInitials_Submit(uwpe)
			).isEnabledSet
			(
				DataBinding.fromContextAndGet
				(
					universe.profile,
					(c: Profile) => { return c.name.length > 0; }
				),
			)
		];

		var returnValue = ControlContainer.fromNamePosSizeAndChildren
		(
			"containerProfileNew",
			Coords.zeroes(), // pos
			sizeBase.clone(), // size
			controls
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	}

	static toControlGetInitials_Submit(uwpe: UniverseWorldPlaceEntities): void
	{
		var universe = uwpe.universe;

		var venueControls = universe.venueCurrent() as VenueControls;
		var controlRootAsContainer = venueControls.controlRoot as ControlContainer;
		var textBoxName =
			controlRootAsContainer.childByName("textBoxInitials") as ControlTextBox<any>;
		var profileName = textBoxName.text();
		if (profileName == "")
		{
			return;
		}

		var storageHelper = universe.storageHelper;

		var profile = new Profile(profileName, []);
		var profileNames = storageHelper.load<string[]>(Profile.StorageKeyProfileNames);
		if (profileNames == null)
		{
			profileNames = [];
		}
		profileNames.push(profileName);
		storageHelper.save(Profile.StorageKeyProfileNames, profileNames);
		storageHelper.save(profileName, profile);

		universe.profileSet(profile);
		var venueNext: Venue = Profile.toControlSaveStateLoad
		(
			universe, null, universe.venueCurrent()
		).toVenue();
		universe.venueTransitionTo(venueNext);
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
		return new LeaderboardPlayerScore("---", score, null);
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
