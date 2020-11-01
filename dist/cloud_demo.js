var rootUrl = window.location.origin; // get the root URL, e.g. https://example.herokuapp.com

var app = new Vue({
    el: "#app",
    data: {
        doubleClick_1: unknown, // the state of bump on device 1
        doubleClick_2: unknown, // the state of bump on device 2
        ClickCounter: 0, // how many times there was a click 
        doubleClickSync: false,  // true if the doubleClicks were pressed within 1 second   
    },
    // This function is executed once when the page is loaded.
    mounted: function () {
        this.initSse();
    },
    methods: {
        // Initialise the Event Stream (Server Sent Events)
        // You don't have to change this function
        initSse: function () {
            if (typeof (EventSource) !== "undefined") {
                var url = rootUrl + "/api/events";
                var source = new EventSource(url);
                source.onmessage = (event) => {
                    this.updateVariables(JSON.parse(event.data));
                };
            } else {
                this.message = "Your browser does not support server-sent events.";
            }
        },
        // react on events: update the variables to be displayed
        updateVariables(ev) {
            // Event "bump"
            if (ev.eventName === "ev") {
                this.ClickCounter = ev.eventData.counter;
                if (ev.eventData.message === "double click") {
                    this.doubleClickSync = ev.eventData.doubleClickSync;
                }
            }

        },
        // get the value of the variable "bumpState" on the device with number "nr" from your backend
        getDoubleClick: function (nr) {
            axios.get(rootUrl + "/api/device/" + nr + "/variable/bumpState")
                .then(response => {
                    // Handle the response from the server
                    var bumpState = response.data.result;
                    if (nr === 0) {
                        this.doubleClick_1 = bumpState;
                    }
                    else if (nr === 1) {
                        this.doubleClick_2 = bumpState;
                    }
                    else {
                        console.log("unknown device number: " + nr);
                    }
                })
                .catch(error => {
                    alert("Could not read the button state of device number " + nr + ".\n\n" + error)
                })
        }
    }
})