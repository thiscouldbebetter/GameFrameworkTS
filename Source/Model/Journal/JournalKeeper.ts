
namespace ThisCouldBeBetter.GameFramework
{

export class JournalKeeper implements EntityProperty<JournalKeeper>
{
	journal: Journal;

	isJournalEntrySelectedEditable: boolean;
	journalEntrySelected: JournalEntry;
	statusMessage: string;

	constructor(journal: Journal)
	{
		this.journal = journal;
	}

	// Clonable.
	clone(): JournalKeeper { return this; }
	overwriteWith(other: JournalKeeper): JournalKeeper { return this; }

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable

	equals(other: JournalKeeper): boolean { return false; } // todo

	// Controls.

	toControl
	(
		universe: Universe, size: Coords, entityJournalKeeper: Entity,
		venuePrev: Venue, includeTitleAndDoneButton: boolean
	): ControlBase
	{
		var world = universe.world;
		var journalKeeper = entityJournalKeeper.journalKeeper();

		this.statusMessage = "Read and edit journal entries.";

		if (size == null)
		{
			size = universe.display.sizeDefault().clone();
		}

		var sizeBase = new Coords(200, 135, 1);

		var fontHeight = 10;
		var fontHeightSmall = fontHeight * .6;
		var fontHeightLarge = fontHeight * 1.5;

		var fontSmall =
			FontNameAndHeight.fromHeightInPixels(fontHeightSmall);
		var fontLarge =
			FontNameAndHeight.fromHeightInPixels(fontHeightLarge);

		var back = () => universe.venueTransitionTo(venuePrev);

		var buttonSize = Coords.fromXY(20, 10);

		var childControls: ControlBase[] =
		[
			new ControlLabel
			(
				"labelJournalEntries",
				Coords.fromXY(10, 5), // pos
				Coords.fromXY(70, 25), // size
				false, // isTextCenteredHorizontally
				false, // isTextCenteredVertically
				DataBinding.fromContext("Journal Entries:"),
				fontSmall
			),

			new ControlButton
			(
				"buttonEntryNew",
				Coords.fromXY(65, 5), // pos
				Coords.fromXY(30, 8), // size
				"New",
				fontSmall,
				true, // hasBorder,
				DataBinding.fromTrueWithContext(this), // isEnabled
				() =>
				{
					var journal = journalKeeper.journal;
					var entryNew = new JournalEntry
					(
						world.timerTicksSoFar,
						"-", // title
						"", // body
					);
					journal.entries.push(entryNew);
				}, // click
				false // canBeHeldDown
			),

			new ControlList
			(
				"listEntries",
				Coords.fromXY(10, 15), // pos
				Coords.fromXY(85, 110), // size
				DataBinding.fromContextAndGet
				(
					this,
					(c: JournalKeeper) => c.journal.entries
				), // items
				DataBinding.fromGet
				(
					(c: JournalEntry) => c.toString(universe)
				), // bindingForItemText
				fontSmall,
				new DataBinding
				(
					this,
					(c: JournalKeeper) => c.journalEntrySelected,
					(c: JournalKeeper, v: JournalEntry) =>
					{
						c.journalEntrySelected = v;
						c.isJournalEntrySelectedEditable = false;
					}
				), // bindingForItemSelected
				DataBinding.fromGet( (c: JournalEntry) => c ), // bindingForItemValue
				DataBinding.fromTrue(), // isEnabled
				(universe: Universe) => // confirm
				{
					// todo
				},
				null
			),

			new ControlLabel
			(
				"labelEntrySelected",
				Coords.fromXY(105, 5), // pos
				Coords.fromXY(100, 15), // size
				false, // isTextCenteredHorizontally
				false, // isTextCenteredVertically
				DataBinding.fromContext("Entry Selected:"),
				fontSmall
			),

			new ControlButton
			(
				"buttonEntrySelectedEdit",
				Coords.fromXY(146, 5), // pos
				Coords.fromXY(15, 8), // size
				"Lock",
				fontSmall,
				true, // hasBorder,
				DataBinding.fromContextAndGet
				(
					this,
					(c: JournalKeeper) =>
					(
						c.journalEntrySelected != null
						&& c.isJournalEntrySelectedEditable
					)
				), // isEnabled
				() =>
				{
					journalKeeper.isJournalEntrySelectedEditable = false;
				}, // click
				false, // canBeHeldDown
			),

			new ControlButton
			(
				"buttonEntrySelectedEdit",
				Coords.fromXY(164, 5), // pos
				Coords.fromXY(15, 8), // size
				"Edit",
				fontSmall,
				true, // hasBorder,
				DataBinding.fromContextAndGet
				(
					this,
					(c: JournalKeeper) =>
					(
						c.journalEntrySelected != null
						&& c.isJournalEntrySelectedEditable == false
					)
				), // isEnabled
				() =>
				{
					journalKeeper.isJournalEntrySelectedEditable = true;
				}, // click
				false, // canBeHeldDown
			),

			new ControlButton
			(
				"buttonEntrySelectedDelete",
				Coords.fromXY(182, 5), // pos
				Coords.fromXY(8, 8), // size
				"X",
				fontSmall,
				true, // hasBorder,
				DataBinding.fromContextAndGet
				(
					this,
					(c: JournalKeeper) => (c.journalEntrySelected != null)
				), // isEnabled
				() =>
				{
					var controlConfirm = universe.controlBuilder.confirmAndReturnToVenue
					(
						universe,
						universe.display.sizeInPixels, // size
						"Are you sure you want to delete this entry?",
						universe.venueCurrent(),
						() => // confirm
						{
							var journal = journalKeeper.journal;
							var entryToDelete = journalKeeper.journalEntrySelected;
							ArrayHelper.remove(journal.entries, entryToDelete);
							journalKeeper.journalEntrySelected = null;
						},
						null // cancel
					);

					var venueNext = controlConfirm.toVenue();
					universe.venueTransitionTo(venueNext);

				}, // click
				false // canBeHeldDown
			),

			new ControlLabel
			(
				"labelEntrySelectedTimeRecorded",
				Coords.fromXY(105, 15), // pos
				Coords.fromXY(100, 15), // size
				false, // isTextCenteredHorizontally
				false, // isTextCenteredVertically
				DataBinding.fromContext("Time Recorded:"),
				fontSmall
			),

			new ControlLabel
			(
				"labelEntrySelectedTimeRecorded",
				Coords.fromXY(145, 15), // pos
				Coords.fromXY(100, 15), // size
				false, // isTextCenteredHorizontally
				false, // isTextCenteredVertically
				DataBinding.fromContextAndGet
				(
					this,
					(c: JournalKeeper) =>
					{
						var entry = c.journalEntrySelected;
						return (entry == null ? "-" : entry.timeRecordedAsStringH_M_S(universe));
					}
				),
				fontSmall
			),

			new ControlTextBox
			(
				"textTitle",
				Coords.fromXY(105, 25), // pos
				Coords.fromXY(85, 10), // size
				new DataBinding
				(
					this,
					(c: JournalKeeper) =>
					{
						var j = c.journalEntrySelected;
						return (j == null ? "" : j.title);
					},
					(c: JournalKeeper, v: string) =>
					{
						var journalEntry = c.journalEntrySelected;
						if (journalEntry != null)
						{
							journalEntry.title = v;
						}
					}
				), // text
				fontSmall,
				32, // charCountMax
				DataBinding.fromContextAndGet
				(
					this,
					(c: JournalKeeper) =>
						(c.journalEntrySelected != null && c.isJournalEntrySelectedEditable)
				) // isEnabled
			),

			new ControlTextarea
			(
				"textareaEntryBody",
				Coords.fromXY(105, 40), // pos
				Coords.fromXY(85, 70), // size
				new DataBinding
				(
					this,
					(c: JournalKeeper) =>
					{
						var j = c.journalEntrySelected;
						return (j == null ? "" : j.body);
					},
					(c: JournalKeeper, v: string) =>
					{
						var journalEntry = c.journalEntrySelected;
						if (journalEntry != null)
						{
							journalEntry.body = v;
						}
					}
				), // text
				fontSmall,
				DataBinding.fromContextAndGet
				(
					this,
					(c: JournalKeeper) =>
						(c.journalEntrySelected != null && c.isJournalEntrySelectedEditable)
				) // isEnabled
			),

			new ControlLabel
			(
				"infoStatus",
				Coords.fromXY(150, 120), // pos
				Coords.fromXY(200, 15), // size
				true, // isTextCenteredHorizontally
				false, // isTextCenteredVertically
				DataBinding.fromContextAndGet
				(
					this,
					(c: JournalKeeper) =>
					{
						return c.statusMessage;
					}
				), // text
				fontSmall
			)
		];

		var returnValue = new ControlContainer
		(
			"Notes",
			Coords.create(), // pos
			sizeBase.clone(), // size
			childControls,
			[
				new Action("Back", back),
			],

			[
				new ActionToInputsMapping( "Back", [ Input.Names().Escape ], true ),
			]
		);

		if (includeTitleAndDoneButton)
		{
			childControls.splice
			(
				0, // indexToInsertAt
				0,
				new ControlLabel
				(
					"labelTitle",
					Coords.fromXY(100, -5), // pos
					Coords.fromXY(100, 25), // size
					true, // isTextCenteredHorizontally
					false, // isTextCenteredVertically
					DataBinding.fromContext("Journal"),
					fontLarge
				)
			);
			childControls.push
			(
				ControlButton.from8
				(
					"buttonDone",
					Coords.fromXY(170, 115), // pos
					buttonSize.clone(),
					"Done",
					fontSmall,
					true, // hasBorder
					DataBinding.fromTrue(), // isEnabled
					back // click
				)
			);
			var titleHeight = Coords.fromXY(0, 15);
			sizeBase.add(titleHeight);
			returnValue.size.add(titleHeight);
			returnValue.shiftChildPositions(titleHeight);
		}

		var scaleMultiplier = size.clone().divide(sizeBase);
		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	}

}

}
