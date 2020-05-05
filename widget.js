/* Sven Latham May 2019 sven@svenlatham.com */
/* Displays a simple widget showing footfall data in graph form */

var highstreetWidget = (function() {
    var el = null;
    var days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    var data = [];
    var max = 0;
    var xhr;
    var svgns = "http://www.w3.org/2000/svg";

    /* formatting options */
    var gh = 100; // Total height of grid
    
    var cols = []; // This will hold 12 columns/rectangles
    function init() {
        el = document.getElementById("highstreetwidget");
        el.style.width = "400px";
        el.style.height = "230px"; 
        el.style.backgroundColor = "#cccccc";

        var svg = document.createElementNS(svgns, "svg");
        svg.setAttribute("viewBox", "0 0 400 200");
        svg.setAttribute("width","400"); 
        svg.setAttribute("height","200");
        for (let i=0; i<12; i++) {
            let rect = document.createElementNS(svgns, "rect");
            rect.setAttributeNS(null, "x", 20+(i*30));
            rect.setAttributeNS(null, "y", 20);
            rect.setAttributeNS(null, "width", 25);
            rect.setAttributeNS(null, "height", gh);
            rect.setAttributeNS(null, "fill", "#336699");
            svg.appendChild(rect);
            cols.push(rect);
        }

        // Position some text:
        {
            var text = document.createElementNS(svgns, "text");
            text.setAttributeNS(null, "x", 5);
            text.setAttributeNS(null, "y", gh+25);
            text.appendChild(document.createTextNode("7am"));
            svg.appendChild(text);
        }
        {
            var text = document.createElementNS(svgns, "text");
            text.setAttributeNS(null, "x", 125);
            text.setAttributeNS(null, "y", gh+25);
            text.appendChild(document.createTextNode("11am"));
            svg.appendChild(text);
        }
        {
            var text = document.createElementNS(svgns, "text");
            text.setAttributeNS(null, "x", 245);
            text.setAttributeNS(null, "y", gh+25);
            text.appendChild(document.createTextNode("3pm"));
            svg.appendChild(text);
        }
        {
            var text = document.createElementNS(svgns, "text");
            text.setAttributeNS(null, "x", 365);
            text.setAttributeNS(null, "y", gh+25);
            text.appendChild(document.createTextNode("7pm"));
            svg.appendChild(text);
        }

        // Draw the line
        var line = document.createElementNS(svgns, "line");
        line.setAttributeNS(null, "x1", 5);
        line.setAttributeNS(null, "x2", 390);
        line.setAttributeNS(null, "y1", 5);
        line.setAttributeNS(null, "y2", 5);
        line.setAttributeNS(null, "stroke", "red");
        svg.appendChild(line);
        
        
            

        el.appendChild(svg);

        // IE conservative events and xhr handling (no promises)
        xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                dataLoaded(this.responseText);
            }
        };
        getData();
    }

    function showDay(i) {
        // Set the rects for this day
        var row = data[i];
        for(let i=0; i<12; i++) {
            
            cols[i].setAttribute("y", gh - ((gh/max)*row[i]));
            cols[i].setAttribute("height", ((gh/max)*row[i]));
        }

    }

    function showHour(h) {
        // Highlight the selected hour


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
        showDay(1);
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