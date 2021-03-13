"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class SkillLearner extends GameFramework.EntityProperty {
            constructor(skillBeingLearnedName, learningAccumulated, skillsKnownNames) {
                super();
                this.skillBeingLearnedName = skillBeingLearnedName;
                this.learningAccumulated = learningAccumulated || 0;
                this.skillsKnownNames = skillsKnownNames || [];
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
                return message;
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
            ;
            skillSelected(skillsAllByName) {
                return (this.skillSelectedName == null ? null : skillsAllByName.get(this.skillSelectedName));
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
            // entity
            updateForTimerTick(universe, world, place, entity) {
                // Do nothing.
            }
            // controls
            toControl(universe, size, entity, venueToReturnTo, includeTitle) {
                var display = universe.display;
                //var size = display.sizeInPixels.clone();
                var labelHeight = display.fontHeightInPixels * 1.2;
                var margin = 20;
                var labelHeightLarge = labelHeight * 2;
                size = size.clone().add(new GameFramework.Coords(0, 30, 0)); // hack
                var listSize = new GameFramework.Coords((size.x - margin * 3) / 2, 150, 0);
                var defns = universe.world.defn;
                var skillLearner = this;
                var skillsAll = defns.defnArraysByTypeName.get(GameFramework.Skill.name); // todo - Just use the -ByName lookup.
                var skillsAllByName = defns.defnsByNameByTypeName.get(GameFramework.Skill.name);
                var returnValue = new GameFramework.ControlContainer("Skills", // name,
                new GameFramework.Coords(0, 0, 0), // pos,
                size.clone(), 
                // children
                [
                    new GameFramework.ControlLabel("labelSkillsKnown", // name,
                    new GameFramework.Coords(margin, 40, 0), // pos,
                    new GameFramework.Coords(size.x - margin * 2, labelHeight, 0), // size,
                    false, // isTextCentered,
                    "Skills Known:", //text
                    labelHeight // fontHeightInPixels
                    ),
                    new GameFramework.ControlList("listSkillsKnown", new GameFramework.Coords(margin, 60, 0), // pos
                    listSize, 
                    // items
                    new GameFramework.DataBinding(this.skillsKnownNames, null, null), new GameFramework.DataBinding(null, null, null), // bindingForItemText
                    labelHeight, // fontHeightInPixels
                    null, null, GameFramework.DataBinding.fromContext(true), // isEnabled
                    null, null),
                    new GameFramework.ControlLabel("labelSkillsAvailable", // name,
                    new GameFramework.Coords(size.x - margin - listSize.x, 40, 0), // pos,
                    new GameFramework.Coords(size.x - margin * 2, labelHeight, 0), // size,
                    false, // isTextCentered,
                    new GameFramework.DataBinding("Skills Available:", null, null), // text
                    labelHeight // fontHeightInPixels
                    ),
                    new GameFramework.ControlList("listSkillsAvailable", // name,
                    new GameFramework.Coords(size.x - margin - listSize.x, 60, 0), // pos,
                    listSize, 
                    // items,
                    new GameFramework.DataBinding(this, (c) => {
                        return c.skillsAvailableToLearn(skillsAll);
                    }, null), new GameFramework.DataBinding(null, (c) => c.name, null), // bindingForItemText
                    labelHeight, // fontHeightInPixels
                    new GameFramework.DataBinding(this, (c) => {
                        return c.skillSelected(skillsAllByName);
                    }, (c, v) => {
                        var skillName = v.name;
                        c.skillSelectedName = skillName;
                    }), // bindingForItemSelected
                    null, // bindingForItemValue
                    GameFramework.DataBinding.fromContext(true), // isEnabled
                    (u) => {
                        skillLearner.skillBeingLearnedName =
                            skillLearner.skillSelectedName;
                    }, // confirm
                    null),
                    new GameFramework.ControlLabel("labelSkillSelected", // name,
                    new GameFramework.Coords(margin, 220, 0), // pos,
                    new GameFramework.Coords(size.x - margin * 2, labelHeight, 0), // size,
                    false, // isTextCentered,
                    "Selected:", // text
                    null),
                    new GameFramework.ControlLabel("labelSkillSelected", // name,
                    new GameFramework.Coords(80, 220, 0), // pos,
                    new GameFramework.Coords(size.x - margin * 2, labelHeight, 0), // size,
                    false, // isTextCentered,
                    new GameFramework.DataBinding(this, (c) => (c.skillSelectedName || "-"), null), null),
                    new GameFramework.ControlLabel("labelSkillSelectedDescription", // name,
                    new GameFramework.Coords(margin, 232, 0), // pos,
                    new GameFramework.Coords(size.x - margin * 2, labelHeight, 0), // size,
                    false, // isTextCentered,
                    new GameFramework.DataBinding(this, (c) => {
                        var skill = c.skillSelected(skillsAllByName);
                        return (skill == null ? "-" : skill.description);
                    }, null), null),
                    new GameFramework.ControlLabel("labelSkillBeingLearned", // name,
                    new GameFramework.Coords(margin, size.y - margin - labelHeight * 2, 0), // pos,
                    new GameFramework.Coords(size.x - margin * 2, labelHeight, 0), // size,
                    false, // isTextCentered,
                    "Skill Being Learned:", // text
                    null),
                    new GameFramework.ControlLabel("textSkillBeingLearned", // name,
                    new GameFramework.Coords(145, size.y - margin - labelHeight * 2, 0), // pos,
                    new GameFramework.Coords(size.x - margin * 2, labelHeight, 0), // size,
                    false, // isTextCentered,
                    new GameFramework.DataBinding(this, (c) => {
                        return (c.skillBeingLearnedName || "-");
                    }, null), null),
                    new GameFramework.ControlLabel("labelLearningAccumulated", // name,
                    new GameFramework.Coords(margin, size.y - margin - labelHeight, 0), // pos,
                    new GameFramework.Coords(size.x - margin * 2, labelHeight, 0), // size,
                    false, // isTextCentered,
                    "Learning Accumulated:", // text
                    null),
                    new GameFramework.ControlLabel("textLearningAccumulated", // name,
                    new GameFramework.Coords(145, size.y - margin - labelHeight, 0), // pos,
                    new GameFramework.Coords(30, labelHeight, 0), // size,
                    false, // isTextCentered,
                    new GameFramework.DataBinding(this, (c) => c.learningAccumulatedOverRequired(skillsAllByName), null), // text
                    null),
                ], null, null);
                if (includeTitle) {
                    returnValue.children.splice(0, 0, new GameFramework.ControlLabel("labelSkills", new GameFramework.Coords(200, 20, 0), // pos
                    new GameFramework.Coords(120, 25, 0), // size
                    true, // isTextCentered
                    "Skills", labelHeightLarge));
                }
                else {
                    var titleHeightInverted = new GameFramework.Coords(0, -30, 0);
                    returnValue.size.add(titleHeightInverted);
                    returnValue.shiftChildPositions(titleHeightInverted);
                }
                return returnValue;
            }
        }
        GameFramework.SkillLearner = SkillLearner;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
