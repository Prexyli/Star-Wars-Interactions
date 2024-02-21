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
    .property("selected", function(d){ return d.display === "Episode 4"; }) 

d3.json("./starwars-interactions/starwars-episode-4-test.json").then(function(data) {
    const c2 = new chart(data, "#chart2", "#selectButton2")
})


// A function that update the chart
function update(selectedGroup, id, selectButton) {
    console.log(selectedGroup.length);
    if(selectedGroup.length == 0) return
    d3.select(id).select("svg").remove();
    //d3.select(selectButton).selectAll('*').remove()
    // d3.json(jsonLinks[selectedGroup]).then(function(data) {
    //     const c1 = new chart(data, id, selectButton)
    // })

    var promiseArray = []
    if(selectedGroup.includes(7)) {
        selectedGroup = [7]
    }
    selectedGroup.forEach((linkIndex)=> 
        promiseArray.push(d3.json(jsonLinks[linkIndex]))
    )
    
        
    // selectedGroup.map(function(filename) {
    //     return d3.json(jsonLinks[filename])
    // })

    Promise.all(promiseArray)
        .then((data01) => {
            console.log(id,selectedGroup,data01);
            const c2 = new chart(data01.length > 1 ? mergeObjects(data01): data01[0], id, selectButton)
        })
}

// When the button is changed, run the updateChart function
d3.select("#selectButton1").on("change", function(d) {
    // recover the option that has been chosen
    var selectedOption = Array.from(this.selectedOptions).map(x=>parseInt(x.value??x.text))
    update(selectedOption, "#chart1", "#selectButton1")
})

d3.select("#selectButton2").on("change", function(d) {
    // recover the option that has been chosen
    var selectedOption = Array.from(this.selectedOptions).map(x=>parseInt(x.value??x.text))
    //console.log(selectedOption);
    update(selectedOption, "#chart2", "#selectButton2")
})




