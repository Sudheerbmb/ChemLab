# ChemLab Simulator

A Flask-based web app to simulate chemical reactions, show equations, and animate results.

## Features

- Select compounds and see if they react
- View balanced chemical equations
- Simple animations for reaction types
- Advanced Python data structures and algorithms
- AI Assistant powered by Grok (set API key via environment variable)

## Run Locally

```bash
pip install -r requirements.txt
export GROQ_API_KEY=your_grok_api_key_here  # or set in your shell/terminal
python app.py
```

Open [http://127.0.0.1:5000](http://127.0.0.1:5000) in your browser.

---

## Deploy on Vercel

1. **Push your code to GitHub.**
2. **Connect your repo to Vercel** (https://vercel.com/import).
3. **Set the environment variable** in Vercel dashboard:
   - `GROQ_API_KEY=your_grok_api_key_here`
4. **Deploy!**

Vercel will use `vercel.json` and `app.py` to serve your Flask app.

---

## Data Structures Used

- **List**: Compounds
- **Dict**: Reaction lookup
- **Set/Frozenset**: Reactant matching
- **Tuple/namedtuple**: Compound info
- **Custom Class**: Reaction
- **Queue (deque)**: BFS for reaction chains

## Algorithms Used

- **Search**: Find compound by formula
- **Dict lookup**: Fast reaction matching
- **BFS**: Find multi-step reaction chains

---

## Extend

- Add more compounds/reactions in `chem_data.py`
- Add more animations in `static/script.js`
