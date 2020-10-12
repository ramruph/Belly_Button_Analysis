function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var samp = samplesArray[0]

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let ids = samp.otu_ids ;
    let labels = samp.otu_labels.slice(0,10);
    let sampleValues = samp.sample_values.slice(0,10).reverse();

    console.log(ids);
    console.log(labels);
    console.log(sampleValues);
    
    
    
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    // so the otu_ids with the most bacteria are last. 
   

    var topOtu = (samp.otu_ids.slice(0,10)).reverse();
    var topId = topOtu.map(ID => "OTU " + ID);
    console.log(topId);
    console.log(topOtu);

    // 8.Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues,
      y: topId,
      text:labels,
      type: "bar",
      orientation: 'h'
    
    }];
    
      
  
    // 9. Create the layout for the bar chart. 
    var barLayout = {
    title: "Top 10 Bacteria ",
    yaxis: {
      tickmode : "linear"
    }
   };
     
    //};
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // Building the Bubble Chart
   var bubbleData = [{
     x: ids,
     y: sampleValues,
     mode: 'markers',
     marker: {
       size: samp.sample_values,
       color: ids
     },
     text: labels
   }];
   console.log(sampleValues);

   //2. Layout
   var bubbleLayout = {
     xaxis:{title : "OTU ID"},
     height : 700,
     width : 1000
   }

   //3 Plotly
   Plotly.newPlot("bubble", bubbleData, bubbleLayout);

   //4. Create the trace for the gauge chart.
   var gaugeData = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: 270,
      title: { text: "Belly Button" },
      type: "indicator",
      mode: "gauge+number"
    }
  ];
  
  var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
  Plotly.newPlot('gauge', gaugeData, layout);
  
  // 5. Create the layout for the gauge chart.
  //var gaugeLayout = { 
   
  //};

  // 6. Use Plotly to plot the gauge data and layout.
  
  });
}
