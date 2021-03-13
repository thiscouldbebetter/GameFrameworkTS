
namespace ThisCouldBeBetter.GameFramework
{

export class SoundFromAudioContext
{
	gain: any;
	oscillator: any;

	constructor()
	{
		// todo
	}

	play(universe: Universe, volume: number)
	{
		var a = universe.soundHelper.audioContext();

		if (this.gain == null)
		{
			this.gain = a.createGain();
			this.gain.gain.setValueAtTime(.01, a.currentTime);
			this.gain.connect(a.destination);

			this.oscillator = a.createOscillator();
			this.oscillator.frequency.setValueAtTime(440, a.currentTime);
			this.oscillator.connect(this.gain);
		}

		this.oscillator.start();
		var durationInSeconds = 1;
		this.oscillator.stop(a.currentTime + durationInSeconds);
	}
}

}
