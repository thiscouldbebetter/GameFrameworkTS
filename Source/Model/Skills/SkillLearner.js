"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class SkillLearner {
            constructor(skillBeingLearnedName, learningAccumulated, skillsKnownNames) {
                this.skillBeingLearnedName = skillBeingLearnedName;
                this.learningAccumulated = learningAccumulated || 0;
                this.skillsKnownNames = skillsKnownNames || [];
            }
            static default() {
                return new SkillLearner(null, null, null);
            }
            static of(entity) {
                return entity.propertyByName(SkillLearner.name);
            }
            isLearningInProgress() {
                return (this.learningAccumulated > 0);
            }
            isSkillBeingLearned() {
                return (this.skillBeingLearnedName != null);
            }
            skillCheapestAvailable(skillsAll) {
                var skillCheapest = null;
                var skillsAvailable = this.skillsAvailableToLearn(skillsAll);
                if (skillsAvailable.length > 0) {
                    skillCheapest = skillsAvailable.sort((x, y) => x.learningRequired - y.learningRequired)[0];
                }
                return skillCheapest;
            }
            learningIncrement(skillsAll, skillsByName, amountToIncrement) {
                var message = null;
                var skillBeingLearned = this.skillBeingLearned(skillsByName);
                if (skillBeingLearned == null) {
                    var skillCheapest = this.skillCheapestAvailable(skillsAll);
                    if (skillCheapest != null) {
                        skillBeingLearned = skillCheapest;
                        this.skillBeingLearnedName = skillCheapest.name;
                        message = "Now learning '" + this.skillBeingLearnedName + "'.";
                    }
                }
                if (skillBeingLearned != null) {
                    this.learningAccumulated += amountToIncrement;
                    var learningRequired = skillBeingLearned.learningRequired;
                    if (this.learningAccumulated >= learningRequired) {
                        message = "Learned skill '" + this.skillBeingLearnedName + "'.";
                        this.skillsKnownNames.push(this.skillBeingLearnedName);
                        this.skillBeingLearnedName = null;
                        this.learningAccumulated = 0;
                    }
                }
                this.statusMessage = message;
            }
            learningAccumulatedOverRequired(skillsAllByName) {
                return this.learningAccumulated + "/" + this.learningRequired(skillsAllByName);
            }
            learningRequired(skillsAllByName) {
                var skillBeingLearned = this.skillBeingLearned(skillsAllByName);
                var returnValue = (skillBeingLearned == null
                    ? 0
                    : skillBeingLearned.learningRequired);
                return returnValue;
            }
            skillSelected(skillsAllByName) {
                var returnValue = (this.skillSelectedName == null
                    ? null
                    : skillsAllByName.get(this.skillSelectedName));
                return returnValue;
            }
            skillsAvailableToLearn(skillsAll) {
                var skillsUnknown = [];
                for (var i = 0; i < skillsAll.length; i++) {
                    var skill = skillsAll[i];
                    var skillName = skill.name;
                    var isAlreadyKnown = this.skillsKnownNames.some(x => x == skillName);
                    if (isAlreadyKnown == false) {
                        skillsUnknown.push(skill);
                    }
                }
                var skillsUnknownWithKnownPrerequisites = [];
                for (var i = 0; i < skillsUnknown.length; i++) {
                    var skill = skillsUnknown[i];
                    var prerequisites = skill.namesOfPrerequisiteSkills;
                    var areAllPrerequisitesKnown = true;
                    for (var p = 0; p < prerequisites.length; p++) {
                        var prerequisite = prerequisites[p];
                        var isPrerequisiteKnown = (this.skillsKnownNames.some(x => x == prerequisite));
                        if (isPrerequisiteKnown == false) {
                            areAllPrerequisitesKnown = false;
                            break;
                        }
                    }
                    if (areAllPrerequisitesKnown) {
                        skillsUnknownWithKnownPrerequisites.push(skill);
                    }
                }
                return skillsUnknownWithKnownPrerequisites;
            }
            skillsKnown(skillsAllByName) {
                var returnValues = [];
                for (var i = 0; i < this.skillsKnownNames.length; i++) {
                    var skillName = this.skillsKnownNames[i];
                    var skill = skillsAllByName.get(skillName);
                    returnValues.push(skill);
                }
                return returnValues;
            }
            skillBeingLearned(skillsAllByName) {
                var returnValue = skillsAllByName.get(this.skillBeingLearnedName);
                return returnValue;
            }
            // Clonable.
            clone() { return this; }
            overwriteWith(other) { return this; }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            propertyName() { return SkillLearner.name; }
            updateForTimerTick(uwpe) {
                // Do nothing.
            }
            // Equatable
            equals(other) { return false; } // todo
            // controls
            toControl(universe, size, entity, venueToReturnTo, includeTitle) {
                var display = universe.display;
                //var size = display.sizeInPixels.clone();
                var fontNameAndHeight = display.fontNameAndHeight.clone();
                var labelHeight = fontNameAndHeight.heightInPixels * 1.2;
                var labelFont = GameFramework.FontNameAndHeight.fromHeightInPixels(labelHeight);
                var margin = 20;
                var labelHeightLarge = labelHeight * 2;
                var labelLargeFont = GameFramework.FontNameAndHeight.fromHeightInPixels(labelHeightLarge);
                // var fontHeightInPixels = margin / 2;
                size = size.clone().addDimensions(0, 30, 0); // hack
                var listSize = GameFramework.Coords.fromXY((size.x - margin * 3) / 2, 150);
                var defns = universe.world.defn;
                var skillLearner = this;
                var skillsAll = defns.skills;
                var skillsAllByName = defns.skillsByName;
                var returnValue = GameFramework.ControlContainer.fromNamePosSizeChildren("Skills", // name,
                GameFramework.Coords.create(), // pos,
                size.clone(), 
                // children
                [
                    GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(margin, 40), // pos,
                    GameFramework.Coords.fromXY(size.x - margin * 2, labelHeight), // size,
                    GameFramework.DataBinding.fromContext("Skills Known:"), //text
                    labelFont // fontNameAndHeight
                    ),
                    GameFramework.ControlList.fromNamePosSizeItemsTextFont("listSkillsKnown", GameFramework.Coords.fromXY(margin, 60), // pos
                    listSize, 
                    // items
                    GameFramework.DataBinding.fromContext(this.skillsKnownNames), GameFramework.DataBinding.fromContext(null), // bindingForItemText
                    labelFont // fontNameAndHeight
                    ),
                    GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(size.x - margin - listSize.x, 40), // pos,
                    GameFramework.Coords.fromXY(size.x - margin * 2, labelHeight), // size,
                    GameFramework.DataBinding.fromContext("Skills Available:"), // text
                    labelFont // fontNameAndHeight
                    ),
                    GameFramework.ControlList.from10("listSkillsAvailable", // name,
                    GameFramework.Coords.fromXY(size.x - margin - listSize.x, 60), // pos,
                    listSize, 
                    // items,
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => c.skillsAvailableToLearn(skillsAll)), GameFramework.DataBinding.fromGet((c) => c.name), // bindingForItemText
                    labelFont, // fontNameAndHeight
                    new GameFramework.DataBinding(this, (c) => {
                        return c.skillSelected(skillsAllByName);
                    }, (c, v) => {
                        var skillName = v.name;
                        c.skillSelectedName = skillName;
                    }), // bindingForItemSelected
                    null, // bindingForItemValue
                    GameFramework.DataBinding.fromTrue(), // isEnabled
                    (u) => {
                        skillLearner.skillBeingLearnedName =
                            skillLearner.skillSelectedName;
                    } // confirm
                    ),
                    GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(margin, 220), // pos,
                    GameFramework.Coords.fromXY(size.x - margin * 2, labelHeight), // size,
                    GameFramework.DataBinding.fromContext("Selected:"), // text
                    fontNameAndHeight),
                    GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(80, 220), // pos,
                    GameFramework.Coords.fromXY(size.x - margin * 2, labelHeight), // size,
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => (c.skillSelectedName || "-")), fontNameAndHeight),
                    GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(margin, 232), // pos,
                    GameFramework.Coords.fromXY(size.x - margin * 2, labelHeight), // size,
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => {
                        var skill = c.skillSelected(skillsAllByName);
                        return (skill == null ? "-" : skill.description);
                    }), fontNameAndHeight),
                    GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(margin, size.y - margin - labelHeight * 2), // pos,
                    GameFramework.Coords.fromXY(size.x - margin * 2, labelHeight), // size,
                    GameFramework.DataBinding.fromContext("Skill Being Learned:"), // text
                    fontNameAndHeight),
                    GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(145, size.y - margin - labelHeight * 2), // pos,
                    GameFramework.Coords.fromXY(size.x - margin * 2, labelHeight), // size,
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => {
                        return (c.skillBeingLearnedName || "-");
                    }), fontNameAndHeight),
                    GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(margin, size.y - margin - labelHeight), // pos,
                    GameFramework.Coords.fromXY(size.x - margin * 2, labelHeight), // size,
                    GameFramework.DataBinding.fromContext("Learning Accumulated:"), // text
                    fontNameAndHeight),
                    GameFramework.ControlLabel.fromPosSizeTextFontUncentered(GameFramework.Coords.fromXY(145, size.y - margin - labelHeight), // pos,
                    GameFramework.Coords.fromXY(30, labelHeight), // size,
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => c.learningAccumulatedOverRequired(skillsAllByName)), // text
                    fontNameAndHeight),
                ]);
                if (includeTitle) {
                    returnValue.children.splice(0, // indexToInsertAt
                    0, // elementsToDelete
                    GameFramework.ControlLabel.fromPosSizeTextFontCenteredHorizontally(GameFramework.Coords.fromXY(200, 20), // pos
                    GameFramework.Coords.fromXY(120, 25), // size
                    GameFramework.DataBinding.fromContext("Skills"), labelLargeFont));
                }
                else {
                    var titleHeightInverted = GameFramework.Coords.fromXY(0, -30);
                    returnValue.size.add(titleHeightInverted);
                    returnValue.shiftChildPositions(titleHeightInverted);
                }
                return returnValue;
            }
        }
        GameFramework.SkillLearner = SkillLearner;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
