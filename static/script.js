// --- Drag and Drop Logic ---
let selectedCompounds = [];
const compoundList = document.getElementById('compound-list');
const tumbler = document.getElementById('tumbler');
const tumblerContent = document.getElementById('tumbler-content');
const tumblerLiquid = document.getElementById('tumbler-liquid');
const tumblerLabel = document.getElementById('tumbler-label');
const reactBtn = document.getElementById('react-btn');
const resultDiv = document.getElementById('result');
const animationDiv = document.getElementById('animation');

function updateTumblerLiquid() {
    // Liquid height based on number of compounds
    const h = Math.min(selectedCompounds.length * 18, 100);
    tumblerLiquid.style.height = h + '%';
}

function renderTumblerContent() {
    tumblerContent.innerHTML = '';
    selectedCompounds.forEach((c, idx) => {
        const el = document.createElement('div');
        el.className = 'animated-compound dropped';
        el.style.top = (30 + idx * 32) + 'px';
        el.innerText = c.formula;
        tumblerContent.appendChild(el);
    });
    updateTumblerLiquid();
    tumblerLabel.innerText = selectedCompounds.length ? 'Ready to React!' : 'Drop compounds here!';
}

// Drag events for compounds
compoundList.addEventListener('dragstart', function(e) {
    if (e.target.classList.contains('compound-card')) {
        e.dataTransfer.setData('text/plain', e.target.dataset.formula);
        e.target.classList.add('dragging');
    }
});
compoundList.addEventListener('dragend', function(e) {
    if (e.target.classList.contains('compound-card')) {
        e.target.classList.remove('dragging');
    }
});
tumbler.addEventListener('dragover', function(e) {
    e.preventDefault();
    tumbler.classList.add('dragover');
});
tumbler.addEventListener('dragleave', function(e) {
    tumbler.classList.remove('dragover');
});
tumbler.addEventListener('drop', function(e) {
    e.preventDefault();
    tumbler.classList.remove('dragover');
    const formula = e.dataTransfer.getData('text/plain');
    // Get name from compoundList
    const card = [...compoundList.children].find(c => c.dataset.formula === formula);
    if (card && !selectedCompounds.some(c => c.formula === formula)) {
        selectedCompounds.push({
            formula: formula,
            name: card.dataset.name
        });
        renderTumblerContent();
    }
});

// Allow removing compounds by clicking on them in tumbler
// (Optional, for better UX)
tumblerContent.addEventListener('click', function(e) {
    if (e.target.classList.contains('animated-compound')) {
        const formula = e.target.innerText;
        selectedCompounds = selectedCompounds.filter(c => c.formula !== formula);
        renderTumblerContent();
    }
});

// --- React Button Logic ---
reactBtn.addEventListener('click', function() {
    if (selectedCompounds.length < 2) {
        resultDiv.innerHTML = '<span style="color:red">Select at least two compounds by dragging them into the tumbler.</span>';
        animationDiv.innerHTML = '';
        return;
    }
    fetch('/react', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ compounds: selectedCompounds.map(c => c.formula) })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            resultDiv.innerHTML = `<span style="color:red">${data.error}</span>`;
            animationDiv.innerHTML = '';
        } else {
            resultDiv.innerHTML = `<b>Equation:</b> ${data.equation}<br>
                                   <b>Description:</b> ${data.description}<br>
                                   <b>Products:</b> ${data.products.map(p => `${p.name} (${p.formula})`).join(', ')}`;
            // Animate tumbler output
            animateReaction(data.animation, data.products);
        }
    });
});

function animateReaction(type, products) {
    // Clear previous
    animationDiv.innerHTML = '';
    // Animate tumbler liquid color change
    if (type === 'neutralization') {
        tumblerLiquid.style.background = 'linear-gradient(180deg, #b2f7b8 0%, #4fc3f7 100%)';
        // Bubbles
        for (let i = 0; i < 3; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            bubble.style.left = (40 + i * 30) + 'px';
            animationDiv.appendChild(bubble);
        }
    } else if (type === 'precipitate') {
        tumblerLiquid.style.background = 'linear-gradient(180deg, #ffe082 0%, #b3c6e7 100%)';
        // Precipitate
        const ppt = document.createElement('div');
        ppt.className = 'precipitate';
        ppt.innerText = 'Precipitate';
        animationDiv.appendChild(ppt);
    } else {
        tumblerLiquid.style.background = 'linear-gradient(180deg, #aeeeee 0%, #4fc3f7 100%)';
    }
    // Optionally, show product compounds in tumbler
    setTimeout(() => {
        tumblerContent.innerHTML = '';
        products.forEach((p, idx) => {
            const el = document.createElement('div');
            el.className = 'animated-compound dropped';
            el.style.top = (30 + idx * 32) + 'px';
            el.innerText = p.formula;
            tumblerContent.appendChild(el);
        });
        updateTumblerLiquid();
        tumblerLabel.innerText = 'Reaction Complete!';
    }, 1200);
}

// Initial render
renderTumblerContent(); 