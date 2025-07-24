from flask import Flask, render_template, request, jsonify
from chem_data import compounds
from reaction_engine import get_reaction, find_compound, find_reaction_chain

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html', compounds=compounds)

@app.route('/react', methods=['POST'])
def react():
    data = request.json
    selected = data.get('compounds', [])
    if len(selected) < 2:
        return jsonify({'error': 'Select at least two compounds.'}), 400
    reaction = get_reaction(selected)
    if reaction:
        products = [find_compound(f) for f in reaction.products]
        return jsonify({
            'equation': f"{' + '.join(selected)} → {' + '.join(reaction.products)}",
            'description': reaction.description,
            'animation': reaction.animation,
            'products': [{'name': p.name, 'formula': p.formula, 'color': p.color} if p else {'name': f, 'formula': f, 'color': 'unknown'} for f, p in zip(reaction.products, products)]
        })
    else:
        return jsonify({'error': 'No reaction found for selected compounds.'}), 404

@app.route('/reaction_chain', methods=['POST'])
def reaction_chain():
    data = request.json
    start = data.get('start')
    end = data.get('end')
    chain = find_reaction_chain(start, end)
    if chain:
        return jsonify({'chain': chain})
    else:
        return jsonify({'error': 'No reaction chain found.'}), 404

if __name__ == '__main__':
    app.run(debug=True) 