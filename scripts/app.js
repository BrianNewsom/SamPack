$(document).ready(function(){

var maxCommunicator = new MaxCommunication.getInstance({
   'socketHost' : "localhost:8080",
   'udpPort' : 7374
});

maxCommunicator.setDefaultBehaviour(function(oscMsg){
    // in here you have access to the received OSC message as a parameter

    // oscMsg.address gives you the address string
    // oscMsg.typeFlags gives you an array containing the message type definition flags
    // oscMsg.values gives you an array containing the values of the OSC message

    console.log(oscMsg);
});

function sendData(){
    var data = document.getElementById("input-text").value;
    upload(data)
}

function upload(data){
    sweetAlert({
        title: "Submit Request?",
        text: "Click to confirm description: \"" + data + "\"",
        type: "info",
        showCancelButton: true,
        closeOnConfirm: false,
        showLoaderOnConfirm: true,
     }, function(){
            $.ajax({
                type: "GET",
                dataType: 'text',
                crossDomain : true,
                url: "http://localhost:8080/tone?text=" + data,
                success: function(res){
                    // console.log("Response: " + res)
                    data = JSON.parse(res);
                    maxCommunicator.sendFloatsToMax("address", data.data);
                    sweetAlert('Success!', 'Thanks for submitting your request.  We\'ll send you the sample pack!', "success");
                },
                error: function(){
                    sweetAlert('Oops!', 'Something went wrong. Please try again.', "error");
                }
            });
            return false;
        });
}


function setInputLabel(){
    var CHOICES = ['reverby', 'sad', 'crunchy', 'dark', 'joyful', 'reverby', 'distorted', 'airy', 'fluttery', 'nerve-wracking', 'panic-inducing', 'tasty']
    var output = []
    for (var i = 0; i < 3; i++){
        output.push(CHOICES[Math.floor(Math.random() * CHOICES.length)]);
    }

    document.getElementById("input-label").innerHTML = output.join(", ");
}

// setInputLabel();
$('#lyric-btn').click(function(){
    var data = document.getElementById("lyric-text").value;
    upload(data);
})

$('#go-btn').click(function(){
    sendData();
})
})
