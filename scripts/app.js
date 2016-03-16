{
particlesJS.load('particles-js', 'assets/particles.json', function() {});

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
    $.ajax({
        type: "GET",
        dataType: 'text',
        crossDomain : true,
        url: "http://localhost:8080/tone?text=" + data,
        success: function(data){
            console.log("Sending: " + data)
            maxCommunicator.sendStringToMax("address", data);
        }
    });
}
}
