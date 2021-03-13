"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class DisplayRecorder {
            constructor(ticksPerFrame, bufferSizeInFrames, isCircular) {
                this.ticksPerFrame = ticksPerFrame;
                this.bufferSizeInFrames = bufferSizeInFrames;
                this.isCircular = isCircular;
                this.framesRecordedAsArrayBuffers = new Array();
                this.isRecording = false;
                this.shouldDownload = false;
            }
            clear() {
                this.framesRecordedAsArrayBuffers.length = 0;
            }
            frameRecord(display) {
                var recorder = this;
                var framesRecorded = recorder.framesRecordedAsArrayBuffers;
                while (framesRecorded.length >= recorder.bufferSizeInFrames) {
                    framesRecorded.splice(0, 1);
                }
                var displayAsImage = display.toImage();
                var displayAsCanvas = displayAsImage.systemImage;
                displayAsCanvas.toBlob((displayAsBlob) => {
                    var reader = new FileReader();
                    reader.onload = () => {
                        var displayAsArrayBuffer = reader.result;
                        framesRecorded.push(displayAsArrayBuffer);
                    };
                    reader.readAsArrayBuffer(displayAsBlob);
                });
            }
            framesRecordedDownload(universe) {
                var universeName = universe.name.split(" ").join("_");
                var fileNameToSaveAs = universeName + "-Recording.tar";
                var framesRecordedAsTarFile = GameFramework.TarFile.create(fileNameToSaveAs);
                var digitsToPadTo = 6; // 2 hours x 24 frames/second = 172,800 frames.
                var frameCount = this.framesRecordedAsArrayBuffers.length;
                for (var i = 0; i < frameCount; i++) {
                    var frameIndex = i;
                    var frameAsArrayBuffer = this.framesRecordedAsArrayBuffers[frameIndex];
                    if (frameAsArrayBuffer == null) {
                        break;
                    }
                    var frameAsUint8Array = new Uint8Array(frameAsArrayBuffer);
                    var frameAsBytes = [...frameAsUint8Array];
                    var frameIndexPadded = GameFramework.StringHelper.padStart("" + frameIndex, digitsToPadTo, "0");
                    var displayAsTarFileEntry = GameFramework.TarFileEntry.fileNew("Frame" + frameIndexPadded + ".png", frameAsBytes);
                    framesRecordedAsTarFile.entries.push(displayAsTarFileEntry);
                }
                var script = "#!/bin/sh"
                    + "\n\n"
                    + "# The PNG files in this TAR file, once extracted, "
                    + "can then be converted to an animated GIF "
                    + "with ffmpeg, using this command line:"
                    + "\n\n"
                    + "ffmpeg -pattern_type glob -i '*.png' " + universeName + ".gif";
                var scriptAsBytes = GameFramework.ByteHelper.stringUTF8ToBytes(script);
                var scriptAsTarFileEntry = GameFramework.TarFileEntry.fileNew("PngsToGif.sh", scriptAsBytes);
                framesRecordedAsTarFile.entries.push(scriptAsTarFileEntry);
                framesRecordedAsTarFile.downloadAs(fileNameToSaveAs);
            }
            start() {
                this.isRecording = true;
            }
            stop() {
                this.isRecording = false;
            }
            updateForTimerTick(universe) {
                if (this.isRecording && universe.timerHelper.ticksSoFar % this.ticksPerFrame == 0) {
                    this.frameRecord(universe.display);
                    if (this.isCircular == false
                        && this.framesRecordedAsArrayBuffers.length >= this.bufferSizeInFrames) {
                        this.stop();
                    }
                }
            }
        }
        GameFramework.DisplayRecorder = DisplayRecorder;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
