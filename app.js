(function(AudioContext) {
	AudioContext.prototype.createWhiteNoise = function(bufferSize) {
		bufferSize = bufferSize || 4096;
		var node = this.createScriptProcessor(bufferSize, 1, 1);
		node.onaudioprocess = function(e) {
			var output = e.outputBuffer.getChannelData(0);
			for (var i = 0; i < bufferSize; i++) {
				output[i] = Math.random() * 2 - 1;
			}
		}
		return node;
	};

	AudioContext.prototype.createBrownNoise = function(bufferSize) {
		bufferSize = bufferSize || 4096;
		var lastOut = 0.0;
		var node = this.createScriptProcessor(bufferSize, 1, 1);
		node.onaudioprocess = function(e) {
			var output = e.outputBuffer.getChannelData(0);
			for (var i = 0; i < bufferSize; i++) {
				var white = Math.random() * 2 - 1;
				output[i] = (lastOut + (0.02 * white)) / 1.02;
				lastOut = output[i];
				output[i] *= 3.5; // (roughly) compensate for gain 3.5
			}
		}
		return node;
	};
})(window.AudioContext || window.webkitAudioContext);

const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;
let instrGain;
const snare = document.querySelector('#snare');
const kick = document.querySelector('#kick');

snare.addEventListener('click', function() {
	init();

	instrGain.gain.value = 5;
	window.setTimeout(function() {
		instrGain.gain.value = 0;
	}, 150);
});

kick.addEventListener('click', function() {
	init();

	instrGain.gain.value = 5;
	window.setTimeout(function() {
		instrGain.gain.value = 0;
	}, 150);
})

function init() {
	audioCtx = new AudioContext();

	var noise = audioCtx.createBrownNoise();
	instrGain = audioCtx.createGain();
	instrGain.gain.value = 0;
	noise.connect(instrGain);
	instrGain.connect(audioCtx.destination);
}

