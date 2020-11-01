// remember the last event so that we can check if two buttons were double clicked within 1 second
var lastDoubleClickEvent = {
    deviceId: "",
    timestamp: 0
}

// remember how many times the buttons were pressed
var doubleClickCounter = 0;

// react on the "bump" Event
function handleBumpStateChanged(event) {
    // read variables from the event
    let ev = JSON.parse(event.data);
    let evData = ev.data; // the data from the argon event: "doubleClick"
    let evDeviceId = ev.coreid; // the device id
    let evTimestamp = Date.parse(ev.published_at); // the timestamp of the event

    // helper variables that we need to build the message to be sent to the clients
    let sync = false;
    let msg = "";

    if (evData === "doubleClick") {
        DoubleClickCounter++; // increase the doubleClickCounter by 1
    msg = "double clicked";

    // check if the last two double click events were whithin 1 second
    if (evTimestamp - lastDoubleClickEvent.timestamp < 1000) {
        if (evDeviceId !== lastDoubleClickEvent.deviceId) {
            sync = true;
        }
    }

    lastDoubleClickEvent.timestamp = evTimestamp;
    lastDoubleClickEvent.deviceId = evDeviceId;
} 
    
    else {
    msg = "unknown state";
}

// the data we want to send to the clients
let data = {
    message: msg,
    counter: doubleClickCounter,
    doubleClickSync: sync
}

// send data to all connected clients
sendData("bumbStateChanged", data, evDeviceId, evTimestamp);
}

// send data to the clients.
// You don't have to change this function
function sendData(evName, evData, evDeviceId, evTimestamp) {

    // map device id to device nr
    let nr = exports.deviceIds.indexOf(evDeviceId)

    // the message that we send to the client
    let data = {
        eventName: evName,
        eventData: evData,
        deviceNumber: nr,
        timestamp: evTimestamp,
    };

    // send the data to all connected clients
    exports.sse.send(data)
}

exports.deviceIds = [];
exports.sse = null;

// export your functions
exports.handleBumpStateChanged = handleBumpStateChanged;
