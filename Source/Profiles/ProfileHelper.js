"use strict";
class ProfileHelper {
    constructor(storageHelper) {
        this.storageHelper = storageHelper;
        this.propertyName = "Profiles";
    }
    profileAdd(profile) {
        var profiles = this.profiles();
        profiles.push(profile);
        this.storageHelper.save(this.propertyName, profiles);
    }
    ;
    profileDelete(profileToDelete) {
        var profiles = this.profiles();
        var profileExisting = profiles.filter(x => x.name == profileToDelete.name)[0];
        if (profileExisting != null) {
            ArrayHelper.remove(profiles, profileExisting);
        }
        this.storageHelper.save(this.propertyName, profiles);
    }
    ;
    profileSave(profileToSave) {
        var wasSaveSuccessful;
        try {
            var profiles = this.profiles();
            var profileExisting = profiles.filter(x => x.name == profileToSave.name)[0];
            if (profileExisting != null) {
                ArrayHelper.remove(profiles, profileExisting);
            }
            profiles.push(profileToSave);
            this.storageHelper.save(this.propertyName, profiles);
            wasSaveSuccessful = true;
        }
        catch (err) {
            console.log("Error attempting save:" + err);
            wasSaveSuccessful = false;
        }
        return wasSaveSuccessful;
    }
    ;
    profiles() {
        var profiles = null;
        try {
            profiles = this.storageHelper.load(this.propertyName);
        }
        catch (ex) {
            console.log("Deserialization of previously saved profiles failed, so they will be abandoned.");
        }
        if (profiles == null) {
            profiles = [];
            this.storageHelper.save(this.propertyName, profiles);
        }
        return profiles;
    }
    ;
    profilesAllDelete(profileToDelete) {
        this.storageHelper.save(this.propertyName, "");
    }
    ;
}
