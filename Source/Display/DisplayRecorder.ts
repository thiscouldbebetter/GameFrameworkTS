
namespace ThisCouldBeBetter.GameFramework
{

export class DisplayRecorder
{
	ticksPerFrame: number;
	bufferSizeInFrames: number;
	isCircular: boolean;

	framesRecordedAsArrayBuffers: ArrayBuffer[];
	isRecording: boolean;

	shouldDownload: boolean; // test

	constructor
	(
		ticksPerFrame: number, bufferSizeInFrames: number, isCircular: boolean
	)
	{
		this.ticksPerFrame = ticksPerFrame;
		this.bufferSizeInFrames = bufferSizeInFrames;
		this.isCircular = isCircular;

		this.framesRecordedAsArrayBuffers = new Array<ArrayBuffer>();
		this.isRecording = false;

		this.shouldDownload = false;
	}

	static actionStartStop(): Action
	{
		return new Action
		(
			"Recording Start/Stop", DisplayRecorder.actionStartStopPerform
		)
	}

	static actionStartStopPerform
	(
		uwpe: UniverseWorldPlaceEntities
	): void
	{
		var universe = uwpe.universe;
		var recorder = universe.displayRecorder;
		if (recorder.isRecording)
		{
			recorder.stop();
			recorder.framesRecordedDownload(universe);
		}
		else
		{
			recorder.start();
		}
	}

	clear(): void
	{
		this.framesRecordedAsArrayBuffers.length = 0;
	}

	frameRecord(display: Display): void
	{
		var recorder = this;

		var framesRecorded = recorder.framesRecordedAsArrayBuffers;
		while (framesRecorded.length >= recorder.bufferSizeInFrames)
		{
			framesRecorded.splice(0, 1);
		}

		var displayAsImage = display.toImage();
		var displayAsCanvas = displayAsImage.systemImage;
		displayAsCanvas.toBlob
		(
			(displayAsBlob: any) =>
			{
				var reader = new FileReader();
				reader.onload = () =>
				{
					var displayAsArrayBuffer = reader.result as ArrayBuffer;
					framesRecorded.push
					(
						displayAsArrayBuffer
					);
				};
				reader.readAsArrayBuffer(displayAsBlob);
			}
		);
	}

	framesRecordedDownload(universe: Universe): void
	{
		var universeName = universe.name.split(" ").join("_");
		var fileNameToSaveAs = universeName + "-Recording.tar";

		var framesRecordedAsTarFile = TarFile.create(fileNameToSaveAs);
		var digitsToPadTo = 6; // 2 hours x 24 frames/second = 172,800 frames.

		var frameCount = this.framesRecordedAsArrayBuffers.length;
		for (var i = 0; i < frameCount; i++)
		{
			var frameIndex = i;
			var frameAsArrayBuffer =
				this.framesRecordedAsArrayBuffers[frameIndex];
			if (frameAsArrayBuffer == null)
			{
				break;
			}
			var frameAsUint8Array = new Uint8Array(frameAsArrayBuffer);
			var frameAsBytes = [...frameAsUint8Array];

			var frameIndexPadded =
				StringHelper.padStart("" + frameIndex, digitsToPadTo, "0");
			var displayAsTarFileEntry = TarFileEntry.fileNew
			(
				"Frame" + frameIndexPadded + ".png", frameAsBytes
			);
			framesRecordedAsTarFile.entries.push(displayAsTarFileEntry);
		}

		var script =
			"#!/bin/sh"
			+ "\n\n"
			+ "# The PNG files in this TAR file, once extracted, "
			+ "can then be converted to an animated GIF "
			+ "with ffmpeg, using this command line:"
			+ "\n\n"
			+ "ffmpeg -pattern_type glob -i '*.png' " + universeName + ".gif";
		var scriptAsBytes = ByteHelper.stringUTF8ToBytes(script);
		var scriptAsTarFileEntry =
			TarFileEntry.fileNew("PngsToGif.sh", scriptAsBytes);
		framesRecordedAsTarFile.entries.push(scriptAsTarFileEntry);

		framesRecordedAsTarFile.downloadAs(fileNameToSaveAs);
	}

	logStartOrStop(): void
	{
		var startedOrStoppedText =
			(this.isRecording ? "started" : "stopped");

		var logMessage =
			DisplayRecorder.name + " " + startedOrStoppedText
			+ ", ticksPerFrame: " + this.ticksPerFrame
			+ ", bufferSizeInFrames:" + this.bufferSizeInFrames
			+ ", isCircular: " + this.isCircular;

		console.log(logMessage);
	}

	start(): void
	{
		this.isRecording = true;
		this.logStartOrStop();
	}

	stop(): void
	{
		this.isRecording = false;
		this.logStartOrStop();
	}

	updateForTimerTick(universe: Universe): void
	{
		if (this.isRecording && universe.timerHelper.ticksSoFar % this.ticksPerFrame == 0)
		{
			this.frameRecord(universe.display);
			if
			(
				this.isCircular == false
				&& this.framesRecordedAsArrayBuffers.length >= this.bufferSizeInFrames
			)
			{
				this.stop();
			}
		}
	}
}

}
