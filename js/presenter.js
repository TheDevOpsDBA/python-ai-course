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
    const sectionKey = "presenterNotes." + (section.id || `m${pCurrentModule}s${pCurrentSection}`);

    // Check if we have saved custom notes for this section
    const saved = localStorage.getItem(sectionKey);

    if (saved) {
        // Render saved version with an info bar
        body.innerHTML = renderNotesToolbar(sectionKey, true) + saved;
        makeNotesEditable(body);
        return;
    }

    // Auto-generate notes
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

    body.innerHTML = renderNotesToolbar(sectionKey, false) + (html || "<p style='color:#94a3b8'>No notes for this section.</p>");
    makeNotesEditable(body);
}

function renderNotesToolbar(sectionKey, hasSaved) {
    return `<div class="notes-toolbar" data-key="${sectionKey}">
        <button class="notes-save-btn" onclick="savePresenterNotes()" title="Save your edits">💾 Save</button>
        ${hasSaved ? '<button class="notes-reset-btn" onclick="resetPresenterNotes()" title="Discard edits, regenerate from auto">↺ Reset to auto</button>' : ''}
        <span class="notes-status" id="notesStatus">${hasSaved ? '✓ Custom notes loaded' : '✎ Click any text to edit'}</span>
    </div>`;
}

function makeNotesEditable(container) {
    // Make each notes-section's content editable
    container.querySelectorAll('.notes-section, .notes-cta').forEach(el => {
        el.setAttribute('contenteditable', 'true');
        el.setAttribute('spellcheck', 'true');
    });
    // Also make the module kickoff <p> and Q&A blocks editable individually
    container.querySelectorAll('.qa-q, .qa-a').forEach(el => {
        el.setAttribute('contenteditable', 'true');
    });
}

function savePresenterNotes() {
    const body = document.getElementById("presenterNotesBody");
    if (!body) return;
    const toolbar = body.querySelector('.notes-toolbar');
    if (!toolbar) return;
    const key = toolbar.getAttribute('data-key');
    if (!key) return;

    // Grab everything after the toolbar as the saved content
    const clone = body.cloneNode(true);
    const tb = clone.querySelector('.notes-toolbar');
    if (tb) tb.remove();
    const html = clone.innerHTML;

    localStorage.setItem(key, html);

    const status = document.getElementById('notesStatus');
    if (status) {
        status.textContent = '✓ Saved';
        status.style.color = '#6ee7d3';
        setTimeout(() => { status.textContent = '✎ Editing'; status.style.color = ''; }, 2000);
    }

    // Ensure the reset button exists now
    if (!toolbar.querySelector('.notes-reset-btn')) {
        const btn = document.createElement('button');
        btn.className = 'notes-reset-btn';
        btn.textContent = '↺ Reset to auto';
        btn.onclick = resetPresenterNotes;
        btn.title = 'Discard edits, regenerate from auto';
        toolbar.insertBefore(btn, toolbar.querySelector('.notes-status'));
    }
}

function resetPresenterNotes() {
    const body = document.getElementById("presenterNotesBody");
    if (!body) return;
    const toolbar = body.querySelector('.notes-toolbar');
    if (!toolbar) return;
    const key = toolbar.getAttribute('data-key');
    if (!key) return;

    if (!confirm('Reset these notes to auto-generated? Your custom edits for this section will be lost.')) return;

    localStorage.removeItem(key);
    render(); // re-render the whole section which triggers renderSpeakerNotes fresh
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
    const bullets = extractBullets(section.brief || section.description || "");
    const sTitle = section.title || "";

    // ===== INTRO — what to actually say out loud =====
    notes.intro.push(`<em>"Alright, let's move to our next section: <strong>${sTitle}</strong>."</em>`);
    if (bullets.length > 0) {
        notes.intro.push(`<em>"Here's the big picture — by the end of this section you'll be able to ${bullets[0].toLowerCase()}${bullets[0].endsWith('.') ? '' : '.'}"</em>`);
    }
    notes.intro.push(`<em>"Before I dive in — quick show of hands, has anyone here worked with ${guessTopicFromTitle(sTitle)} before? No? Perfect, we'll start from zero."</em>`);

    // ===== KEY POINTS — expanded into spoken explanations =====
    if (bullets.length > 0) {
        bullets.slice(0, 5).forEach((b, i) => {
            notes.keyPoints.push(expandBulletIntoScript(b, i + 1, bullets.length));
        });
    } else {
        notes.keyPoints.push(`<em>"Let me walk you through the diagram on the left — this shows the flow of what we're building."</em>`);
    }

    // ===== DEMO — step-by-step spoken instructions =====
    if (section.examples && section.examples.length > 0) {
        notes.demo.push(`<em>"OK, let's see this in action. I'm going to open the code panel on the right."</em>`);
        section.examples.forEach((ex, i) => {
            if (i === 0) {
                notes.demo.push(`<em>"This first example is called <strong>${ex.name}</strong>. Let me read through it line by line…"</em> → point at each line, explain what it does.`);
                notes.demo.push(`<em>"Now watch what happens when I run it…"</em> → Copy and run in terminal. Point out the output.`);
            } else {
                notes.demo.push(`<em>"Now let's look at a slightly different version: <strong>${ex.name}</strong>. Notice how ${guessWhatChanged(ex.name)} — that's the key difference."</em>`);
            }
        });
        notes.demo.push(`<em>"Try changing one value yourself — maybe swap the server name or the ticket ID — and run it again. See what changes in the output."</em>`);
    } else {
        notes.demo.push(`<em>"This is a concept section — no code to run here. Let me explain the diagram and we'll get to hands-on in the next section."</em>`);
    }

    // ===== Q&A — Jira / PowerShell / REST specific =====
    notes.qa = inferQuestions(section);

    // ===== RECAP — what to say before moving on =====
    notes.recap.push(`<em>"To summarise this section in one line: ${generateOneLineSummary(sTitle, bullets)}."</em>`);
    if (section.examples && section.examples.length > 0) {
        notes.recap.push(`<em>"Make sure you've copied and run at least one of those examples before we move on. If you got an error, paste it into the AI mentor — it'll tell you exactly what went wrong."</em>`);
    }
    notes.recap.push(`<em>"Any questions or blockers? … Good. Let's move to the next section."</em>`);

    // ===== CTA =====
    const isLastInModule = pCurrentSection === module.sections.length - 1;
    if (isLastInModule) {
        notes.cta = `🎉 <em>"That wraps up <strong>${module.title}</strong>. Great work. Check your badge progress — you might have just earned one. Take a 5-minute break and we'll start the next module."</em>`;
    }

    return notes;
}

// Expand a bare bullet ("Variables store data using the $ prefix") into a spoken script
function expandBulletIntoScript(bullet, index, total) {
    const b = bullet.replace(/<[^>]+>/g, '').trim();
    if (index === 1) {
        return `<em>"First thing to know: ${b.charAt(0).toLowerCase() + b.slice(1)}${b.endsWith('.') ? '' : '.'} This is the foundation — everything else in this section builds on it."</em>`;
    }
    if (index === total || index >= 5) {
        return `<em>"And finally: ${b.charAt(0).toLowerCase() + b.slice(1)}${b.endsWith('.') ? '' : '.'} Keep this one in mind when we get to the hands-on part."</em>`;
    }
    const connectors = [
        "Next up: ",
        "Building on that: ",
        "Here's the practical part: ",
        "Related to that: "
    ];
    const connector = connectors[(index - 2) % connectors.length];
    return `<em>"${connector}${b.charAt(0).toLowerCase() + b.slice(1)}${b.endsWith('.') ? '' : '.'}"</em>`;
}

// Guess the topic for the warm-up question from section title
function guessTopicFromTitle(title) {
    const t = title.toLowerCase();
    if (t.includes('variable'))    return 'PowerShell variables';
    if (t.includes('array') || t.includes('hashtable')) return 'arrays or hashtables';
    if (t.includes('if') || t.includes('switch') || t.includes('condition')) return 'conditional logic in PowerShell';
    if (t.includes('loop') || t.includes('foreach')) return 'loops or iteration';
    if (t.includes('function') || t.includes('param')) return 'writing custom functions';
    if (t.includes('json'))        return 'working with JSON in scripts';
    if (t.includes('file') || t.includes('read') || t.includes('write')) return 'file I/O in PowerShell';
    if (t.includes('rest') || t.includes('api') || t.includes('invoke')) return 'calling REST APIs from PowerShell';
    if (t.includes('jira'))        return 'the Jira REST API';
    if (t.includes('auth'))        return 'API authentication';
    if (t.includes('ticket') || t.includes('issue')) return 'Jira ticket operations';
    if (t.includes('email') || t.includes('report')) return 'automated reporting';
    if (t.includes('module') || t.includes('import')) return 'PowerShell modules';
    if (t.includes('status') || t.includes('transition')) return 'Jira workflow transitions';
    return 'this particular topic';
}

// Guess what changed between examples for transition text
function guessWhatChanged(exName) {
    const n = exName.toLowerCase();
    if (n.includes('error') || n.includes('handling')) return 'we added error handling';
    if (n.includes('advanced') || n.includes('full')) return 'we combined everything into a complete script';
    if (n.includes('param') || n.includes('function')) return 'we wrapped it in a reusable function';
    if (n.includes('loop') || n.includes('multi') || n.includes('batch')) return 'we loop through multiple items';
    return 'the approach is slightly different';
}

// Generate a one-line summary from the title + bullets
function generateOneLineSummary(title, bullets) {
    const clean = title.replace(/^\d+\.\d+\s*/, '').replace(/^Module \d+:\s*/i, '');
    if (bullets.length > 0) {
        const firstBullet = bullets[0].replace(/<[^>]+>/g, '').trim().toLowerCase();
        return `you now know how to ${firstBullet.length > 60 ? clean.toLowerCase() : firstBullet}`;
    }
    return `you've covered ${clean}`;
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
    const content = strip(section.brief || section.description || "").toLowerCase();
    const all = [];

    const patterns = [
        { match: /variable|string|interpolat/, qa: [
            { q: "When should I use single quotes vs double quotes?", a: "Double quotes expand variables (<code>\"Hello $name\"</code>). Single quotes are literal — no expansion. Use single quotes for strings that shouldn't change, like JSON keys." }
        ]},
        { match: /array|hashtable|@\(|@\{/, qa: [
            { q: "What's the difference between @() and @{}?", a: "<code>@()</code> creates an array (ordered list). <code>@{}</code> creates a hashtable (key-value pairs). APIs usually want hashtables for their body, arrays for lists of items." }
        ]},
        { match: /if|else|switch|condition/, qa: [
            { q: "When should I use Switch instead of if/elseif?", a: "When you're comparing one value against 3+ possibilities. Switch is cleaner and faster to read — think of it like a routing table for values." }
        ]},
        { match: /loop|foreach|for\b|while/, qa: [
            { q: "ForEach-Object vs foreach — what's the difference?", a: "<code>ForEach-Object</code> works in the pipeline (<code>| ForEach-Object {...}</code>). The <code>foreach</code> statement loads everything into memory first — faster for large sets, but can't stream." }
        ]},
        { match: /function|param|parameter/, qa: [
            { q: "Why use [Parameter(Mandatory)]?", a: "It forces the caller to provide the value — PowerShell will prompt them if they forget. Prevents silent failures from empty variables hitting your API call." }
        ]},
        { match: /json|convert/, qa: [
            { q: "Why does my JSON look flat / only 2 levels deep?", a: "ConvertTo-Json defaults to depth 2. Add <code>-Depth 10</code> for nested objects. This bites everyone at least once with Jira payloads." }
        ]},
        { match: /file|read|write|get-content/, qa: [
            { q: "Get-Content vs Import-Csv — when to use which?", a: "Get-Content reads raw lines. Import-Csv parses structure. For JSON configs use <code>Get-Content | ConvertFrom-Json</code>." }
        ]},
        { match: /module|import-module|psm1/, qa: [
            { q: "Why use -Force when importing during development?", a: "Without -Force, PowerShell uses the cached version from the first import in that session. -Force reloads from disk — critical when you're editing the module between runs." }
        ]},
        { match: /rest|api|invoke-restmethod|invoke-webrequest/, qa: [
            { q: "Invoke-RestMethod vs Invoke-WebRequest — which one?", a: "RestMethod auto-parses JSON into objects — cleaner for APIs. WebRequest gives you raw access to headers, status codes, and redirects — use it when you need to inspect the full response." }
        ]},
        { match: /jira|ticket|issue|atlassian/, qa: [
            { q: "Do I need Jira admin access to use the API?", a: "No. A regular Jira user with an API token can read/write issues they have permission to see. Admin is only needed for project-level settings or app management." }
        ]},
        { match: /auth|token|credential|basic|oauth/, qa: [
            { q: "API token vs OAuth — which should I use?", a: "For scripts (automation by one person): API token with Basic auth — simple and effective. For apps that act on behalf of many users: OAuth 2.0. Jira Cloud supports both." }
        ]},
        { match: /status|transition|workflow/, qa: [
            { q: "Why can't I transition a ticket directly to 'Done'?", a: "Jira enforces workflow rules. You can only move to transitions allowed from the current status. Use <code>GET /transitions</code> first to find what's available from the current state." }
        ]},
        { match: /email|report|send-mailmessage|html/, qa: [
            { q: "Can I send HTML emails from PowerShell?", a: "Yes — <code>Send-MailMessage -BodyAsHtml</code> with an HTML string. Build a table with ConvertTo-Html or string templates. For modern sending, consider the Microsoft Graph API or SendGrid." }
        ]}
    ];

    patterns.forEach(p => {
        if (p.match.test(title) || p.match.test(content)) {
            all.push(...p.qa);
        }
    });

    if (all.length === 0) {
        all.push({
            q: "How would I use this in a real production environment?",
            a: "Frame it for the audience: this exact pattern can run as a scheduled task, a CI/CD step, or a manual on-demand tool. The code is production-ready — just add error handling and logging."
        });
    }

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
    if (e.target.isContentEditable) return;
    if (e.target.closest && e.target.closest('.CodeMirror')) return;

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


// ============================================================
// ADMIN — manage student records
// ============================================================

let adminCurrentUser = null;
let adminAllUsers = [];

// Wait until Firebase is ready, then check admin status
function bootAdmin() {
    if (!window.fbHelpers) return;
    window.fbHelpers.onAuthStateChanged(async (user) => {
        if (!user) {
            adminCurrentUser = null;
            document.getElementById("adminBtn").style.display = "none";
            return;
        }
        const isAdmin = await window.fbHelpers.isAdmin(user.uid);
        if (isAdmin) {
            adminCurrentUser = { uid: user.uid, email: user.email || "", displayName: user.displayName || "Admin" };
            document.getElementById("adminBtn").style.display = "";
            document.getElementById("adminBtn").textContent = "👥 Manage Users";
        } else {
            // Signed in but not an admin — keep button hidden, but log to console
            adminCurrentUser = null;
            document.getElementById("adminBtn").style.display = "";
            document.getElementById("adminBtn").textContent = "🔒 Admin sign-in";
        }
    });
}

if (window.fbHelpers) {
    bootAdmin();
} else {
    window.addEventListener("firebase-ready", bootAdmin, { once: true });
}

// === Admin button handler ===
function openAdminPanel() {
    if (!adminCurrentUser) {
        // Show admin sign-in
        document.getElementById("adminAuthOverlay").style.display = "flex";
        return;
    }
    document.getElementById("adminOverlay").style.display = "flex";
    refreshAdminUsers();
}

function closeAdminPanel() {
    document.getElementById("adminOverlay").style.display = "none";
}

// === Admin sign-in ===
async function adminSignIn() {
    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value;
    const errorEl = document.getElementById("adminAuthError");
    errorEl.textContent = "";
    if (!email || !password) {
        errorEl.textContent = "Email and password required.";
        return;
    }
    try {
        await window.fbHelpers.signInEmail(email, password);
        // bootAdmin's onAuthStateChanged will run and set adminCurrentUser
        document.getElementById("adminAuthOverlay").style.display = "none";
        document.getElementById("adminPassword").value = "";
        // Wait a tick for the admin status to resolve, then open panel
        setTimeout(() => {
            if (adminCurrentUser) openAdminPanel();
            else errorEl.textContent = "Signed in, but you are not in /admins. Add your UID via Firebase Console.";
        }, 500);
    } catch (err) {
        errorEl.textContent = (err && err.code) === "auth/invalid-credential"
            ? "Wrong email or password."
            : (err && err.message) || "Sign-in failed.";
    }
}

async function adminSignInGoogle() {
    try {
        await window.fbHelpers.signInGoogle();
        document.getElementById("adminAuthOverlay").style.display = "none";
        setTimeout(() => {
            if (adminCurrentUser) openAdminPanel();
            else document.getElementById("adminAuthError").textContent =
                "Signed in, but you are not in /admins. Add your UID via Firebase Console.";
        }, 500);
    } catch (err) {
        document.getElementById("adminAuthError").textContent = (err && err.message) || "Google sign-in failed.";
    }
}

function closeAdminAuth() {
    document.getElementById("adminAuthOverlay").style.display = "none";
}

// === User list operations ===
async function refreshAdminUsers() {
    const subtitle = document.getElementById("adminSubtitle");
    const listEl = document.getElementById("adminList");
    subtitle.textContent = "Loading…";
    listEl.innerHTML = '<div class="admin-loading">Loading users…</div>';

    try {
        adminAllUsers = await window.fbHelpers.listAllUsers();
        adminAllUsers.sort((a, b) => (b.xp || 0) - (a.xp || 0));
        rebuildCourseFilter();
        applyAdminFilters();
        subtitle.textContent = adminAllUsers.length + " enrolments across "
            + new Set(adminAllUsers.map(u => u.course)).size + " courses";
    } catch (err) {
        listEl.innerHTML = '<div class="admin-loading">Failed to load: ' + (err.message || err) + '</div>';
        subtitle.textContent = "Error";
    }
}

function rebuildCourseFilter() {
    const sel = document.getElementById("adminCourseFilter");
    if (!sel) return;
    const courses = Array.from(new Set(adminAllUsers.map(u => u.course))).filter(Boolean).sort();
    const current = sel.value;
    sel.innerHTML = '<option value="">All courses</option>'
        + courses.map(c => `<option value="${c}">${courseLabel(c)}</option>`).join('');
    if (courses.includes(current)) sel.value = current;
}

function courseLabel(courseId) {
    const map = {
        "python-for-ai": "Python for AI",
        "ai-sql-dba":    "AI for SQL Server DBAs",
        "ps-sql-dba":    "PowerShell for SQL DBAs",
        "jira-ps":       "Jira Automation (PowerShell)",
        "(none)":        "(no progress yet)"
    };
    return map[courseId] || courseId;
}

function applyAdminFilters() {
    const q = document.getElementById("adminSearch").value.trim().toLowerCase();
    const course = document.getElementById("adminCourseFilter").value;

    let filtered = adminAllUsers;
    if (course) filtered = filtered.filter(u => u.course === course);
    if (q) {
        filtered = filtered.filter(u =>
            (u.displayName || "").toLowerCase().includes(q) ||
            (u.email || "").toLowerCase().includes(q) ||
            (u.uid || "").toLowerCase().includes(q)
        );
    }

    renderAdminUserList(filtered);

    const footer = document.getElementById("adminFooter");
    const parts = [];
    if (q)      parts.push(`search "${q}"`);
    if (course) parts.push(`course ${courseLabel(course)}`);
    footer.textContent = parts.length
        ? `${filtered.length} of ${adminAllUsers.length} match — ${parts.join(', ')}`
        : `${filtered.length} enrolment${filtered.length === 1 ? '' : 's'}`;
}

// Backwards-compat alias for the old onclick handlers
function filterAdminUsers() { applyAdminFilters(); }

function renderAdminUserList(users) {
    const listEl = document.getElementById("adminList");
    if (!users || users.length === 0) {
        listEl.innerHTML = '<div class="admin-loading">No matching users.</div>';
        return;
    }
    let html = "";
    users.forEach(u => {
        const sec = (u.completedSections || []).length;
        const ch = (u.completedChallenges || []).length;
        const isMe = adminCurrentUser && u.uid === adminCurrentUser.uid;
        const courseTag = u.course && u.course !== "(none)"
            ? `<span class="admin-course-tag course-${u.course}">${courseLabel(u.course)}</span>`
            : `<span class="admin-course-tag none">—</span>`;
        const rowKey = u.uid + "::" + (u.course || "");
        html += `
            <div class="admin-row${isMe ? ' me' : ''}" data-key="${rowKey}">
                <span class="admin-cell admin-name">${esc(u.displayName || "Anonymous")}${isMe ? ' <em>(you)</em>' : ''}</span>
                <span class="admin-cell admin-email">${esc(u.email || "—")}</span>
                <span class="admin-cell">${courseTag}</span>
                <span class="admin-cell admin-xp">${u.xp || 0}</span>
                <span class="admin-cell">${u.level || 1}</span>
                <span class="admin-cell">${sec}</span>
                <span class="admin-cell">${ch}</span>
                <span class="admin-cell admin-actions">
                    <button class="admin-action-btn admin-view"   onclick="adminViewUser('${u.uid}', '${u.course}')"   title="View details">👁</button>
                    <button class="admin-action-btn admin-rename" onclick="adminRenameUser('${u.uid}')"               title="Rename (affects all courses)">✎</button>
                    <button class="admin-action-btn admin-reset"  onclick="adminResetUser('${u.uid}', '${u.course}')"  title="Reset progress for this course">↺</button>
                    <button class="admin-action-btn admin-delete" onclick="adminDeleteUser('${u.uid}', '${u.course}')" title="Delete this course's record">🗑</button>
                </span>
            </div>`;
    });
    listEl.innerHTML = html;
}

function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// === Action handlers ===
async function adminViewUser(uid, courseId) {
    const u = adminAllUsers.find(x => x.uid === uid && (!courseId || x.course === courseId))
        || adminAllUsers.find(x => x.uid === uid)
        || await window.fbHelpers.getUser(uid);
    if (!u) return alert("User not found.");
    const lines = [
        `Name:           ${u.displayName || "—"}`,
        `Email:          ${u.email || "—"}`,
        `UID:            ${u.uid || uid}`,
        `Course:         ${courseLabel(u.course || "")}`,
        `XP:             ${u.xp || 0}`,
        `Level:          ${u.level || 1}`,
        `Sections done:  ${(u.completedSections || []).length}`,
        `Challenges:     ${(u.completedChallenges || []).length} completed, ${(u.viewedChallengeSolutions || []).length} attended`,
        `Code runs:      ${u.codeRuns || 0}`,
        `Labs passed:    ${u.labsCompleted || 0}`,
        `Badges:         ${(u.badges || []).join(", ") || "—"}`
    ];
    alert(lines.join("\n"));
}

async function adminRenameUser(uid) {
    const u = adminAllUsers.find(x => x.uid === uid);
    const current = u ? (u.displayName || "") : "";
    const next = prompt(`Rename student "${current}" to:\n(this updates their identity across ALL courses)`, current);
    if (!next || !next.trim() || next.trim() === current) return;
    try {
        await window.fbHelpers.saveUser(uid, { displayName: next.trim() });
        toast(`Renamed to "${next.trim()}"`);
        refreshAdminUsers();
    } catch (err) {
        alert("Rename failed: " + (err.message || err));
    }
}

async function adminResetUser(uid, courseId) {
    const u = adminAllUsers.find(x => x.uid === uid && x.course === courseId);
    const name = u ? (u.displayName || u.email || uid) : uid;
    const cLabel = courseLabel(courseId || "");
    if (!courseId || courseId === "(none)") {
        return alert("This user has no course progress to reset.");
    }
    if (!confirm(
        `Reset ${cLabel} progress for ${name}?\n\n` +
        `XP, badges, completed sections, and challenges for this course will be cleared.\n` +
        `Their sign-in account and progress on OTHER courses remain intact.`
    )) return;
    try {
        await window.fbHelpers.resetUserProgress(uid, courseId);
        toast(`${cLabel}: reset for ${name}`);
        refreshAdminUsers();
    } catch (err) {
        alert("Reset failed: " + (err.message || err));
    }
}

async function adminDeleteUser(uid, courseId) {
    const u = adminAllUsers.find(x => x.uid === uid && x.course === courseId);
    const name = u ? (u.displayName || u.email || uid) : uid;
    const cLabel = courseLabel(courseId || "");
    if (!courseId || courseId === "(none)") {
        return alert("This user has no course progress to delete.");
    }
    if (!confirm(
        `Delete ${cLabel} record for ${name}?\n\n` +
        `• Removes their progress + leaderboard entry for this course only.\n` +
        `• Their sign-in account and OTHER courses' progress are kept.\n` +
        `• To fully delete the auth account, use the Firebase Console (link in toolbar).\n\n` +
        `Continue?`
    )) return;

    try {
        await window.fbHelpers.deleteUserRecord(uid, courseId);
        toast(`${cLabel}: record deleted for ${name}`);
        refreshAdminUsers();
    } catch (err) {
        alert("Delete failed: " + (err.message || err));
    }
}

function toast(msg) {
    let t = document.getElementById("presenterToast");
    if (!t) {
        t = document.createElement("div");
        t.id = "presenterToast";
        t.className = "presenter-toast";
        document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("visible");
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove("visible"), 2500);
}
