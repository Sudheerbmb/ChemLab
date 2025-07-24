from flask import Flask, render_template, request, jsonify
from chem_data import compounds, elements
from reaction_engine import (
    get_reaction, find_compound, find_element, find_reaction_chain, find_shortest_reaction_chain,
    get_dsa_info, autocomplete_compounds, autocomplete_elements
)
import requests
import markdown
from langchain_groq import ChatGroq
import re

GROQ_API_KEY = "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"
GROQ_MODEL = "llama-3.1-8b-instant"

def ask_grok(prompt, model_name=GROQ_MODEL):
    try:
        llm = ChatGroq(api_key=GROQ_API_KEY, model=model_name)
        response = llm.invoke(prompt)
        return response.content if response else "Error getting answer from Grok."
    except Exception as e:
        return f"Grok API error: {e}"

def strip_html_tags(text):
    # Remove HTML tags
    clean = re.compile('<.*?>')
    return re.sub(clean, '', text)

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html', compounds=compounds, elements=elements)

@app.route('/react', methods=['POST'])
def react():
    data = request.json
    selected = data.get('compounds', [])
    log = []
    if len(selected) < 2:
        return jsonify({'error': 'Select at least two compounds or elements.'}), 400
    reaction = get_reaction(selected, log=log)
    if reaction:
        # Try to find as compound, else as element
        products = []
        for f in reaction.products:
            c = find_compound(f)
            if not c:
                c = find_element(f)
            if c:
                # namedtuple: use attribute access
                products.append({'name': getattr(c, 'name', None), 'formula': getattr(c, 'formula', getattr(c, 'symbol', None)), 'color': getattr(c, 'color', None)})
            else:
                # fallback dict
                products.append({'name': f, 'formula': f, 'color': 'unknown'})
        return jsonify({
            'equation': f"{' + '.join(selected)} → {' + '.join(reaction.products)}",
            'description': reaction.description,
            'animation': reaction.animation,
            'products': products,
            'dsa_log': log
        })
    else:
        # Use Grok to generate a reaction
        prompt = f"What is the chemical reaction when {' and '.join(selected)} react? Give the balanced equation and product names."
        grok_result = ask_grok(prompt)
        return jsonify({'error': 'No reaction found for selected compounds or elements. (Local)', 'grok': strip_html_tags(grok_result), 'dsa_log': log}), 404

@app.route('/reaction_chain', methods=['POST'])
def reaction_chain():
    data = request.json
    start = data.get('start')
    end = data.get('end')
    log = []
    chain = find_reaction_chain(start, end, log=log)
    if chain:
        return jsonify({'chain': chain, 'dsa_log': log})
    else:
        return jsonify({'error': 'No reaction chain found.', 'dsa_log': log}), 404

@app.route('/shortest_chain', methods=['POST'])
def shortest_chain():
    data = request.json
    start = data.get('start')
    end = data.get('end')
    log = []
    chain = find_shortest_reaction_chain(start, end, log=log)
    if chain:
        return jsonify({'chain': chain, 'dsa_log': log})
    else:
        return jsonify({'error': 'No reaction chain found.', 'dsa_log': log}), 404

@app.route('/dsa_info')
def dsa_info():
    return jsonify(get_dsa_info())

@app.route('/autocomplete_compounds')
def autocomplete_compounds_api():
    prefix = request.args.get('prefix', '')
    return jsonify({'results': autocomplete_compounds(prefix)})

@app.route('/autocomplete_elements')
def autocomplete_elements_api():
    prefix = request.args.get('prefix', '')
    return jsonify({'results': autocomplete_elements(prefix)})

# PubChem search (no API key required)
def search_pubchem(compound_name):
    url = f'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/{compound_name}/JSON'
    try:
        resp = requests.get(url, timeout=5)
        if resp.status_code == 200:
            data = resp.json()
            # Example: get the first compound's IUPAC name and molecular formula
            try:
                info = data['PC_Compounds'][0]
                props = info.get('props', [])
                formula = None
                iupac = None
                for prop in props:
                    if prop.get('urn', {}).get('label') == 'Molecular Formula':
                        formula = prop.get('value', {}).get('sval')
                    if prop.get('urn', {}).get('label') == 'IUPAC Name':
                        iupac = prop.get('value', {}).get('sval')
                return {
                    'iupac': iupac,
                    'formula': formula,
                    'raw': data
                }
            except Exception:
                return {'error': 'Compound found but could not parse details.', 'raw': data}
        return {'error': 'Compound not found.'}
    except Exception as e:
        return {'error': f'Error contacting PubChem: {e}'}

@app.route('/web_search')
def web_search_api():
    query = request.args.get('query', '')
    if not query:
        return jsonify({'result': None})
    pubchem_result = search_pubchem(query)
    if 'error' in pubchem_result:
        # Use Grok as fallback
        grok_result = ask_grok(f"Give me the IUPAC name and molecular formula for {query}.")
        return jsonify({'result': strip_html_tags(grok_result)})
    # Format a nice result
    result_str = f"IUPAC Name: {pubchem_result['iupac']}\nMolecular Formula: {pubchem_result['formula']}"
    return jsonify({'result': result_str})

if __name__ == '__main__':
    app.run(debug=True) 