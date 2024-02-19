
d3.json("./starwars-interactions/starwars-full-test.json").then(function(data) {
    const c1 = new chart(data, "#chart1")
    
})


d3.json("./starwars-interactions/starwars-episode-4-test.json").then(function(data) {
    const c2 = new chart(data, "#chart2")
})


