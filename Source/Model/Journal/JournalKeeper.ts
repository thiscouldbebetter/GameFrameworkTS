
namespace ThisCouldBeBetter.GameFramework
{

export class JournalKeeper extends EntityPropertyBase<JournalKeeper>
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

	static fromJournal(journal: Journal): JournalKeeper
	{
		return new JournalKeeper(journal);
	}

	static of(entity: Entity): JournalKeeper
	{
		return entity.propertyByName(JournalKeeper.name) as JournalKeeper;
	}

	// Clonable.

	clone(): JournalKeeper { return this; }

	// Controls.

	toControl
	(
		universe: Universe, size: Coords, entityJournalKeeper: Entity,
		venuePrev: Venue, includeTitleAndDoneButton: boolean
	): ControlBase
	{
		var world = universe.world;
		var journalKeeper = JournalKeeper.of(entityJournalKeeper);

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

		var entrySelectedDelete =
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

			};

		var entrySelectedEdit =
			() =>
			{
				journalKeeper.isJournalEntrySelectedEditable = true;
			};

		var entrySelectedLock =
			() =>
			{
				journalKeeper.isJournalEntrySelectedEditable = false;
			};

		var childControls: ControlBase[] =
		[
			ControlLabel.fromPosSizeTextFontUncentered
			(
				Coords.fromXY(10, 5), // pos
				Coords.fromXY(70, 25), // size
				DataBinding.fromContext("Journal Entries:"),
				fontSmall
			),

			ControlButton.fromPosSizeTextFontClick<JournalKeeper>
			(
				Coords.fromXY(65, 5), // pos
				Coords.fromXY(30, 8), // size
				"New",
				fontSmall,
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
			).isEnabledSet
			(
				DataBinding.fromTrueWithContext<JournalKeeper>(this) // Is this necessary?
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

			ControlLabel.fromPosSizeTextFontUncentered
			(
				Coords.fromXY(105, 5), // pos
				Coords.fromXY(100, 15), // size
				DataBinding.fromContext("Entry Selected:"),
				fontSmall
			),

			ControlButton.fromPosSizeTextFontClick<JournalKeeper>
			(
				Coords.fromXY(146, 5), // pos
				Coords.fromXY(15, 8), // size
				"Lock",
				fontSmall,
				entrySelectedLock
			).isEnabledSet
			(
				DataBinding.fromContextAndGet<JournalKeeper, boolean>
				(
					this,
					(c: JournalKeeper) =>
					(
						c.journalEntrySelected != null
						&& c.isJournalEntrySelectedEditable
					)
				)
			),

			ControlButton.fromPosSizeTextFontClick<JournalKeeper>
			(
				Coords.fromXY(164, 5), // pos
				Coords.fromXY(15, 8), // size
				"Edit",
				fontSmall,
				entrySelectedEdit
			).isEnabledSet
			(
				DataBinding.fromContextAndGet<JournalKeeper, boolean>
				(
					this,
					(c: JournalKeeper) =>
					(
						c.journalEntrySelected != null
						&& c.isJournalEntrySelectedEditable == false
					)
				)
			),

			ControlButton.fromPosSizeTextFontClick<JournalKeeper>
			(
				Coords.fromXY(182, 5), // pos
				Coords.fromXY(8, 8), // size
				"X",
				fontSmall,
				entrySelectedDelete
			).isEnabledSet
			(
				DataBinding.fromContextAndGet<JournalKeeper, boolean>
				(
					this,
					(c: JournalKeeper) => (c.journalEntrySelected != null)
				)
			),

			ControlLabel.fromPosSizeTextFontUncentered
			(
				Coords.fromXY(105, 15), // pos
				Coords.fromXY(100, 15), // size
				DataBinding.fromContext("Time Recorded:"),
				fontSmall
			),

			ControlLabel.fromPosSizeTextFontUncentered
			(
				Coords.fromXY(145, 15), // pos
				Coords.fromXY(100, 15), // size
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

			ControlLabel.fromPosSizeTextFontCenteredHorizontally
			(
				Coords.fromXY(150, 120), // pos
				null, // size
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

		var returnValue = ControlContainer.fromNamePosSizeChildrenActionsAndMappings
		(
			"Notes",
			Coords.create(), // pos
			sizeBase.clone(), // size
			childControls,
			[
				Action.fromNameAndPerform("Back", back),
			],

			[
				new ActionToInputsMapping( "Back", [ Input.Instances().Escape.name ], true ),
			]
		);

		if (includeTitleAndDoneButton)
		{
			childControls.splice
			(
				0, // indexToInsertAt
				0,
				ControlLabel.fromPosSizeTextFontCenteredHorizontally
				(
					Coords.fromXY(100, -5), // pos
					Coords.fromXY(100, 25), // size
					DataBinding.fromContext("Journal"),
					fontLarge
				)
			);
			childControls.push
			(
				ControlButton.fromPosSizeTextFontClick
				(
					Coords.fromXY(170, 115), // pos
					buttonSize.clone(),
					"Done",
					fontSmall,
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
