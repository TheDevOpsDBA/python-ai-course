// Presenter view — drives the same courseData with speaker notes,
// timers, and presenter-only commentary.

let pCurrentModule = 0;
let pCurrentSection = 0;

// Timers
let sectionStart = 0;        // ms when section timer (re)started
let sectionElapsed = 0;      // accumulated ms while paused
let sectionRunning = false;
let sessionStart = Date.now();
let timerInterval = null;

// ============================================================
// INIT
// ============================================================

function init() {
    populateModules();
    loadFromHash();
    render();
    startSessionClock();

    document.addEventListener("keydown", onKey);
    window.addEventListener("hashchange", () => { loadFromHash(); render(); });
}

function loadFromHash() {
    // Allow deep-linking like #m=2&s=1
    const m = location.hash.match(/m=(\d+)/);
    const s = location.hash.match(/s=(\d+)/);
    if (m) pCurrentModule = Math.max(0, Math.min(courseData.modules.length - 1, parseInt(m[1])));
    if (s) {
        const max = courseData.modules[pCurrentModule].sections.length - 1;
        pCurrentSection = Math.max(0, Math.min(max, parseInt(s[1])));
    }
}

function updateHash() {
    const newHash = `#m=${pCurrentModule}&s=${pCurrentSection}`;
    if (location.hash !== newHash) {
        history.replaceState(null, "", newHash);
    }
}

// ============================================================
// MODULE / SECTION DROPDOWNS
// ============================================================

function populateModules() {
    const ms = document.getElementById("moduleSelect");
    ms.innerHTML = "";
    courseData.modules.forEach((m, i) => {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = m.title;
        ms.appendChild(opt);
    });
    ms.onchange = () => {
        pCurrentModule = parseInt(ms.value);
        pCurrentSection = 0;
        resetSectionTimer();
        render();
    };
    populateSections();
}

function populateSections() {
    const ss = document.getElementById("sectionSelect");
    ss.innerHTML = "";
    courseData.modules[pCurrentModule].sections.forEach((s, i) => {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = `${i + 1}. ${s.title}`;
        ss.appendChild(opt);
    });
    ss.value = pCurrentSection;
    ss.onchange = () => {
        pCurrentSection = parseInt(ss.value);
        resetSectionTimer();
        render();
    };
}

// ============================================================
// RENDER
// ============================================================

function render() {
    const module = courseData.modules[pCurrentModule];
    const section = module.sections[pCurrentSection];

    document.getElementById("moduleSelect").value = pCurrentModule;
    populateSections();

    document.getElementById("breadcrumb").textContent =
        module.title + " — " + section.title;

    const total = module.sections.length;
    document.getElementById("sectionIndicator").textContent =
        (pCurrentSection + 1) + " / " + total;
    const overallIdx = sectionGlobalIndex();
    const overallTotal = totalSections();
    document.getElementById("presenterProgress").textContent =
        `Section ${overallIdx + 1} of ${overallTotal}`;

    renderLabObjective(module);
    renderContent(section);
    renderDiagram(section);
    renderExamples(section);
    renderSpeakerNotes(module, section);

    updateHash();
}

function renderLabObjective(module) {
    const card = document.getElementById("labObjectiveCard");
    if (!module.labObjective) {
        card.style.display = "none";
        return;
    }
    card.style.display = "block";
    const obj = module.labObjective;
    document.getElementById("labObjText").textContent = obj.objective;
    document.getElementById("labObjTime").textContent = "⏱ " + obj.duration;
    const diff = document.getElementById("labObjDifficulty");
    diff.textContent = "🧠 " + obj.difficulty;
    diff.className = "lab-obj-badge difficulty " + (obj.difficulty || "beginner").toLowerCase();
}

function renderContent(section) {
    document.getElementById("sectionHeading").textContent = section.title;
    let content = section.brief || section.description || "";
    content = content.replace(/<h4>.*?<\/h4>/, "");
    document.getElementById("description").innerHTML = content;
}

function renderDiagram(section) {
    const box = document.getElementById("diagramBox");
    if (section.diagram) {
        box.innerHTML = section.diagram;
        return;
    }
    const id = section.id || "";
    const dt = (typeof sectionDiagramTypes !== "undefined" && sectionDiagramTypes[id]) || "generic";
    if (typeof getDiagramSVG === "function") {
        box.innerHTML = getDiagramSVG(dt, section.title);
    } else {
        box.innerHTML = "";
    }
}

function renderExamples(section) {
    const sel = document.getElementById("exampleSelect");
    const preview = document.getElementById("codePreview");
    sel.innerHTML = "";
    if (!section.examples || section.examples.length === 0) {
        sel.style.display = "none";
        preview.textContent = "(No example code in this section.)";
        return;
    }
    sel.style.display = "";
    section.examples.forEach((ex, i) => {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = ex.name;
        sel.appendChild(opt);
    });
    sel.onchange = () => {
        preview.textContent = section.examples[parseInt(sel.value)].code;
    };
    preview.textContent = section.examples[0].code;
}

function copyExampleCode() {
    const text = document.getElementById("codePreview").textContent;
    navigator.clipboard.writeText(text);
}

// ============================================================
// SPEAKER NOTES (auto-generated + optional overrides)
// ============================================================

function renderSpeakerNotes(module, section) {
    const body = document.getElementById("presenterNotesBody");
    const notes = buildNotes(module, section);

    let html = "";

    // Module Lab Objective recap
    if (pCurrentSection === 0 && module.labObjective) {
        html += `<div class="notes-section intro"><h4>🎯 Module kickoff</h4>`;
        html += `<p style="color:#cbd5e1;font-size:14px;margin:0 0 8px"><strong>Set the scene:</strong> "${module.labObjective.objective}"</p>`;
        html += `<ul>`;
        if (module.labObjective.skills) html += `<li>Skills they'll walk away with: <strong>${module.labObjective.skills.join(", ")}</strong></li>`;
        if (module.labObjective.duration) html += `<li>Plan to spend about <strong>${module.labObjective.duration}</strong></li>`;
        html += `</ul></div>`;
    }

    if (notes.intro && notes.intro.length) {
        html += renderList("intro", "🎤 Open with", notes.intro);
    }
    if (notes.keyPoints && notes.keyPoints.length) {
        html += renderList("intro", "🔑 Key points to land", notes.keyPoints);
    }
    if (notes.demo && notes.demo.length) {
        html += renderList("demo", "🛠 Live demo flow", notes.demo, true);
    }
    if (notes.qa && notes.qa.length) {
        html += `<div class="notes-section qa"><h4>❓ Likely questions</h4>`;
        notes.qa.forEach(({ q, a }) => {
            html += `<div class="qa-q">Q: ${q}</div><div class="qa-a">A: ${a}</div>`;
        });
        html += `</div>`;
    }
    if (notes.recap && notes.recap.length) {
        html += renderList("recap", "🔁 Wrap up with", notes.recap);
    }

    if (notes.cta) {
        html += `<div class="notes-cta">${notes.cta}</div>`;
    }

    body.innerHTML = html || "<p style='color:#94a3b8'>No notes for this section.</p>";
}

function renderList(cls, title, items, ordered) {
    const tag = ordered ? "ol" : "ul";
    let html = `<div class="notes-section ${cls}"><h4>${title}</h4><${tag}>`;
    items.forEach(item => { html += `<li>${item}</li>`; });
    html += `</${tag}></div>`;
    return html;
}

/**
 * Build presenter notes for a section.
 * Priority:
 *  1. Explicit `section.presenter` object (intro / keyPoints / demo / qa / recap / cta)
 *  2. Falls back to auto-generated notes derived from existing fields
 */
function buildNotes(module, section) {
    if (section.presenter) {
        // Merge explicit notes with auto-derived ones for any missing keys
        const auto = autoNotes(module, section);
        return Object.assign({}, auto, section.presenter);
    }
    return autoNotes(module, section);
}

function autoNotes(module, section) {
    const notes = { intro: [], keyPoints: [], demo: [], qa: [], recap: [], cta: "" };

    // Intro — frame it for IT pros
    notes.intro.push(`Read the section title aloud: <strong>${section.title}</strong>.`);
    if (section.brief || section.description) {
        const firstSentence = strip(section.brief || section.description).split(/[.!?]/)[0];
        if (firstSentence && firstSentence.length > 8) {
            notes.intro.push(`Lead with: "${firstSentence.trim()}."`);
        }
    }
    notes.intro.push("Ask one warm-up question to gauge familiarity (e.g., \"How many of you have used this before?\").");

    // Key points pulled from <li> bullets in the description
    const bullets = extractBullets(section.brief || section.description || "");
    bullets.slice(0, 6).forEach(b => notes.keyPoints.push(b));
    if (notes.keyPoints.length === 0) {
        notes.keyPoints.push("Walk students through the diagram on the left.");
    }

    // Demo flow from examples
    if (section.examples && section.examples.length > 0) {
        notes.demo.push("Open the right panel in the student lab so attendees can follow along.");
        section.examples.forEach((ex, i) => {
            notes.demo.push(`<strong>${ex.name}</strong> — paste/show the code, run it, point out the output.`);
        });
        if (section.examples.length > 1) {
            notes.demo.push("Highlight the difference between the simpler and more advanced examples.");
        }
        notes.demo.push("Encourage students to modify a value (e.g., change a name, a number) and re-run to internalise it.");
    } else if (section.lab) {
        notes.demo.push("This is a hands-on section — let students attempt the lab challenge first.");
        notes.demo.push("Walk around or share screen as they work; expect 5-10 min of quiet coding time.");
    } else {
        notes.demo.push("This is a conceptual section — no live coding. Use the diagram and bullets to drive the discussion.");
    }

    // Likely questions
    notes.qa = inferQuestions(section);

    // Recap
    notes.recap.push("Summarise the one-line takeaway in your own words.");
    if (section.lab) {
        notes.recap.push("Confirm everyone has attempted the hands-on challenge before moving on.");
    }
    notes.recap.push("Ask: \"Any blockers before we move to the next section?\"");

    // CTA / module wrap
    const isLastInModule = pCurrentSection === module.sections.length - 1;
    if (isLastInModule) {
        notes.cta = `🎉 <strong>End of ${module.title}.</strong> Encourage students to view their badge progress and leaderboard standing before the break.`;
    } else if (section.lab) {
        notes.cta = `💡 Tip: this section has a Hands-On Challenge — make sure students click <strong>✓ Check My Code</strong> for AI feedback.`;
    }

    return notes;
}

// Pull the <li> texts out of the description HTML, strip tags
function extractBullets(html) {
    const out = [];
    const re = /<li>([\s\S]*?)<\/li>/gi;
    let m;
    while ((m = re.exec(html)) !== null) {
        const text = strip(m[1]).trim();
        if (text) out.push(text);
    }
    return out;
}

function strip(html) {
    const div = document.createElement("div");
    div.innerHTML = html || "";
    return div.textContent || div.innerText || "";
}

function inferQuestions(section) {
    const title = (section.title || "").toLowerCase();
    const all = [];

    // Generic question patterns by topic keyword
    const patterns = [
        { match: /variable|f-string|string|input|output/, qa: [
            { q: "Why use f-strings instead of concatenation?", a: "They're faster, more readable, and let you embed expressions directly: <code>f\"CPU: {cpu}%\"</code>." }
        ]},
        { match: /list|tuple/, qa: [
            { q: "When should I use a tuple vs a list?", a: "Tuples are immutable — use them for fixed records like <code>(host, port)</code>. Lists are for collections that change." }
        ]},
        { match: /dict|json/, qa: [
            { q: "Are dicts ordered?", a: "Yes — since Python 3.7 they preserve insertion order. Use that when serialising to JSON." }
        ]},
        { match: /if|else|elif|condition/, qa: [
            { q: "Can I do switch/case?", a: "Python 3.10+ has <code>match/case</code>; before that, an if/elif chain or a dict lookup is idiomatic." }
        ]},
        { match: /loop|for|while|range/, qa: [
            { q: "When should I use a list comprehension instead of a loop?", a: "When you're building a new list from an iterable. If you have side-effects (logging, API calls), use a regular loop." }
        ]},
        { match: /function|def|lambda|argument/, qa: [
            { q: "Why use type hints?", a: "They document intent and let editors catch bugs early — they're optional at runtime." }
        ]},
        { match: /error|exception|try|except/, qa: [
            { q: "Should I catch <code>Exception</code> or be specific?", a: "Always be specific. Catching everything hides bugs. Catch <code>FileNotFoundError</code>, <code>ValueError</code>, etc." }
        ]},
        { match: /file|csv|read|write/, qa: [
            { q: "Why use <code>with open(...)</code>?", a: "It auto-closes the file even if an exception is raised — cleaner than manual <code>open()/close()</code>." }
        ]},
        { match: /class|object|inherit/, qa: [
            { q: "When do I need a class?", a: "When you have data that always travels with the same set of operations. For simple records, a dict or dataclass is enough." }
        ]},
        { match: /pip|module|package|import/, qa: [
            { q: "Should I use <code>pip install</code> globally or in a venv?", a: "Always in a venv. It isolates dependencies per project and keeps your system Python clean." }
        ]},
        { match: /ai|ml|machine learning|model/, qa: [
            { q: "Do I need GPUs to learn ML?", a: "No — CPU is fine for the basics and small datasets. GPUs matter for deep learning training, not classical ML." }
        ]},
        { match: /llm|prompt|gpt|generative/, qa: [
            { q: "How do I keep my API key safe?", a: "Never commit it. Load from an environment variable: <code>os.getenv(\"OPENAI_API_KEY\")</code>." }
        ]},
        { match: /api|request|http/, qa: [
            { q: "Why use <code>requests</code> over <code>urllib</code>?", a: "<code>requests</code> has a cleaner API and handles JSON, headers, and sessions out of the box." }
        ]}
    ];

    patterns.forEach(p => {
        if (p.match.test(title) || p.match.test(strip(section.brief || section.description || "").toLowerCase())) {
            all.push(...p.qa);
        }
    });

    // Fallback so every section has at least one Q&A
    if (all.length === 0) {
        all.push({
            q: "How does this apply to my day job?",
            a: "Tie it to the audience: SQL DBAs can use this to automate reports; infra engineers to monitor servers; DevOps to glue tools together."
        });
    }

    // Limit to 3 to keep notes scannable
    return all.slice(0, 3);
}

// ============================================================
// NAVIGATION
// ============================================================

function nextSection() {
    const total = courseData.modules[pCurrentModule].sections.length;
    if (pCurrentSection < total - 1) {
        pCurrentSection++;
    } else if (pCurrentModule < courseData.modules.length - 1) {
        pCurrentModule++;
        pCurrentSection = 0;
    }
    resetSectionTimer();
    render();
}

function prevSection() {
    if (pCurrentSection > 0) {
        pCurrentSection--;
    } else if (pCurrentModule > 0) {
        pCurrentModule--;
        pCurrentSection = courseData.modules[pCurrentModule].sections.length - 1;
    }
    resetSectionTimer();
    render();
}

function sectionGlobalIndex() {
    let n = 0;
    for (let i = 0; i < pCurrentModule; i++) n += courseData.modules[i].sections.length;
    return n + pCurrentSection;
}
function totalSections() {
    return courseData.modules.reduce((a, m) => a + m.sections.length, 0);
}

// ============================================================
// TIMERS
// ============================================================

function startSessionClock() {
    timerInterval = setInterval(() => {
        // Session
        const sessionMs = Date.now() - sessionStart;
        document.getElementById("sessionTimer").textContent = formatHMS(sessionMs);

        // Section
        let sec = sectionElapsed;
        if (sectionRunning) sec += Date.now() - sectionStart;
        const secEl = document.getElementById("sectionTimer");
        secEl.textContent = formatMS(sec);

        // Section warn / over against module duration
        const target = parseDurationMin(currentModuleDuration());
        if (target) {
            const sectionsInModule = courseData.modules[pCurrentModule].sections.length;
            const perSection = (target * 60 * 1000) / sectionsInModule;
            secEl.classList.remove("warn", "over");
            if (sec > perSection * 1.5) secEl.classList.add("over");
            else if (sec > perSection)   secEl.classList.add("warn");
        }
    }, 500);
}

function toggleTimer() {
    const btn = document.getElementById("timerBtn");
    if (sectionRunning) {
        sectionElapsed += Date.now() - sectionStart;
        sectionRunning = false;
        btn.textContent = "▶ Resume";
    } else {
        sectionStart = Date.now();
        sectionRunning = true;
        btn.textContent = "⏸ Pause";
    }
}
function resetSectionTimer() {
    sectionElapsed = 0;
    sectionStart = Date.now();
    sectionRunning = false;
    const btn = document.getElementById("timerBtn");
    if (btn) btn.textContent = "▶ Start";
    const el = document.getElementById("sectionTimer");
    if (el) {
        el.textContent = "00:00";
        el.classList.remove("warn", "over");
    }
}

function currentModuleDuration() {
    const mod = courseData.modules[pCurrentModule];
    return (mod.labObjective && mod.labObjective.duration) || "";
}
function parseDurationMin(s) {
    if (!s) return 0;
    const m = s.match(/(\d+)\s*min/i);
    return m ? parseInt(m[1]) : 0;
}
function formatMS(ms) {
    const total = Math.floor(ms / 1000);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}
function formatHMS(ms) {
    const total = Math.floor(ms / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

// ============================================================
// MISC
// ============================================================

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
    } else {
        document.exitFullscreen();
    }
}

function toggleNotesSize() {
    const notes = document.querySelector(".presenter-notes");
    notes.classList.toggle("large");
    document.getElementById("notesSizeBtn").textContent = notes.classList.contains("large") ? "A−" : "A+";
}

function onKey(e) {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") return;

    switch (e.key) {
        case "ArrowRight": e.preventDefault(); nextSection(); break;
        case "ArrowLeft":  e.preventDefault(); prevSection(); break;
        case "t": case "T": e.preventDefault(); toggleTimer(); break;
        case "r": case "R": e.preventDefault(); resetSectionTimer(); break;
        case "f": case "F": e.preventDefault(); toggleFullscreen(); break;
        case "s": case "S": e.preventDefault(); window.open("index.html", "_blank"); break;
        case "?":           e.preventDefault(); document.getElementById("presenterHelp").style.display = "flex"; break;
        case "Escape":      document.getElementById("presenterHelp").style.display = "none"; break;
    }
}

window.onload = init;
