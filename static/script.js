
// --- Drag and Drop Logic ---
let selectedCompounds = [];
const elementList = document.getElementById('element-list');
const compoundList = document.getElementById('compound-list');
const tumbler = document.getElementById('tumbler');
const tumblerContent = document.getElementById('tumbler-content');
const tumblerLiquid = document.getElementById('tumbler-liquid');
const tumblerBubbles = document.getElementById('tumbler-bubbles');
const tumblerSparkle = document.getElementById('tumbler-sparkle');
const tumblerLabel = document.getElementById('tumbler-label');
const reactBtn = document.getElementById('react-btn');
const resultDiv = document.getElementById('result');
const animationDiv = document.getElementById('animation');

function updateTumblerLiquid() {
    // Liquid height based on number of compounds/elements
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
        if (c.type === 'element') {
            el.style.background = c.color || '#e0e7ff';
            el.style.borderColor = '#2a4d69';
            el.title = c.name + ' (Element)';
        } else {
            el.title = c.name + ' (Compound)';
        }
        tumblerContent.appendChild(el);
    });
    updateTumblerLiquid();
    tumblerLabel.innerText = selectedCompounds.length ? 'Ready to React!' : 'Drop elements or compounds here!';
}

function handleDragStart(e, type) {
    if (e.target.classList.contains(type + '-card')) {
        e.dataTransfer.setData('text/plain', JSON.stringify({
            formula: e.target.dataset.formula,
            name: e.target.dataset.name,
            type: type,
            color: e.target.style.background
        }));
        e.target.classList.add('dragging');
    }
}
function handleDragEnd(e, type) {
    if (e.target.classList.contains(type + '-card')) {
        e.target.classList.remove('dragging');
    }
}
[elementList, compoundList].forEach((list, idx) => {
    const type = idx === 0 ? 'element' : 'compound';
    list.addEventListener('dragstart', e => handleDragStart(e, type));
    list.addEventListener('dragend', e => handleDragEnd(e, type));
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
    let data = e.dataTransfer.getData('text/plain');
    try { data = JSON.parse(data); } catch { return; }
    if (!selectedCompounds.some(c => c.formula === data.formula)) {
        selectedCompounds.push(data);
        renderTumblerContent();
    }
});

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
        resultDiv.innerHTML = '<span style="color:red">Select at least two elements or compounds by dragging them into the tumbler.</span>';
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
    tumblerBubbles.innerHTML = '';
    tumblerSparkle.innerHTML = '';
    // Animate tumbler liquid color change
    if (type === 'neutralization') {
        tumblerLiquid.style.background = 'linear-gradient(180deg, #b2f7b8 0%, #4fc3f7 100%)';
        // Bubbles
        for (let i = 0; i < 5; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            bubble.style.left = (40 + i * 22) + 'px';
            bubble.style.animationDelay = (i * 0.3) + 's';
            tumblerBubbles.appendChild(bubble);
        }
        // Sparkle
        for (let i = 0; i < 3; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = (30 + i * 60) + 'px';
            sparkle.style.top = (30 + i * 20) + 'px';
            tumblerSparkle.appendChild(sparkle);
        }
    } else if (type === 'precipitate') {
        tumblerLiquid.style.background = 'linear-gradient(180deg, #ffe082 0%, #b3c6e7 100%)';
        // Precipitate
        const ppt = document.createElement('div');
        ppt.className = 'precipitate';
        ppt.innerText = 'Precipitate';
        animationDiv.appendChild(ppt);
        // Sparkle
        for (let i = 0; i < 2; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = (60 + i * 40) + 'px';
            sparkle.style.top = (40 + i * 30) + 'px';
            tumblerSparkle.appendChild(sparkle);
        }
    } else if (type === 'synthesis' || type === 'combination') {
        tumblerLiquid.style.background = 'linear-gradient(180deg, #b3e6ff 0%, #b3ffb3 100%)';
        for (let i = 0; i < 4; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = (40 + i * 30) + 'px';
            sparkle.style.top = (20 + i * 30) + 'px';
            tumblerSparkle.appendChild(sparkle);
        }
    } else if (type === 'rusting') {
        tumblerLiquid.style.background = 'linear-gradient(180deg, #b87333 0%, #b3c6e7 100%)';
        for (let i = 0; i < 2; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = (80 + i * 30) + 'px';
            sparkle.style.top = (60 + i * 20) + 'px';
            tumblerSparkle.appendChild(sparkle);
        }
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

// --- Search & Autocomplete Feature ---
const searchBar = document.getElementById('search-bar');
const autocompleteList = document.getElementById('autocomplete-list');
const searchResult = document.getElementById('search-result');

let autocompleteResults = [];
let selectedAutocompleteIdx = -1;

searchBar.addEventListener('input', function() {
    const query = searchBar.value.trim();
    if (!query) {
        autocompleteList.style.display = 'none';
        searchResult.innerHTML = '';
        return;
    }
    // Fetch autocomplete from backend
    Promise.all([
        fetch(`/autocomplete_compounds?prefix=${encodeURIComponent(query)}`).then(r => r.json()),
        fetch(`/autocomplete_elements?prefix=${encodeURIComponent(query)}`).then(r => r.json())
    ]).then(([compounds, elements]) => {
        autocompleteResults = [...(compounds.results || []), ...(elements.results || [])];
        renderAutocompleteList();
    });
});

searchBar.addEventListener('keydown', function(e) {
    if (autocompleteList.style.display === 'none') return;
    if (e.key === 'ArrowDown') {
        selectedAutocompleteIdx = Math.min(selectedAutocompleteIdx + 1, autocompleteResults.length - 1);
        updateAutocompleteActive();
        e.preventDefault();
    } else if (e.key === 'ArrowUp') {
        selectedAutocompleteIdx = Math.max(selectedAutocompleteIdx - 1, 0);
        updateAutocompleteActive();
        e.preventDefault();
    } else if (e.key === 'Enter') {
        if (selectedAutocompleteIdx >= 0 && selectedAutocompleteIdx < autocompleteResults.length) {
            selectAutocompleteItem(autocompleteResults[selectedAutocompleteIdx]);
            e.preventDefault();
        }
    }
});

autocompleteList.addEventListener('mousedown', function(e) {
    if (e.target.classList.contains('autocomplete-item')) {
        const idx = parseInt(e.target.dataset.idx);
        selectAutocompleteItem(autocompleteResults[idx]);
    }
});

document.addEventListener('click', function(e) {
    if (!autocompleteList.contains(e.target) && e.target !== searchBar) {
        autocompleteList.style.display = 'none';
    }
});

function renderAutocompleteList() {
    autocompleteList.innerHTML = '';
    if (autocompleteResults.length === 0) {
        autocompleteList.style.display = 'none';
        return;
    }
    autocompleteResults.forEach((item, idx) => {
        const div = document.createElement('div');
        div.className = 'autocomplete-item' + (idx === selectedAutocompleteIdx ? ' active' : '');
        div.innerText = item;
        div.dataset.idx = idx;
        autocompleteList.appendChild(div);
    });
    autocompleteList.style.display = 'block';
    selectedAutocompleteIdx = -1;
}

function updateAutocompleteActive() {
    const items = autocompleteList.querySelectorAll('.autocomplete-item');
    items.forEach((el, idx) => {
        el.classList.toggle('active', idx === selectedAutocompleteIdx);
    });
}

function selectAutocompleteItem(formula) {
    autocompleteList.style.display = 'none';
    searchBar.value = formula;
    // Try to find in local lists
    let found = null;
    // Check compounds
    for (const c of window.compounds || []) {
        if (c.formula === formula || c.name === formula) {
            found = { ...c, type: 'compound' };
            break;
        }
    }
    // Check elements
    if (!found) {
        for (const e of window.elements || []) {
            if (e.symbol === formula || e.name === formula) {
                found = { ...e, type: 'element' };
                break;
            }
        }
    }
    if (found) {
        renderSearchResult(found);
    } else {
        // Not found locally, search the web
        searchResult.innerHTML = '<em>Searching the web for this compound...</em>';
        fetch(`/web_search?query=${encodeURIComponent(formula)}`)
            .then(r => r.json())
            .then(data => {
                if (data && data.result) {
                    renderSearchResult({
                        name: formula,
                        formula: formula,
                        color: '#e0e7ff',
                        type: 'web',
                        webResult: data.result
                    });
                } else {
                    searchResult.innerHTML = '<span style="color:red">No information found online.</span>';
                }
            });
    }
}

function renderSearchResult(item) {
    let html = '';
    if (item.type === 'compound') {
        html = `<b>Compound:</b> ${item.name} (${item.formula}) <button class="add-to-tumbler-btn">Add to Tumbler</button>`;
    } else if (item.type === 'element') {
        html = `<b>Element:</b> ${item.name} (${item.symbol}) <button class="add-to-tumbler-btn">Add to Tumbler</button>`;
    } else if (item.type === 'web') {
        html = `<b>Web Result for:</b> ${item.name}<br><pre>${item.webResult}</pre>`;
    }
    searchResult.innerHTML = html;
    const btn = searchResult.querySelector('.add-to-tumbler-btn');
    if (btn) {
        btn.onclick = function() {
            // Add to tumbler
            if (item.type === 'compound' || item.type === 'element') {
                if (!selectedCompounds.some(c => c.formula === (item.formula || item.symbol))) {
                    selectedCompounds.push({
                        formula: item.formula || item.symbol,
                        name: item.name,
                        type: item.type,
                        color: item.color
                    });
                    renderTumblerContent();
                }
            }
        };
    }
}

// Expose compounds and elements to window for search
window.compounds = [];
window.elements = [];
document.addEventListener('DOMContentLoaded', function() {
    // Parse from DOM
    document.querySelectorAll('.compound-card').forEach(card => {
        window.compounds.push({
            name: card.dataset.name,
            formula: card.dataset.formula,
            color: '',
        });
    });
    document.querySelectorAll('.element-card').forEach(card => {
        window.elements.push({
            name: card.dataset.name,
            symbol: card.dataset.formula,
            color: card.style.background,
        });
    });
});

// Initial render
renderTumblerContent();

// --- AI Assistant Tab ---
const aiDial = document.getElementById('ai-assistant-dial');
const aiPanel = document.getElementById('ai-assistant-panel');
const aiCloseBtn = document.getElementById('ai-close-btn');
const aiChatArea = document.getElementById('ai-chat-area');
const aiChatForm = document.getElementById('ai-chat-form');
const aiChatInput = document.getElementById('ai-chat-input');
const aiMicBtn = document.getElementById('ai-mic-btn');
const aiMicIcon = document.getElementById('ai-mic-icon');

let aiListening = false;
let recognition = null;

// Show/hide panel
aiDial.onclick = () => {
    aiPanel.classList.remove('hidden');
    aiChatInput.focus();
};
aiCloseBtn.onclick = () => {
    aiPanel.classList.add('hidden');
};

// Voice input
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        aiChatInput.value = transcript;
        aiMicBtn.classList.remove('listening');
        aiMicIcon.classList.remove('listening');
        aiListening = false;
    };
    recognition.onend = function() {
        aiMicBtn.classList.remove('listening');
        aiMicIcon.classList.remove('listening');
        aiListening = false;
    };
    aiMicBtn.onclick = function(e) {
        e.preventDefault();
        if (aiListening) {
            recognition.stop();
            aiMicBtn.classList.remove('listening');
            aiMicIcon.classList.remove('listening');
            aiListening = false;
        } else {
            recognition.start();
            aiMicBtn.classList.add('listening');
            aiMicIcon.classList.add('listening');
            aiListening = true;
        }
    };
} else {
    aiMicBtn.disabled = true;
    aiMicBtn.title = 'Voice input not supported in this browser.';
}

// Chat logic
aiChatForm.onsubmit = function(e) {
    e.preventDefault();
    const query = aiChatInput.value.trim();
    if (!query) return;
    addAiUserMsg(query);
    aiChatInput.value = '';
    aiChatInput.disabled = true;
    aiMicBtn.disabled = true;
    fetch(`/web_search?query=${encodeURIComponent(query)}`)
        .then(r => r.json())
        .then(data => {
            addAiBotMsg(data.result || 'No answer found.');
        })
        .finally(() => {
            aiChatInput.disabled = false;
            aiMicBtn.disabled = false;
            aiChatInput.focus();
        });
};

function addAiUserMsg(msg) {
    const div = document.createElement('div');
    div.className = 'ai-user-msg';
    div.innerText = msg;
    aiChatArea.appendChild(div);
    aiChatArea.scrollTop = aiChatArea.scrollHeight;
}
function addAiBotMsg(msg) {
    const div = document.createElement('div');
    div.className = 'ai-bot-msg';
    div.innerText = msg;
    aiChatArea.appendChild(div);
    aiChatArea.scrollTop = aiChatArea.scrollHeight;
} 
