from collections import namedtuple

# Element as a namedtuple (tuple)
Element = namedtuple('Element', ['name', 'symbol', 'color'])

# Compound as a namedtuple (tuple)
Compound = namedtuple('Compound', ['name', 'formula', 'color'])

# List of elements (list)
elements = [
    Element('Hydrogen', 'H2', '#e3e3e3'),
    Element('Oxygen', 'O2', '#b3d1ff'),
    Element('Sodium', 'Na', '#f4e285'),
    Element('Chlorine', 'Cl2', '#b2ffb2'),
    Element('Iron', 'Fe', '#b87333'),
    Element('Copper', 'Cu', '#b87333'),
    Element('Zinc', 'Zn', '#c0c0c0'),
    Element('Potassium', 'K', '#ffe066'),
    Element('Iodine', 'I2', '#a259a2'),
    Element('Lead', 'Pb', '#a9a9a9'),
    Element('Silver', 'Ag', '#d9d9d9'),
    Element('Barium', 'Ba', '#e0ffe0'),
    # Add more elements as needed
]

# List of compounds (list)
compounds = [
    Compound('Hydrochloric Acid', 'HCl', 'colorless'),
    Compound('Sodium Hydroxide', 'NaOH', 'colorless'),
    Compound('Sulfuric Acid', 'H2SO4', 'colorless'),
    Compound('Copper(II) Sulfate', 'CuSO4', 'blue'),
    Compound('Silver Nitrate', 'AgNO3', 'colorless'),
    Compound('Barium Chloride', 'BaCl2', 'white'),
    Compound('Potassium Iodide', 'KI', 'colorless'),
    Compound('Lead(II) Nitrate', 'Pb(NO3)2', 'colorless'),
    Compound('Ammonia', 'NH3', 'colorless'),
    Compound('Iron(III) Chloride', 'FeCl3', 'yellow'),
    Compound('Calcium Carbonate', 'CaCO3', 'white'),
    Compound('Magnesium Sulfate', 'MgSO4', 'white'),
    Compound('Zinc Sulfate', 'ZnSO4', 'white'),
    Compound('Copper', 'Cu', 'red-brown'),
    Compound('Hydrogen Peroxide', 'H2O2', 'colorless'),
    Compound('Nitric Acid', 'HNO3', 'colorless'),
    Compound('Potassium Sulfate', 'K2SO4', 'white'),
    Compound('Sodium Chloride', 'NaCl', 'white'),
    Compound('Water', 'H2O', 'colorless'),
    Compound('Iron(III) Hydroxide', 'Fe(OH)3', 'brown'),
    Compound('Copper(II) Chloride', 'CuCl2', 'blue-green'),
    Compound('Barium Sulfate', 'BaSO4', 'white'),
    Compound('Silver Iodide', 'AgI', 'yellow'),
    Compound('Lead(II) Iodide', 'PbI2', 'yellow'),
    Compound('Potassium Nitrate', 'KNO3', 'white'),
    Compound('Ammonium Chloride', 'NH4Cl', 'white'),
    # Add more compounds as needed
]

# Reaction as a custom class
class Reaction:
    def __init__(self, reactants, products, description, animation):
        self.reactants = frozenset(reactants)  # set for unordered lookup
        self.products = products  # list of product formulas
        self.description = description
        self.animation = animation  # animation type (string)

# Dictionary for fast reaction lookup (dict)
reactions = {
    frozenset(['HCl', 'NaOH']): Reaction(
        ['HCl', 'NaOH'],
        ['NaCl', 'H2O'],
        'Neutralization: Hydrochloric acid reacts with sodium hydroxide to form sodium chloride and water.',
        'neutralization'
    ),
    frozenset(['CuSO4', 'BaCl2']): Reaction(
        ['CuSO4', 'BaCl2'],
        ['BaSO4', 'CuCl2'],
        'Double displacement: Copper(II) sulfate reacts with barium chloride to form barium sulfate (white precipitate) and copper(II) chloride.',
        'precipitate'
    ),
    frozenset(['AgNO3', 'KI']): Reaction(
        ['AgNO3', 'KI'],
        ['AgI', 'KNO3'],
        'Precipitation: Silver nitrate reacts with potassium iodide to form silver iodide (yellow precipitate) and potassium nitrate.',
        'precipitate'
    ),
    frozenset(['Pb(NO3)2', 'KI']): Reaction(
        ['Pb(NO3)2', 'KI'],
        ['PbI2', 'KNO3'],
        'Precipitation: Lead(II) nitrate reacts with potassium iodide to form lead(II) iodide (yellow precipitate) and potassium nitrate.',
        'precipitate'
    ),
    frozenset(['FeCl3', 'NH3']): Reaction(
        ['FeCl3', 'NH3'],
        ['Fe(OH)3', 'NH4Cl'],
        'Formation of iron(III) hydroxide: Iron(III) chloride reacts with ammonia to form iron(III) hydroxide (brown precipitate) and ammonium chloride.',
        'precipitate'
    ),
    frozenset(['Na', 'Cl2']): Reaction(
        ['Na', 'Cl2'],
        ['NaCl'],
        'Synthesis: Sodium reacts with chlorine gas to form sodium chloride (table salt).',
        'synthesis'
    ),
    frozenset(['H2', 'O2']): Reaction(
        ['H2', 'O2'],
        ['H2O'],
        'Combination: Hydrogen reacts with oxygen to form water.',
        'combination'
    ),
    frozenset(['Fe', 'O2']): Reaction(
        ['Fe', 'O2'],
        ['Fe2O3'],
        'Rusting: Iron reacts with oxygen to form iron(III) oxide (rust).',
        'rusting'
    ),
    # Add more reactions as needed
} 