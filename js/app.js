const jsonLinks = [
    "./starwars-interactions/starwars-episode-1-test.json",
    "./starwars-interactions/starwars-episode-2-test.json",
    "./starwars-interactions/starwars-episode-3-test.json",
    "./starwars-interactions/starwars-episode-4-test.json",
    "./starwars-interactions/starwars-episode-5-test.json",
    "./starwars-interactions/starwars-episode-6-test.json",
    "./starwars-interactions/starwars-episode-7-test.json",
    "./starwars-interactions/starwars-full-test.json",
]

// List of movies
var allGroup = [
    { display:"Episode 1", value:0 }, 
    { display:"Episode 2", value:1 }, 
    { display:"Episode 3", value:2 }, 
    { display:"Episode 4", value:3 }, 
    { display:"Episode 5", value:4 }, 
    { display:"Episode 6", value:5 }, 
    { display:"Episode 7", value:6 }, 
    { display:"All movies", value:7 }, 
]

d3.select("#selectButton1")
    .selectAll('myOptions')
    .data(allGroup)
    .enter()
    .append('option')
    .text(function (d) { return d.display; })
    .attr("value", function (d) { return d.value; })
    .property("selected", function(d){ return d.display === "All movies"; }) 

d3.json("./starwars-interactions/starwars-full-test.json").then(function(data) {
    const c1 = new chart(data, "#chart1", "#selectButton1")
    
})

d3.select("#selectButton2")
    .selectAll('myOptions')
    .data(allGroup)
    .enter()
    .append('option')
    .text(function (d) { return d.display; })
    .attr("value", function (d) { return d.value; }) 

d3.json("./starwars-interactions/starwars-episode-4-test.json").then(function(data) {
    const c2 = new chart(data, "#chart2", "#selectButton2")
})


// A function that update the chart
function update(selectedGroup, id, selectButton) {
    d3.select(id).select("svg").remove();
    //d3.select(selectButton).selectAll('*').remove()
    d3.json(jsonLinks[selectedGroup]).then(function(data) {
        const c1 = new chart(data, id, selectButton)
    })
}

// When the button is changed, run the updateChart function
d3.select("#selectButton1").on("change", function(d) {
    // recover the option that has been chosen
    var selectedOption = d3.select(this).property("value")
    update(selectedOption, "#chart1", "#selectButton1")
})

d3.select("#selectButton2").on("change", function(d) {
    // recover the option that has been chosen
    var selectedOption = d3.select(this).property("value")
    update(selectedOption, "#chart2", "#selectButton2")
})


// Promise.all([
//     d3.json('file01.json'),
//     d3.json('file02.json')
// ]).then(function([data01, data02]){

// })

