/* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
particlesJS.load('particles-js', 'assets/particles.json', function() {
    console.log('callback - particles.js config loaded');
});

function sendData(){
    var data = document.getElementById("input-text").value;

    var maxCommunicator = new MaxCommunication.getInstance({
        'socketHost' : "http://localhost:8080",
        'udpPort' : 7374
    });

    console.log("Sending: " + data)
    maxCommunicator.sendStringToMax("address", data);
}
