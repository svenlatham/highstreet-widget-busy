## High Street "How Busy is this Town" Indicator

This is a simple tool for showing how busy your High Street is, and when the best times to visit might be.

### Sample

<div id="highstreetwidget" data-source="https://svenlatham.github.io/highstreet-widget-busy/sample.csv"></div>
<script defer src="https://svenlatham.github.io/highstreet-widget-busy/widget.js"></script>

### Installation

Open the page you want to edit, and add the following code:

```markdown
<div id="highstreetwidget" data-source="https://svenlatham.github.io/highstreet-widget-busy/sample.csv"></div>
<script defer src="https://svenlatham.github.io/highstreet-widget-busy/widget.js"></script>
```

Replace data-source with a link to a file containing your footfall data (see below)

### File format

The footfall data must be in CSV format. Each row refers to a day (Monday to Sunday) and each row contains 12 values, one for each hour from 7am to 6pm.

You can use actual footfall counts, or a percentage (of the weekly maximum) if you prefer. The widget will calculate the maximum value for the week and adjust all other figures accordingly.

Example:
```
2,3,7,6,5,5,6,6,5,6,6,4
2,3,6,6,5,5,5,6,6,5,4,4
2,3,7,6,5,5,5,6,5,6,6,4
2,3,6,6,5,5,5,6,6,6,6,5
2,3,6,6,5,4,5,6,6,5,6,6
2,4,7,8,9,10,10,9,8,6,6,5
0,0,1,2,5,6,5,4,5,2,1,0
```

If you're using WordPress, you can probably upload the CSV to the Media Library (I haven't tested this yet...)

### Licence

It's free to use and licenced under MIT Licence.