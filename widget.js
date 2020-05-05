/* Sven Latham May 2019 sven@svenlatham.com */
/* Displays a simple widget showing footfall data in graph form */

var highstreetWidget = (function() {
    var el = null;
    var days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    var data = [];
    var max = 0;
    var xhr;
    var svgns = "http://www.w3.org/2000/svg";


    var cols = []; // This will hold 12 columns/rectangles
    function init() {
        el = document.getElementById("highstreetwidget");
        // List each of the 7 days:

        var svg = document.createElement("svg");
        svg.width = 400; 
        svg.height = 200;
        for (let i=7; i<=18; i++) {
            let rect = document.createAttributeNS(svgns, "rect");
            rect.setAttributeNS(null, "x", i*5);
            rect.setAttributeNS(null, "y", 20);
            rect.setAttributeNS(null, "width", 3);
            rect.setAttributeNS(null, "height", 50);
            rect.setAttributeNS(null, "fill", "#336699");
            svg.appendChild(rect);
        }


        // IE conservative events and xhr handling (no promises)
        xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                dataLoaded(this.responseText);
            }
        };
        getData();
    }

    function getData() {
        // Go load the data
        let src = el.dataset.source;
        xhr.open("GET",src);
        xhr.send();
    }

    function render() {
        // data has 7 x 12 values (covering 0700-1900); max has the max value. Go do your work!
        console.log(data);
        console.log(max);
    }

    function dataLoaded(input) {
        // We're expecting a CSV of some kind
        // Format is 7 lines, with 12 values on each. This is local time (0700-1900) for Monday to Sunday
        rows = input.split("\n");
        data = []; // Reset the data field
        max = 0;
        rows.forEach(function(row) {
            if (!row) { return false; }
            let vals = row.split(",");
            let outcome = [];
            vals.forEach(function(val) {
                val = 1* val;
                if (val > max) { max = val; }
                outcome.push(val);
            });
            data.push(vals);
        });
        // Assertions to check our work:
        if (data.length != 7) { console.log("Expected 7 rows in data, got "+data.length); }
        render();
    }


    return { init: init }
})();


highstreetWidget.init();