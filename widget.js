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
    var gh = 70; // Total height of grid
    var gy = 30; // Top of the main chart (where MAX will be)
    
    var cols = []; // This will hold 12 columns/rectangles
    var elDays = []; // Accumulate days here (0..6)
    function init() {
    
        el = document.getElementById("highstreetwidget");
        el.style.width = "400px";
        el.style.height = "180px"; 
        el.style.backgroundColor = "#ffffff";

        let dateContainer = document.createElement("DIV");
        for (let i=0; i<7; i++) {
            let div = document.createElement("DIV");
            div.appendChild(document.createTextNode(days[i]));
            div.style.width = "35px";
            div.style.padding = "10px";
            div.style.display = "inline-block";
            div.style.textAlign = "center";
            div.style.cursor = "pointer";
            div.style.fontSize = "16px";
            dateContainer.appendChild(div);
            div.addEventListener("click", function() {
                showDay(i+1);
            });
            elDays[i]= div;
        }
        el.appendChild(dateContainer);



        var svg = document.createElementNS(svgns, "svg");
        svg.setAttribute("viewBox", "0 0 400 200");
        svg.setAttribute("width","400"); 
        svg.setAttribute("height","200");
        for (let i=0; i<12; i++) {
            let rect = document.createElementNS(svgns, "rect");
            rect.setAttributeNS(null, "x", 20+(i*30));
            rect.setAttributeNS(null, "y", gy);
            rect.setAttributeNS(null, "width", 25);
            rect.setAttributeNS(null, "height", gh);
            rect.setAttributeNS(null, "fill", "#336699");
            svg.appendChild(rect);
            cols.push(rect);
        }

        // Position some text:
        function renderTime(x, val) {
            var text = document.createElementNS(svgns, "text");
            text.setAttributeNS(null, "x", x-13);
            text.setAttributeNS(null, "y", gy+gh+25);
            text.setAttributeNS(null, "font-size", "16px");
            text.appendChild(document.createTextNode(val));
            svg.appendChild(text);
            var line = document.createElementNS(svgns, "line");
            line.setAttributeNS(null, "x1", x);
            line.setAttributeNS(null, "x2", x);
            line.setAttributeNS(null, "y1", gy+gh+5);
            line.setAttributeNS(null, "y2", gy+gh+10);
            line.setAttributeNS(null, "stroke", "gray");
            svg.appendChild(line);
        }
        renderTime(18, "7am");
        renderTime(138, "11am");
        renderTime(258, "3pm");
        renderTime(378, "7pm");
        
        // Draw the line
        var line = document.createElementNS(svgns, "line");
        line.setAttributeNS(null, "x1", 5);
        line.setAttributeNS(null, "x2", 390);
        line.setAttributeNS(null, "y1", gy);
        line.setAttributeNS(null, "y2", gy);
        line.setAttributeNS(null, "stroke", "red");
        svg.appendChild(line);
        {
            var text = document.createElementNS(svgns, "text");
            text.setAttributeNS(null, "x", 5);
            text.setAttributeNS(null, "y", gy-3);
            text.setAttributeNS(null, "font-size", "10px");
            text.setAttributeNS(null, "fill", "red");
            text.appendChild(document.createTextNode("MAX"));
            svg.appendChild(text);
        }
        
        
            

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

    function showDay(index) {
        let today = new Date();
        let day = today.getDay();
        if (day == 0) { day = 7; }
        if (!index) { index = day; }


        // Day is 1-indexed, so we need to subtract 1 in most cases
        // Set the rects for this day
        var row = data[index-1];
        for(let i=0; i<12; i++) {
            
            cols[i].setAttribute("y", gy + (gh - ((gh/max)*row[i])));
            cols[i].setAttribute("height", ((gh/max)*row[i]));
        }

        for (let i=0; i<7; i++) {
            elDays[i].style.fontWeight = (i==index-1 ? 'bold': 'normal');
        }

        // If it's today's date, highlight the hour in particular:

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

        showDay(); // Without an argument, it shows current day
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