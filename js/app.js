
let editor;
let pyodide;

let currentModule = 0;
let currentSection = 0;

// OpenRouter API Configuration
// Key is injected at deploy time via GitHub Actions
const API_KEY_INJECTED = "__GEMINI_API_KEY__";
let OPENROUTER_API_KEY = API_KEY_INJECTED.startsWith("__") ? localStorage.getItem("openrouter_api_key") || "" : API_KEY_INJECTED;

async function initializeApp() {

    const editorEl = document.getElementById("editor");
    if (!editorEl) return; // Not on the main page

    editor = CodeMirror.fromTextArea(
        editorEl,
        {
            mode: "python",
            theme: "material-darker",
            lineNumbers: true
        }
    );

    pyodide = await loadPyodide();

    loadModules();
}

function loadModules() {

    const moduleSelect = document.getElementById("moduleSelect");
    moduleSelect.innerHTML = "";

    courseData.modules.forEach((module, index) => {

        const option = document.createElement("option");

        option.value = index;
        option.textContent = module.title;

        moduleSelect.appendChild(option);
    });

    moduleSelect.value = currentModule;

    moduleSelect.onchange = function () {

        currentModule = parseInt(this.value);
        currentSection = 0;

        loadSections();
    };

    loadSections();
}

function loadSections() {

    const sectionSelect = document.getElementById("sectionSelect");
    sectionSelect.innerHTML = "";

    const sections =
        courseData.modules[currentModule].sections;

    sections.forEach((section, index) => {

        const option = document.createElement("option");

        option.value = index;
        option.textContent = section.title;

        sectionSelect.appendChild(option);
    });

    sectionSelect.value = currentSection;

    sectionSelect.onchange = function () {

        currentSection = parseInt(this.value);

        renderSection();
    };

    renderSection();
}

function renderSection() {

    const section =
        courseData.modules[currentModule]
        .sections[currentSection];

    document.getElementById("moduleSelect").value =
        currentModule;

    document.getElementById("sectionSelect").value =
        currentSection;

    let content = section.brief || section.description;
    // Remove the h4 heading from content (it's shown separately above diagram)
    content = content.replace(/<h4>.*?<\/h4>/, "");
    document.getElementById("description").innerHTML = content;

    // Set heading above diagram
    document.getElementById("sectionHeading").textContent = section.title;

    // Initialize reveal animation for bullet points
    initReveal();

    document.getElementById("syntax").textContent =
        section.syntax;

    updateDiagram(section);

    renderTabs(section, 0);

    if (section.examples.length > 0) {

        editor.setValue(section.examples[0].code);

    } else {

        editor.setValue("# No examples available");
    }
}

function renderTabs(section, activeIndex) {

    const tabs = document.getElementById("exampleTabs");

    tabs.innerHTML = "";

    // Helper to update active button highlight
    function setActiveTab(btn) {
        tabs.querySelectorAll(".example-btn").forEach(b =>
            b.classList.remove("active-tab")
        );
        btn.classList.add("active-tab");
    }

    const scratchButton =
        document.createElement("button");

    scratchButton.innerText = "âœ Scratch Pad";
    scratchButton.className = "example-btn";

    scratchButton.onclick = () => {

        setActiveTab(scratchButton);

        editor.setValue(
            localStorage.getItem(section.id)
            || "# Scratch Pad"
        );
    };

    tabs.appendChild(scratchButton);

    section.examples.forEach((example, index) => {

        const button =
            document.createElement("button");

        button.className = "example-btn";

        button.innerText = example.name;

        button.onclick = () => {

            setActiveTab(button);

            editor.setValue(example.code);
        };

        tabs.appendChild(button);

        // Highlight the initially active example tab
        if (index === activeIndex) {
            button.classList.add("active-tab");
        }
    });
}

function updateDiagram(section) {

    const container =
        document.querySelector(".diagram-box");

    // Use section's own diagram HTML if provided
    if (section.diagram) {
        container.innerHTML = section.diagram;
        return;
    }

    const title = section.title;
    const id = section.id || "";

    // Look up diagram type by section ID, fall back to "generic"
    const diagramType = sectionDiagramTypes[id] || "generic";

    // Replace the element to force animation restart
    const newBox = container.cloneNode(false);
    newBox.innerHTML = getDiagramSVG(diagramType, title);
    container.parentNode.replaceChild(newBox, container);
}

async function runCode() {

    const output =
        document.getElementById("output");

    output.textContent = "";

    try {

        pyodide.setStdout({
            batched: (message) => {

                output.textContent +=
                    message + "\n";
            }
        });

        await pyodide.runPythonAsync(
            editor.getValue()
        );

    } catch (error) {

        output.textContent = error;
    }
}

async function runSelected() {

    const output =
        document.getElementById("output");

    const selected = editor.getSelection();

    if (!selected.trim()) {
        output.textContent = "âš  No code selected. Highlight lines to run them.";
        return;
    }

    output.textContent = "";

    try {

        pyodide.setStdout({
            batched: (message) => {

                output.textContent +=
                    message + "\n";
            }
        });

        await pyodide.runPythonAsync(selected);

    } catch (error) {

        output.textContent = error;
    }
}

function clearOutput() {

    document.getElementById("output")
        .textContent = "";
}

let revealItems = [];
let revealIndex = 0;

function initReveal() {
    const desc = document.getElementById("description");
    revealItems = desc.querySelectorAll("li");
    revealIndex = 0;
    updateRevealCounter();
}

function revealNext() {
    if (revealIndex < revealItems.length) {
        revealItems[revealIndex].classList.add("revealed");
        revealIndex++;
        updateRevealCounter();
    }
}

function revealAll() {
    revealItems.forEach(item => item.classList.add("revealed"));
    revealIndex = revealItems.length;
    updateRevealCounter();
}

function updateRevealCounter() {
    const counter = document.getElementById("revealCount");
    if (counter) {
        if (revealItems.length === 0) {
            counter.textContent = "";
        } else {
            counter.textContent = `${revealIndex} / ${revealItems.length}`;
        }
    }
}

function previousSection() {

    if (currentSection > 0) {

        currentSection--;

    } else if (currentModule > 0) {

        currentModule--;

        currentSection =
            courseData.modules[currentModule]
            .sections.length - 1;

        loadSections();

        return;
    }

    renderSection();
}

function nextSection() {

    // If there are unrevealed bullets, reveal next one first (PPT mode)
    if (revealIndex < revealItems.length) {
        revealNext();
        return;
    }

    const totalSections =
        courseData.modules[currentModule]
        .sections.length;

    if (currentSection < totalSections - 1) {

        currentSection++;

    } else if (
        currentModule <
        courseData.modules.length - 1
    ) {

        currentModule++;
        currentSection = 0;

        loadSections();

        return;
    }

    renderSection();
}

function toggleDescription() {

    document.querySelector(".left-panel")
        .classList.toggle("fullscreen");
}

window.onload = initializeApp;

// ===== AI Chat Functions =====

function toggleChat() {
    const body = document.getElementById("chatBody");
    body.classList.toggle("open");
    const btn = document.querySelector(".chat-toggle");
    btn.textContent = body.classList.contains("open") ? "â–²" : "â–¼";
}

function addChatMessage(text, role) {
    const messages = document.getElementById("chatMessages");
    const msg = document.createElement("div");
    msg.className = `chat-msg ${role}`;
    msg.innerHTML = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
    return msg;
}

async function sendChat() {
    const input = document.getElementById("chatInput");
    const question = input.value.trim();
    if (!question) return;

    input.value = "";
    addChatMessage(question, "user");

    if (!OPENROUTER_API_KEY) {
        const key = prompt("Enter the AI API key (provided by your instructor):");
        if (key && key.trim()) {
            OPENROUTER_API_KEY = key.trim();
            localStorage.setItem("openrouter_api_key", OPENROUTER_API_KEY);
        } else {
            addChatMessage("No API key provided. Ask your instructor for the key.", "bot");
            return;
        }
    }

    const loadingMsg = addChatMessage("Thinking...", "bot loading");

    const code = editor ? editor.getValue() : "";
    const section = courseData.modules[currentModule].sections[currentSection];

    const chatPrompt = `You are a helpful Python tutor for IT professionals learning Python for automation and AI. You ONLY answer questions related to Python programming, the code shown below, or the course topic. If the question is unrelated to Python or the code, politely decline and ask them to keep questions relevant to the course material.

The student is currently studying: "${section.title}"

Here is the code they are looking at:
\`\`\`python
${code}
\`\`\`

The student asks: "${question}"

Give a clear, helpful answer. If the question is about the code, refer to specific lines. If it's a general Python question related to the course, answer it directly. If it's completely unrelated to Python or programming, politely say you can only help with Python and course-related questions. Keep the answer concise but complete (4-6 sentences).`;

    const models = [
        "google/gemma-4-31b-it:free",
        "nvidia/nemotron-nano-9b-v2:free",
        "openai/gpt-oss-20b:free",
        "google/gemma-4-26b-a4b-it:free"
    ];

    let lastError = "";
    for (const model of models) {
        try {
            console.log("Trying model:", model);
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "HTTP-Referer": window.location.href,
                    "X-Title": "Python for AI - Interactive Course"
                },
                body: JSON.stringify({
                    model: model,
                    messages: [{ role: "user", content: chatPrompt }],
                    max_tokens: 1024,
                    temperature: 0.7
                })
            });

            const data = await response.json();

            if (data.choices && data.choices[0] && data.choices[0].message) {
                let answer = data.choices[0].message.content || "";
                if (answer.trim()) {
                    loadingMsg.remove();
                    answer = answer
                        .replace(/\n\n/g, "<br><br>")
                        .replace(/\n/g, "<br>")
                        .replace(/`([^`]+)`/g, "<code>$1</code>")
                        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
                        .replace(/\*([^*]+)\*/g, "<em>$1</em>");
                    addChatMessage(answer, "bot");
                    return;
                }
            }
            lastError = data.error ? data.error.message : "Empty response";
            console.log("Model failed:", model, lastError);
        } catch (err) {
            lastError = err.message;
            console.log("Model error:", model, err.message);
        }
    }

    loadingMsg.remove();
    addChatMessage(`All models busy. Please try again in a moment. (${lastError})`, "bot");
}

// Keyboard navigation â€” right arrow reveals/advances, left arrow goes back
document.addEventListener("keydown", function(e) {
    // Don't intercept if user is typing in editor, textarea, or chat input
    if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") return;
    if (e.target.classList.contains("CodeMirror")) return;
    if (document.querySelector(".CodeMirror-focused")) return;

    if (e.key === "ArrowRight") {
        e.preventDefault();
        nextSection();
    } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        previousSection();
    }
});


