"use strict";
class JournalEntry {
    constructor(tickRecorded, title, body) {
        this.tickRecorded = tickRecorded;
        this.title = title;
        this.body = body;
    }
    timeRecordedAsStringH_M_S(universe) {
        return universe.timerHelper.ticksToStringH_M_S(this.tickRecorded);
    }
    toString(universe) {
        return universe.timerHelper.ticksToStringHColonMColonS(this.tickRecorded) + " - " + this.title;
    }
}
