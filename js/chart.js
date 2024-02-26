function chart(data, id, selectButton) {

    const width = 700;
    const height = 700;

    //Specify the color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    //Extract nodes and links from the data
    let links = data.links.filter(function(d) {
        if (d.value < 0) {
            return false; // skip
        }
        return true
    })
    links = links.map(d => ({...d}));
    const nodes = data.nodes.map(d => ({...d}));

    var clicked = ""

    //Create a simulation with several forces.
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.name).distance(80))
        .force("charge", d3.forceManyBody().strength(-36))
        .force("collide", d3.forceCollide(d => Math.log(d.value)*3+5).iterations(10))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("forceX", d3.forceX(width/2).strength(0.01)) // THIS IS ONLY NEED BECAUSE OF "GOLD FIVE" sigh...
        .force("forceY", d3.forceY(height/2).strength(0.01)) // Btw GOLD FIVE actually interacts with RED LEADER in episode 4 so...
        .on("tick", ticked)
    
    const svg = d3.select(id).append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;")
    

    //Focusing 
    svg
        .on('foucs', function(a) {return a}) 
        .on('blur', function(d) {
            resetStyling()
        })
        .style("outline", "none")

    //Zooming
    const zoom = d3.zoom()
    .scaleExtent([0.5, 5]) // Min and max zoom levels
    .on("zoom", zoomed)//Zoomed function called when a zoom-event occurs (aka scrolling or clicking)
    //.on("dblclick.zoom", null); 
    

    // Call zoom
    svg.call(zoom).on("dblclick.zoom", null);

    function zoomed(event) {
        // Update the transform of the graph container based on the zoom event
        link.attr("transform", event.transform);
        node.attr("transform", event.transform);
    }

    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll()
        .data(links)
        .join("line")
            .attr("stroke-width", d => Math.sqrt(d.value) * 2.0)
            .attr("class", d => d.source.name.replace(/ /g,"_") + d.target.name.replace(/ /g,"_"))
            .on("mouseover", function(d, i) {
                const data = d.target.__data__
                d3.select(this).attr("stroke-width", 10)
                //tooltip.transition().duration(200).style("opacity", .9);
                tooltip.html(`
                <div class="tooltip-imggroup">
                <img src="../Images/Small/${data.source.name.replace("/","_")}.webp" alt="${data.source.name}" class="tooltip-image" width="100"/>
                <img src="../Images/Small/${data.target.name.replace("/","_")}.webp" alt="${data.target.name}" class="tooltip-image" width="100"/>
                </div>
                <span class="tooltip-title">INTERACTIONS BETWEEN</span><br/>
                <span class="tooltip-name">${data.source.name}</span><br>
                <span class="tooltip-title">AND</span><br/><span class="tooltip-name">${data.target.name}</span><br/>
                <span class="tooltip-title">Number of interaction: </span><br/><span class="tooltip-name">${data.value}</span>       
                `)
            })
            .on("mouseout", function(d) {
                d3.select(this).attr("stroke-width", Math.sqrt(d.target.__data__.value)*2.0)
                //tooltip.transition().duration(500).style("opacity", 0)
            })

    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll()
        .data(nodes)
        .join("circle")
            .attr("r", d => Math.log(d.value)*4)
            .attr("fill", d => d.colour)
            .attr("class", d => d.name.replace(/ /g,"_"))
            .on("mouseover", (d, i) => {
                const data = d.target.__data__
                //console.log(d);
                //tooltip.transition().duration(200).style("opacity", .9);
                tooltip.html(`
                <img src="../Images/Small/${data.name.replace("/","_")}.webp" alt="${data.name}" class="tooltip-image" width="100"/>
                <span class="tooltip-name">${data.name}</span><br/>
                <span class="tooltip-title">Number of aperances: </span><br/>
                <span class="tooltip-name">${data.value}</span><br/>
                <span class="tooltip-title">Interacted with: </span><br/>
                <div class="tooltip-imagegrid">${findConnected(data.name).nodesRaw.map(d => {
                    return `<img src="../Images/Tiny/${d.name.replace("/","_")}.webp" alt="${d.name}" class="tooltip-image" width="45"/>`
                }).join('')
                }</div>
                `)
            })
            .on("mouseout", d => {
                //tooltip.transition().duration(500).style("opacity", 0)
            })
            .on("click", event => handleClick(event))
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))
        
    node.append("title")
        .text(d => d.name)


    function handleClick(event) {
        var name = event.target.className.baseVal
        var connected = findConnected(name)
        
        if(clicked != name) {
            clicked = name
            d3.selectAll('circle')
                .each(function(d) {
                    var isIncluded = connected.nodes.includes(d.name)
                    //console.log(clicked, d.name);
                    d3.select(this).style("fill", clicked == d.name.replace(" ","_") || isIncluded ? this.colour : "#dadada")
                    .style("stroke", isIncluded ? "#555" : "#fff")
                })
            
            //Color links connected to the node red and the rest light grey
            d3.selectAll("line")
                .each(function(d) {
                    d3.select(this).style("stroke",
                        connected.links.includes(d.source.name.replace(/ /g,"_") + d.target.name.replace(/ /g,"_")) ? "red" : "#dadada"
                    )
                })
            
            //Move the red lines to the front
            d3.selectAll("svg")
                .each(function(d, i) {
                    //This code is god tier
                    d3.select(`#chart${i+1}`).selectAll("line").sort(function (d) {
                        if (connected.links.includes(d.source.name.replace(/ /g,"_") + d.target.name.replace(/ /g,"_"))) return 1;
                        else return -1;     
                    })
                                    
                })

            //Set the stroke color of the clicked node to black    
            d3.selectAll(`.${name}`)
                .style("stroke", "#000")
        } 
        else{
            resetStyling()
        }
        
    }

    //Finds and returns all connected nodes
    function findConnected(name) {
        var connectedNodes = []     //List containing the name of the Nodes
        var connectedLinks = []     //List containing the class name of the Link
        var connectedRawNodes = []  //List containing the actual nodes
        links.forEach(function(link) {
            if(link.source.name == name.replace("_"," ")) {
                connectedRawNodes.push(link.target)
                connectedNodes.push(link.target.name)
                connectedLinks.push(link.source.name.replace(/ /g,"_") + link.target.name.replace(/ /g,"_"))
            }
            else if(link.target.name == name.replace("_"," ")) {
                connectedRawNodes.push(link.source)
                connectedNodes.push(link.source.name)
                connectedLinks.push(link.source.name.replace(/ /g,"_") + link.target.name.replace(/ /g,"_"))
            }
        })
        return {
            'nodesRaw' : connectedRawNodes,
            'nodes' : connectedNodes,
            'links' : connectedLinks  
        }
    }

    function resetStyling () {
        clicked = ""
            d3.selectAll('circle')
                .each(function(d) {
                    d3.select(this).style("fill", this.colour)
                })
                .style("stroke", "#fff")
                
            d3.selectAll("line")
                .each(function(d) {
                    d3.select(this).style("stroke","#999")
            })
    }

    //tooltip
    var tooltip = d3.select(".tooltip")

    //set the position attributes of links and nodes on each simulation tick
    function ticked () {
        link
            .attr("x1", d=> d.source.x)
            .attr("y1", d=> d.source.y)
            .attr("x2", d=> d.target.x)
            .attr("y2", d=> d.target.y)

        node
            .attr("cx", d => d.x = Math.max(10, Math.min(width - 10, d.x)))
            .attr("cy", d => d.y = Math.max(10, Math.min(height - 10, d.y)))
    }

    function dragstarted(event) {
        if(!event.active) simulation.alphaTarget(0.3).restart()
        event.subject.fx = event.subject.x
        event.subject.fy = event.subject.y
    }

    function dragged(event) {
        event.subject.fx = event.x
        event.subject.fy = event.y
    }

    function dragended(event) {
        if(!event.active) simulation.alphaTarget(0)
        event.subject.fx = null
        event.subject.fy = null
    }

    //invalidation.then(() => simulation.stop())

    

    

    return svg.node()

}