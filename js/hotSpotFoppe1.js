/**
 * Created by DrTone on 10/07/2015.
 */

$(document).ready(function() {

    //Play audio
    $('#story1').on("click", function() {
        audioManager.playAudio(this.id);
    });

    $('#story2').on("click", function() {
        audioManager.playAudio(this.id);
    });
});
