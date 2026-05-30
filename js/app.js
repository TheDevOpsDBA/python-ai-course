
let editor;
let pyodide;

let currentModule = 0;
let currentSection = 0;

// Gemini API Configuration
// Get your free key at: https://aistudio.google.com/apikey
const GEMINI_API_KEY = "AQ.Ab8RN6KATXcylvZ-VUnm7ATIclhAYAZNbGCm0rW2N-ZKdXbMjQ";

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

    scratchButton.innerText = "✏ Scratch Pad";
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
        output.textContent = "⚠ No code selected. Highlight lines to run them.";
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
    btn.textContent = body.classList.contains("open") ? "▲" : "▼";
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

    if (GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
        addChatMessage("⚠️ Please set your Gemini API key in js/app.js to enable AI chat.", "bot");
        return;
    }

    const loadingMsg = addChatMessage("Thinking...", "bot loading");

    const code = editor ? editor.getValue() : "";
    const section = courseData.modules[currentModule].sections[currentSection];

    const prompt = `You are a helpful Python tutor for IT professionals learning Python for automation and AI. You ONLY answer questions related to Python programming, the code shown below, or the course topic. If the question is unrelated to Python or the code, politely decline and ask them to keep questions relevant to the course material.

The student is currently studying: "${section.title}"

Here is the code they are looking at:
\`\`\`python
${code}
\`\`\`

The student asks: "${question}"

Give a clear, helpful answer. If the question is about the code, refer to specific lines. If it's a general Python question related to the course, answer it directly. If it's completely unrelated to Python or programming, politely say you can only help with Python and course-related questions. Keep the answer concise but complete (4-6 sentences).`;

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        console.log("Chat API request to:", url.replace(GEMINI_API_KEY, "***"));

        const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1024
                    }
                })
            }
        );

        const data = await response.json();
        console.log("Chat API response:", response.status, data);

        if (data.candidates && data.candidates[0]) {
            let answer = data.candidates[0].content.parts[0].text;
            loadingMsg.remove();
            // Format the response
            answer = answer
                .replace(/\n\n/g, "<br><br>")
                .replace(/\n/g, "<br>")
                .replace(/`([^`]+)`/g, "<code>$1</code>")
                .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
                .replace(/\*([^*]+)\*/g, "<em>$1</em>");
            addChatMessage(answer, "bot");
        } else {
            loadingMsg.remove();
            const errMsg = data.error ? data.error.message : "No response generated";
            console.error("Chat API error:", errMsg);
            addChatMessage(`Error: ${errMsg}`, "bot");
        }
    } catch (error) {
        console.error("Chat fetch error:", error);
        loadingMsg.remove();
        addChatMessage(`Connection error: ${error.message}`, "bot");
    }
}

// Keyboard navigation — right arrow reveals/advances, left arrow goes back
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
