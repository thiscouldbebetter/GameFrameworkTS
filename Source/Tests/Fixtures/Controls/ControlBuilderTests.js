"use strict";
class ControlBuilderTests extends TestFixture {
    constructor() {
        super(ControlBuilderTests.name);
        var fixture = this;
        new EnvironmentMock().universeCreate(universe => {
            fixture._universe = universe;
            fixture._controlBuilder = universe.controlBuilder;
        });
    }
    tests() {
        var testRuns = [
            //this.styleByName,
            //this.styleDefault,
            this.choice,
            this.choiceList,
            this.confirm,
            this.confirmAndReturnToVenue,
            this.game,
            this.gameAndSettings,
            this.gameAndSettings1,
            this.inputs,
            this.opening,
            this.settings,
            this.title,
            this.worldDetail,
            this.worldLoad
        ];
        var tests = testRuns.map(x => Test.fromRun(x));
        return tests;
    }
    // Tests.
    styleByName() {
        var styleName = "Default";
        var style = this._controlBuilder.styleByName(styleName);
        Assert.isNotNull(style);
    }
    styleDefault() {
        var style = this._controlBuilder.styleDefault();
        Assert.isNotNull(style);
    }
    // Controls.
    choice() {
        var controlChoice = this._controlBuilder.choice(this._universe, null, // size,
        DataBinding.fromContext("[message]"), ["[option1]", "[option2]"], // optionNames
        [() => { }, () => { }], // optionFunctions
        true, // acknowledgeButtonSuppressed
        false, // backgroundIsTransparent
        FontNameAndHeight.default(), null, // buttonPosY
        60 // secondsToShow
        );
        Assert.isNotNull(controlChoice);
    }
    choiceList() {
        var controlChoiceList = this._controlBuilder.choiceList(this._universe, null, // size
        "[message]", DataBinding.fromContext([
            "[option1]", "[option2]"
        ]), // options
        DataBinding.fromGet((c) => c), "[buttonSelectText]", (u, optionSelected) => { } // select
        );
        Assert.isNotNull(controlChoiceList);
    }
    confirm() {
        var controlConfirm = this._controlBuilder.confirm(this._universe, null, // size
        "[message]", () => { }, // confirm
        () => { } // cancel
        );
        Assert.isNotNull(controlConfirm);
    }
    confirmAndReturnToVenue() {
        var controlConfirm = this._controlBuilder.confirm(this._universe, null, // size
        "[message]", () => { }, // confirm
        () => { } // cancel
        );
        Assert.isNotNull(controlConfirm);
    }
    game() {
        var controlGame = this._controlBuilder.game(this._universe, null, // size
        null // venuePrev
        );
        Assert.isNotNull(controlGame);
    }
    gameAndSettings() {
        var controlGameAndSettings = this._controlBuilder.gameAndSettings(this._universe, null, // size
        null, // venuePrev
        true // includeResumeButton
        );
        Assert.isNotNull(controlGameAndSettings);
    }
    gameAndSettings1() {
        var controlGameAndSettings = this._controlBuilder.gameAndSettings1(this._universe);
        Assert.isNotNull(controlGameAndSettings);
    }
    inputs() {
        var controlInputs = this._controlBuilder.inputs(this._universe, null, // size
        null // venuePrev
        );
        Assert.isNotNull(controlInputs);
    }
    message() {
        var controlMessage = this._controlBuilder.message(this._universe, null, // size
        DataBinding.fromContext("[message]"), () => { }, // acknowledge
        false, // acknowledgeButtonSuppressed
        false, // backgroundIsTransparent
        FontNameAndHeight.default(), 60 // secondsToShow
        );
        Assert.isNotNull(controlMessage);
    }
    opening() {
        var controlOpening = this._controlBuilder.opening(this._universe, null // size
        );
        Assert.isNotNull(controlOpening);
    }
    settings() {
        var controlSettings = this._controlBuilder.settingsForVideoSoundAndInput(this._universe, null, // size
        null);
        Assert.isNotNull(controlSettings);
    }
    title() {
        var controlTitle = this._controlBuilder.titleAsControl(this._universe, null // size
        );
        Assert.isNotNull(controlTitle);
    }
    worldDetail() {
        var controlWorldDetail = this._controlBuilder.worldDetail(this._universe, null, // size
        null // venuePrev
        );
        Assert.isNotNull(controlWorldDetail);
    }
    worldLoad() {
        var controlWorldLoad = this._controlBuilder.worldLoad(this._universe, null // size
        );
        Assert.isNotNull(controlWorldLoad);
    }
}
