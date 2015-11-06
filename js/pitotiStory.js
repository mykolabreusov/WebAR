/**
 * Created by atg on 06/11/2015.
 */


$(document).ready(function() {

    var userData = new FormData();

    $('#nameEntered').on("click", function() {
        var userName = $('#username').val();
        if(!userName) {
            alert("Please enter a username!");
            return;
        }
        userData.append("username", userName);

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "getStories.php", true);
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4) {
                if(xhr.status === 200) {
                    console.log(xhr.responseText);
                } else {
                    console.log("Error uploading");
                }
            }
        };

        xhr.send(userData);
    });

});
