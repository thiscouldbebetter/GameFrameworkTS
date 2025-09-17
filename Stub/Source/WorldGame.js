"use strict";
class WorldGame extends World {
    constructor(name) {
        var name = name;
        var timeCreated = DateTime.now();
        var defn = WorldGame.defnBuild();
        var place = new PlaceDefault();
        var places = [place];
        var placesByName = new Map(places.map(x => [x.name, x]));
        var placeGetByName = (placeName) => placesByName.get(placeName);
        var placeInitialName = places[0].name;
        super(name, timeCreated, defn, placeGetByName, placeInitialName);
    }
    static defnBuild() {
        return new WorldDefn([
            [
                UserInputListener.activityDefn()
            ],
            [
                PlaceDefault.defnBuild()
            ]
        ]);
    }
}
