from chem_data import compounds, reactions

# Algorithm 1: Search for compound by formula (linear search)
def find_compound(formula):
    for c in compounds:
        if c.formula == formula:
            return c
    return None

# Algorithm 2: Get reaction (dict lookup, O(1))
def get_reaction(reactant_formulas):
    key = frozenset(reactant_formulas)
    return reactions.get(key, None)

# Algorithm 3: Find reaction chain (BFS for multi-step reactions)
from collections import deque

def find_reaction_chain(start, end):
    # Build graph: node = compound, edge = reaction
    graph = {}
    for r in reactions.values():
        for reactant in r.reactants:
            graph.setdefault(reactant, set()).update(r.products)
    # BFS
    queue = deque([(start, [start])])
    visited = set()
    while queue:
        current, path = queue.popleft()
        if current == end:
            return path
        visited.add(current)
        for neighbor in graph.get(current, []):
            if neighbor not in visited:
                queue.append((neighbor, path + [neighbor]))
    return None 