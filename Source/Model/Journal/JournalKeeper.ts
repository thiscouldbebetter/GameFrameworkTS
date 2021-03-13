
namespace ThisCouldBeBetter.GameFramework
{

export class JournalKeeper extends EntityProperty
{
	journal: Journal;

	isJournalEntrySelectedEditable: boolean;
	journalEntrySelected: JournalEntry;
	statusMessage: string;

	constructor(journal: Journal)
	{
		super();
		this.journal = journal;
	}

	// Controls.

	toControl
	(
		universe: Universe, size: Coords, entityJournalKeeper: Entity,
		venuePrev: Venue, includeTitleAndDoneButton: boolean
	)
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

		var back = () =>
		{
			var venueNext = venuePrev;
			venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null) as Venue;
			universe.venueNext = venueNext;
		};

		var buttonSize = new Coords(20, 10, 0);

		var childControls: ControlBase[] =
		[
			new ControlLabel
			(
				"labelJournalEntries",
				new Coords(10, 5, 0), // pos
				new Coords(70, 25, 0), // size
				false, // isTextCentered
				"Journal Entries:",
				fontHeightSmall
			),

			new ControlButton
			(
				"buttonEntryNew",
				new Coords(65, 5, 0), // pos
				new Coords(30, 8, 0), // size
				"New",
				fontHeightSmall,
				true, // hasBorder,
				new DataBinding
				(
					this,
					(c: JournalKeeper) => true, // todo
					null
				), // isEnabled
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
				null, // context
				false, // canBeHeldDown
			),

			new ControlList
			(
				"listEntries",
				new Coords(10, 15, 0), // pos
				new Coords(85, 110, 0), // size
				new DataBinding(this.journal.entries, null, null), // items
				new DataBinding
				(
					null,
					(c: JournalEntry) => c.toString(universe),
					null
				), // bindingForItemText
				fontHeightSmall,
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
				DataBinding.fromGet( (c: Entity) => c ), // bindingForItemValue
				DataBinding.fromContext(true), // isEnabled
				(universe: Universe) => // confirm
				{
					// todo
				},
				null
			),

			new ControlLabel
			(
				"labelEntrySelected",
				new Coords(105, 5, 0), // pos
				new Coords(100, 15, 0), // size
				false, // isTextCentered
				"Entry Selected:",
				fontHeightSmall
			),

			new ControlButton
			(
				"buttonEntrySelectedEdit",
				new Coords(146, 5, 0), // pos
				new Coords(15, 8, 0), // size
				"Lock",
				fontHeightSmall,
				true, // hasBorder,
				new DataBinding
				(
					this,
					(c: JournalKeeper) =>
					(
						c.journalEntrySelected != null
						&& c.isJournalEntrySelectedEditable
					),
					null
				), // isEnabled
				() =>
				{
					journalKeeper.isJournalEntrySelectedEditable = false;
				}, // click
				null, // context
				false, // canBeHeldDown
			),

			new ControlButton
			(
				"buttonEntrySelectedEdit",
				new Coords(164, 5, 0), // pos
				new Coords(15, 8, 0), // size
				"Edit",
				fontHeightSmall,
				true, // hasBorder,
				new DataBinding
				(
					this,
					(c: JournalKeeper) =>
					(
						c.journalEntrySelected != null
						&& c.isJournalEntrySelectedEditable == false
					),
					null
				), // isEnabled
				() =>
				{
					journalKeeper.isJournalEntrySelectedEditable = true;
				}, // click
				null, // context
				false, // canBeHeldDown
			),

			new ControlButton
			(
				"buttonEntrySelectedDelete",
				new Coords(182, 5, 0), // pos
				new Coords(8, 8, 0), // size
				"X",
				fontHeightSmall,
				true, // hasBorder,
				new DataBinding
				(
					this,
					(c: JournalKeeper) => c.journalEntrySelected != null, // todo
					null
				), // isEnabled
				() =>
				{
					var controlConfirm = universe.controlBuilder.confirmAndReturnToVenue
					(
						universe,
						universe.display.sizeInPixels, // size
						"Are you sure you want to delete this entry?",
						universe.venueCurrent,
						() => // confirm
						{
							var journal = journalKeeper.journal;
							var entryToDelete = journalKeeper.journalEntrySelected;
							ArrayHelper.remove(journal.entries, entryToDelete);
							journalKeeper.journalEntrySelected = null;
						},
						null // cancel
					);

					var venueNext: Venue = new VenueControls(controlConfirm, false);
					venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
					universe.venueNext = venueNext;

				}, // click
				null, // context
				false // canBeHeldDown
			),

			new ControlLabel
			(
				"labelEntrySelectedTimeRecorded",
				new Coords(105, 15, 0), // pos
				new Coords(100, 15, 0), // size
				false, // isTextCentered
				new DataBinding
				(
					"Time Recorded:", null, null
				),
				fontHeightSmall
			),

			new ControlLabel
			(
				"labelEntrySelectedTimeRecorded",
				new Coords(145, 15, 0), // pos
				new Coords(100, 15, 0), // size
				false, // isTextCentered
				new DataBinding
				(
					this,
					(c: JournalKeeper) =>
					{
						var entry = c.journalEntrySelected;
						return (entry == null ? "-" : entry.timeRecordedAsStringH_M_S(universe));
					},
					null
				),
				fontHeightSmall
			),

			new ControlTextBox
			(
				"textTitle",
				new Coords(105, 25, 0), // pos
				new Coords(85, 10, 0), // size
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
				fontHeightSmall,
				32, // charCountMax
				new DataBinding
				(
					this,
					(c: JournalKeeper) => 
						(c.journalEntrySelected != null && c.isJournalEntrySelectedEditable),
					null
				) // isEnabled
			),

			new ControlTextarea
			(
				"textareaEntryBody",
				new Coords(105, 40, 0), // pos
				new Coords(85, 70, 0), // size
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
				fontHeightSmall,
				new DataBinding
				(
					this,
					(c: JournalKeeper) => 
					{
						return (c.journalEntrySelected != null && c.isJournalEntrySelectedEditable);
					},
					null
				) // isEnabled
			),

			new ControlLabel
			(
				"infoStatus",
				new Coords(150, 120, 0), // pos
				new Coords(200, 15, 0), // size
				true, // isTextCentered
				new DataBinding
				(
					this,
					(c: JournalKeeper) =>
					{
						return c.statusMessage;
					},
					null
				), // text
				fontHeightSmall
			)
		];

		var returnValue = new ControlContainer
		(
			"Notes",
			new Coords(0, 0, 0), // pos
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
					new Coords(100, -5, 0), // pos
					new Coords(100, 25, 0), // size
					true, // isTextCentered
					"Journal",
					fontHeightLarge
				)
			);
			childControls.push
			(
				new ControlButton
				(
					"buttonDone",
					new Coords(170, 115, 0), // pos
					buttonSize.clone(),
					"Done",
					fontHeightSmall,
					true, // hasBorder
					true, // isEnabled
					back, // click
					null, null
				)
			);
			var titleHeight = new Coords(0, 15, 0);
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
