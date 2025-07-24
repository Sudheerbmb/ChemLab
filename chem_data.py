from collections import namedtuple

# Compound as a namedtuple (tuple)
Compound = namedtuple('Compound', ['name', 'formula', 'color'])

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
    Compound('Zinc', 'Zn', 'gray'),
    Compound('Copper', 'Cu', 'red-brown'),
    Compound('Hydrogen Peroxide', 'H2O2', 'colorless'),
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
    # Add more reactions as needed
} 