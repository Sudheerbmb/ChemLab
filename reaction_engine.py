from chem_data import compounds, elements, reactions
from collections import deque, defaultdict
import heapq

# --- Trie for fast search/autocomplete ---
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False
        self.values = set()

class Trie:
    def __init__(self):
        self.root = TrieNode()
    def insert(self, word, value):
        node = self.root
        for char in word.lower():
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
            node.values.add(value)
        node.is_end = True
    def search(self, prefix):
        node = self.root
        for char in prefix.lower():
            if char not in node.children:
                return set()
            node = node.children[char]
        return node.values

# Build tries for elements and compounds
compound_trie = Trie()
element_trie = Trie()
for c in compounds:
    compound_trie.insert(c.name, c.formula)
    compound_trie.insert(c.formula, c.formula)
for e in elements:
    element_trie.insert(e.name, e.symbol)
    element_trie.insert(e.symbol, e.symbol)

# --- Stack for undo/redo ---
class Stack:
    def __init__(self):
        self.data = []
    def push(self, item):
        self.data.append(item)
    def pop(self):
        return self.data.pop() if self.data else None
    def peek(self):
        return self.data[-1] if self.data else None
    def is_empty(self):
        return not self.data

undo_stack = Stack()
redo_stack = Stack()

# --- Graph for reaction pathways ---
reaction_graph = defaultdict(set)
for r in reactions.values():
    for reactant in r.reactants:
        for product in r.products:
            reaction_graph[reactant].add(product)

# --- Priority Queue for shortest reaction chain ---
def find_shortest_reaction_chain(start, end, log=None):
    # Dijkstra's algorithm
    queue = [(0, [start])]
    visited = set()
    while queue:
        cost, path = heapq.heappop(queue)
        node = path[-1]
        if log is not None:
            log.append(f"Visiting: {node}, Path: {path}")
        if node == end:
            return path
        if node in visited:
            continue
        visited.add(node)
        for neighbor in reaction_graph.get(node, []):
            if neighbor not in visited:
                heapq.heappush(queue, (cost + 1, path + [neighbor]))
    return None

# --- Algorithm 1: Search for compound/element by formula (linear search, with log) ---
def find_compound(formula, log=None):
    for c in compounds:
        if log is not None:
            log.append(f"Checking compound: {c.formula}")
        if c.formula == formula:
            if log is not None:
                log.append(f"Found compound: {c.name} ({c.formula})")
            return c
    return None

def find_element(symbol, log=None):
    for e in elements:
        if log is not None:
            log.append(f"Checking element: {e.symbol}")
        if e.symbol == symbol:
            if log is not None:
                log.append(f"Found element: {e.name} ({e.symbol})")
            return e
    return None

# --- Algorithm 2: Get reaction (dict lookup, O(1), with log) ---
def get_reaction(reactant_formulas, log=None):
    key = frozenset(reactant_formulas)
    if log is not None:
        log.append(f"Looking up reaction for: {sorted(list(key))}")
    reaction = reactions.get(key, None)
    if reaction and log is not None:
        log.append(f"Reaction found: {reaction.description}")
    elif log is not None:
        log.append("No reaction found.")
    return reaction

# --- Algorithm 3: Find reaction chain (BFS for multi-step reactions, with log) ---
def find_reaction_chain(start, end, log=None):
    queue = deque([(start, [start])])
    visited = set()
    while queue:
        current, path = queue.popleft()
        if log is not None:
            log.append(f"At: {current}, Path: {path}")
        if current == end:
            return path
        visited.add(current)
        for neighbor in reaction_graph.get(current, []):
            if neighbor not in visited:
                queue.append((neighbor, path + [neighbor]))
    return None

# --- Expose DSA for frontend visualization ---
def get_dsa_info():
    return {
        'data_structures': [
            'List (elements, compounds)',
            'Dict (reactions)',
            'Set/Frozenset (reactant matching)',
            'Tuple/namedtuple (Element, Compound)',
            'Custom Class (Reaction)',
            'Trie (search/autocomplete)',
            'Graph (reaction pathways)',
            'Priority Queue (shortest reaction chain)',
            'Stack (undo/redo)',
            'Queue (BFS for reaction chains)'
        ],
        'algorithms': [
            'Linear search (find compound/element)',
            'Trie search (autocomplete)',
            'Dict lookup (reaction matching)',
            'BFS (find reaction chain)',
            'Dijkstra/Priority Queue (shortest chain)',
            'Stack (undo/redo)',
        ]
    }

def autocomplete_compounds(prefix):
    return list(compound_trie.search(prefix))

def autocomplete_elements(prefix):
    return list(element_trie.search(prefix)) 