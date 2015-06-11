/**
 * Created by DrTone on 14/05/2015.
 */


var audio_context, recorder, recording = false;
var linkNumber = 0;
var audioClips = [];

function __log(e, data) {
    log.innerHTML += "\n" + e + " " + (data || '');
}

var videoPlayer = (function() {
    var player;
    var numVideos = sessionStorage.getItem('numVideos');
    var currentVideo = 0;
    var checkInterval = 500;
    var videoTitle;
    var videoSource;
    var videoTimer;

    return {
        init: function(videoId) {
            player = document.getElementById(videoId);
            for(currentVideo= 0; currentVideo<numVideos; ++currentVideo) {
                videoTitle = sessionStorage.getItem('space'+currentVideo);
                if(videoTitle) break;
            }

            if(videoTitle) {
                if(player) {
                    videoSource = document.createElement("source");
                    videoSource.setAttribute("src", videoTitle);
                    player.appendChild(videoSource);
                }
            }
            videoTimer = setInterval(function() {
                //console.log("Checking");
                if(player.ended) {
                    if(++currentVideo >= numVideos) currentVideo = 0;
                    player.removeChild(videoSource);
                    //Get next video
                    videoTitle = sessionStorage.getItem('space'+currentVideo);
                    if(videoTitle) {
                        videoSource = document.createElement("source");
                        videoSource.setAttribute("src", videoTitle);
                        player.appendChild(videoSource);
                        player.load();
                        player.play();
                    }
                }
            }, checkInterval);
        },

        reset: function() {
            clearInterval(videoTimer);
            if(player) {
                player.pause();
            }
        },

        playBack: function() {
            player = document.getElementById('videoPlayback');
            player.play();
        }
    }
})();

function startUserMedia(stream) {
    var input = audio_context.createMediaStreamSource(stream);
    console.log('Media stream created.');
    // Uncomment if you want the audio to feedback directly
    //input.connect(audio_context.destination);
    //__log('Input connected to audio context destination.');

    recorder = new Recorder(input);
    console.log('Recorder initialised.');
}

function createLink() {
    //Create list of audio links
    recorder.exportWAV(function(blob) {
        var url = URL.createObjectURL(blob);
        var li = document.createElement('li');
        var au = document.createElement('audio');
        var status = document.createElement('img');

        au.controls = true;
        au.src = url;
        audioClips.push(url);
        status.src = "images/redCircle.png";
        status.id = "audioSelect" + linkNumber;
        status.onclick = function() {
            $('#audioRecordings img').attr('src', 'images/redCircle.png');
            this.setAttribute('src', 'images/greenCircle.png');
            var index = this.id.substr(this.id.length - 1);
            sessionStorage.setItem('audioSelection', audioClips[index]);
        };
        li.appendChild(status);
        li.appendChild(au);
        audioRecordings.appendChild(li);
        ++linkNumber;
    });
}

function toggleRecording() {
    //Start/stop recording
    if(!recorder) return;

    var recImage = $('#audioRecord');
    recording = !recording;
    if(recording) {
        recImage.attr('src', 'images/recordOn.png');
        recorder.record();
    } else {
        recorder.stop();
        recImage.attr('src', 'images/recordOff.png');
        createLink();
        recorder.clear();
    }
}

$(document).ready(function() {
    //Play videos
    videoPlayer.init('videoPlayer');

    //Set up audio recording
    try {
        // webkit shim
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
        window.URL = window.URL || window.webkitURL;

        audio_context = new AudioContext;
        console.log('Audio context set up.');
        console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
    } catch (e) {
        alert('No web audio support in this browser!');
    }

    navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
        alert('No live audio input: ' + e);
    });

    //Callbacks
    $('#audioRecord').on('click', function() {
        toggleRecording();
    });

    var audioPlayer = null;

    $('#gotoFinal').on('click', function() {
        $('#pitRecord').hide();
        $('#pitVideo').show();

        //Play selected video/audio
        videoPlayer.reset();
        videoPlayer.init('videoPlayback');

        audioPlayer = document.createElement('audio');
        audioPlayer.src = sessionStorage.getItem('audioSelection');
    });

    $('#finalClip').on('click', function() {
        if(audioPlayer != null) {
            videoPlayer.playBack();
            audioPlayer.play();
        }

    });
});
