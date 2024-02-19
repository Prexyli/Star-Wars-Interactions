import json

with open("./starwars-interactions/starwars-episode-4-interactions-allCharacters.json") as f:
    data = json.load(f)

nodes = data["nodes"]
links = data["links"]

# Map from names to their indices
name_to_index = {node["name"]: index for index, node in enumerate(nodes)}

# Replace source and target integers with node names
for link in links:
    link["source"] = nodes[link["source"]]["name"]
    link["target"] = nodes[link["target"]]["name"]

print("Updated links:")
print(links)
