function mergeObjects(objects) {
    const mergedObj = { nodes: [], links: [] };

    // Create a map to store node names and their corresponding indices
    const nodeMap = new Map();

    // Iterate through each object in the array
    objects.forEach(obj => {
        // Iterate through the nodes of the current object
        obj.nodes.forEach(node => {
            if (nodeMap.has(node.name)) {
                // Node already exists, update the value
                nodeMap.set(node.name, nodeMap.get(node.name) + node.value);
            } else {
                // Node doesn't exist, add it to the map and mergedObj
                mergedObj.nodes.push(node);
                nodeMap.set(node.name, node.value);
            }
        });

        // Iterate through the links of the current object
        obj.links.forEach(link => {
            const sourceName = link.source;
            const targetName = link.target;

            if (nodeMap.has(sourceName) && nodeMap.has(targetName)) {
                // Both source and target nodes exist, add/update the link in mergedObj
                const existingLink = mergedObj.links.find(l => l.source === sourceName && l.target === targetName);
                if (existingLink) {
                    // Link already exists, update the value
                    existingLink.value += link.value;
                } else {
                    // Link doesn't exist, add it to mergedObj.links
                    mergedObj.links.push({ source: sourceName, target: targetName, value: link.value });
                }
            }
        });
    });

    return mergedObj;
}
