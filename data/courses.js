const courseData = {
  "modules": [
    {
      "id": "module0",
      "title": "Module 1: Why IT Pros Need Python for AI",
      "sections": [
        {
          "id": "m1s1",
          "title": "1.1 AI is Not Optional",
          "description": "<p><strong>Artificial Intelligence is reshaping every layer of IT infrastructure.</strong> From automated incident response to predictive capacity planning, AI-driven tools are becoming standard in modern operations — and Python is the language that powers them.</p><p>As an IT professional, understanding Python gives you the ability to build, extend, and troubleshoot the AI pipelines your organisation depends on. Waiting is no longer a viable strategy.</p><h4>Why This Matters</h4><ul><li><strong>AI tools are Python-first:</strong> TensorFlow, PyTorch, scikit-learn, and LangChain are all Python libraries.</li><li><strong>Automation reduces toil:</strong> Repetitive tasks — log parsing, alerting, provisioning — can be scripted and handed off.</li><li><strong>Career relevance:</strong> Roles in DevOps, SRE, and cloud engineering increasingly require scripting and AI integration skills.</li></ul><h4>Key Takeaway</h4><p>Python is not a developer-only skill. It is the operational language of the AI era.</p>",
          "syntax": "# Python is interpreted — run line by line\nprint(\"Hello, Infrastructure\")   # Output to console\n\n# Variables need no type declaration\nhost = \"server-01\"\nport = 8080\nactive = True\n\n# Basic conditional\nif active:\n    print(f\"{host} is listening on port {port}\")",
          "examples": [
            {
              "name": "Hello World",
              "code": "# Your first Python statement\nprint(\"Hello from Python!\")\nprint(\"Python is ready.\")",
              "level": "beginner"
            },
            {
              "name": "Infrastructure Check",
              "code": "# Simulating a basic infrastructure health check\ncpu_usage = 88\nmemory_usage = 72\ndisk_usage = 91\n\nprint(\"=== Infrastructure Health Check ===\")\nprint(f\"CPU:    {cpu_usage}%\")\nprint(f\"Memory: {memory_usage}%\")\nprint(f\"Disk:   {disk_usage}%\")\n\nif cpu_usage > 80 or disk_usage > 90:\n    print(\"\\n[ALERT] One or more thresholds exceeded!\")\nelse:\n    print(\"\\n[OK] All systems within normal range.\")",
              "level": "beginner"
            },
            {
              "name": "AI Relevance",
              "code": "# Demonstrating Python's role in AI workflows\ntools = [\"TensorFlow\", \"PyTorch\", \"scikit-learn\", \"LangChain\", \"Pandas\"]\n\nprint(\"Top Python AI/ML Libraries:\")\nfor i, tool in enumerate(tools, 1):\n    print(f\"  {i}. {tool}\")\n\nprint(\"\\nAll of these run on Python.\")\nprint(\"Python is the language of AI infrastructure.\")",
              "level": "intermediate"
            }
          ],
          "brief": "<h4>AI is Not Optional</h4><ul><li>AI tools are Python-first — TensorFlow, PyTorch, LangChain</li><li>Automation reduces toil — scripting replaces repetitive manual work</li><li>Career relevance — DevOps, SRE, and cloud roles now require Python + AI skills</li><li>Python is the operational language of the AI era</li></ul>"
        },
        {
          "id": "m1s2",
          "title": "1.2 Python in Infrastructure",
          "description": "<p><strong>Python has become the de facto scripting language for infrastructure engineering.</strong> Whether you are managing cloud resources, configuring network devices, or orchestrating containers, Python provides the libraries and flexibility to automate at scale.</p><p>Unlike Bash, Python handles complex data structures, API responses, and error conditions gracefully — making it the right tool for modern infrastructure tasks.</p><h4>Common Infrastructure Use Cases</h4><ul><li><strong>Cloud APIs:</strong> boto3 (AWS), azure-sdk, google-cloud — all Python.</li><li><strong>Configuration Management:</strong> Ansible playbooks call Python modules under the hood.</li><li><strong>Monitoring &amp; Alerting:</strong> Parse logs, query metrics APIs, trigger alerts programmatically.</li><li><strong>Network Automation:</strong> Netmiko and NAPALM use Python to configure routers and switches.</li></ul><h4>Python vs Bash</h4><p>Bash is excellent for simple shell pipelines. Python wins when you need structured data, error handling, reusable functions, or integration with external APIs.</p>",
          "syntax": "# Working with system-level data\nimport os\n\n# Environment variables\nhost = os.environ.get(\"HOSTNAME\", \"unknown\")\n\n# String formatting\nprint(f\"Running on: {host}\")\n\n# Lists and iteration\nservers = [\"web-01\", \"web-02\", \"db-01\"]\nfor server in servers:\n    print(f\"Checking: {server}\")",
          "examples": [
            {
              "name": "Server Inventory",
              "code": "# A simple list of servers\nservers = [\"web-01\", \"web-02\", \"db-01\"]\n\nfor server in servers:\n    print(server)",
              "level": "beginner"
            },
            {
              "name": "Threshold Monitor",
              "code": "# Infrastructure threshold monitoring\nmetrics = {\n    \"web-01\":  {\"cpu\": 45, \"mem\": 60},\n    \"web-02\":  {\"cpu\": 92, \"mem\": 78},\n    \"db-01\":   {\"cpu\": 30, \"mem\": 95},\n}\n\nCPU_LIMIT = 85\nMEM_LIMIT = 90\n\nprint(\"=== Threshold Scan ===\")\nfor host, data in metrics.items():\n    alerts = []\n    if data[\"cpu\"] > CPU_LIMIT:\n        alerts.append(f\"CPU {data['cpu']}%\")\n    if data[\"mem\"] > MEM_LIMIT:\n        alerts.append(f\"MEM {data['mem']}%\")\n    status = \"ALERT: \" + \", \".join(alerts) if alerts else \"OK\"\n    print(f\"  {host:<10} {status}\")",
              "level": "beginner"
            },
            {
              "name": "Log Parser",
              "code": "# Parsing structured log entries\nlogs = [\n    \"2024-01-15 08:12:01 INFO  web-01 Request processed in 120ms\",\n    \"2024-01-15 08:12:05 ERROR web-02 Connection timeout after 30s\",\n    \"2024-01-15 08:12:09 WARN  db-01  Query took 4500ms\",\n    \"2024-01-15 08:12:11 ERROR web-01 Disk write failed: /var/log\",\n]\n\nerrors = [line for line in logs if \"ERROR\" in line]\nwarnings = [line for line in logs if \"WARN\" in line]\n\nprint(f\"Total log entries : {len(logs)}\")\nprint(f\"Errors            : {len(errors)}\")\nprint(f\"Warnings          : {len(warnings)}\")\nprint(\"\\nErrors found:\")\nfor e in errors:\n    print(f\"  {e}\")",
              "level": "intermediate"
            }
          ],
          "brief": "<h4>Python in Infrastructure</h4><ul><li>Cloud APIs — boto3 (AWS), azure-sdk, google-cloud</li><li>Config Management — Ansible uses Python modules internally</li><li>Monitoring — parse logs, query metrics, trigger alerts</li><li>Network Automation — Netmiko, NAPALM for routers/switches</li><li>Python wins over Bash for structured data, error handling, and API integration</li></ul>"
        },
        {
          "id": "m1s3",
          "title": "1.3 Automation Benefits",
          "description": "<p><strong>Automation is the practice of replacing manual, repetitive tasks with code that executes reliably, consistently, and at scale.</strong> In infrastructure, this means fewer human errors, faster response times, and engineers freed up for higher-value work.</p><p>Python automation ranges from simple scripts that rename files to complex pipelines that provision cloud infrastructure, run tests, and deploy applications — all without human intervention.</p><h4>The Four Pillars of Automation Value</h4><ul><li><strong>Speed:</strong> A script that takes 2 seconds replaces a task that took 20 minutes.</li><li><strong>Consistency:</strong> Code runs the same way every time — no missed steps, no typos.</li><li><strong>Scale:</strong> Run the same logic against 1 server or 1,000 servers with no extra effort.</li><li><strong>Auditability:</strong> Code is version-controlled — you know exactly what ran and when.</li></ul><h4>Where to Start</h4><p>Identify the most repetitive task in your current role. If you do it more than twice a week, it is a candidate for automation.</p>",
          "syntax": "# Automation pattern: loop + condition + action\nservers = [\"web-01\", \"web-02\", \"db-01\"]\n\nfor server in servers:\n    # Simulate a check\n    is_healthy = True  # replace with real check\n    if not is_healthy:\n        print(f\"Restarting {server}...\")\n    else:\n        print(f\"{server}: OK\")",
          "examples": [
            {
              "name": "Task Timer",
              "code": "# Comparing manual vs automated time\nmanual_minutes = 30\nauto_seconds = 5\n\nsaved = manual_minutes * 60 - auto_seconds\nprint(f\"Time saved: {saved} seconds\")",
              "level": "beginner"
            },
            {
              "name": "Bulk Operation",
              "code": "# Simulating a bulk configuration push\nservers = [\"web-01\", \"web-02\", \"web-03\", \"web-04\", \"web-05\"]\nconfig = {\"timeout\": 30, \"max_connections\": 500, \"log_level\": \"INFO\"}\n\nprint(\"Pushing configuration to all servers...\\n\")\nsuccess = 0\nfor server in servers:\n    # Simulate deployment (all succeed here)\n    print(f\"  [{server}] Applying config... Done\")\n    success += 1\n\nprint(f\"\\nResult: {success}/{len(servers)} servers updated successfully.\")",
              "level": "beginner"
            },
            {
              "name": "Automation ROI",
              "code": "# Calculate automation return on investment\nscript_build_hours = 4\nscript_runs_per_week = 5\nminutes_saved_per_run = 25\nweeks = 52\n\ntotal_minutes_saved = script_runs_per_week * minutes_saved_per_run * weeks\ntotal_hours_saved = total_minutes_saved / 60\nbuild_cost_hours = script_build_hours\n\nprint(\"=== Automation ROI Calculator ===\")\nprint(f\"Script build time    : {build_cost_hours} hours\")\nprint(f\"Runs per week        : {script_runs_per_week}\")\nprint(f\"Time saved per run   : {minutes_saved_per_run} minutes\")\nprint(f\"Over {weeks} weeks:\")\nprint(f\"  Total time saved   : {total_hours_saved:.1f} hours\")\nprint(f\"  Net gain           : {total_hours_saved - build_cost_hours:.1f} hours\")",
              "level": "intermediate"
            }
          ],
          "brief": "<h4>Automation Benefits</h4><ul><li><strong>Speed</strong> — 2 seconds vs 20 minutes</li><li><strong>Consistency</strong> — no missed steps, no typos</li><li><strong>Scale</strong> — same logic for 1 or 1,000 servers</li><li><strong>Auditability</strong> — version-controlled, traceable</li><li>Rule of thumb: if you do it more than twice a week, automate it</li></ul>"
        }
      ]
    },
    {
      "id": "module1",
      "title": "Module 2: Python Installation & Setup",
      "sections": [
        {
          "id": "m0s1",
          "title": "0.1 Installing Python",
          "description": "<p><strong>Python must be installed on your system before you can write and run scripts.</strong> The official installer from python.org is the recommended approach for Windows and macOS. Linux distributions typically include Python pre-installed.</p><h4>Installation Steps (Windows)</h4><ul><li>Download the latest Python 3.x installer from <code>python.org/downloads</code></li><li><strong>Check \"Add Python to PATH\"</strong> during installation — this is critical</li><li>Choose \"Install Now\" for the default setup, or \"Customize\" for advanced options</li><li>Verify installation by opening a terminal and running <code>python --version</code></li></ul><h4>Installation Steps (macOS / Linux)</h4><ul><li>macOS: Use Homebrew — <code>brew install python</code></li><li>Linux: Usually pre-installed. Update with <code>sudo apt install python3</code> (Debian/Ubuntu)</li><li>Verify: <code>python3 --version</code></li></ul><h4>Key Points</h4><ul><li>Always install Python 3.x (Python 2 is end-of-life)</li><li>The installer includes <code>pip</code> — Python's package manager</li><li>PATH must be configured so your terminal can find the <code>python</code> command</li></ul>",
          "brief": "<h4>Installing Python</h4><ul><li>Download from <code>python.org/downloads</code> — always Python 3.x</li><li><strong>Check \"Add Python to PATH\"</strong> during install (critical step)</li><li>Verify: open terminal → <code>python --version</code></li><li>Includes <code>pip</code> — the package manager for installing libraries</li><li>macOS: <code>brew install python</code> | Linux: usually pre-installed</li></ul>",
          "syntax": "# Verify Python installation in terminal\n# (These are terminal commands, not Python code)\n\n# Windows\n# python --version\n# pip --version\n\n# macOS / Linux\n# python3 --version\n# pip3 --version\n\n# Test Python works\nprint(\"Python is installed and working!\")\nimport sys\nprint(f\"Version: {sys.version}\")",
          "script": "Walk through the installation process.\nShow the python.org download page.\nEmphasise the PATH checkbox.\nDemo: open terminal, run python --version.\nShow pip --version too.",
          "examples": [
            {
              "name": "Verify Install",
              "code": "# Check Python is working\nimport sys\n\nprint(\"Python is installed!\")\nprint(f\"Version: {sys.version}\")",
              "level": "beginner"
            },
            {
              "name": "Check pip",
              "code": "# pip is Python's package manager\n# In a real terminal you'd run:\n#   pip install requests\n#   pip list\n#   pip freeze > requirements.txt\n\n# Here we can check what's available\nimport importlib\n\npackages = [\"json\", \"csv\", \"os\", \"sys\", \"math\"]\n\nprint(\"Built-in modules available:\")\nfor pkg in packages:\n    try:\n        importlib.import_module(pkg)\n        print(f\"  ✓ {pkg}\")\n    except ImportError:\n        print(f\"  ✗ {pkg} (not available)\")",
              "level": "beginner"
            },
            {
              "name": "First Script",
              "code": "# Your very first Python script!\n\nname = \"IT Professional\"\nrole = \"Infrastructure Engineer\"\n\nprint(f\"Hello, {name}!\")\nprint(f\"Role: {role}\")\nprint()\nprint(\"You're about to learn Python for:\")\nprint(\"  1. Automation\")\nprint(\"  2. AI Integration\")\nprint(\"  3. Infrastructure Management\")\nprint()\nprint(\"Let's get started! 🚀\")",
              "level": "intermediate"
            }
          ]
        },
        {
          "id": "m0s2",
          "title": "0.2 Virtual Environments (venv)",
          "description": "<p><strong>A virtual environment is an isolated Python installation that keeps project dependencies separate from each other and from the system Python.</strong> Without virtual environments, installing a package for one project can break another project that needs a different version of the same package.</p><h4>Why You Need venv</h4><ul><li><strong>Dependency isolation:</strong> Project A needs <code>requests==2.28</code>, Project B needs <code>requests==2.31</code> — both work without conflict.</li><li><strong>Reproducibility:</strong> <code>pip freeze > requirements.txt</code> captures exact versions. Anyone can recreate your environment.</li><li><strong>Clean system:</strong> Your global Python stays clean. Delete a venv to remove all its packages instantly.</li><li><strong>No admin rights needed:</strong> Install packages without <code>sudo</code> or administrator access.</li></ul><h4>How It Works</h4><p>A venv is simply a folder (usually named <code>.venv</code> or <code>venv</code>) containing a copy of the Python interpreter and its own <code>pip</code>. When activated, your terminal uses this local Python instead of the system one.</p><h4>Commands</h4><ul><li>Create: <code>python -m venv .venv</code></li><li>Activate (Windows): <code>.venv\\Scripts\\activate</code></li><li>Activate (macOS/Linux): <code>source .venv/bin/activate</code></li><li>Deactivate: <code>deactivate</code></li><li>Install packages: <code>pip install flask requests</code></li><li>Save dependencies: <code>pip freeze > requirements.txt</code></li><li>Restore: <code>pip install -r requirements.txt</code></li></ul>",
          "brief": "<h4>Virtual Environments (venv)</h4><ul><li><strong>Isolates</strong> project dependencies — no conflicts between projects</li><li><strong>Create:</strong> <code>python -m venv .venv</code></li><li><strong>Activate (Win):</strong> <code>.venv\\Scripts\\activate</code></li><li><strong>Activate (Mac/Linux):</strong> <code>source .venv/bin/activate</code></li><li><strong>Install packages:</strong> <code>pip install flask requests</code></li><li><strong>Save deps:</strong> <code>pip freeze > requirements.txt</code></li><li>Delete the folder to remove everything — clean and simple</li></ul>",
          "syntax": "# Terminal commands for virtual environments\n\n# Create a virtual environment\n# python -m venv .venv\n\n# Activate (Windows CMD)\n# .venv\\Scripts\\activate\n\n# Activate (Windows PowerShell)\n# .venv\\Scripts\\Activate.ps1\n\n# Activate (macOS / Linux)\n# source .venv/bin/activate\n\n# Install packages\n# pip install flask requests pandas\n\n# Save dependencies\n# pip freeze > requirements.txt\n\n# Restore on another machine\n# pip install -r requirements.txt\n\n# Deactivate\n# deactivate",
          "script": "Explain WHY venv matters with a real example:\n- Project A needs requests 2.28\n- Project B needs requests 2.31\n- Without venv, one breaks the other.\n\nDemo in terminal:\n1. python -m venv .venv\n2. .venv\\Scripts\\activate\n3. pip install requests\n4. pip freeze\n5. deactivate\n\nShow the .venv folder structure briefly.",
          "examples": [
            {
              "name": "Why venv?",
              "code": "# Why virtual environments matter\nprint(\"Without venv:\")\nprint(\"  Projects share packages = conflicts!\")\nprint()\nprint(\"With venv:\")\nprint(\"  Each project has its own packages.\")\nprint(\"  No conflicts. Clean and isolated.\")",
              "level": "beginner"
            },
            {
              "name": "requirements.txt",
              "code": "# What a requirements.txt looks like\n\nrequirements = \"\"\"\nflask==3.0.0\nrequests==2.31.0\npandas==2.1.4\nnumpy==1.26.2\nscikit-learn==1.3.2\npython-dotenv==1.0.0\n\"\"\"\n\nprint(\"Example requirements.txt:\")\nprint(requirements)\nprint(\"To install all at once:\")\nprint(\"  pip install -r requirements.txt\")\nprint()\nprint(\"To generate from current environment:\")\nprint(\"  pip freeze > requirements.txt\")\nprint()\nprint(\"This makes your project reproducible!\")\nprint(\"Anyone can recreate your exact setup.\")",
              "level": "beginner"
            },
            {
              "name": "Project Structure",
              "code": "# Typical Python project structure with venv\n\nstructure = \"\"\"\nmy-project/\n├── .venv/              ← Virtual environment (don't commit to git)\n│   ├── Scripts/        ← Python + pip executables\n│   └── Lib/            ← Installed packages\n├── src/\n│   ├── main.py         ← Your code\n│   └── utils.py\n├── tests/\n│   └── test_main.py\n├── requirements.txt    ← Dependency list\n├── .gitignore          ← Should include .venv/\n└── README.md\n\"\"\"\n\nprint(structure)\nprint(\"Key rules:\")\nprint(\"  1. NEVER commit .venv/ to git\")\nprint(\"  2. Always commit requirements.txt\")\nprint(\"  3. Create one venv per project\")",
              "level": "intermediate"
            }
          ]
        },
        {
          "id": "m0s3",
          "title": "0.3 VS Code Setup & This Portal",
          "description": "<p><strong>Visual Studio Code (VS Code) is the most popular editor for Python development.</strong> It provides syntax highlighting, IntelliSense (auto-completion), integrated terminal, debugging, and seamless virtual environment support — all for free.</p><h4>VS Code Setup for Python</h4><ul><li>Install VS Code from <code>code.visualstudio.com</code></li><li>Install the <strong>Python extension</strong> by Microsoft (provides IntelliSense, linting, debugging)</li><li>Open your project folder with <code>File → Open Folder</code></li><li>VS Code auto-detects <code>.venv</code> and prompts you to select it as the interpreter</li><li>Use <code>Ctrl+Shift+`</code> to open the integrated terminal (auto-activates venv)</li></ul><h4>Selecting the Python Interpreter</h4><ul><li>Press <code>Ctrl+Shift+P</code> → type \"Python: Select Interpreter\"</li><li>Choose the one inside your <code>.venv</code> folder</li><li>VS Code will use this for running, debugging, and IntelliSense</li></ul><h4>About This Interactive Portal</h4><p>During this course, we use this browser-based interactive portal for demonstrations. It runs real Python code (via Pyodide) directly in your browser — no installation needed. It works the same way as any Python interpreter: you write code, run it, and see output.</p><p>Everything you learn here applies identically to VS Code, PyCharm, or any other editor. The syntax, logic, and libraries are the same everywhere.</p>",
          "brief": "<h4>VS Code Setup & This Portal</h4><ul><li>Install VS Code + <strong>Python extension</strong> by Microsoft</li><li>Open project folder → VS Code auto-detects <code>.venv</code></li><li><code>Ctrl+Shift+P</code> → \"Python: Select Interpreter\" → choose .venv</li><li><code>Ctrl+Shift+`</code> → integrated terminal (auto-activates venv)</li><li><strong>This portal</strong> runs real Python in your browser — same as any interpreter</li><li>Everything here works identically in VS Code, PyCharm, or terminal</li></ul>",
          "syntax": "# VS Code keyboard shortcuts for Python\n\n# Ctrl+Shift+P     → Command Palette\n# Ctrl+Shift+`     → Open Terminal\n# F5               → Run/Debug\n# Ctrl+Space       → IntelliSense suggestions\n# Ctrl+/           → Toggle comment\n# Shift+Alt+F      → Format document\n\n# This portal works the same as VS Code:\n# Write code → Click Run → See output\nprint(\"This runs the same everywhere!\")",
          "script": "Show VS Code briefly:\n1. Open a folder\n2. Create a .venv\n3. Select interpreter (Ctrl+Shift+P)\n4. Open terminal — notice (venv) prefix\n5. Run a simple script\n\nThen explain: for this course, we use this portal.\nIt runs real Python — same syntax, same output.\nNo setup needed for students to follow along.",
          "examples": [
            {
              "name": "VS Code Tips",
              "code": "# Key VS Code shortcuts\nprint(\"Ctrl+Shift+P  → Command Palette\")\nprint(\"Ctrl+Shift+`  → Open Terminal\")\nprint(\"F5            → Run / Debug\")\nprint(\"Ctrl+Space    → Auto-complete\")",
              "level": "beginner"
            },
            {
              "name": "This Portal",
              "code": "# This interactive portal runs REAL Python\n# Everything works the same as VS Code or terminal\n\n# Variables work\nserver = \"web-01\"\nport = 443\n\n# Conditions work\nif port == 443:\n    protocol = \"https\"\nelse:\n    protocol = \"http\"\n\n# Functions work\ndef get_url(host, port, proto):\n    return f\"{proto}://{host}:{port}\"\n\nurl = get_url(server, port, protocol)\nprint(f\"URL: {url}\")\nprint()\nprint(\"This portal = same Python as VS Code.\")\nprint(\"Write code. Run it. See output.\")\nprint(\"No installation needed to follow along!\")",
              "level": "beginner"
            },
            {
              "name": "Editor Comparison",
              "code": "# Python works the same everywhere\n# The editor is just a tool — the language is identical\n\neditors = {\n    \"VS Code\":       \"Free, extensions, integrated terminal\",\n    \"PyCharm\":       \"Full IDE, refactoring, database tools\",\n    \"This Portal\":   \"Browser-based, zero setup, instant\",\n    \"Terminal/REPL\": \"Quick tests, no GUI needed\",\n    \"Jupyter\":       \"Notebooks, data science, visualisation\",\n}\n\nprint(\"Python Editors & Environments:\")\nprint(\"=\" * 55)\nfor editor, desc in editors.items():\n    print(f\"  {editor:<16} {desc}\")\n\nprint()\nprint(\"Same Python code runs in ALL of these.\")\nprint(\"Choose what fits your workflow.\")\nprint(\"For this course: we use this portal for demos.\")",
              "level": "intermediate"
            }
          ]
        }
      ]
    },
    {
      "id": "module2",
      "title": "Module 3: Python Basics",
      "sections": [
        {
          "id": "m2s1",
          "title": "2.1 Variables",
          "description": "<p><strong>A variable is a named reference to a value stored in memory.</strong> In Python, you do not declare a type — Python infers it automatically based on the value you assign. This is called <em>dynamic typing</em>.</p><p>Variables are the foundation of every script. They let you store configuration values, counters, results, and state — and refer to them by a meaningful name rather than a raw value.</p><h4>Naming Rules</h4><ul><li>Must start with a letter or underscore (<code>_</code>)</li><li>Can contain letters, digits, and underscores</li><li>Case-sensitive: <code>Host</code> and <code>host</code> are different variables</li><li>Use <code>snake_case</code> by convention: <code>server_name</code>, <code>cpu_threshold</code></li></ul><h4>Assignment</h4><p>The <code>=</code> operator assigns a value to a variable. Python evaluates the right side first, then stores the result under the name on the left.</p><h4>Infrastructure Context</h4><p>Variables let you write scripts that are easy to reconfigure — change <code>threshold = 80</code> in one place and the entire script adapts.</p>",
          "syntax": "# Assignment\nhost = \"web-01\"          # str\nport = 443               # int\nlatency = 12.5           # float\nis_active = True         # bool\n\n# Multiple assignment\nx = y = z = 0\n\n# Swap values\na, b = 10, 20\na, b = b, a\n\n# Check type\nprint(type(host))        # <class 'str'>",
          "examples": [
            {
              "name": "Basic Variables",
              "code": "# Creating variables\nname = \"Alice\"\nage = 30\nis_student = True\n\nprint(name)\nprint(age)\nprint(is_student)",
              "level": "beginner"
            },
            {
              "name": "Infrastructure Config",
              "code": "# Using variables for configurable thresholds\nCPU_THRESHOLD    = 85      # % — alert if exceeded\nMEMORY_THRESHOLD = 90      # %\nDISK_THRESHOLD   = 80      # %\nRETRY_LIMIT      = 3\nTIMEOUT_SECONDS  = 30\n\n# Current readings (would come from monitoring API)\ncurrent_cpu    = 91\ncurrent_memory = 74\ncurrent_disk   = 83\n\nprint(f\"CPU:    {current_cpu}% (limit: {CPU_THRESHOLD}%)  {'ALERT' if current_cpu > CPU_THRESHOLD else 'OK'}\")\nprint(f\"Memory: {current_memory}% (limit: {MEMORY_THRESHOLD}%) {'ALERT' if current_memory > MEMORY_THRESHOLD else 'OK'}\")\nprint(f\"Disk:   {current_disk}% (limit: {DISK_THRESHOLD}%)  {'ALERT' if current_disk > DISK_THRESHOLD else 'OK'}\")",
              "level": "beginner"
            },
            {
              "name": "Variable Types",
              "code": "# Python infers types automatically\nname     = \"db-primary\"   # str\nreplicas = 3               # int\nlag_ms   = 0.45            # float\nsynced   = True            # bool\ntags     = None            # NoneType\n\nvalues = [name, replicas, lag_ms, synced, tags]\nfor v in values:\n    print(f\"  Value: {str(v):<15}  Type: {type(v).__name__}\")",
              "level": "intermediate"
            }
          ],
          "brief": "<h4>Variables</h4><ul><li>Named reference to a value in memory</li><li>Dynamic typing — Python infers the type automatically</li><li>Naming: <code>snake_case</code>, start with letter or underscore</li><li><code>=</code> assigns a value: <code>host = \"web-01\"</code></li><li>Change one variable, the whole script adapts</li></ul>",
          "lab": {
            "title": "Lab: Server Metrics Variables",
            "challenge": "Create variables for 5 servers (server1 through server5). Each should have a name (string), cpu usage (int), memory usage (int), and a boolean indicating if it's online. Then print a formatted summary of all 5 servers.",
            "hint": "Use descriptive variable names like server1_name, server1_cpu, server1_mem, server1_online"
          }
        },
        {
          "id": "m2s2",
          "title": "2.2 Data Types",
          "description": "<p><strong>Python has several built-in data types, each designed for a specific kind of value.</strong> Choosing the right type makes your code more readable, efficient, and less error-prone.</p><h4>Core Types</h4><ul><li><strong>str</strong> — Text. Immutable sequence of Unicode characters. Use for hostnames, messages, paths.</li><li><strong>int</strong> — Whole numbers. No size limit in Python. Use for counts, ports, IDs.</li><li><strong>float</strong> — Decimal numbers. Use for percentages, latency, measurements.</li><li><strong>bool</strong> — <code>True</code> or <code>False</code>. Used in conditions and flags.</li><li><strong>NoneType</strong> — Represents the absence of a value. The single value is <code>None</code>.</li></ul><h4>Type Conversion</h4><p>Python does not automatically convert between types. Use <code>int()</code>, <code>str()</code>, <code>float()</code>, and <code>bool()</code> to convert explicitly.</p><h4>Why It Matters</h4><p>When reading data from APIs, config files, or user input, values often arrive as strings. You must convert them to the correct type before performing calculations or comparisons.</p>",
          "syntax": "# Type conversion\nport_str = \"8080\"\nport_int = int(port_str)      # str -> int\n\ncpu_str  = \"87.5\"\ncpu_float = float(cpu_str)    # str -> float\n\ncount = 42\ncount_str = str(count)        # int -> str\n\n# Check type\nprint(isinstance(port_int, int))   # True\nprint(type(cpu_float))             # <class 'float'>",
          "examples": [
            {
              "name": "Type Check",
              "code": "# Python data types\nname = \"Alice\"       # string\nage = 30             # integer\nheight = 1.75        # float\nactive = True        # boolean\n\nprint(type(name))\nprint(type(age))\nprint(type(height))\nprint(type(active))",
              "level": "beginner"
            },
            {
              "name": "Type Conversion",
              "code": "# API responses often return everything as strings\napi_response = {\n    \"cpu\":     \"88\",\n    \"memory\":  \"73.5\",\n    \"healthy\": \"True\",\n    \"port\":    \"443\",\n}\n\n# Convert to correct types\ncpu     = int(api_response[\"cpu\"])\nmemory  = float(api_response[\"memory\"])\nhealthy = api_response[\"healthy\"] == \"True\"\nport    = int(api_response[\"port\"])\n\nprint(f\"CPU:     {cpu}%   (type: {type(cpu).__name__})\")\nprint(f\"Memory:  {memory}% (type: {type(memory).__name__})\")\nprint(f\"Healthy: {healthy}  (type: {type(healthy).__name__})\")\nprint(f\"Port:    {port}    (type: {type(port).__name__})\")",
              "level": "beginner"
            },
            {
              "name": "String Operations",
              "code": "# Common string operations in infrastructure scripts\nhostname = \"  PROD-WEB-01.example.com  \"\n\n# Clean and normalise\nclean    = hostname.strip().lower()\nparts    = clean.split(\".\")\nshort    = parts[0]\n\nprint(f\"Original : '{hostname}'\")\nprint(f\"Cleaned  : '{clean}'\")\nprint(f\"Short    : '{short}'\")\nprint(f\"Starts with 'prod': {short.startswith('prod')}\")\nprint(f\"Replace  : '{short.replace('prod', 'staging')}'\")",
              "level": "intermediate"
            }
          ],
          "brief": "<h4>Data Types</h4><ul><li><code>str</code> — text: hostnames, messages, paths</li><li><code>int</code> — whole numbers: ports, counts</li><li><code>float</code> — decimals: percentages, latency</li><li><code>bool</code> — True / False: flags, conditions</li><li><code>None</code> — absence of value</li><li>Convert with <code>int()</code>, <code>str()</code>, <code>float()</code></li></ul>"
        },
        {
          "id": "m2s3",
          "title": "2.3 Input and Output",
          "description": "<p><strong>Input and output (I/O) are how your Python scripts communicate with the outside world.</strong> Output lets you display results, log status, and surface alerts. Input lets scripts accept runtime values — making them flexible and reusable without code changes.</p><h4>Output with <code>print()</code></h4><p>The <code>print()</code> function writes to standard output. Use <strong>f-strings</strong> (formatted string literals) for clean, readable output that embeds variable values directly into text.</p><h4>Input with <code>input()</code></h4><p>The <code>input()</code> function pauses execution and waits for the user to type a value. It always returns a <strong>string</strong> — convert it if you need a number.</p><h4>F-Strings</h4><p>Introduced in Python 3.6, f-strings are the preferred way to format output. Prefix a string with <code>f</code> and embed expressions in <code>{}</code> braces. You can include format specifiers like <code>{value:.2f}</code> for two decimal places or <code>{name:<20}</code> for left-aligned padding.</p>",
          "syntax": "# Basic output\nprint(\"Status: OK\")\n\n# F-string formatting\nhost = \"web-01\"\ncpu  = 87.456\nprint(f\"{host}: CPU = {cpu:.1f}%\")\n\n# Padding for aligned tables\nprint(f\"{'Host':<12} {'CPU':>6}\")\nprint(f\"{host:<12} {cpu:>6.1f}\")\n\n# Input (always returns str)\n# name = input(\"Enter hostname: \")",
          "examples": [
            {
              "name": "Formatted Output",
              "code": "# Using f-strings to format output\nname = \"Alice\"\nage = 30\n\nprint(f\"Name: {name}\")\nprint(f\"Age: {age}\")\nprint(f\"Next year: {age + 1}\")",
              "level": "beginner"
            },
            {
              "name": "User Input",
              "code": "# Interactive script using input()\n# (In Pyodide, input() is simulated — values are preset)\n\n# Simulating user input for demonstration\nthreshold_input = \"85\"   # pretend user typed this\nhostname_input  = \"prod-web-01\"\n\nthreshold = int(threshold_input)\nhostname  = hostname_input.strip().lower()\n\nprint(f\"Monitoring host    : {hostname}\")\nprint(f\"Alert threshold    : {threshold}%\")\n\n# Simulate a reading\ncurrent_cpu = 91\nprint(f\"Current CPU usage  : {current_cpu}%\")\n\nif current_cpu > threshold:\n    print(f\"[ALERT] {hostname} CPU exceeds {threshold}% threshold!\")\nelse:\n    print(f\"[OK] {hostname} is within acceptable range.\")",
              "level": "beginner"
            },
            {
              "name": "Report Generator",
              "code": "# Generating a structured text report\nreport_data = {\n    \"environment\": \"Production\",\n    \"region\":      \"eu-west-1\",\n    \"servers\":     12,\n    \"alerts\":       3,\n    \"avg_cpu\":     54.7,\n    \"avg_memory\":  68.2,\n}\n\nprint(\"=\" * 40)\nprint(\"  INFRASTRUCTURE STATUS REPORT\")\nprint(\"=\" * 40)\nfor key, value in report_data.items():\n    label = key.replace(\"_\", \" \").title()\n    if isinstance(value, float):\n        print(f\"  {label:<18}: {value:.1f}%\")\n    else:\n        print(f\"  {label:<18}: {value}\")\nprint(\"=\" * 40)",
              "level": "intermediate"
            }
          ],
          "brief": "<h4>Input and Output</h4><ul><li><code>print()</code> — output to console</li><li><code>input()</code> — read user input (always returns string)</li><li>F-strings: <code>f\"CPU: {cpu:.1f}%\"</code> — clean, readable formatting</li><li>Padding: <code>{name:&lt;12}</code> left-align, <code>{value:&gt;6}</code> right-align</li><li>Essential for reports, logs, and interactive scripts</li></ul>"
        }
      ]
    },
    {
      "id": "module3",
      "title": "Module 4: Collections",
      "sections": [
        {
          "id": "m3s1",
          "title": "3.1 Lists",
          "description": "<p><strong>A list is an ordered, mutable collection of items.</strong> Lists can hold any mix of data types and are one of the most frequently used structures in Python scripts.</p><p>In infrastructure work, lists are ideal for storing groups of related items: server names, IP addresses, log entries, or metric readings.</p><h4>Key Characteristics</h4><ul><li><strong>Ordered:</strong> Items maintain their insertion order.</li><li><strong>Mutable:</strong> You can add, remove, or change items after creation.</li><li><strong>Indexed:</strong> Access items by position — <code>list[0]</code> is the first item, <code>list[-1]</code> is the last.</li><li><strong>Allows duplicates:</strong> The same value can appear multiple times.</li></ul><h4>Common Operations</h4><p>Use <code>append()</code> to add, <code>remove()</code> to delete by value, <code>pop()</code> to remove by index, and <code>len()</code> to get the count. Slicing (<code>list[1:4]</code>) extracts a sub-list.</p>",
          "syntax": "# Create\nservers = [\"web-01\", \"web-02\", \"db-01\"]\n\n# Access\nfirst = servers[0]       # \"web-01\"\nlast  = servers[-1]      # \"db-01\"\n\n# Modify\nservers.append(\"cache-01\")\nservers.remove(\"web-02\")\n\n# Iterate\nfor s in servers:\n    print(s)\n\n# Length and slice\nprint(len(servers))      # 3\nprint(servers[0:2])      # first two",
          "examples": [
            {
              "name": "List Basics",
              "code": "# Working with a list\nfruits = [\"apple\", \"banana\", \"cherry\"]\n\nprint(fruits[0])      # first item\nprint(len(fruits))    # count\n\nfruits.append(\"date\")\nprint(fruits)",
              "level": "beginner"
            },
            {
              "name": "List Operations",
              "code": "# Practical list operations for infrastructure\ncpu_readings = [72, 88, 45, 91, 63, 77, 84, 55]\n\nprint(f\"Readings      : {cpu_readings}\")\nprint(f\"Count         : {len(cpu_readings)}\")\nprint(f\"Highest       : {max(cpu_readings)}%\")\nprint(f\"Lowest        : {min(cpu_readings)}%\")\nprint(f\"Average       : {sum(cpu_readings)/len(cpu_readings):.1f}%\")\n\n# Filter high readings\nhigh = [r for r in cpu_readings if r > 80]\nprint(f\"\\nReadings > 80%: {high}\")\nprint(f\"Alert count   : {len(high)}\")",
              "level": "beginner"
            },
            {
              "name": "List Comprehension",
              "code": "# List comprehensions — concise and Pythonic\nall_hosts = [\"web-01\", \"web-02\", \"db-01\", \"db-02\", \"cache-01\", \"backup-01\"]\n\n# Filter by prefix\nweb_servers = [h for h in all_hosts if h.startswith(\"web\")]\ndb_servers  = [h for h in all_hosts if h.startswith(\"db\")]\n\n# Transform\nupper_hosts = [h.upper() for h in all_hosts]\n\nprint(f\"All hosts    : {all_hosts}\")\nprint(f\"Web servers  : {web_servers}\")\nprint(f\"DB servers   : {db_servers}\")\nprint(f\"Uppercased   : {upper_hosts}\")",
              "level": "intermediate"
            }
          ],
          "brief": "<h4>Lists</h4><ul><li>Ordered, mutable collection: <code>servers = [\"web-01\", \"db-01\"]</code></li><li>Indexed: <code>list[0]</code> first, <code>list[-1]</code> last</li><li>Methods: <code>.append()</code>, <code>.remove()</code>, <code>.pop()</code>, <code>.sort()</code></li><li>Slicing: <code>list[1:4]</code> extracts a sub-list</li><li>List comprehension: <code>[x for x in data if x > 80]</code></li></ul>",
          "lab": {
            "title": "Lab: Filter High-CPU Servers",
            "challenge": "Create a list of dictionaries representing 8 servers, each with 'name' and 'cpu' keys. Write code to filter and print only the servers where CPU usage is above 80%. Use a list comprehension.",
            "hint": "Use a list comprehension: [s for s in servers if s['cpu'] > 80]"
          }
        },
        {
          "id": "m3s2",
          "title": "3.2 Tuples",
          "description": "<p><strong>A tuple is an ordered, immutable collection of items.</strong> Once created, a tuple cannot be changed — no items can be added, removed, or modified. This immutability is a feature, not a limitation.</p><p>Use tuples when the data should not change: coordinates, configuration constants, database records, or function return values where multiple values are returned together.</p><h4>Tuples vs Lists</h4><ul><li><strong>Tuples are immutable</strong> — safer for data that must not be altered.</li><li><strong>Tuples are faster</strong> — Python optimises them internally.</li><li><strong>Tuples can be dictionary keys</strong> — lists cannot, because they are mutable.</li><li><strong>Tuples communicate intent</strong> — using a tuple signals \"this data is fixed\".</li></ul><h4>Unpacking</h4><p>Tuple unpacking lets you assign multiple variables in a single line: <code>host, port, protocol = (\"web-01\", 443, \"https\")</code>. This is a common Python pattern for returning multiple values from a function.</p>",
          "syntax": "# Create\nendpoint = (\"10.0.1.45\", 443, \"https\")\n\n# Access by index\nip       = endpoint[0]\nport     = endpoint[1]\n\n# Unpack\nip, port, proto = endpoint\n\n# Tuples are immutable\n# endpoint[0] = \"10.0.1.46\"  # TypeError!\n\n# Single-item tuple needs trailing comma\nsingle = (\"web-01\",)\nprint(type(single))   # <class 'tuple'>",
          "examples": [
            {
              "name": "Tuple Basics",
              "code": "# Tuples are immutable (cannot change)\npoint = (10, 20)\n\nprint(point[0])  # 10\nprint(point[1])  # 20\n\n# Unpacking\nx, y = point\nprint(f\"x={x}, y={y}\")",
              "level": "beginner"
            },
            {
              "name": "Immutability",
              "code": "# Demonstrating why immutability matters\nREGIONS = (\"eu-west-1\", \"us-east-1\", \"ap-southeast-1\")\nENVIRONMENTS = (\"development\", \"staging\", \"production\")\n\nprint(\"Supported regions:\")\nfor r in REGIONS:\n    print(f\"  - {r}\")\n\nprint(\"\\nEnvironments:\")\nfor e in ENVIRONMENTS:\n    print(f\"  - {e}\")\n\n# Tuples support membership testing\ntarget_env = \"production\"\nif target_env in ENVIRONMENTS:\n    print(f\"\\n'{target_env}' is a valid environment.\")\nelse:\n    print(f\"\\n'{target_env}' is NOT a recognised environment.\")",
              "level": "beginner"
            },
            {
              "name": "Multiple Return",
              "code": "# Functions returning multiple values via tuples\ndef analyse_metrics(readings):\n    \"\"\"Return summary statistics as a tuple.\"\"\"\n    avg = sum(readings) / len(readings)\n    return min(readings), max(readings), round(avg, 1)\n\ncpu_data = [45, 72, 88, 61, 94, 53, 77]\n\nlow, high, average = analyse_metrics(cpu_data)\n\nprint(f\"CPU Readings : {cpu_data}\")\nprint(f\"Minimum      : {low}%\")\nprint(f\"Maximum      : {high}%\")\nprint(f\"Average      : {average}%\")\n\nif high > 90:\n    print(\"\\n[WARN] Peak CPU exceeded 90% — review capacity.\")",
              "level": "intermediate"
            }
          ],
          "brief": "<h4>Tuples</h4><ul><li>Ordered, <strong>immutable</strong> collection: <code>endpoint = (\"10.0.1.45\", 443)</code></li><li>Cannot add, remove, or change items after creation</li><li>Faster than lists, can be dictionary keys</li><li>Unpacking: <code>ip, port = endpoint</code></li><li>Use for fixed data: coordinates, config constants, return values</li></ul>"
        },
        {
          "id": "m3s3",
          "title": "3.3 Dictionaries",
          "description": "<p><strong>A dictionary is an unordered collection of key-value pairs.</strong> It is Python's most powerful built-in data structure for representing structured data — think of it as a JSON object or a database row in memory.</p><p>Dictionaries are ideal for storing configuration, API responses, server metadata, and any data where you need to look up a value by a meaningful name rather than a numeric index.</p><h4>Key Characteristics</h4><ul><li><strong>Key-value pairs:</strong> Every item has a unique key and an associated value.</li><li><strong>Fast lookup:</strong> Retrieving a value by key is O(1) — instant regardless of size.</li><li><strong>Mutable:</strong> Add, update, or delete keys at any time.</li><li><strong>Keys must be immutable:</strong> Strings, numbers, and tuples can be keys. Lists cannot.</li></ul><h4>Common Methods</h4><p><code>.get(key, default)</code> safely retrieves a value without raising an error if the key is missing. <code>.keys()</code>, <code>.values()</code>, and <code>.items()</code> let you iterate over the dictionary in different ways.</p>",
          "syntax": "# Create\nserver = {\"name\": \"web-01\", \"cpu\": 72, \"online\": True}\n\n# Access\nname = server[\"name\"]              # direct\ncpu  = server.get(\"cpu\", 0)        # safe with default\n\n# Add / update\nserver[\"region\"] = \"eu-west-1\"\nserver[\"cpu\"]    = 85\n\n# Delete\ndel server[\"online\"]\n\n# Iterate\nfor key, value in server.items():\n    print(f\"{key}: {value}\")",
          "examples": [
            {
              "name": "Dict Basics",
              "code": "# A dictionary stores key-value pairs\nperson = {\n    \"name\": \"Alice\",\n    \"age\": 30,\n    \"city\": \"London\"\n}\n\nprint(person[\"name\"])\nprint(person[\"age\"])\nprint(person[\"city\"])",
              "level": "beginner"
            },
            {
              "name": "Nested Dicts",
              "code": "# Nested dictionaries for complex infrastructure data\ninfrastructure = {\n    \"web-01\": {\"cpu\": 45, \"mem\": 60, \"status\": \"online\"},\n    \"web-02\": {\"cpu\": 92, \"mem\": 78, \"status\": \"online\"},\n    \"db-01\":  {\"cpu\": 30, \"mem\": 95, \"status\": \"online\"},\n    \"db-02\":  {\"cpu\": 18, \"mem\": 41, \"status\": \"offline\"},\n}\n\nprint(f\"{'Host':<10} {'CPU%':>6} {'Mem%':>6} {'Status'}\")\nprint(\"-\" * 35)\nfor host, metrics in infrastructure.items():\n    print(f\"{host:<10} {metrics['cpu']:>6} {metrics['mem']:>6}  {metrics['status']}\")\n\nalerts = [h for h, m in infrastructure.items() if m['cpu'] > 85 or m['mem'] > 90]\nprint(f\"\\nAlerts: {alerts}\")",
              "level": "beginner"
            },
            {
              "name": "Config Store",
              "code": "# Using a dictionary as an application config store\nconfig = {\n    \"app_name\":    \"InfraMonitor\",\n    \"version\":     \"2.4.1\",\n    \"debug\":       False,\n    \"log_level\":   \"INFO\",\n    \"db_host\":     \"db-primary.internal\",\n    \"db_port\":     5432,\n    \"alert_email\": \"ops@company.com\",\n    \"thresholds\":  {\"cpu\": 85, \"memory\": 90, \"disk\": 80},\n}\n\nprint(f\"App: {config['app_name']} v{config['version']}\")\nprint(f\"Log level : {config['log_level']}\")\nprint(f\"Database  : {config['db_host']}:{config['db_port']}\")\nprint(\"\\nAlert Thresholds:\")\nfor metric, limit in config['thresholds'].items():\n    print(f\"  {metric:<10}: {limit}%\")",
              "level": "intermediate"
            }
          ],
          "brief": "<h4>Dictionaries</h4><ul><li>Key-value pairs: <code>server = {\"name\": \"web-01\", \"cpu\": 72}</code></li><li>O(1) fast lookup by key</li><li>Access: <code>server[\"name\"]</code> or <code>server.get(\"port\", 80)</code></li><li>Mutable: add, update, delete keys anytime</li><li>Iterate: <code>for key, val in dict.items()</code></li><li>Ideal for config, API responses, structured data</li></ul>",
          "lab": {
            "title": "Lab: Server Inventory Dictionary",
            "challenge": "Create a nested dictionary called 'inventory' representing a server inventory. It should have 3 environments ('production', 'staging', 'development'), each containing a list of server dicts with 'name', 'ip', 'role', and 'cpu' keys. Print a formatted report showing all servers grouped by environment.",
            "hint": "Use nested dicts: inventory = {'production': [{'name': 'web-01', ...}], ...} then loop with .items()"
          }
        }
      ]
    },
    {
      "id": "module4",
      "title": "Module 5: Operators",
      "sections": [
        {
          "id": "m4s1",
          "title": "4.1 Arithmetic Operators",
          "description": "<p><strong>Arithmetic operators perform mathematical calculations on numeric values.</strong> In infrastructure scripting, you use them constantly — calculating percentages, averaging metrics, computing time deltas, and sizing resources.</p><h4>Operators</h4><ul><li><code>+</code> Addition</li><li><code>-</code> Subtraction</li><li><code>*</code> Multiplication</li><li><code>/</code> Division (always returns float)</li><li><code>//</code> Floor division (integer result, rounds down)</li><li><code>%</code> Modulo (remainder after division)</li><li><code>**</code> Exponentiation (power)</li></ul><h4>Operator Precedence</h4><p>Python follows standard mathematical precedence: <code>**</code> first, then <code>* / // %</code>, then <code>+ -</code>. Use parentheses to make intent explicit and avoid subtle bugs.</p><h4>Augmented Assignment</h4><p><code>x += 1</code> is shorthand for <code>x = x + 1</code>. Works with all arithmetic operators: <code>-=</code>, <code>*=</code>, <code>/=</code>, <code>//=</code>, <code>%=</code>.</p>",
          "syntax": "total = 500 + 250        # 750\ndiff  = 500 - 125        # 375\nscale = 4 * 8            # 32\nratio = 750 / 4          # 187.5  (float)\nquot  = 750 // 4         # 187    (int)\nrem   = 750 % 4          # 2      (remainder)\npow2  = 2 ** 10          # 1024\n\n# Augmented assignment\ncount = 0\ncount += 1               # count is now 1\n\n# Percentage calculation\nused  = 340\ntotal = 500\npct   = (used / total) * 100\nprint(f\"{pct:.1f}% used\")",
          "examples": [
            {
              "name": "Basic Arithmetic",
              "code": "# Basic math operations\na = 10\nb = 3\n\nprint(f\"{a} + {b} = {a + b}\")\nprint(f\"{a} - {b} = {a - b}\")\nprint(f\"{a} * {b} = {a * b}\")\nprint(f\"{a} / {b} = {a / b:.2f}\")",
              "level": "beginner"
            },
            {
              "name": "Capacity Planning",
              "code": "# Arithmetic for infrastructure capacity planning\ntotal_ram_gb    = 128\nused_ram_gb     = 94\nos_reserved_gb  = 8\n\navailable = total_ram_gb - used_ram_gb - os_reserved_gb\npct_used  = (used_ram_gb / total_ram_gb) * 100\npct_free  = 100 - pct_used\n\nprint(\"=== Memory Capacity Report ===\")\nprint(f\"Total RAM      : {total_ram_gb} GB\")\nprint(f\"Used           : {used_ram_gb} GB  ({pct_used:.1f}%)\")\nprint(f\"OS Reserved    : {os_reserved_gb} GB\")\nprint(f\"Available      : {available} GB  ({pct_free:.1f}%)\")\n\nif pct_used > 85:\n    print(\"\\n[WARN] Memory utilisation above 85%\")",
              "level": "beginner"
            },
            {
              "name": "Metric Averages",
              "code": "# Computing averages and statistics\nreadings = [62, 75, 88, 91, 70, 55, 83, 79, 94, 68]\n\ntotal   = sum(readings)\ncount   = len(readings)\naverage = total / count\nhigh    = max(readings)\nlow     = min(readings)\nrange_  = high - low\n\nprint(f\"Readings : {readings}\")\nprint(f\"Count    : {count}\")\nprint(f\"Total    : {total}\")\nprint(f\"Average  : {average:.1f}%\")\nprint(f\"High     : {high}%\")\nprint(f\"Low      : {low}%\")\nprint(f\"Range    : {range_}%\")\n\nabove_avg = [r for r in readings if r > average]\nprint(f\"Above avg: {len(above_avg)} readings\")",
              "level": "intermediate"
            }
          ],
          "brief": "<h4>Arithmetic Operators</h4><ul><li><code>+</code> <code>-</code> <code>*</code> <code>/</code> — basic math</li><li><code>//</code> floor division, <code>%</code> modulo, <code>**</code> power</li><li><code>/</code> always returns float; <code>//</code> returns int</li><li>Augmented: <code>x += 1</code>, <code>total -= used</code></li><li>Use for percentages, averages, capacity calculations</li></ul>"
        },
        {
          "id": "m4s2",
          "title": "4.2 Comparison Operators",
          "description": "<p><strong>Comparison operators evaluate a relationship between two values and return a boolean result: <code>True</code> or <code>False</code>.</strong> They are the building blocks of every conditional statement and filtering operation in Python.</p><h4>Operators</h4><ul><li><code>==</code> Equal to</li><li><code>!=</code> Not equal to</li><li><code>&gt;</code> Greater than</li><li><code>&lt;</code> Less than</li><li><code>&gt;=</code> Greater than or equal to</li><li><code>&lt;=</code> Less than or equal to</li></ul><h4>Common Mistakes</h4><p>Do not confuse <code>=</code> (assignment) with <code>==</code> (comparison). Using <code>=</code> inside a condition is a syntax error in Python 3 — a deliberate design choice to prevent bugs.</p><h4>Chained Comparisons</h4><p>Python supports chained comparisons: <code>0 &lt;= cpu &lt;= 100</code> is valid and reads naturally. This is more concise than <code>cpu &gt;= 0 and cpu &lt;= 100</code>.</p>",
          "syntax": "cpu = 87\n\nprint(cpu == 87)    # True  — equal\nprint(cpu != 100)   # True  — not equal\nprint(cpu > 80)     # True  — greater than\nprint(cpu < 90)     # True  — less than\nprint(cpu >= 87)    # True  — greater or equal\nprint(cpu <= 86)    # False — less or equal\n\n# Chained comparison\nprint(0 <= cpu <= 100)   # True — valid range check\n\n# String comparison\nstatus = \"online\"\nprint(status == \"online\")   # True",
          "examples": [
            {
              "name": "Comparison Basics",
              "code": "# Comparisons return True or False\nage = 25\n\nprint(age == 25)   # equal\nprint(age != 30)   # not equal\nprint(age > 18)    # greater than\nprint(age < 10)    # less than",
              "level": "beginner"
            },
            {
              "name": "Threshold Checks",
              "code": "# Using comparisons for infrastructure threshold checks\nmetrics = {\n    \"cpu\":    87,\n    \"memory\": 62,\n    \"disk\":   91,\n    \"latency_ms\": 340,\n}\n\nthresholds = {\n    \"cpu\":    85,\n    \"memory\": 90,\n    \"disk\":   80,\n    \"latency_ms\": 200,\n}\n\nprint(f\"{'Metric':<14} {'Value':>8} {'Limit':>8} {'Status'}\")\nprint(\"-\" * 42)\nfor metric, value in metrics.items():\n    limit  = thresholds[metric]\n    status = \"ALERT\" if value > limit else \"OK\"\n    flag   = \" <<<\" if status == \"ALERT\" else \"\"\n    print(f\"{metric:<14} {value:>8} {limit:>8}  {status}{flag}\")",
              "level": "beginner"
            },
            {
              "name": "Status Filtering",
              "code": "# Filtering servers by status using comparisons\nservers = [\n    {\"name\": \"web-01\", \"status\": \"online\",  \"cpu\": 45},\n    {\"name\": \"web-02\", \"status\": \"online\",  \"cpu\": 92},\n    {\"name\": \"db-01\",  \"status\": \"offline\", \"cpu\": 0},\n    {\"name\": \"db-02\",  \"status\": \"online\",  \"cpu\": 31},\n    {\"name\": \"cache\",  \"status\": \"degraded\",\"cpu\": 78},\n]\n\nonline  = [s for s in servers if s[\"status\"] == \"online\"]\noffline = [s for s in servers if s[\"status\"] != \"online\"]\nhigh_cpu = [s for s in servers if s[\"cpu\"] >= 85]\n\nprint(f\"Online  ({len(online)})  : {[s['name'] for s in online]}\")\nprint(f\"Offline ({len(offline)}) : {[s['name'] for s in offline]}\")\nprint(f\"High CPU ({len(high_cpu)}): {[s['name'] for s in high_cpu]}\")",
              "level": "intermediate"
            }
          ],
          "brief": "<h4>Comparison Operators</h4><ul><li><code>==</code> equal, <code>!=</code> not equal</li><li><code>&gt;</code> <code>&lt;</code> <code>&gt;=</code> <code>&lt;=</code></li><li>Always return <code>True</code> or <code>False</code></li><li>Chained: <code>0 &lt;= cpu &lt;= 100</code> is valid Python</li><li>Foundation of every <code>if</code> statement and filter</li></ul>"
        },
        {
          "id": "m4s3",
          "title": "4.3 Logical Operators",
          "description": "<p><strong>Logical operators combine multiple boolean expressions into a single condition.</strong> They are essential for writing nuanced alert rules, access controls, and validation logic.</p><h4>Operators</h4><ul><li><code>and</code> — Returns <code>True</code> only if <strong>both</strong> conditions are true. Short-circuits: if the first is false, the second is not evaluated.</li><li><code>or</code> — Returns <code>True</code> if <strong>at least one</strong> condition is true. Short-circuits: if the first is true, the second is not evaluated.</li><li><code>not</code> — Inverts a boolean value. <code>not True</code> is <code>False</code>.</li></ul><h4>Truth Tables</h4><p><code>True and True → True</code> | <code>True and False → False</code><br><code>True or False → True</code> | <code>False or False → False</code><br><code>not True → False</code> | <code>not False → True</code></p><h4>Practical Use</h4><p>Logical operators let you express complex alert conditions clearly: <code>if cpu > 85 and memory > 90</code> fires only when both are high. <code>if cpu > 95 or disk > 95</code> fires when either is critical.</p>",
          "syntax": "cpu = 88\nmem = 92\ndisk = 70\n\n# and — both must be true\nif cpu > 85 and mem > 90:\n    print(\"Critical: CPU and Memory both high\")\n\n# or — at least one must be true\nif cpu > 95 or disk > 90:\n    print(\"Critical threshold reached\")\n\n# not — invert\nis_healthy = False\nif not is_healthy:\n    print(\"Server is unhealthy\")\n\n# Combined\nif (cpu > 80 or mem > 80) and not disk > 90:\n    print(\"Compute pressure, disk OK\")",
          "examples": [
            {
              "name": "Logic Basics",
              "code": "# Logical operators: and, or, not\nx = True\ny = False\n\nprint(x and y)   # False\nprint(x or y)    # True\nprint(not x)     # False",
              "level": "beginner"
            },
            {
              "name": "Alert Rules",
              "code": "# Multi-condition alert rules using logical operators\nservers = [\n    {\"name\": \"web-01\", \"cpu\": 45, \"mem\": 60, \"disk\": 55},\n    {\"name\": \"web-02\", \"cpu\": 92, \"mem\": 88, \"disk\": 70},\n    {\"name\": \"db-01\",  \"cpu\": 30, \"mem\": 95, \"disk\": 82},\n    {\"name\": \"db-02\",  \"cpu\": 78, \"mem\": 74, \"disk\": 91},\n]\n\nfor s in servers:\n    critical = s[\"cpu\"] > 90 and s[\"mem\"] > 85\n    warning  = s[\"cpu\"] > 75 or s[\"mem\"] > 80 or s[\"disk\"] > 85\n    healthy  = not (critical or warning)\n\n    if critical:\n        level = \"CRITICAL\"\n    elif warning:\n        level = \"WARNING \"\n    else:\n        level = \"OK      \"\n\n    print(f\"  {s['name']:<10} {level}  cpu={s['cpu']}% mem={s['mem']}% disk={s['disk']}%\")",
              "level": "beginner"
            },
            {
              "name": "Access Control",
              "code": "# Logical operators in access control logic\ndef check_access(user, role, mfa_enabled, ip_address):\n    trusted_ips = [\"10.0.0.0\", \"10.0.1.0\", \"192.168.1.0\"]\n    is_trusted_ip = ip_address in trusted_ips\n\n    # Admin requires MFA and trusted IP\n    if role == \"admin\" and (not mfa_enabled or not is_trusted_ip):\n        return \"DENIED — admin requires MFA and trusted IP\"\n\n    # Read-only users allowed from anywhere\n    if role == \"readonly\" or is_trusted_ip:\n        return \"GRANTED\"\n\n    return \"DENIED — untrusted IP for this role\"\n\nprint(check_access(\"alice\", \"admin\",    True,  \"10.0.0.0\"))\nprint(check_access(\"bob\",   \"admin\",    False, \"10.0.0.0\"))\nprint(check_access(\"carol\", \"readonly\", False, \"8.8.8.8\"))\nprint(check_access(\"dave\",  \"operator\", False, \"8.8.8.8\"))",
              "level": "intermediate"
            }
          ],
          "brief": "<h4>Logical Operators</h4><ul><li><code>and</code> — both must be True</li><li><code>or</code> — at least one must be True</li><li><code>not</code> — inverts the boolean</li><li>Short-circuit evaluation for efficiency</li><li>Use for multi-condition alerts and access control</li></ul>"
        }
      ]
    },
    {
      "id": "module5",
      "title": "Module 6: Control Flow",
      "sections": [
        {
          "id": "m5s1",
          "title": "5.1 If / Else",
          "description": "<p><strong>Conditional statements let your program make decisions based on data.</strong> The <code>if / elif / else</code> structure is the primary way Python branches execution — running different code depending on whether conditions are true or false.</p><p>In infrastructure scripts, conditionals drive alert logic, routing decisions, validation, and automated remediation.</p><h4>Structure</h4><ul><li><code>if</code> — Evaluates the first condition. Executes its block if true.</li><li><code>elif</code> — (\"else if\") Checked only if the preceding <code>if</code> was false. You can chain multiple <code>elif</code> blocks.</li><li><code>else</code> — Executes if no preceding condition was true. Optional.</li></ul><h4>Indentation is Mandatory</h4><p>Python uses indentation (4 spaces by convention) to define code blocks. There are no curly braces. Incorrect indentation is a syntax error.</p><h4>Ternary Expression</h4><p>For simple one-line conditionals: <code>status = \"OK\" if cpu &lt; 80 else \"ALERT\"</code></p>",
          "syntax": "cpu = 87\n\nif cpu >= 90:\n    print(\"CRITICAL\")\nelif cpu >= 80:\n    print(\"WARNING\")\nelif cpu >= 60:\n    print(\"ELEVATED\")\nelse:\n    print(\"OK\")\n\n# Ternary (one-liner)\nlabel = \"HIGH\" if cpu > 80 else \"NORMAL\"\nprint(label)\n\n# Nested condition\nif cpu > 80:\n    if cpu > 95:\n        print(\"Emergency — page on-call\")\n    else:\n        print(\"Alert — notify team\")",
          "examples": [
            {
              "name": "Alert Levels",
              "code": "# Multi-level alert classification\ndef classify_cpu(cpu):\n    if cpu >= 95:\n        return \"CRITICAL\"\n    elif cpu >= 85:\n        return \"WARNING\"\n    elif cpu >= 70:\n        return \"ELEVATED\"\n    else:\n        return \"OK\"\n\nreadings = [42, 71, 86, 95, 58, 99, 68]\n\nprint(f\"{'CPU%':>6}  {'Level'}\")\nprint(\"-\" * 20)\nfor r in readings:\n    print(f\"{r:>6}%  {classify_cpu(r)}\")",
              "level": "beginner"
            },
            {
              "name": "Remediation Logic",
              "code": "# Automated remediation based on conditions\nservice = \"nginx\"\nstatus  = \"stopped\"\ncpu     = 12\nmemory  = 45\n\nprint(f\"Service : {service}\")\nprint(f\"Status  : {status}\")\nprint(f\"CPU     : {cpu}%\")\nprint(f\"Memory  : {memory}%\")\nprint()\n\nif status == \"stopped\":\n    print(f\"[ACTION] Starting {service}...\")\nelif cpu > 90 and memory > 85:\n    print(f\"[ACTION] Restarting {service} — resource pressure\")\nelif cpu > 90:\n    print(f\"[ALERT]  {service} CPU critical — investigate\")\nelse:\n    print(f\"[OK]     {service} is healthy\")",
              "level": "intermediate"
            },
            {
              "name": "Input Validation",
              "code": "# Validating configuration input\ndef validate_port(port):\n    if not isinstance(port, int):\n        return False, \"Port must be an integer\"\n    elif port < 1 or port > 65535:\n        return False, f\"Port {port} out of valid range (1-65535)\"\n    elif port < 1024:\n        return True, f\"Port {port} is a privileged port (requires root)\"\n    else:\n        return True, f\"Port {port} is valid\"\n\ntest_ports = [80, 443, 8080, 0, 70000, 22, \"abc\"]\n\nfor p in test_ports:\n    valid, message = validate_port(p)\n    status = \"PASS\" if valid else \"FAIL\"\n    print(f\"  [{status}] {str(p):<8} {message}\")",
              "level": "intermediate"
            }
          ],
          "brief": "<h4>If / Else</h4><ul><li><code>if</code> → <code>elif</code> → <code>else</code> — branching logic</li><li>Indentation (4 spaces) defines code blocks</li><li>Ternary: <code>status = \"OK\" if cpu &lt; 80 else \"ALERT\"</code></li><li>Drives alert logic, validation, and remediation</li><li>Only the first matching branch executes</li></ul>",
          "lab": {
            "title": "Lab: Multi-Level Alert Classifier",
            "challenge": "Write a function called classify_alert(cpu, memory, disk) that returns: 'CRITICAL' if any metric is above 95, 'HIGH' if any is above 85, 'WARNING' if any is above 75, 'ELEVATED' if any is above 60, or 'OK' otherwise. Test it with at least 5 different input combinations and print the results.",
            "hint": "Check conditions from highest to lowest using if/elif/else. Use max() or check each value individually."
          }
        },
        {
          "id": "m5s2",
          "title": "5.2 Loops",
          "description": "<p><strong>Loops allow you to execute a block of code repeatedly — either over a sequence of items or while a condition remains true.</strong> They are the engine of automation: without loops, you would need to write the same code once for every server, every log line, every metric reading.</p><h4>for Loop</h4><p>Iterates over any iterable — a list, tuple, dictionary, string, or range. The loop variable takes each value in turn. Use <code>for</code> when you know what you are iterating over.</p><h4>while Loop</h4><p>Repeats as long as a condition is true. Use <code>while</code> for polling, retries, and event loops where the number of iterations is not known in advance.</p><h4>Loop Control</h4><ul><li><code>break</code> — Exit the loop immediately.</li><li><code>continue</code> — Skip the rest of the current iteration and move to the next.</li><li><code>else</code> — Executes after the loop completes normally (not via <code>break</code>).</li></ul>",
          "syntax": "# for loop over a list\nservers = [\"web-01\", \"web-02\", \"db-01\"]\nfor server in servers:\n    print(f\"Checking {server}\")\n\n# for loop with index\nfor i, server in enumerate(servers):\n    print(f\"{i+1}. {server}\")\n\n# while loop\nretries = 0\nwhile retries < 3:\n    print(f\"Attempt {retries + 1}\")\n    retries += 1\n\n# break and continue\nfor s in servers:\n    if s == \"db-01\":\n        break          # stop at db-01\n    print(s)",
          "examples": [
            {
              "name": "For Loop",
              "code": "# Iterating over infrastructure data\nservers = [\n    {\"name\": \"web-01\", \"cpu\": 45, \"status\": \"online\"},\n    {\"name\": \"web-02\", \"cpu\": 92, \"status\": \"online\"},\n    {\"name\": \"db-01\",  \"cpu\": 30, \"status\": \"online\"},\n    {\"name\": \"cache\",  \"cpu\": 11, \"status\": \"offline\"},\n]\n\nprint(f\"{'#':<4} {'Server':<12} {'CPU%':>6} {'Status'}\")\nprint(\"-\" * 35)\nfor i, s in enumerate(servers, 1):\n    flag = \" ⚠\" if s[\"cpu\"] > 85 else \"\"\n    print(f\"{i:<4} {s['name']:<12} {s['cpu']:>6}%  {s['status']}{flag}\")",
              "level": "beginner"
            },
            {
              "name": "While Loop",
              "code": "# Retry loop — common in infrastructure automation\nimport random\nrandom.seed(42)\n\ndef attempt_connection(host):\n    \"\"\"Simulate a connection attempt (70% success rate).\"\"\"\n    return random.random() > 0.3\n\nhost    = \"db-primary.internal\"\nMAX_RETRIES = 5\nretries = 0\nconnected = False\n\nwhile retries < MAX_RETRIES and not connected:\n    retries += 1\n    print(f\"  Attempt {retries}/{MAX_RETRIES} connecting to {host}...\")\n    connected = attempt_connection(host)\n    if connected:\n        print(f\"  Connected successfully on attempt {retries}.\")\n\nif not connected:\n    print(f\"  FAILED — could not connect after {MAX_RETRIES} attempts.\")",
              "level": "intermediate"
            },
            {
              "name": "Break & Continue",
              "code": "# Using break and continue in log processing\nlogs = [\n    \"INFO  Service started\",\n    \"INFO  Request received\",\n    \"WARN  Response time elevated: 450ms\",\n    \"ERROR Disk write failed: /var/log/app.log\",\n    \"INFO  Retry scheduled\",\n    \"FATAL Out of memory — process killed\",\n    \"INFO  This line won't be reached\",\n]\n\nprint(\"Processing logs (stop at FATAL):\")\nfor line in logs:\n    if line.startswith(\"INFO\"):\n        continue   # skip informational lines\n    if line.startswith(\"FATAL\"):\n        print(f\"  [FATAL] {line} — halting processing\")\n        break\n    print(f\"  [ISSUE] {line}\")",
              "level": "intermediate"
            }
          ],
          "brief": "<h4>Loops</h4><ul><li><code>for item in collection:</code> — iterate over sequences</li><li><code>while condition:</code> — repeat until condition is false</li><li><code>break</code> — exit loop early</li><li><code>continue</code> — skip to next iteration</li><li><code>enumerate()</code> — get index + value together</li></ul>",
          "lab": {
            "title": "Lab: Server Status Report",
            "challenge": "Create a list of 6 server dictionaries with 'name', 'cpu', 'memory', and 'status' fields. Loop through them and print a formatted status report. Include a summary at the end showing: total servers, how many are online, how many have CPU > 80%, and the average CPU across all servers.",
            "hint": "Use a for loop with f-strings for formatting. Track counters and sums as you iterate."
          }
        },
        {
          "id": "m5s3",
          "title": "5.3 Range Function",
          "description": "<p><strong><code>range()</code> generates a sequence of integers on demand, without storing them all in memory.</strong> It is the standard way to loop a specific number of times or generate numeric sequences in Python.</p><p>Because <code>range()</code> is lazy (it generates values one at a time), it is memory-efficient even for very large sequences — <code>range(1_000_000)</code> uses the same memory as <code>range(10)</code>.</p><h4>Syntax Forms</h4><ul><li><code>range(stop)</code> — 0 up to (not including) stop. e.g. <code>range(5)</code> → 0,1,2,3,4</li><li><code>range(start, stop)</code> — start up to (not including) stop.</li><li><code>range(start, stop, step)</code> — with a custom step. Negative step counts down.</li></ul><h4>Common Uses</h4><p>Generating numbered sequences, creating test data, iterating a fixed number of times, and building indexed loops when you need both the index and the value (though <code>enumerate()</code> is preferred for the latter).</p>",
          "syntax": "# Basic range\nfor i in range(5):\n    print(i)          # 0 1 2 3 4\n\n# Start and stop\nfor i in range(1, 6):\n    print(i)          # 1 2 3 4 5\n\n# With step\nfor i in range(0, 101, 10):\n    print(i)          # 0 10 20 ... 100\n\n# Countdown\nfor i in range(5, 0, -1):\n    print(i)          # 5 4 3 2 1\n\n# Convert to list\nprint(list(range(5)))  # [0, 1, 2, 3, 4]",
          "examples": [
            {
              "name": "Range Basics",
              "code": "# Exploring range() forms\nprint(\"range(5):\")\nprint(list(range(5)))\n\nprint(\"\\nrange(1, 6):\")\nprint(list(range(1, 6)))\n\nprint(\"\\nrange(0, 51, 10):\")\nprint(list(range(0, 51, 10)))\n\nprint(\"\\nrange(10, 0, -2):\")\nprint(list(range(10, 0, -2)))\n\nprint(\"\\nCounting loop:\")\nfor i in range(1, 4):\n    print(f\"  Iteration {i}\")",
              "level": "beginner"
            },
            {
              "name": "Generate Test Data",
              "code": "# Using range to generate test infrastructure data\nprint(\"Generating server inventory...\\n\")\n\nservers = []\nfor i in range(1, 6):\n    servers.append({\n        \"name\": f\"web-{i:02d}\",\n        \"ip\":   f\"10.0.1.{i + 9}\",\n        \"port\": 80,\n    })\n\nfor i in range(1, 3):\n    servers.append({\n        \"name\": f\"db-{i:02d}\",\n        \"ip\":   f\"10.0.2.{i + 9}\",\n        \"port\": 5432,\n    })\n\nprint(f\"{'Name':<10} {'IP':<16} {'Port'}\")\nprint(\"-\" * 32)\nfor s in servers:\n    print(f\"{s['name']:<10} {s['ip']:<16} {s['port']}\")",
              "level": "intermediate"
            },
            {
              "name": "Progress Tracker",
              "code": "# Simulating a batch operation with progress\ntasks = [\n    \"Backup web-01\", \"Backup web-02\", \"Backup db-01\",\n    \"Rotate logs\",   \"Clear cache\",   \"Run health check\",\n]\n\ntotal = len(tasks)\nprint(f\"Starting batch job: {total} tasks\\n\")\n\nfor i in range(total):\n    task = tasks[i]\n    pct  = ((i + 1) / total) * 100\n    bar  = \"#\" * (i + 1) + \"-\" * (total - i - 1)\n    print(f\"  [{bar}] {pct:5.1f}%  {task}\")\n\nprint(f\"\\nAll {total} tasks completed.\")",
              "level": "intermediate"
            }
          ],
          "brief": "<h4>Range Function</h4><ul><li><code>range(stop)</code> — 0 to stop-1</li><li><code>range(start, stop)</code> — start to stop-1</li><li><code>range(start, stop, step)</code> — with custom step</li><li>Lazy — memory efficient even for millions</li><li>Use for numbered loops, test data generation, progress tracking</li></ul>"
        }
      ]
    },
    {
      "id": "module6",
      "title": "Module 7: Functions",
      "sections": [
        {
          "id": "m6s1",
          "title": "6.1 Creating Functions",
          "description": "<p><strong>A function is a named, reusable block of code that performs a specific task.</strong> Functions are the primary tool for organising code, eliminating repetition, and making scripts maintainable.</p><p>The principle is simple: if you write the same logic more than once, put it in a function. Give it a clear name, and call it wherever you need it.</p><h4>Anatomy of a Function</h4><ul><li><code>def</code> keyword — declares the function</li><li><strong>Name</strong> — descriptive, snake_case: <code>check_cpu_health</code></li><li><strong>Parameters</strong> — inputs the function accepts (optional)</li><li><strong>Docstring</strong> — a string immediately after <code>def</code> that documents what the function does</li><li><strong>Body</strong> — the indented code block</li><li><code>return</code> — sends a value back to the caller (optional; returns <code>None</code> if omitted)</li></ul><h4>Why Functions Matter</h4><p>Functions make code testable, readable, and reusable. A well-named function reads like plain English: <code>restart_service(\"nginx\")</code> is self-documenting.</p>",
          "syntax": "def greet(name):\n    \"\"\"Return a greeting string.\"\"\"\n    return f\"Hello, {name}\"\n\n# Call the function\nmessage = greet(\"Alice\")\nprint(message)\n\n# Function with no return value\ndef log_event(level, message):\n    \"\"\"Print a formatted log entry.\"\"\"\n    print(f\"[{level}] {message}\")\n\nlog_event(\"INFO\", \"Service started\")\nlog_event(\"WARN\", \"High memory usage\")",
          "examples": [
            {
              "name": "Basic Function",
              "code": "# Defining and calling functions\ndef get_status_label(cpu):\n    \"\"\"Return a status label based on CPU percentage.\"\"\"\n    if cpu >= 90:\n        return \"CRITICAL\"\n    elif cpu >= 75:\n        return \"WARNING\"\n    elif cpu >= 50:\n        return \"ELEVATED\"\n    else:\n        return \"OK\"\n\n# Test with various values\ntest_values = [25, 55, 78, 91, 100]\n\nprint(f\"{'CPU%':>6}  {'Status'}\")\nprint(\"-\" * 18)\nfor cpu in test_values:\n    print(f\"{cpu:>6}%  {get_status_label(cpu)}\")",
              "level": "beginner"
            },
            {
              "name": "Reusable Logic",
              "code": "# Functions eliminate repetition\ndef format_bytes(bytes_value):\n    \"\"\"Convert bytes to a human-readable string.\"\"\"\n    for unit in [\"B\", \"KB\", \"MB\", \"GB\", \"TB\"]:\n        if bytes_value < 1024:\n            return f\"{bytes_value:.1f} {unit}\"\n        bytes_value /= 1024\n    return f\"{bytes_value:.1f} PB\"\n\ndef print_disk_report(volumes):\n    \"\"\"Print a formatted disk usage report.\"\"\"\n    print(f\"{'Volume':<15} {'Used':>10} {'Total':>10} {'%':>6}\")\n    print(\"-\" * 45)\n    for v in volumes:\n        pct = (v['used'] / v['total']) * 100\n        print(f\"{v['name']:<15} {format_bytes(v['used']):>10} {format_bytes(v['total']):>10} {pct:>5.1f}%\")\n\nvolumes = [\n    {\"name\": \"/\",        \"used\": 42_000_000_000, \"total\": 100_000_000_000},\n    {\"name\": \"/var/log\", \"used\":  8_500_000_000, \"total\":  20_000_000_000},\n    {\"name\": \"/data\",    \"used\": 750_000_000_000,\"total\": 1_000_000_000_000},\n]\nprint_disk_report(volumes)",
              "level": "intermediate"
            },
            {
              "name": "Docstrings",
              "code": "# Well-documented functions with docstrings\ndef calculate_sla_uptime(total_minutes, downtime_minutes):\n    \"\"\"\n    Calculate SLA uptime percentage.\n\n    Args:\n        total_minutes (int): Total period in minutes.\n        downtime_minutes (int): Total downtime in minutes.\n\n    Returns:\n        float: Uptime percentage rounded to 3 decimal places.\n    \"\"\"\n    if total_minutes <= 0:\n        raise ValueError(\"total_minutes must be greater than zero\")\n    uptime = ((total_minutes - downtime_minutes) / total_minutes) * 100\n    return round(uptime, 3)\n\n# Monthly SLA calculation\nmonth_minutes = 30 * 24 * 60   # 43,200 minutes\ndowntime      = 45              # 45 minutes of downtime\n\nuptime = calculate_sla_uptime(month_minutes, downtime)\nprint(f\"Period    : {month_minutes:,} minutes\")\nprint(f\"Downtime  : {downtime} minutes\")\nprint(f\"Uptime    : {uptime}%\")\nprint(f\"SLA 99.9% : {'PASS' if uptime >= 99.9 else 'FAIL'}\")",
              "level": "intermediate"
            }
          ],
          "brief": "<h4>Creating Functions</h4><ul><li><code>def name(params):</code> — declares a function</li><li>Docstring documents what it does</li><li><code>return</code> sends a value back to the caller</li><li>Eliminates repetition — write once, call anywhere</li><li>Makes code testable, readable, and maintainable</li></ul>",
          "lab": {
            "title": "Lab: Bytes Formatter Function",
            "challenge": "Write a function called format_bytes(size_bytes) that converts a number of bytes into a human-readable string. It should return values like '1.50 KB', '2.30 MB', '1.10 GB', etc. Handle bytes, KB, MB, GB, and TB. Test it with values: 500, 1536, 5242880, 1073741824, 2199023255552.",
            "hint": "Divide by 1024 repeatedly and track the unit. Use a list of units: ['B', 'KB', 'MB', 'GB', 'TB']"
          }
        },
        {
          "id": "m6s2",
          "title": "6.2 Arguments",
          "description": "<p><strong>Arguments are the values you pass into a function when calling it.</strong> Python offers several argument types, giving you flexibility in how functions are called and making APIs more expressive and self-documenting.</p><h4>Argument Types</h4><ul><li><strong>Positional:</strong> Matched by position. <code>connect(\"host\", 443)</code></li><li><strong>Keyword:</strong> Matched by name. <code>connect(host=\"host\", port=443)</code> — order doesn't matter.</li><li><strong>Default values:</strong> Parameters with defaults are optional. <code>def connect(host, port=443)</code></li><li><strong>*args:</strong> Accepts any number of positional arguments as a tuple.</li><li><strong>**kwargs:</strong> Accepts any number of keyword arguments as a dictionary.</li></ul><h4>Best Practices</h4><p>Use keyword arguments when calling functions with many parameters — it makes the call self-documenting. Use default values for optional configuration. Avoid mutable defaults (like lists or dicts) — use <code>None</code> and initialise inside the function.</p>",
          "syntax": "# Positional and keyword\ndef connect(host, port=443, protocol=\"https\"):\n    return f\"{protocol}://{host}:{port}\"\n\nprint(connect(\"web-01\"))                    # uses defaults\nprint(connect(\"web-01\", 8080))              # positional\nprint(connect(\"web-01\", protocol=\"http\"))   # keyword\n\n# *args — variable positional\ndef total(*values):\n    return sum(values)\nprint(total(10, 20, 30))   # 60\n\n# **kwargs — variable keyword\ndef log(**fields):\n    for k, v in fields.items():\n        print(f\"{k}={v}\")\nlog(level=\"INFO\", host=\"web-01\", code=200)",
          "examples": [
            {
              "name": "Default Args",
              "code": "# Functions with default argument values\ndef create_alert(message, level=\"WARNING\", notify=True, channel=\"email\"):\n    \"\"\"Create a structured alert.\"\"\"\n    alert = {\n        \"level\":   level,\n        \"message\": message,\n        \"notify\":  notify,\n        \"channel\": channel,\n    }\n    return alert\n\n# Different calling styles\na1 = create_alert(\"CPU above 85%\")\na2 = create_alert(\"Disk full\", level=\"CRITICAL\")\na3 = create_alert(\"Cert expiring\", level=\"WARNING\", channel=\"slack\")\na4 = create_alert(\"Test run\", notify=False)\n\nfor alert in [a1, a2, a3, a4]:\n    print(f\"  [{alert['level']:<8}] {alert['message']:<25} notify={alert['notify']} via={alert['channel']}\")",
              "level": "beginner"
            },
            {
              "name": "*args & **kwargs",
              "code": "# Flexible argument handling\ndef log_event(level, *messages, **context):\n    \"\"\"\n    Log an event with optional extra context.\n    *messages: one or more message strings\n    **context: key=value metadata\n    \"\"\"\n    full_msg = \" | \".join(messages)\n    ctx_str  = \" \".join(f\"{k}={v}\" for k, v in context.items())\n    line = f\"[{level}] {full_msg}\"\n    if ctx_str:\n        line += f\"  ({ctx_str})\"\n    print(line)\n\nlog_event(\"INFO\",  \"Service started\")\nlog_event(\"WARN\",  \"High CPU\", \"Consider scaling\", host=\"web-02\", cpu=92)\nlog_event(\"ERROR\", \"Connection failed\", \"Retrying in 30s\", host=\"db-01\", attempt=3)",
              "level": "intermediate"
            },
            {
              "name": "Config Builder",
              "code": "# Using keyword arguments to build configuration\ndef build_server_config(\n    name,\n    environment,\n    cpu_cores=4,\n    ram_gb=16,\n    disk_gb=100,\n    region=\"eu-west-1\",\n    tags=None\n):\n    \"\"\"Build a server configuration dictionary.\"\"\"\n    if tags is None:\n        tags = []\n    return {\n        \"name\":        name,\n        \"environment\": environment,\n        \"cpu_cores\":   cpu_cores,\n        \"ram_gb\":      ram_gb,\n        \"disk_gb\":     disk_gb,\n        \"region\":      region,\n        \"tags\":        tags,\n    }\n\nweb = build_server_config(\"web-01\", \"production\", cpu_cores=8, tags=[\"web\", \"frontend\"])\ndb  = build_server_config(\"db-01\",  \"production\", cpu_cores=16, ram_gb=64, disk_gb=500)\n\nfor cfg in [web, db]:\n    print(f\"\\n{cfg['name']} ({cfg['environment']})\")\n    for k, v in cfg.items():\n        if k != 'name':\n            print(f\"  {k:<14}: {v}\")",
              "level": "intermediate"
            }
          ],
          "brief": "<h4>Arguments</h4><ul><li><strong>Positional</strong> — matched by order</li><li><strong>Keyword</strong> — matched by name (self-documenting)</li><li><strong>Default values</strong> — optional parameters</li><li><code>*args</code> — variable positional arguments (tuple)</li><li><code>**kwargs</code> — variable keyword arguments (dict)</li></ul>"
        },
        {
          "id": "m6s3",
          "title": "6.3 Lambda Functions",
          "description": "<p><strong>A lambda is a small, anonymous function defined in a single expression.</strong> It is not a replacement for <code>def</code> — it is a tool for short, throwaway functions used inline, typically as arguments to higher-order functions like <code>sorted()</code>, <code>map()</code>, and <code>filter()</code>.</p><h4>Syntax</h4><p><code>lambda parameters: expression</code></p><p>A lambda can take any number of parameters but contains only a single expression. The expression is evaluated and returned automatically — no <code>return</code> keyword needed.</p><h4>When to Use Lambdas</h4><ul><li>As the <code>key</code> argument to <code>sorted()</code> or <code>min()</code>/<code>max()</code></li><li>As quick transformations in <code>map()</code></li><li>As filters in <code>filter()</code></li><li>Anywhere a short function is needed once and naming it would add noise</li></ul><h4>When NOT to Use Lambdas</h4><p>If the logic is complex, spans multiple lines, or will be reused — use <code>def</code>. Lambdas should be immediately readable; if you need to think about what it does, write a named function instead.</p>",
          "syntax": "# Named function vs lambda\ndef double(x):\n    return x * 2\n\ndouble_lambda = lambda x: x * 2\n\nprint(double(5))         # 10\nprint(double_lambda(5))  # 10\n\n# Lambda as sort key\nservers = [{\"name\": \"db-01\", \"cpu\": 30}, {\"name\": \"web-01\", \"cpu\": 88}]\nsorted_by_cpu = sorted(servers, key=lambda s: s[\"cpu\"])\n\n# Lambda with map and filter\nnums = [10, 25, 40, 55, 70]\ndoubled  = list(map(lambda x: x * 2, nums))\nhigh     = list(filter(lambda x: x > 30, nums))",
          "examples": [
            {
              "name": "Lambda Basics",
              "code": "# Lambda vs def — equivalent functions\ndef add(a, b):\n    return a + b\n\nadd_lambda = lambda a, b: a + b\n\nprint(f\"def result    : {add(10, 5)}\")\nprint(f\"lambda result : {add_lambda(10, 5)}\")\n\n# Common lambda patterns\ndouble   = lambda x: x * 2\nsquare   = lambda x: x ** 2\nto_upper = lambda s: s.upper()\nclamp    = lambda x, lo, hi: max(lo, min(hi, x))\n\nprint(f\"\\ndouble(7)         = {double(7)}\")\nprint(f\"square(9)         = {square(9)}\")\nprint(f\"to_upper('hello') = {to_upper('hello')}\")\nprint(f\"clamp(150, 0, 100)= {clamp(150, 0, 100)}\")",
              "level": "beginner"
            },
            {
              "name": "Sort & Filter",
              "code": "# Using lambdas with sorted(), map(), filter()\nservers = [\n    {\"name\": \"db-01\",  \"cpu\": 30, \"mem\": 95},\n    {\"name\": \"web-01\", \"cpu\": 88, \"mem\": 62},\n    {\"name\": \"web-02\", \"cpu\": 45, \"mem\": 71},\n    {\"name\": \"cache\",  \"cpu\": 12, \"mem\": 40},\n]\n\n# Sort by CPU descending\nby_cpu = sorted(servers, key=lambda s: s[\"cpu\"], reverse=True)\nprint(\"Sorted by CPU (high to low):\")\nfor s in by_cpu:\n    print(f\"  {s['name']:<10} cpu={s['cpu']}%\")\n\n# Filter servers with memory > 70%\nhigh_mem = list(filter(lambda s: s[\"mem\"] > 70, servers))\nprint(f\"\\nHigh memory servers: {[s['name'] for s in high_mem]}\")\n\n# Map: extract names only\nnames = list(map(lambda s: s[\"name\"].upper(), servers))\nprint(f\"All names (upper): {names}\")",
              "level": "intermediate"
            },
            {
              "name": "Inline Transforms",
              "code": "# Lambdas for quick data transformations\nraw_metrics = [\n    \"web-01:88:72\",\n    \"web-02:45:61\",\n    \"db-01:30:95\",\n]\n\n# Parse each string into a structured dict\nparse = lambda s: dict(zip([\"host\",\"cpu\",\"mem\"], s.split(\":\")))\nparsed = list(map(parse, raw_metrics))\n\n# Convert numeric fields\nfor m in parsed:\n    m[\"cpu\"] = int(m[\"cpu\"])\n    m[\"mem\"] = int(m[\"mem\"])\n\n# Find the server with highest CPU\nbusiest = max(parsed, key=lambda m: m[\"cpu\"])\n\nprint(\"Parsed metrics:\")\nfor m in parsed:\n    print(f\"  {m['host']:<10} cpu={m['cpu']}% mem={m['mem']}%\")\nprint(f\"\\nBusiest server: {busiest['host']} ({busiest['cpu']}% CPU)\")",
              "level": "intermediate"
            }
          ],
          "brief": "<h4>Lambda Functions</h4><ul><li>Anonymous single-expression function</li><li>Syntax: <code>lambda x: x * 2</code></li><li>Use as <code>key=</code> in <code>sorted()</code>, <code>min()</code>, <code>max()</code></li><li>Use with <code>map()</code> and <code>filter()</code></li><li>If it's complex, use <code>def</code> instead</li></ul>"
        }
      ]
    },
    {
      "id": "module7",
      "title": "Module 8: Error Handling",
      "sections": [
        {
          "id": "m7s1",
          "title": "7.1 Try / Except",
          "description": "<p><strong>Error handling is the practice of anticipating failures and responding to them gracefully, rather than letting your script crash.</strong> In production infrastructure scripts, unhandled exceptions can leave systems in an inconsistent state, suppress important error messages, or cause cascading failures.</p><p>Python uses the <code>try / except</code> block to catch and handle exceptions at runtime.</p><h4>How It Works</h4><ul><li>Code in the <code>try</code> block is executed normally.</li><li>If an exception occurs, Python jumps to the matching <code>except</code> block.</li><li>If no exception occurs, the <code>except</code> block is skipped.</li></ul><h4>Catching Specific Exceptions</h4><p>Always catch the most specific exception you expect. Catching bare <code>except:</code> or <code>except Exception:</code> hides bugs. Common exceptions: <code>ValueError</code>, <code>TypeError</code>, <code>KeyError</code>, <code>FileNotFoundError</code>, <code>ConnectionError</code>.</p><h4>The Exception Object</h4><p>Use <code>except ValueError as e</code> to capture the exception and inspect its message with <code>str(e)</code>.</p>",
          "syntax": "# Basic try/except\ntry:\n    value = int(\"not-a-number\")\nexcept ValueError as e:\n    print(f\"Conversion failed: {e}\")\n\n# Multiple except clauses\ntry:\n    data = {\"host\": \"web-01\"}\n    port = data[\"port\"]          # KeyError\n    result = 100 / 0             # ZeroDivisionError\nexcept KeyError as e:\n    print(f\"Missing key: {e}\")\nexcept ZeroDivisionError:\n    print(\"Cannot divide by zero\")\nexcept Exception as e:\n    print(f\"Unexpected error: {e}\")",
          "examples": [
            {
              "name": "Basic Handling",
              "code": "# Handling common exceptions\ndef safe_divide(a, b):\n    \"\"\"Divide a by b, returning None on error.\"\"\"\n    try:\n        return a / b\n    except ZeroDivisionError:\n        print(f\"  [ERROR] Cannot divide {a} by zero\")\n        return None\n    except TypeError as e:\n        print(f\"  [ERROR] Invalid types: {e}\")\n        return None\n\ntest_cases = [\n    (100, 4),\n    (75,  0),\n    (\"x\", 5),\n    (200, 8),\n]\n\nprint(f\"{'A':>6} {'B':>6} {'Result':>10}\")\nprint(\"-\" * 26)\nfor a, b in test_cases:\n    result = safe_divide(a, b)\n    display = f\"{result:.2f}\" if result is not None else \"ERROR\"\n    print(f\"{str(a):>6} {str(b):>6} {display:>10}\")",
              "level": "beginner"
            },
            {
              "name": "Config Validation",
              "code": "# Robust configuration parsing with error handling\ndef parse_config(raw):\n    \"\"\"Parse and validate a configuration dictionary.\"\"\"\n    errors = []\n    config = {}\n\n    try:\n        config[\"host\"] = str(raw[\"host\"])\n    except KeyError:\n        errors.append(\"Missing required field: 'host'\")\n\n    try:\n        config[\"port\"] = int(raw[\"port\"])\n        if not (1 <= config[\"port\"] <= 65535):\n            raise ValueError(f\"Port {config['port']} out of range\")\n    except KeyError:\n        errors.append(\"Missing required field: 'port'\")\n    except (ValueError, TypeError) as e:\n        errors.append(f\"Invalid port: {e}\")\n\n    return config, errors\n\ntest_inputs = [\n    {\"host\": \"db-01\", \"port\": \"5432\"},\n    {\"host\": \"web-01\", \"port\": \"abc\"},\n    {\"port\": \"443\"},\n]\n\nfor raw in test_inputs:\n    cfg, errs = parse_config(raw)\n    status = \"OK\" if not errs else \"FAIL\"\n    print(f\"  [{status}] Input: {raw}\")\n    for e in errs:\n        print(f\"         Error: {e}\")",
              "level": "intermediate"
            },
            {
              "name": "API Error Handling",
              "code": "# Simulating robust API call with error handling\nimport json\n\ndef parse_api_response(response_text):\n    \"\"\"Parse a JSON API response safely.\"\"\"\n    try:\n        data = json.loads(response_text)\n    except json.JSONDecodeError as e:\n        return None, f\"Invalid JSON: {e}\"\n\n    try:\n        status = data[\"status\"]\n        metrics = data[\"metrics\"]\n        cpu = float(metrics[\"cpu\"])\n    except KeyError as e:\n        return None, f\"Missing field in response: {e}\"\n    except (ValueError, TypeError) as e:\n        return None, f\"Invalid metric value: {e}\"\n\n    return {\"status\": status, \"cpu\": cpu}, None\n\nresponses = [\n    '{\"status\": \"ok\", \"metrics\": {\"cpu\": \"74.2\"}}',\n    '{\"status\": \"ok\"}',\n    'not valid json',\n    '{\"status\": \"ok\", \"metrics\": {\"cpu\": \"N/A\"}}',\n]\n\nfor r in responses:\n    result, error = parse_api_response(r)\n    if error:\n        print(f\"  [FAIL] {error}\")\n    else:\n        print(f\"  [OK]   status={result['status']} cpu={result['cpu']}%\")",
              "level": "intermediate"
            }
          ],
          "brief": "<h4>Try / Except</h4><ul><li>Wrap risky code in <code>try:</code> block</li><li><code>except SpecificError as e:</code> — catch and handle</li><li>Always catch specific exceptions, not bare <code>except:</code></li><li>Common: <code>ValueError</code>, <code>KeyError</code>, <code>FileNotFoundError</code></li><li>Prevents crashes, enables graceful degradation</li></ul>",
          "lab": {
            "title": "Lab: Connection Failure Handler",
            "challenge": "Write a function called safe_connect(host, port) that simulates connecting to a server. Use try/except to handle: ValueError (invalid port), TimeoutError (simulate with a random check), and a general ConnectionError. The function should retry up to 3 times on TimeoutError before giving up. Print clear status messages for each attempt.",
            "hint": "Use a while loop for retries inside a try/except. Raise TimeoutError randomly using: if random.random() < 0.5: raise TimeoutError"
          }
        },
        {
          "id": "m7s2",
          "title": "7.2 Finally and Raise",
          "description": "<p><strong><code>finally</code> and <code>raise</code> give you precise control over cleanup and error propagation.</strong> Together with <code>try/except</code>, they form a complete error handling toolkit.</p><h4>finally</h4><p>The <code>finally</code> block <strong>always executes</strong> — whether an exception occurred or not, and even if a <code>return</code> statement was hit. Use it for cleanup that must happen regardless: closing files, releasing locks, closing database connections, logging completion.</p><h4>raise</h4><p><code>raise</code> deliberately triggers an exception. Use it to enforce preconditions, signal invalid state, or re-raise a caught exception after logging it. You can raise built-in exceptions (<code>ValueError</code>, <code>RuntimeError</code>) or define custom exception classes.</p><h4>else on try</h4><p>The optional <code>else</code> block runs only if the <code>try</code> block completed without raising an exception. It keeps the \"success path\" code separate from the error handling code, improving readability.</p>",
          "syntax": "# finally — always runs\ntry:\n    result = risky_operation()\nexcept RuntimeError as e:\n    print(f\"Error: {e}\")\nfinally:\n    print(\"Cleanup complete\")   # always runs\n\n# raise — signal an error\ndef set_threshold(value):\n    if not 0 <= value <= 100:\n        raise ValueError(f\"Threshold must be 0-100, got {value}\")\n    return value\n\n# try/except/else/finally\ntry:\n    data = fetch_data()\nexcept ConnectionError as e:\n    log(f\"Failed: {e}\")\nelse:\n    process(data)    # only if no exception\nfinally:\n    close_connection()",
          "examples": [
            {
              "name": "Finally Cleanup",
              "code": "# finally ensures cleanup always happens\ndef process_server_data(server_name):\n    \"\"\"Simulate acquiring a lock and processing data.\"\"\"\n    lock_acquired = False\n    try:\n        print(f\"  Acquiring lock for {server_name}...\")\n        lock_acquired = True\n\n        # Simulate processing\n        if server_name == \"db-01\":\n            raise RuntimeError(\"Database connection refused\")\n\n        print(f\"  Processing {server_name} — success\")\n        return True\n\n    except RuntimeError as e:\n        print(f\"  [ERROR] {e}\")\n        return False\n\n    finally:\n        if lock_acquired:\n            print(f\"  Releasing lock for {server_name}\")\n\nfor server in [\"web-01\", \"db-01\", \"web-02\"]:\n    print(f\"\\n--- {server} ---\")\n    process_server_data(server)",
              "level": "beginner"
            },
            {
              "name": "Raise Validation",
              "code": "# Using raise to enforce business rules\nclass ConfigError(Exception):\n    \"\"\"Raised when configuration is invalid.\"\"\"\n    pass\n\ndef validate_threshold(name, value, min_val=0, max_val=100):\n    \"\"\"Validate a percentage threshold.\"\"\"\n    if not isinstance(value, (int, float)):\n        raise TypeError(f\"'{name}' must be numeric, got {type(value).__name__}\")\n    if not min_val <= value <= max_val:\n        raise ConfigError(f\"'{name}' must be {min_val}-{max_val}, got {value}\")\n    return value\n\ntest_cases = [\n    (\"cpu_alert\",    85,   0, 100),\n    (\"cpu_alert\",   110,   0, 100),\n    (\"latency_ms\",  200,   0, 500),\n    (\"latency_ms\", \"abc\",  0, 500),\n]\n\nfor name, val, lo, hi in test_cases:\n    try:\n        result = validate_threshold(name, val, lo, hi)\n        print(f\"  [OK]   {name} = {result}\")\n    except (ConfigError, TypeError) as e:\n        print(f\"  [FAIL] {e}\")",
              "level": "intermediate"
            },
            {
              "name": "Try/Else/Finally",
              "code": "# Full try/except/else/finally pattern\nimport json\n\ndef load_config(json_string):\n    \"\"\"\n    Load and validate a JSON config.\n    Uses try/except/else/finally for clean flow.\n    \"\"\"\n    config = None\n    print(f\"  Loading: {json_string[:40]}...\")\n    try:\n        config = json.loads(json_string)\n    except json.JSONDecodeError as e:\n        print(f\"  [ERROR] Parse failed: {e}\")\n    else:\n        # Only runs if no exception\n        required = [\"host\", \"port\"]\n        missing  = [k for k in required if k not in config]\n        if missing:\n            print(f\"  [WARN]  Missing keys: {missing}\")\n        else:\n            print(f\"  [OK]    Config valid: host={config['host']} port={config['port']}\")\n    finally:\n        print(\"  [INFO]  Load attempt complete\")\n    return config\n\nload_config('{\"host\": \"db-01\", \"port\": 5432}')\nprint()\nload_config('{\"host\": \"web-01\"}')\nprint()\nload_config('not json at all')",
              "level": "intermediate"
            }
          ],
          "brief": "<h4>Finally and Raise</h4><ul><li><code>finally:</code> — ALWAYS executes (cleanup: close files, release locks)</li><li><code>raise</code> — deliberately trigger an exception</li><li><code>else:</code> on try — runs only if no exception occurred</li><li>Use <code>raise ValueError(...)</code> to enforce preconditions</li><li>Pattern: try → except → else → finally</li></ul>"
        }
      ]
    },
    {
      "id": "module8",
      "title": "Module 9: File Handling",
      "sections": [
        {
          "id": "m8s1",
          "title": "8.1 Reading Files",
          "description": "<p><strong>File I/O is fundamental to infrastructure scripting.</strong> Configuration files, log files, inventory lists, and reports all live on disk. Python's built-in file handling makes reading and writing them straightforward and safe.</p><h4>Opening Files</h4><p>Use the <code>open()</code> function with a file path and mode. Always use the <code>with</code> statement — it guarantees the file is closed automatically when the block exits, even if an exception occurs.</p><h4>Read Modes</h4><ul><li><code>'r'</code> — Read text (default)</li><li><code>'rb'</code> — Read binary</li></ul><h4>Reading Methods</h4><ul><li><code>read()</code> — Read entire file as a single string</li><li><code>readlines()</code> — Read all lines into a list</li><li><code>for line in file</code> — Iterate line by line (memory-efficient for large files)</li></ul><h4>Encoding</h4><p>Always specify <code>encoding='utf-8'</code> explicitly to avoid platform-dependent behaviour, especially on Windows.</p>",
          "syntax": "# Read entire file\nwith open(\"config.txt\", \"r\", encoding=\"utf-8\") as f:\n    content = f.read()\n\n# Read line by line (memory efficient)\nwith open(\"server.log\", \"r\", encoding=\"utf-8\") as f:\n    for line in f:\n        line = line.strip()\n        if \"ERROR\" in line:\n            print(line)\n\n# Read all lines into a list\nwith open(\"hosts.txt\", \"r\", encoding=\"utf-8\") as f:\n    hosts = [line.strip() for line in f.readlines()]",
          "examples": [
            {
              "name": "Read Simulation",
              "code": "# Simulating file reading (using in-memory data)\n# In a real script: open(\"server.log\", \"r\", encoding=\"utf-8\")\n\nlog_content = \"\"\"2024-01-15 08:00:01 INFO  web-01 Service started\n2024-01-15 08:00:45 WARN  web-02 Response time 450ms\n2024-01-15 08:01:12 ERROR db-01  Connection pool exhausted\n2024-01-15 08:01:30 INFO  web-01 Request processed\n2024-01-15 08:02:05 ERROR web-02 Disk write failed\n2024-01-15 08:02:44 INFO  db-01  Reconnected successfully\"\"\"\n\nlines = log_content.splitlines()\n\nprint(f\"Total lines : {len(lines)}\")\nprint(f\"Errors      : {sum(1 for l in lines if 'ERROR' in l)}\")\nprint(f\"Warnings    : {sum(1 for l in lines if 'WARN' in l)}\")\nprint(\"\\nErrors found:\")\nfor line in lines:\n    if \"ERROR\" in line:\n        print(f\"  {line}\")",
              "level": "beginner"
            },
            {
              "name": "Config Parser",
              "code": "# Parsing a key=value config file format\nconfig_text = \"\"\"# Server configuration\nhost=prod-db-01.internal\nport=5432\nmax_connections=100\ntimeout=30\nlog_level=INFO\ndebug=false\"\"\"\n\nconfig = {}\nfor line in config_text.splitlines():\n    line = line.strip()\n    if not line or line.startswith(\"#\"):\n        continue   # skip blanks and comments\n    if \"=\" in line:\n        key, _, value = line.partition(\"=\")\n        config[key.strip()] = value.strip()\n\nprint(\"Parsed configuration:\")\nfor key, value in config.items():\n    print(f\"  {key:<20} = {value}\")\n\nprint(f\"\\nHost    : {config.get('host', 'not set')}\")\nprint(f\"Port    : {config.get('port', 'not set')}\")\nprint(f\"Timeout : {config.get('timeout', '60')}s\")",
              "level": "intermediate"
            },
            {
              "name": "Log Analyser",
              "code": "# Analysing log data — counting by level and host\nlog_data = \"\"\"2024-01-15 08:00:01 INFO  web-01 Started\n2024-01-15 08:00:45 WARN  web-02 Slow response\n2024-01-15 08:01:12 ERROR db-01  Connection failed\n2024-01-15 08:01:30 INFO  web-01 Request OK\n2024-01-15 08:02:05 ERROR web-02 Disk error\n2024-01-15 08:02:44 ERROR db-01  Timeout\n2024-01-15 08:03:01 WARN  web-01 Memory elevated\"\"\"\n\nby_level = {}\nby_host  = {}\n\nfor line in log_data.splitlines():\n    parts = line.split()\n    if len(parts) < 4:\n        continue\n    level = parts[2]\n    host  = parts[3]\n    by_level[level] = by_level.get(level, 0) + 1\n    by_host[host]   = by_host.get(host, 0) + 1\n\nprint(\"By Level:\")\nfor level, count in sorted(by_level.items()):\n    print(f\"  {level:<8}: {count}\")\n\nprint(\"\\nBy Host:\")\nfor host, count in sorted(by_host.items()):\n    print(f\"  {host:<10}: {count}\")",
              "level": "intermediate"
            }
          ],
          "brief": "<h4>Reading Files</h4><ul><li><code>with open(path, \"r\") as f:</code> — auto-closes file</li><li><code>f.read()</code> — entire file as string</li><li><code>f.readlines()</code> — list of lines</li><li><code>for line in f:</code> — memory-efficient iteration</li><li>Always specify <code>encoding=\"utf-8\"</code></li></ul>",
          "lab": {
            "title": "Lab: Config File Validator",
            "challenge": "Write a function called validate_config(config_text) that takes a JSON string (simulating a config file), parses it, and validates that these required fields exist: 'host', 'port', 'database', and 'timeout'. Return a dict with 'valid' (bool) and 'missing' (list of missing field names). Test with both valid and invalid config strings.",
            "hint": "Use json.loads() to parse the string. Compare required fields against the parsed dict's keys."
          }
        },
        {
          "id": "m8s2",
          "title": "8.2 Writing CSV",
          "description": "<p><strong>CSV (Comma-Separated Values) is the universal format for tabular data exchange.</strong> It is human-readable, supported by every spreadsheet application, and trivial to generate from Python using the built-in <code>csv</code> module.</p><p>In infrastructure work, CSV is the go-to format for exporting reports, audit logs, capacity data, and inventory lists that need to be shared with non-technical stakeholders or imported into other tools.</p><h4>The csv Module</h4><p>Always use Python's <code>csv</code> module rather than manually joining strings with commas. The module handles quoting, escaping, and line endings correctly across platforms.</p><h4>Key Classes</h4><ul><li><code>csv.writer</code> — Writes rows as lists</li><li><code>csv.DictWriter</code> — Writes rows as dictionaries (preferred — self-documenting)</li></ul><h4>Best Practices</h4><p>Open files with <code>newline=''</code> on Windows to prevent double line endings. Use <code>encoding='utf-8-sig'</code> if the file will be opened in Excel (adds a BOM marker).</p>",
          "syntax": "import csv\n\n# Write with DictWriter\nfields = [\"host\", \"cpu\", \"status\"]\nrows   = [\n    {\"host\": \"web-01\", \"cpu\": 45, \"status\": \"online\"},\n    {\"host\": \"db-01\",  \"cpu\": 88, \"status\": \"online\"},\n]\n\nwith open(\"report.csv\", \"w\", newline=\"\", encoding=\"utf-8\") as f:\n    writer = csv.DictWriter(f, fieldnames=fields)\n    writer.writeheader()\n    writer.writerows(rows)\n\n# Read back\nwith open(\"report.csv\", \"r\", encoding=\"utf-8\") as f:\n    reader = csv.DictReader(f)\n    for row in reader:\n        print(row)",
          "examples": [
            {
              "name": "Write CSV",
              "code": "import csv\nimport io\n\n# Infrastructure report data\nservers = [\n    {\"host\": \"web-01\",  \"region\": \"eu-west-1\", \"cpu\": 45, \"mem\": 62, \"status\": \"online\"},\n    {\"host\": \"web-02\",  \"region\": \"eu-west-1\", \"cpu\": 92, \"mem\": 78, \"status\": \"online\"},\n    {\"host\": \"db-01\",   \"region\": \"eu-west-1\", \"cpu\": 30, \"mem\": 95, \"status\": \"online\"},\n    {\"host\": \"cache-01\",\"region\": \"us-east-1\", \"cpu\": 11, \"mem\": 40, \"status\": \"offline\"},\n]\n\n# Write to an in-memory buffer (simulates writing to a file)\nbuffer = io.StringIO()\nfields = [\"host\", \"region\", \"cpu\", \"mem\", \"status\"]\nwriter = csv.DictWriter(buffer, fieldnames=fields)\nwriter.writeheader()\nwriter.writerows(servers)\n\nprint(\"Generated CSV output:\")\nprint(\"-\" * 55)\nprint(buffer.getvalue())",
              "level": "beginner"
            },
            {
              "name": "Read CSV",
              "code": "import csv\nimport io\n\n# Simulated CSV file content\ncsv_data = \"\"\"host,region,cpu,mem,status\nweb-01,eu-west-1,45,62,online\nweb-02,eu-west-1,92,78,online\ndb-01,eu-west-1,30,95,online\ncache-01,us-east-1,11,40,offline\"\"\"\n\nreader = csv.DictReader(io.StringIO(csv_data))\nservers = list(reader)\n\n# Convert numeric fields\nfor s in servers:\n    s[\"cpu\"] = int(s[\"cpu\"])\n    s[\"mem\"] = int(s[\"mem\"])\n\nprint(f\"Loaded {len(servers)} servers from CSV\")\nprint()\n\n# Report: servers needing attention\nalerts = [s for s in servers if s[\"cpu\"] > 80 or s[\"mem\"] > 90]\nprint(f\"Servers requiring attention ({len(alerts)}):\")\nfor s in alerts:\n    print(f\"  {s['host']:<12} cpu={s['cpu']}% mem={s['mem']}%\")",
              "level": "intermediate"
            },
            {
              "name": "CSV Report",
              "code": "import csv\nimport io\nfrom datetime import date\n\n# Generate a daily capacity report\nreadings = [\n    {\"host\": \"web-01\", \"avg_cpu\": 52.3, \"peak_cpu\": 88, \"avg_mem\": 61.0, \"incidents\": 0},\n    {\"host\": \"web-02\", \"avg_cpu\": 71.8, \"peak_cpu\": 95, \"avg_mem\": 74.2, \"incidents\": 2},\n    {\"host\": \"db-01\",  \"avg_cpu\": 28.4, \"peak_cpu\": 45, \"avg_mem\": 91.5, \"incidents\": 1},\n]\n\nbuffer = io.StringIO()\nfields = [\"date\", \"host\", \"avg_cpu\", \"peak_cpu\", \"avg_mem\", \"incidents\", \"health\"]\nwriter = csv.DictWriter(buffer, fieldnames=fields)\nwriter.writeheader()\n\ntoday = str(date.today())\nfor r in readings:\n    health = \"OK\" if r[\"peak_cpu\"] < 90 and r[\"avg_mem\"] < 90 else \"REVIEW\"\n    writer.writerow({\"date\": today, \"health\": health, **r})\n\nprint(\"Daily Capacity Report (CSV):\")\nprint(buffer.getvalue())",
              "level": "intermediate"
            }
          ],
          "brief": "<h4>Writing CSV</h4><ul><li>Use <code>csv.DictWriter</code> — handles quoting and escaping</li><li><code>writeheader()</code> + <code>writerows(data)</code></li><li>Open with <code>newline=\"\"</code> on Windows</li><li>Universal format for reports, exports, and data sharing</li><li>Readable by Excel, Google Sheets, and any data tool</li></ul>"
        },
        {
          "id": "m8s3",
          "title": "8.3 JSON Processing",
          "description": "<p><strong>JSON (JavaScript Object Notation) is the standard data format for APIs, configuration files, and inter-service communication.</strong> Python's built-in <code>json</code> module makes it trivial to parse JSON into Python objects and serialise Python objects back to JSON.</p><h4>Core Functions</h4><ul><li><code>json.loads(string)</code> — Parse a JSON string into a Python dict/list</li><li><code>json.dumps(obj)</code> — Serialise a Python object to a JSON string</li><li><code>json.load(file)</code> — Parse JSON from a file object</li><li><code>json.dump(obj, file)</code> — Write JSON to a file object</li></ul><h4>Python ↔ JSON Type Mapping</h4><p><code>dict</code> ↔ object, <code>list</code> ↔ array, <code>str</code> ↔ string, <code>int/float</code> ↔ number, <code>True/False</code> ↔ true/false, <code>None</code> ↔ null</p><h4>Pretty Printing</h4><p>Use <code>json.dumps(obj, indent=2)</code> for human-readable output. Add <code>sort_keys=True</code> for deterministic ordering.</p>",
          "syntax": "import json\n\n# Parse JSON string\nraw = '{\"host\": \"web-01\", \"cpu\": 88, \"online\": true}'\ndata = json.loads(raw)\nprint(data[\"host\"])       # \"web-01\"\nprint(data[\"online\"])     # True (Python bool)\n\n# Serialise to JSON\nserver = {\"name\": \"db-01\", \"port\": 5432, \"tags\": [\"prod\", \"primary\"]}\njson_str = json.dumps(server, indent=2)\nprint(json_str)\n\n# File I/O\nwith open(\"config.json\", \"w\") as f:\n    json.dump(server, f, indent=2)\n\nwith open(\"config.json\", \"r\") as f:\n    loaded = json.load(f)",
          "examples": [
            {
              "name": "Parse JSON",
              "code": "import json\n\n# Parsing a JSON API response\napi_response = '''\n{\n  \"status\": \"success\",\n  \"timestamp\": \"2024-01-15T08:30:00Z\",\n  \"data\": {\n    \"servers\": [\n      {\"name\": \"web-01\", \"cpu\": 45, \"mem\": 62, \"healthy\": true},\n      {\"name\": \"web-02\", \"cpu\": 92, \"mem\": 78, \"healthy\": true},\n      {\"name\": \"db-01\",  \"cpu\": 30, \"mem\": 95, \"healthy\": false}\n    ]\n  }\n}\n'''\n\nresult = json.loads(api_response)\n\nprint(f\"Status    : {result['status']}\")\nprint(f\"Timestamp : {result['timestamp']}\")\nprint(f\"Servers   : {len(result['data']['servers'])}\")\nprint()\n\nfor s in result['data']['servers']:\n    health = 'OK' if s['healthy'] else 'UNHEALTHY'\n    print(f\"  {s['name']:<10} cpu={s['cpu']:>3}% mem={s['mem']:>3}%  [{health}]\")",
              "level": "beginner"
            },
            {
              "name": "Build JSON",
              "code": "import json\nfrom datetime import datetime\n\n# Building a JSON payload for an API request\ndef build_alert_payload(host, level, message, metrics):\n    \"\"\"Build a structured alert payload.\"\"\"\n    return {\n        \"alert\": {\n            \"level\":     level,\n            \"message\":   message,\n            \"host\":      host,\n            \"timestamp\": datetime.now().isoformat(),\n        },\n        \"metrics\": metrics,\n        \"actions\": {\n            \"notify\":  level in (\"CRITICAL\", \"WARNING\"),\n            \"restart\": level == \"CRITICAL\",\n        }\n    }\n\npayload = build_alert_payload(\n    host=\"web-02\",\n    level=\"CRITICAL\",\n    message=\"CPU sustained above 95% for 5 minutes\",\n    metrics={\"cpu\": 97, \"mem\": 82, \"disk\": 45}\n)\n\nprint(\"Generated JSON payload:\")\nprint(json.dumps(payload, indent=2))",
              "level": "intermediate"
            },
            {
              "name": "Config File",
              "code": "import json\n\n# Working with JSON configuration files\nconfig_json = '''\n{\n  \"app_name\": \"InfraMonitor\",\n  \"version\": \"2.4.1\",\n  \"database\": {\n    \"host\": \"db-primary.internal\",\n    \"port\": 5432,\n    \"name\": \"monitoring\"\n  },\n  \"thresholds\": {\n    \"cpu_warning\": 75,\n    \"cpu_critical\": 90,\n    \"memory_warning\": 80,\n    \"memory_critical\": 95\n  },\n  \"notifications\": [\"email\", \"slack\", \"pagerduty\"]\n}\n'''\n\nconfig = json.loads(config_json)\n\nprint(f\"App: {config['app_name']} v{config['version']}\")\nprint(f\"\\nDatabase:\")\nfor k, v in config['database'].items():\n    print(f\"  {k:<6}: {v}\")\n\nprint(f\"\\nThresholds:\")\nfor k, v in config['thresholds'].items():\n    print(f\"  {k:<18}: {v}%\")\n\nprint(f\"\\nNotification channels: {', '.join(config['notifications'])}\")",
              "level": "intermediate"
            }
          ],
          "brief": "<h4>JSON Processing</h4><ul><li><code>json.loads(string)</code> — parse JSON → Python dict</li><li><code>json.dumps(obj, indent=2)</code> — Python → JSON string</li><li><code>json.load(file)</code> / <code>json.dump(obj, file)</code> — file I/O</li><li>Type mapping: dict↔object, list↔array, None↔null</li><li>Standard format for APIs and configuration files</li></ul>"
        }
      ]
    },
    {
      "id": "module9",
      "title": "Module 10: Modules & Packages",
      "sections": [
        {
          "id": "m9s1",
          "title": "9.1 Importing Modules",
          "brief": "<h4>Importing Modules</h4><ul><li><code>import module</code> — import entire module</li><li><code>from module import func</code> — import specific items</li><li><code>import module as alias</code> — shorter name</li><li>Python searches: current dir → installed packages → standard library</li><li>Modules = reusable code files (.py)</li></ul>",
          "description": "<p><strong>Modules are Python files that contain reusable code — functions, classes, and variables.</strong> The import system lets you use code from other files, the standard library, or third-party packages without rewriting anything.</p><h4>Import Styles</h4><ul><li><code>import os</code> — import the whole module, access with <code>os.path.join()</code></li><li><code>from os import path</code> — import specific items directly</li><li><code>import numpy as np</code> — alias for convenience</li><li><code>from os.path import join, exists</code> — multiple specific imports</li></ul><h4>How Python Finds Modules</h4><p>Python searches in order: current directory → installed packages (site-packages) → standard library paths. The search path is stored in <code>sys.path</code>.</p>",
          "syntax": "import os\nimport sys\nfrom pathlib import Path\nimport json as j\nfrom math import sqrt, pi\n\n# Access module contents\nprint(os.getcwd())\nprint(sys.platform)\nprint(sqrt(16))",
          "script": "Show different import styles.\nExplain when to use each.\nDemo sys.path to show search order.",
          "examples": [
            {
              "name": "Import Styles",
              "code": "# Different ways to import\nimport math\nfrom math import sqrt, pi\nimport json as j\n\nprint(f\"math.ceil(4.2) = {math.ceil(4.2)}\")\nprint(f\"sqrt(144)      = {sqrt(144)}\")\nprint(f\"pi             = {pi:.6f}\")\n\n# json aliased as j\ndata = j.dumps({\"host\": \"web-01\", \"cpu\": 88})\nprint(f\"JSON: {data}\")",
              "level": "beginner"
            },
            {
              "name": "Standard Library",
              "code": "# Python's standard library — batteries included\nimport sys\nimport os\nimport datetime\nimport random\n\nprint(\"Python Standard Library Highlights:\")\nprint(f\"  sys.platform  : {sys.platform}\")\nprint(f\"  os.name       : {os.name}\")\nprint(f\"  datetime.now(): {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}\")\nprint(f\"  random.randint: {random.randint(1, 100)}\")\n\nprint(\"\\nNo pip install needed — these come with Python!\")",
              "level": "intermediate"
            },
            {
              "name": "Custom Module",
              "code": "# Simulating a custom module pattern\n# In real projects: save as utils.py, then import utils\n\n# --- utils.py would contain: ---\ndef format_bytes(b):\n    for unit in ['B','KB','MB','GB','TB']:\n        if b < 1024: return f\"{b:.1f} {unit}\"\n        b /= 1024\n\ndef check_threshold(value, limit):\n    return \"ALERT\" if value > limit else \"OK\"\n\n# --- main.py would do: from utils import format_bytes ---\nprint(format_bytes(1_500_000_000))\nprint(check_threshold(92, 85))",
              "level": "intermediate"
            }
          ]
        },
        {
          "id": "m9s2",
          "title": "9.2 Installing Packages (pip)",
          "brief": "<h4>Installing Packages (pip)</h4><ul><li><code>pip install package_name</code> — install from PyPI</li><li><code>pip install package==version</code> — specific version</li><li><code>pip list</code> — see installed packages</li><li><code>pip freeze > requirements.txt</code> — save dependencies</li><li>PyPI has 400,000+ packages for every use case</li></ul>",
          "description": "<p><strong>pip is Python's package manager that installs third-party libraries from PyPI (Python Package Index).</strong> PyPI hosts over 400,000 packages covering everything from web frameworks to machine learning to infrastructure automation.</p><h4>Essential pip Commands</h4><ul><li><code>pip install requests</code> — install latest version</li><li><code>pip install flask==3.0.0</code> — install specific version</li><li><code>pip install -r requirements.txt</code> — install from file</li><li><code>pip list</code> — show installed packages</li><li><code>pip show requests</code> — package details</li><li><code>pip uninstall requests</code> — remove a package</li></ul>",
          "syntax": "# pip commands (run in terminal, not Python)\n# pip install requests flask pandas\n# pip install requests==2.31.0\n# pip list\n# pip freeze > requirements.txt\n# pip install -r requirements.txt\n# pip uninstall requests\n\n# In Python, just import after installing\nimport json  # standard library, no install needed\nprint(\"Package ready to use after pip install\")",
          "script": "Demo pip install in terminal.\nShow pip list output.\nExplain requirements.txt workflow.",
          "examples": [
            {
              "name": "Popular Packages",
              "code": "# Top Python packages for IT/AI professionals\npackages = [\n    (\"requests\",     \"HTTP client — API calls\"),\n    (\"flask\",        \"Web framework — build APIs\"),\n    (\"pandas\",       \"Data analysis — tables & CSV\"),\n    (\"numpy\",        \"Numerical computing — arrays\"),\n    (\"scikit-learn\", \"Machine learning — models\"),\n    (\"boto3\",        \"AWS SDK — cloud automation\"),\n    (\"paramiko\",     \"SSH — remote server access\"),\n    (\"python-dotenv\",\"Environment variables — secrets\"),\n]\n\nprint(f\"{'Package':<16} {'Use Case'}\")\nprint(\"-\" * 45)\nfor pkg, desc in packages:\n    print(f\"  {pkg:<16} {desc}\")",
              "level": "beginner"
            },
            {
              "name": "requirements.txt",
              "code": "# Managing project dependencies\nreqs = \"\"\"flask==3.0.0\nrequests==2.31.0\npandas==2.1.4\npython-dotenv==1.0.0\ngunicorn==21.2.0\"\"\"\n\nprint(\"requirements.txt:\")\nprint(reqs)\nprint(\"Workflow:\")\nprint(\"  1. pip install flask requests pandas\")\nprint(\"  2. pip freeze > requirements.txt\")\nprint(\"  3. Share requirements.txt with team\")\nprint(\"  4. Team runs: pip install -r requirements.txt\")\nprint(\"  → Everyone has identical dependencies!\")",
              "level": "intermediate"
            },
            {
              "name": "Version Pinning",
              "code": "# Why version pinning matters\nprint(\"Version specifiers:\")\nprint(\"  requests==2.31.0   Exact version (safest)\")\nprint(\"  requests>=2.28     Minimum version\")\nprint(\"  requests~=2.31     Compatible release (2.31.x)\")\nprint(\"  requests<3.0       Upper bound\")\nprint()\nprint(\"Best practice for production:\")\nprint(\"  → Always pin exact versions\")\nprint(\"  → pip freeze gives you exact versions\")\nprint(\"  → Prevents 'works on my machine' issues\")",
              "level": "intermediate"
            }
          ]
        },
        {
          "id": "m9s3",
          "title": "9.3 Creating Your Own Modules",
          "brief": "<h4>Creating Your Own Modules</h4><ul><li>Any <code>.py</code> file is a module — just import it</li><li>Organise related functions into separate files</li><li><code>__name__ == \"__main__\"</code> — run only when executed directly</li><li>Packages = folders with <code>__init__.py</code></li><li>Keep modules focused — one responsibility per file</li></ul>",
          "description": "<p><strong>Any Python file (.py) is a module that can be imported by other files.</strong> Creating your own modules is how you organise larger projects — splitting code into logical, reusable units.</p><h4>Module Structure</h4><ul><li>Group related functions into a single file: <code>utils.py</code>, <code>config.py</code>, <code>monitoring.py</code></li><li>Use <code>if __name__ == \"__main__\":</code> to include test code that only runs when the file is executed directly</li><li>A package is a folder containing an <code>__init__.py</code> file — it groups multiple modules together</li></ul>",
          "syntax": "# File: monitoring.py\ndef check_cpu(value, threshold=85):\n    return \"ALERT\" if value > threshold else \"OK\"\n\ndef check_memory(value, threshold=90):\n    return \"ALERT\" if value > threshold else \"OK\"\n\nif __name__ == \"__main__\":\n    # Only runs when executing this file directly\n    print(check_cpu(92))\n\n# File: main.py\n# from monitoring import check_cpu, check_memory",
          "script": "Show creating a module file.\nDemo importing from it.\nExplain __name__ == '__main__' pattern.\nBriefly mention packages with __init__.py.",
          "examples": [
            {
              "name": "Module Pattern",
              "code": "# Simulating a custom module: monitoring.py\n\n# --- monitoring.py ---\ndef check_health(host, cpu, mem, thresholds=None):\n    if thresholds is None:\n        thresholds = {\"cpu\": 85, \"mem\": 90}\n    alerts = []\n    if cpu > thresholds[\"cpu\"]:\n        alerts.append(f\"CPU {cpu}%\")\n    if mem > thresholds[\"mem\"]:\n        alerts.append(f\"MEM {mem}%\")\n    return {\"host\": host, \"status\": \"ALERT\" if alerts else \"OK\", \"alerts\": alerts}\n\n# --- main.py would do: from monitoring import check_health ---\nservers = [(\"web-01\",45,62),(\"web-02\",92,78),(\"db-01\",30,95)]\nfor name, cpu, mem in servers:\n    result = check_health(name, cpu, mem)\n    print(f\"  {result['host']:<10} {result['status']:<6} {result['alerts']}\")",
              "level": "beginner"
            },
            {
              "name": "__name__ Guard",
              "code": "# The if __name__ == '__main__' pattern\n\ndef add(a, b):\n    return a + b\n\ndef multiply(a, b):\n    return a * b\n\n# This block only runs when THIS file is executed directly\n# It does NOT run when the file is imported as a module\nif __name__ == \"__main__\":\n    print(\"Running tests...\")\n    assert add(2, 3) == 5\n    assert multiply(4, 5) == 20\n    print(\"All tests passed!\")\n    print()\n    print(\"When imported: only add() and multiply() are available\")\n    print(\"Test code doesn't execute on import\")",
              "level": "intermediate"
            },
            {
              "name": "Package Structure",
              "code": "# Python package structure\nstructure = \"\"\"\ninfra_tools/              ← Package (folder)\n├── __init__.py           ← Makes it a package\n├── monitoring.py         ← Module: check_cpu, check_mem\n├── networking.py         ← Module: ping, traceroute\n└── cloud/                ← Sub-package\n    ├── __init__.py\n    ├── aws.py            ← Module: ec2, s3 functions\n    └── azure.py          ← Module: vm, storage functions\n\"\"\"\nprint(structure)\nprint(\"Import examples:\")\nprint(\"  from infra_tools.monitoring import check_cpu\")\nprint(\"  from infra_tools.cloud.aws import list_ec2\")\nprint(\"  import infra_tools.networking as net\")",
              "level": "intermediate"
            }
          ]
        }
      ]
    },
    {
      "id": "module10",
      "title": "Module 11: Object-Oriented Programming",
      "sections": [
        {
          "id": "m10s1",
          "title": "10.1 Classes & Objects",
          "brief": "<h4>Classes & Objects</h4><ul><li>Class = blueprint, Object = instance built from it</li><li><code>class Server:</code> defines a new type</li><li><code>__init__(self)</code> — constructor, runs on creation</li><li><code>self</code> — refers to the current instance</li><li>Attributes = data, Methods = functions on the object</li></ul>",
          "description": "<p><strong>A class is a blueprint for creating objects that bundle data (attributes) and behaviour (methods) together.</strong> OOP lets you model real-world entities — servers, users, connections — as self-contained units with clear interfaces.</p><h4>Key Concepts</h4><ul><li><code>class</code> — defines the blueprint</li><li><code>__init__(self)</code> — constructor method, initialises attributes</li><li><code>self</code> — reference to the current instance</li><li>Attributes — data stored on the object</li><li>Methods — functions that operate on the object's data</li></ul>",
          "syntax": "class Server:\n    def __init__(self, name, ip, port=443):\n        self.name = name\n        self.ip = ip\n        self.port = port\n        self.status = \"online\"\n\n    def get_url(self):\n        return f\"https://{self.ip}:{self.port}\"\n\n# Create instances\nweb = Server(\"web-01\", \"10.0.1.10\")\nprint(web.name, web.get_url())",
          "script": "Explain class vs object with server analogy.\nDemo creating a Server class.\nShow multiple instances.",
          "examples": [
            {
              "name": "Basic Class",
              "code": "class Server:\n    def __init__(self, name, ip, port=443):\n        self.name = name\n        self.ip = ip\n        self.port = port\n        self.status = \"online\"\n\n    def get_url(self):\n        return f\"https://{self.ip}:{self.port}\"\n\n    def __str__(self):\n        return f\"{self.name} ({self.ip}) [{self.status}]\"\n\n# Create objects\nweb1 = Server(\"web-01\", \"10.0.1.10\")\nweb2 = Server(\"web-02\", \"10.0.1.11\", 8080)\ndb   = Server(\"db-01\", \"10.0.2.10\", 5432)\n\nfor s in [web1, web2, db]:\n    print(f\"  {s} → {s.get_url()}\")",
              "level": "beginner"
            },
            {
              "name": "Methods",
              "code": "class Alert:\n    def __init__(self, host, level, message):\n        self.host = host\n        self.level = level\n        self.message = message\n        self.acknowledged = False\n\n    def acknowledge(self, by):\n        self.acknowledged = True\n        self.ack_by = by\n\n    def is_critical(self):\n        return self.level == \"CRITICAL\"\n\n    def __repr__(self):\n        ack = f\" (ack by {self.ack_by})\" if self.acknowledged else \"\"\n        return f\"[{self.level}] {self.host}: {self.message}{ack}\"\n\na = Alert(\"web-02\", \"CRITICAL\", \"CPU 98%\")\nprint(a)\nprint(f\"Critical: {a.is_critical()}\")\na.acknowledge(\"ops-team\")\nprint(a)",
              "level": "intermediate"
            },
            {
              "name": "Real-World OOP",
              "code": "class MonitoringAgent:\n    def __init__(self, name, thresholds=None):\n        self.name = name\n        self.thresholds = thresholds or {\"cpu\": 85, \"mem\": 90}\n        self.readings = []\n\n    def record(self, cpu, mem):\n        self.readings.append({\"cpu\": cpu, \"mem\": mem})\n\n    def check(self):\n        if not self.readings:\n            return \"NO DATA\"\n        latest = self.readings[-1]\n        alerts = []\n        if latest[\"cpu\"] > self.thresholds[\"cpu\"]:\n            alerts.append(f\"CPU={latest['cpu']}%\")\n        if latest[\"mem\"] > self.thresholds[\"mem\"]:\n            alerts.append(f\"MEM={latest['mem']}%\")\n        return f\"ALERT: {', '.join(alerts)}\" if alerts else \"OK\"\n\nagent = MonitoringAgent(\"web-01\")\nagent.record(45, 60)\nagent.record(92, 88)\nprint(f\"{agent.name}: {agent.check()}\")",
              "level": "intermediate"
            }
          ]
        },
        {
          "id": "m10s2",
          "title": "10.2 Inheritance",
          "brief": "<h4>Inheritance</h4><ul><li>Child class inherits attributes and methods from parent</li><li><code>class WebServer(Server):</code> — extends Server</li><li><code>super().__init__()</code> — call parent constructor</li><li>Override methods to specialise behaviour</li><li>Promotes code reuse — define common logic once</li></ul>",
          "description": "<p><strong>Inheritance lets a child class reuse and extend the behaviour of a parent class.</strong> You define common functionality once in a base class, then create specialised subclasses that add or override specific behaviour.</p><h4>How It Works</h4><ul><li>Child class inherits all attributes and methods from parent</li><li><code>super().__init__()</code> calls the parent's constructor</li><li>Override methods by redefining them in the child</li><li><code>isinstance(obj, Class)</code> checks inheritance chain</li></ul>",
          "syntax": "class Server:\n    def __init__(self, name, ip):\n        self.name = name\n        self.ip = ip\n\nclass WebServer(Server):\n    def __init__(self, name, ip, domain):\n        super().__init__(name, ip)\n        self.domain = domain\n\n    def get_url(self):\n        return f\"https://{self.domain}\"",
          "script": "Show base Server class.\nCreate WebServer and DBServer subclasses.\nDemo method overriding.",
          "examples": [
            {
              "name": "Inheritance",
              "code": "class Server:\n    def __init__(self, name, ip):\n        self.name = name\n        self.ip = ip\n        self.status = \"online\"\n\n    def describe(self):\n        return f\"{self.name} @ {self.ip}\"\n\nclass WebServer(Server):\n    def __init__(self, name, ip, domain):\n        super().__init__(name, ip)\n        self.domain = domain\n\n    def describe(self):\n        return f\"{self.name} → {self.domain} ({self.ip})\"\n\nclass DBServer(Server):\n    def __init__(self, name, ip, engine):\n        super().__init__(name, ip)\n        self.engine = engine\n\n    def describe(self):\n        return f\"{self.name} [{self.engine}] @ {self.ip}\"\n\nservers = [\n    WebServer(\"web-01\", \"10.0.1.10\", \"app.example.com\"),\n    DBServer(\"db-01\", \"10.0.2.10\", \"PostgreSQL\"),\n]\nfor s in servers:\n    print(f\"  {s.describe()}\")",
              "level": "beginner"
            },
            {
              "name": "isinstance",
              "code": "class Animal:\n    def speak(self): return \"...\"\n\nclass Dog(Animal):\n    def speak(self): return \"Woof!\"\n\nclass Cat(Animal):\n    def speak(self): return \"Meow!\"\n\npets = [Dog(), Cat(), Dog(), Cat()]\nfor p in pets:\n    print(f\"  {type(p).__name__}: {p.speak()}\")\n\nprint(f\"\\nDog is Animal? {isinstance(pets[0], Animal)}\")\nprint(f\"Cat is Dog?    {isinstance(pets[1], Dog)}\")",
              "level": "intermediate"
            }
          ]
        },
        {
          "id": "m10s3",
          "title": "10.3 Encapsulation & Properties",
          "brief": "<h4>Encapsulation & Properties</h4><ul><li>Prefix with <code>_</code> — convention for \"private\" attributes</li><li><code>@property</code> — getter that looks like attribute access</li><li><code>@attr.setter</code> — control how values are set</li><li>Validate data on assignment — prevent invalid state</li><li>Hide internal complexity behind clean interfaces</li></ul>",
          "description": "<p><strong>Encapsulation hides internal implementation details and exposes a clean interface.</strong> Python uses conventions (underscore prefix) and properties to control access to object data, enabling validation and computed attributes.</p>",
          "syntax": "class Server:\n    def __init__(self, name, cpu=0):\n        self.name = name\n        self._cpu = cpu  # 'private' by convention\n\n    @property\n    def cpu(self):\n        return self._cpu\n\n    @cpu.setter\n    def cpu(self, value):\n        if not 0 <= value <= 100:\n            raise ValueError(\"CPU must be 0-100\")\n        self._cpu = value",
          "script": "Explain _ convention.\nDemo @property for validation.\nShow how it prevents invalid state.",
          "examples": [
            {
              "name": "Properties",
              "code": "class Server:\n    def __init__(self, name):\n        self.name = name\n        self._cpu = 0\n        self._status = \"offline\"\n\n    @property\n    def cpu(self):\n        return self._cpu\n\n    @cpu.setter\n    def cpu(self, value):\n        if not 0 <= value <= 100:\n            raise ValueError(f\"CPU must be 0-100, got {value}\")\n        self._cpu = value\n        # Auto-update status based on CPU\n        if value > 90:\n            self._status = \"critical\"\n        elif value > 75:\n            self._status = \"warning\"\n        else:\n            self._status = \"healthy\"\n\n    @property\n    def status(self):\n        return self._status\n\ns = Server(\"web-01\")\ns.cpu = 45\nprint(f\"{s.name}: cpu={s.cpu}% status={s.status}\")\ns.cpu = 92\nprint(f\"{s.name}: cpu={s.cpu}% status={s.status}\")\ntry:\n    s.cpu = 150\nexcept ValueError as e:\n    print(f\"Blocked: {e}\")",
              "level": "beginner"
            }
          ]
        }
      ]
    },
    {
      "id": "module11",
      "title": "Module 12: Python for Automation",
      "sections": [
        {
          "id": "m11s1",
          "title": "11.1 Working with APIs",
          "brief": "<h4>Working with APIs</h4><ul><li>APIs = programmatic access to services (REST/HTTP)</li><li><code>requests.get(url)</code> — fetch data</li><li><code>requests.post(url, json=data)</code> — send data</li><li>Response: <code>.status_code</code>, <code>.json()</code>, <code>.text</code></li><li>Authentication: API keys, tokens, headers</li></ul>",
          "description": "<p><strong>APIs (Application Programming Interfaces) let your Python scripts interact with external services programmatically.</strong> REST APIs use HTTP methods (GET, POST, PUT, DELETE) and exchange data as JSON.</p>",
          "syntax": "# import requests\n# response = requests.get(\"https://api.example.com/servers\")\n# data = response.json()\n# print(response.status_code)  # 200 = success\n\n# Simulated API call\nimport json\nresponse_data = {\"status\": \"ok\", \"servers\": 12}\nprint(json.dumps(response_data, indent=2))",
          "script": "Explain REST APIs.\nDemo GET and POST requests.\nShow JSON response handling.",
          "examples": [
            {
              "name": "API Basics",
              "code": "# Simulating API interactions (requests library)\nimport json\n\n# Simulated GET response\napi_response = {\n    \"status\": 200,\n    \"data\": {\n        \"servers\": [\n            {\"name\": \"web-01\", \"cpu\": 45, \"healthy\": True},\n            {\"name\": \"web-02\", \"cpu\": 92, \"healthy\": True},\n            {\"name\": \"db-01\", \"cpu\": 30, \"healthy\": False},\n        ]\n    }\n}\n\nprint(\"GET /api/servers\")\nprint(f\"Status: {api_response['status']}\")\nprint(f\"Servers: {len(api_response['data']['servers'])}\")\nfor s in api_response['data']['servers']:\n    health = '✓' if s['healthy'] else '✗'\n    print(f\"  {health} {s['name']} cpu={s['cpu']}%\")",
              "level": "beginner"
            },
            {
              "name": "POST Request",
              "code": "# Simulating a POST request to create an alert\nimport json\n\npayload = {\n    \"level\": \"CRITICAL\",\n    \"host\": \"web-02\",\n    \"message\": \"CPU above 90% for 5 minutes\",\n    \"notify\": [\"email\", \"slack\"]\n}\n\nprint(\"POST /api/alerts\")\nprint(f\"Payload: {json.dumps(payload, indent=2)}\")\nprint()\n# Simulated response\nprint(\"Response: 201 Created\")\nprint(json.dumps({\"id\": \"alert-4521\", \"created\": True}, indent=2))",
              "level": "intermediate"
            },
            {
              "name": "Error Handling",
              "code": "# Robust API call pattern\nimport json\n\ndef call_api(endpoint, method=\"GET\"):\n    \"\"\"Simulate an API call with error handling.\"\"\"\n    # Simulate different responses\n    responses = {\n        \"/api/health\": (200, {\"status\": \"ok\"}),\n        \"/api/missing\": (404, {\"error\": \"Not found\"}),\n        \"/api/error\": (500, {\"error\": \"Internal server error\"}),\n    }\n    status, data = responses.get(endpoint, (404, {\"error\": \"Unknown\"}))\n    return status, data\n\nendpoints = [\"/api/health\", \"/api/missing\", \"/api/error\"]\nfor ep in endpoints:\n    status, data = call_api(ep)\n    icon = '✓' if status == 200 else '✗'\n    print(f\"  {icon} {ep} → {status} {data}\")",
              "level": "intermediate"
            }
          ]
        },
        {
          "id": "m11s2",
          "title": "11.2 Task Scheduling & Scripts",
          "brief": "<h4>Task Scheduling & Scripts</h4><ul><li>Scripts = standalone .py files that perform a task</li><li><code>argparse</code> — command-line arguments</li><li>Cron (Linux) / Task Scheduler (Windows) for scheduling</li><li>Pattern: parse args → do work → log results → exit code</li><li>Logging with <code>logging</code> module for production scripts</li></ul>",
          "description": "<p><strong>Automation scripts are standalone Python programs designed to run unattended — on a schedule, triggered by events, or as part of a pipeline.</strong> They follow a pattern: accept input, perform work, log results, and exit with an appropriate code.</p>",
          "syntax": "# Script pattern\nimport sys\nimport logging\n\nlogging.basicConfig(level=logging.INFO)\nlogger = logging.getLogger(__name__)\n\ndef main():\n    logger.info(\"Script started\")\n    # ... do work ...\n    logger.info(\"Script completed\")\n    return 0  # exit code\n\nif __name__ == \"__main__\":\n    sys.exit(main())",
          "script": "Show a complete automation script.\nExplain argparse for CLI args.\nDemo logging vs print.",
          "examples": [
            {
              "name": "CLI Script",
              "code": "# Complete automation script pattern\nimport sys\n\ndef check_servers(threshold):\n    servers = [\n        {\"name\": \"web-01\", \"cpu\": 45},\n        {\"name\": \"web-02\", \"cpu\": 92},\n        {\"name\": \"db-01\", \"cpu\": 30},\n    ]\n    alerts = []\n    for s in servers:\n        if s[\"cpu\"] > threshold:\n            alerts.append(s)\n    return alerts\n\ndef main():\n    threshold = 80  # Would come from argparse\n    print(f\"Checking servers (threshold: {threshold}%)...\")\n    alerts = check_servers(threshold)\n    if alerts:\n        print(f\"\\n⚠ {len(alerts)} server(s) above threshold:\")\n        for a in alerts:\n            print(f\"  {a['name']}: {a['cpu']}%\")\n        return 1  # non-zero = problem found\n    print(\"✓ All servers OK\")\n    return 0\n\nexit_code = main()\nprint(f\"\\nExit code: {exit_code}\")",
              "level": "beginner"
            },
            {
              "name": "Logging",
              "code": "import logging\n\n# Configure logging\nlogging.basicConfig(\n    level=logging.INFO,\n    format='%(asctime)s %(levelname)-8s %(message)s',\n    datefmt='%H:%M:%S'\n)\nlogger = logging.getLogger(\"infra-check\")\n\n# Use logging instead of print in production\nlogger.info(\"Starting health check\")\nlogger.info(\"Checking web-01...\")\nlogger.warning(\"web-02 CPU at 92%\")\nlogger.error(\"db-01 connection refused\")\nlogger.info(\"Health check complete\")\n\nprint(\"\\nWhy logging > print:\")\nprint(\"  • Timestamps automatic\")\nprint(\"  • Severity levels (DEBUG/INFO/WARN/ERROR)\")\nprint(\"  • Can write to files, syslog, etc.\")\nprint(\"  • Can filter by level in production\")",
              "level": "intermediate"
            }
          ]
        },
        {
          "id": "m11s3",
          "title": "11.3 Infrastructure Automation",
          "brief": "<h4>Infrastructure Automation</h4><ul><li>Automate server provisioning, config, and monitoring</li><li>SSH with <code>paramiko</code> — remote command execution</li><li>Cloud SDKs — <code>boto3</code> (AWS), <code>azure-sdk</code></li><li>Pattern: discover → check → act → report</li><li>Idempotent scripts — safe to run multiple times</li></ul>",
          "description": "<p><strong>Infrastructure automation uses Python to manage servers, cloud resources, and network devices programmatically.</strong> Instead of clicking through consoles or running manual commands, you write scripts that are repeatable, testable, and version-controlled.</p>",
          "syntax": "# Infrastructure automation pattern\n# 1. Discover resources\n# 2. Check current state\n# 3. Apply desired state\n# 4. Report results\n\ndef automate(servers, desired_state):\n    results = []\n    for server in servers:\n        current = get_state(server)\n        if current != desired_state:\n            apply_state(server, desired_state)\n            results.append((server, \"changed\"))\n        else:\n            results.append((server, \"ok\"))\n    return results",
          "script": "Show a real automation workflow.\nDemo: check servers, apply config, report.\nExplain idempotency.",
          "examples": [
            {
              "name": "Server Automation",
              "code": "# Automated server configuration\ndef apply_config(servers, config):\n    results = []\n    for server in servers:\n        # Simulate applying config\n        result = {\n            \"host\": server,\n            \"config_applied\": config,\n            \"status\": \"changed\",\n            \"previous\": {\"timeout\": 30, \"max_conn\": 100}\n        }\n        results.append(result)\n    return results\n\nservers = [\"web-01\", \"web-02\", \"web-03\"]\nnew_config = {\"timeout\": 60, \"max_conn\": 500, \"log_level\": \"INFO\"}\n\nprint(\"Applying configuration...\\n\")\nresults = apply_config(servers, new_config)\nfor r in results:\n    print(f\"  {r['host']}: {r['status']}\")\n    print(f\"    New: {r['config_applied']}\")\nprint(f\"\\n✓ {len(results)} servers updated\")",
              "level": "beginner"
            },
            {
              "name": "Health Monitor",
              "code": "import random\nrandom.seed(42)\n\ndef monitor_infrastructure():\n    servers = [\"web-01\",\"web-02\",\"web-03\",\"db-01\",\"cache-01\"]\n    report = {\"healthy\": [], \"warning\": [], \"critical\": []}\n\n    for server in servers:\n        cpu = random.randint(20, 99)\n        mem = random.randint(30, 98)\n        if cpu > 90 or mem > 95:\n            report[\"critical\"].append((server, cpu, mem))\n        elif cpu > 75 or mem > 80:\n            report[\"warning\"].append((server, cpu, mem))\n        else:\n            report[\"healthy\"].append((server, cpu, mem))\n    return report\n\nreport = monitor_infrastructure()\nprint(\"=== Infrastructure Report ===\")\nfor level in [\"critical\", \"warning\", \"healthy\"]:\n    print(f\"\\n{level.upper()} ({len(report[level])}):\")\n    for host, cpu, mem in report[level]:\n        print(f\"  {host:<10} cpu={cpu}% mem={mem}%\")",
              "level": "intermediate"
            }
          ]
        }
      ]
    },
    {
      "id": "module12",
      "title": "Module 13: Intro to AI & Machine Learning",
      "sections": [
        {
          "id": "m12s1",
          "title": "12.1 What is AI & ML?",
          "brief": "<h4>What is AI & ML?</h4><ul><li><strong>AI</strong> — machines performing tasks that require human intelligence</li><li><strong>ML</strong> — subset of AI: systems that learn from data</li><li><strong>Deep Learning</strong> — ML with neural networks (many layers)</li><li>Supervised (labelled data) vs Unsupervised (find patterns)</li><li>Python is the #1 language for AI/ML development</li></ul>",
          "description": "<p><strong>Artificial Intelligence is the broad field of making machines perform tasks that typically require human intelligence.</strong> Machine Learning is a subset where systems learn patterns from data rather than being explicitly programmed.</p>",
          "syntax": "# AI/ML Python ecosystem\n# pip install scikit-learn pandas numpy matplotlib\n\n# Core workflow:\n# 1. Collect data\n# 2. Prepare/clean data\n# 3. Choose a model\n# 4. Train the model\n# 5. Evaluate performance\n# 6. Deploy\n\nprint(\"ML = Learning from data\")\nprint(\"Not: if cpu > 80 then alert\")\nprint(\"But: learn what 'normal' looks like from history\")",
          "script": "Explain AI vs ML vs Deep Learning.\nUse infrastructure examples.\nShow the ML workflow at high level.",
          "examples": [
            {
              "name": "AI Landscape",
              "code": "# The AI/ML landscape\nai_fields = {\n    \"Machine Learning\": [\"Classification\", \"Regression\", \"Clustering\"],\n    \"Deep Learning\": [\"Neural Networks\", \"CNNs\", \"Transformers\"],\n    \"NLP\": [\"Text Analysis\", \"Chatbots\", \"Translation\"],\n    \"Computer Vision\": [\"Image Recognition\", \"Object Detection\"],\n    \"Gen AI\": [\"LLMs\", \"Image Generation\", \"Code Assistants\"],\n}\n\nprint(\"AI/ML Fields & Applications:\")\nprint(\"=\" * 45)\nfor field, apps in ai_fields.items():\n    print(f\"\\n  {field}:\")\n    for app in apps:\n        print(f\"    • {app}\")",
              "level": "beginner"
            },
            {
              "name": "ML for IT",
              "code": "# ML use cases for IT professionals\nuse_cases = [\n    (\"Anomaly Detection\",  \"Detect unusual server behaviour\"),\n    (\"Capacity Planning\",  \"Predict when resources run out\"),\n    (\"Log Classification\", \"Auto-categorise error types\"),\n    (\"Incident Prediction\",\"Predict failures before they happen\"),\n    (\"Auto-Remediation\",   \"ML decides which fix to apply\"),\n    (\"Security\",           \"Detect intrusion patterns\"),\n]\n\nprint(\"ML Use Cases for Infrastructure:\")\nprint(\"-\" * 50)\nfor name, desc in use_cases:\n    print(f\"  {name:<22} {desc}\")",
              "level": "intermediate"
            },
            {
              "name": "ML Workflow",
              "code": "# The ML workflow in Python\nsteps = [\n    (\"1. Data Collection\",  \"pandas, requests, csv\"),\n    (\"2. Data Cleaning\",    \"pandas, numpy\"),\n    (\"3. Feature Engineering\", \"pandas, scikit-learn\"),\n    (\"4. Model Selection\",  \"scikit-learn, xgboost\"),\n    (\"5. Training\",         \"model.fit(X_train, y_train)\"),\n    (\"6. Evaluation\",       \"accuracy, precision, recall\"),\n    (\"7. Deployment\",       \"flask, fastapi, docker\"),\n]\n\nprint(\"ML Workflow & Python Tools:\")\nprint(\"=\" * 50)\nfor step, tools in steps:\n    print(f\"  {step:<25} → {tools}\")",
              "level": "intermediate"
            }
          ]
        },
        {
          "id": "m12s2",
          "title": "12.2 Data Preparation with Pandas",
          "brief": "<h4>Data Preparation with Pandas</h4><ul><li><code>pandas</code> — the #1 library for tabular data</li><li>DataFrame = table (rows + columns)</li><li>Load: <code>pd.read_csv()</code>, <code>pd.read_json()</code></li><li>Explore: <code>.head()</code>, <code>.describe()</code>, <code>.info()</code></li><li>Clean: handle missing values, filter, transform</li></ul>",
          "description": "<p><strong>Pandas is Python's primary library for data manipulation and analysis.</strong> Before any ML model can learn, data must be loaded, cleaned, and transformed into the right format — and pandas makes this efficient and readable.</p>",
          "syntax": "# import pandas as pd\n# df = pd.read_csv(\"metrics.csv\")\n# df.head()        # first 5 rows\n# df.describe()    # statistics\n# df.info()        # types & nulls\n# df[\"cpu\"].mean() # column average\n# df[df[\"cpu\"] > 80]  # filter rows\n\n# Simulated with lists (pandas not in Pyodide)\ndata = [{\"host\":\"web-01\",\"cpu\":45},{\"host\":\"web-02\",\"cpu\":92}]\nprint(data)",
          "script": "Show pandas basics with server metrics.\nDemo loading, exploring, filtering.\nExplain DataFrame concept.",
          "examples": [
            {
              "name": "DataFrame Basics",
              "code": "# Simulating pandas DataFrame operations\n# (pandas not available in browser, showing the pattern)\n\nmetrics = [\n    {\"host\": \"web-01\", \"cpu\": 45, \"mem\": 62, \"requests\": 1200},\n    {\"host\": \"web-02\", \"cpu\": 92, \"mem\": 78, \"requests\": 3400},\n    {\"host\": \"web-03\", \"cpu\": 38, \"mem\": 55, \"requests\": 800},\n    {\"host\": \"db-01\",  \"cpu\": 67, \"mem\": 91, \"requests\": 500},\n    {\"host\": \"db-02\",  \"cpu\": 23, \"mem\": 44, \"requests\": 200},\n]\n\n# DataFrame-like operations\ncpus = [m[\"cpu\"] for m in metrics]\nprint(f\"Count   : {len(cpus)}\")\nprint(f\"Mean CPU: {sum(cpus)/len(cpus):.1f}%\")\nprint(f\"Max CPU : {max(cpus)}%\")\nprint(f\"Min CPU : {min(cpus)}%\")\n\n# Filter (like df[df['cpu'] > 80])\nhigh_cpu = [m for m in metrics if m[\"cpu\"] > 80]\nprint(f\"\\nHigh CPU servers: {[m['host'] for m in high_cpu]}\")",
              "level": "beginner"
            },
            {
              "name": "Data Cleaning",
              "code": "# Data cleaning patterns (what you'd do with pandas)\nraw_data = [\n    {\"host\": \"web-01\", \"cpu\": \"45\", \"mem\": \"62\"},\n    {\"host\": \"web-02\", \"cpu\": \"N/A\", \"mem\": \"78\"},\n    {\"host\": \"\",       \"cpu\": \"38\", \"mem\": \"55\"},\n    {\"host\": \"db-01\",  \"cpu\": \"67\", \"mem\": None},\n]\n\nprint(\"Raw data (messy):\")\nfor r in raw_data:\n    print(f\"  {r}\")\n\n# Clean\ncleaned = []\nfor row in raw_data:\n    if not row[\"host\"]:  # skip empty hosts\n        continue\n    try:\n        row[\"cpu\"] = int(row[\"cpu\"])\n    except (ValueError, TypeError):\n        row[\"cpu\"] = None  # mark as missing\n    row[\"mem\"] = int(row[\"mem\"]) if row[\"mem\"] else None\n    cleaned.append(row)\n\nprint(\"\\nCleaned data:\")\nfor r in cleaned:\n    print(f\"  {r}\")",
              "level": "intermediate"
            }
          ]
        },
        {
          "id": "m12s3",
          "title": "12.3 First ML Model",
          "brief": "<h4>First ML Model</h4><ul><li>Classification: predict a category (healthy/unhealthy)</li><li>Train/test split — never test on training data</li><li><code>model.fit(X_train, y_train)</code> — train</li><li><code>model.predict(X_test)</code> — predict</li><li>Evaluate: accuracy, confusion matrix</li></ul>",
          "description": "<p><strong>Building your first ML model follows a clear pattern: prepare data, split into train/test, fit a model, and evaluate its predictions.</strong> We'll use a simple classification example relevant to infrastructure.</p>",
          "syntax": "# scikit-learn pattern\n# from sklearn.model_selection import train_test_split\n# from sklearn.tree import DecisionTreeClassifier\n#\n# X_train, X_test, y_train, y_test = train_test_split(X, y)\n# model = DecisionTreeClassifier()\n# model.fit(X_train, y_train)\n# predictions = model.predict(X_test)\n# accuracy = model.score(X_test, y_test)",
          "script": "Walk through a complete ML example.\nUse server health prediction.\nExplain train/test split.\nShow accuracy evaluation.",
          "examples": [
            {
              "name": "Simple ML",
              "code": "# Simulating a simple ML classification\nimport random\nrandom.seed(42)\n\n# Generate training data: [cpu, mem] → healthy/unhealthy\ndef generate_data(n):\n    data = []\n    for _ in range(n):\n        cpu = random.randint(10, 99)\n        mem = random.randint(20, 99)\n        # Rule: unhealthy if cpu>85 OR mem>90\n        label = 0 if (cpu > 85 or mem > 90) else 1\n        data.append((cpu, mem, label))\n    return data\n\ntrain_data = generate_data(100)\ntest_data = generate_data(20)\n\n# Simple 'model': learn threshold from training data\n# (Real ML would use DecisionTreeClassifier)\ndef predict(cpu, mem):\n    return 0 if (cpu > 85 or mem > 90) else 1\n\n# Evaluate\ncorrect = sum(1 for cpu, mem, label in test_data if predict(cpu, mem) == label)\naccuracy = correct / len(test_data)\n\nprint(f\"Training samples: {len(train_data)}\")\nprint(f\"Test samples    : {len(test_data)}\")\nprint(f\"Accuracy        : {accuracy:.1%}\")\nprint(f\"\\nPredictions:\")\nfor cpu, mem, actual in test_data[:5]:\n    pred = predict(cpu, mem)\n    status = '✓' if pred == actual else '✗'\n    print(f\"  {status} cpu={cpu:>2} mem={mem:>2} → {'healthy' if pred else 'unhealthy'}\")",
              "level": "beginner"
            },
            {
              "name": "ML Workflow Code",
              "code": "# Complete ML workflow (pseudocode with real logic)\n\n# Step 1: Data\nprint(\"Step 1: Prepare Data\")\nprint(\"  Features (X): cpu_usage, memory_usage, disk_io\")\nprint(\"  Labels   (y): 0=will_fail, 1=healthy\")\n\n# Step 2: Split\nprint(\"\\nStep 2: Train/Test Split\")\nprint(\"  80% training (model learns from this)\")\nprint(\"  20% testing  (evaluate on unseen data)\")\n\n# Step 3: Train\nprint(\"\\nStep 3: Train Model\")\nprint(\"  model = DecisionTreeClassifier()\")\nprint(\"  model.fit(X_train, y_train)\")\n\n# Step 4: Predict\nprint(\"\\nStep 4: Predict\")\nprint(\"  predictions = model.predict(X_test)\")\n\n# Step 5: Evaluate\nprint(\"\\nStep 5: Evaluate\")\nprint(\"  accuracy = 94.5%\")\nprint(\"  precision = 92.1%\")\nprint(\"  recall = 96.3%\")\nprint(\"\\n→ Model can predict server failures!\")",
              "level": "intermediate"
            }
          ]
        }
      ]
    },
    {
      "id": "module13",
      "title": "Module 14: Intro to Generative AI",
      "sections": [
        {
          "id": "m13s1",
          "title": "13.1 What is Generative AI?",
          "brief": "<h4>What is Generative AI?</h4><ul><li>AI that <strong>creates</strong> new content — text, code, images</li><li>LLMs (Large Language Models) — GPT, Claude, Gemini</li><li>Trained on massive text data, predict next tokens</li><li>Prompt engineering — how you ask determines what you get</li><li>Not magic — statistical pattern matching at scale</li></ul>",
          "description": "<p><strong>Generative AI refers to AI systems that can create new content — text, code, images, audio — rather than just classifying or predicting.</strong> Large Language Models (LLMs) like GPT, Claude, and Gemini are the most prominent examples, trained on vast amounts of text to understand and generate human-like language.</p>",
          "syntax": "# Working with LLM APIs (pattern)\n# import openai\n# response = openai.chat.completions.create(\n#     model=\"gpt-4\",\n#     messages=[{\"role\": \"user\", \"content\": \"Explain venv\"}]\n# )\n# print(response.choices[0].message.content)\n\nprint(\"Gen AI = AI that creates new content\")\nprint(\"LLMs = trained on text, generate text\")",
          "script": "Explain Gen AI vs traditional ML.\nShow LLM interaction pattern.\nDiscuss prompt engineering basics.",
          "examples": [
            {
              "name": "Gen AI Overview",
              "code": "# Generative AI landscape\ngen_ai = {\n    \"Text Generation\": {\n        \"models\": [\"GPT-4\", \"Claude\", \"Gemini\", \"LLaMA\"],\n        \"uses\": \"Chatbots, writing, code generation\"\n    },\n    \"Image Generation\": {\n        \"models\": [\"DALL-E\", \"Midjourney\", \"Stable Diffusion\"],\n        \"uses\": \"Art, design, prototyping\"\n    },\n    \"Code Generation\": {\n        \"models\": [\"Copilot\", \"CodeWhisperer\", \"Cursor\"],\n        \"uses\": \"Auto-complete, refactoring, docs\"\n    },\n}\n\nprint(\"Generative AI Categories:\")\nprint(\"=\" * 50)\nfor category, info in gen_ai.items():\n    print(f\"\\n  {category}\")\n    print(f\"    Models: {', '.join(info['models'])}\")\n    print(f\"    Uses  : {info['uses']}\")",
              "level": "beginner"
            },
            {
              "name": "Prompt Engineering",
              "code": "# Prompt engineering — how to talk to LLMs\nprompts = [\n    {\n        \"type\": \"Bad prompt\",\n        \"prompt\": \"Fix my server\",\n        \"why\": \"Too vague — no context\"\n    },\n    {\n        \"type\": \"Good prompt\",\n        \"prompt\": \"Write a Python script that checks CPU usage on web-01 via SSH and sends a Slack alert if above 90%\",\n        \"why\": \"Specific task, context, output format\"\n    },\n    {\n        \"type\": \"System prompt\",\n        \"prompt\": \"You are an infrastructure automation expert. Respond with Python code only.\",\n        \"why\": \"Sets role and output format\"\n    },\n]\n\nprint(\"Prompt Engineering Tips:\")\nprint(\"=\" * 50)\nfor p in prompts:\n    print(f\"\\n  [{p['type']}]\")\n    print(f\"  Prompt: {p['prompt']}\")\n    print(f\"  Why   : {p['why']}\")",
              "level": "intermediate"
            }
          ]
        },
        {
          "id": "m13s2",
          "title": "13.2 LLM APIs with Python",
          "brief": "<h4>LLM APIs with Python</h4><ul><li>OpenAI, Anthropic, Google — all have Python SDKs</li><li>Pattern: create client → send messages → get response</li><li>Messages: system (role), user (question), assistant (reply)</li><li>Parameters: temperature, max_tokens, model</li><li>Always handle errors and rate limits</li></ul>",
          "description": "<p><strong>LLM providers offer Python SDKs that let you integrate AI capabilities into your scripts and applications.</strong> The pattern is consistent across providers: create a client, send a conversation (messages), and receive a generated response.</p>",
          "syntax": "# OpenAI pattern (pip install openai)\n# from openai import OpenAI\n# client = OpenAI(api_key=\"sk-...\")\n# response = client.chat.completions.create(\n#     model=\"gpt-4\",\n#     messages=[\n#         {\"role\": \"system\", \"content\": \"You are a helpful assistant.\"},\n#         {\"role\": \"user\", \"content\": \"Explain Python venv\"}\n#     ],\n#     temperature=0.7\n# )\n# print(response.choices[0].message.content)",
          "script": "Show the API call pattern.\nExplain messages array (system/user/assistant).\nDemo temperature and token parameters.",
          "examples": [
            {
              "name": "API Pattern",
              "code": "# Simulating an LLM API call\nimport json\n\ndef simulate_llm_call(messages, model=\"gpt-4\", temperature=0.7):\n    \"\"\"Simulate an LLM API response.\"\"\"\n    user_msg = messages[-1][\"content\"]\n    # Simulated response\n    return {\n        \"model\": model,\n        \"usage\": {\"prompt_tokens\": 25, \"completion_tokens\": 80},\n        \"content\": f\"Here's a Python script for: {user_msg[:50]}...\"\n    }\n\nmessages = [\n    {\"role\": \"system\", \"content\": \"You are an infrastructure automation expert.\"},\n    {\"role\": \"user\", \"content\": \"Write a script to check disk usage on all servers\"}\n]\n\nprint(\"Request:\")\nprint(json.dumps(messages, indent=2))\n\nresponse = simulate_llm_call(messages)\nprint(f\"\\nResponse ({response['model']}):\")\nprint(f\"  {response['content']}\")\nprint(f\"  Tokens: {response['usage']}\")",
              "level": "beginner"
            },
            {
              "name": "Chat Pattern",
              "code": "# Building a conversation with an LLM\ndef chat_simulation(conversation):\n    responses = [\n        \"I'll help you write that monitoring script.\",\n        \"Here's the updated version with error handling.\",\n        \"Yes, you can add email alerts using smtplib.\",\n    ]\n    return responses[min(len(conversation)//2, len(responses)-1)]\n\nconversation = []\nprompts = [\n    \"Write a CPU monitoring script\",\n    \"Add error handling to it\",\n    \"Can it send email alerts?\",\n]\n\nprint(\"Chat with AI Assistant:\")\nprint(\"=\" * 40)\nfor prompt in prompts:\n    conversation.append({\"role\": \"user\", \"content\": prompt})\n    response = chat_simulation(conversation)\n    conversation.append({\"role\": \"assistant\", \"content\": response})\n    print(f\"\\n  You: {prompt}\")\n    print(f\"  AI : {response}\")",
              "level": "intermediate"
            }
          ]
        },
        {
          "id": "m13s3",
          "title": "13.3 Building AI-Powered Tools",
          "brief": "<h4>Building AI-Powered Tools</h4><ul><li>Combine LLM APIs with your infrastructure scripts</li><li>AI for log analysis — summarise errors automatically</li><li>AI for incident response — suggest remediation steps</li><li>RAG (Retrieval Augmented Generation) — AI + your docs</li><li>Always validate AI output before executing actions</li></ul>",
          "description": "<p><strong>The real power of Gen AI for IT professionals is combining LLM capabilities with your existing automation scripts.</strong> AI can analyse logs, suggest fixes, generate configurations, and assist with incident response — but always with human oversight.</p>",
          "syntax": "# AI-powered infrastructure tool pattern\n# 1. Collect context (logs, metrics, config)\n# 2. Build a prompt with that context\n# 3. Call LLM API\n# 4. Parse and validate the response\n# 5. Present to human OR auto-execute (with guardrails)\n\ndef ai_analyse_logs(logs):\n    prompt = f\"Analyse these logs and suggest fixes:\\n{logs}\"\n    # response = llm.complete(prompt)\n    return \"Simulated AI analysis\"",
          "script": "Show practical AI + infrastructure integration.\nDemo: AI analyses logs, suggests fix.\nEmphasise: validate before executing.",
          "examples": [
            {
              "name": "AI Log Analyser",
              "code": "# AI-powered log analysis tool\ndef ai_analyse_logs(logs):\n    \"\"\"Simulate AI analysing server logs.\"\"\"\n    errors = [l for l in logs if \"ERROR\" in l]\n    warnings = [l for l in logs if \"WARN\" in l]\n\n    # Simulated AI analysis\n    analysis = {\n        \"summary\": f\"{len(errors)} errors, {len(warnings)} warnings detected\",\n        \"root_cause\": \"Database connection pool exhausted\",\n        \"suggested_fix\": [\n            \"Increase max_connections in db config\",\n            \"Add connection pooling with pgbouncer\",\n            \"Check for connection leaks in app code\",\n        ],\n        \"severity\": \"HIGH\" if len(errors) > 2 else \"MEDIUM\"\n    }\n    return analysis\n\nlogs = [\n    \"ERROR db-01 Connection pool exhausted\",\n    \"ERROR web-02 Timeout waiting for db\",\n    \"WARN  web-01 Response time 2.5s\",\n    \"ERROR web-03 Database connection refused\",\n]\n\nresult = ai_analyse_logs(logs)\nprint(\"AI Analysis:\")\nprint(f\"  Summary   : {result['summary']}\")\nprint(f\"  Root Cause: {result['root_cause']}\")\nprint(f\"  Severity  : {result['severity']}\")\nprint(\"  Suggested Fixes:\")\nfor fix in result['suggested_fix']:\n    print(f\"    → {fix}\")",
              "level": "beginner"
            },
            {
              "name": "AI + Automation",
              "code": "# Combining AI with automation\ndef ai_incident_response(incident):\n    \"\"\"AI suggests remediation, human approves.\"\"\"\n    playbooks = {\n        \"high_cpu\": [\"Scale horizontally\", \"Check for runaway processes\", \"Review recent deployments\"],\n        \"disk_full\": [\"Clear old logs\", \"Expand volume\", \"Move data to archive\"],\n        \"connection_refused\": [\"Restart service\", \"Check port binding\", \"Review firewall rules\"],\n    }\n    suggestions = playbooks.get(incident[\"type\"], [\"Escalate to on-call\"])\n    return suggestions\n\nincident = {\n    \"host\": \"web-02\",\n    \"type\": \"high_cpu\",\n    \"cpu\": 97,\n    \"duration\": \"5 minutes\"\n}\n\nprint(f\"Incident: {incident['host']} — {incident['type']}\")\nprint(f\"CPU: {incident['cpu']}% for {incident['duration']}\")\nprint()\nsuggestions = ai_incident_response(incident)\nprint(\"AI Suggested Actions:\")\nfor i, s in enumerate(suggestions, 1):\n    print(f\"  {i}. {s}\")\nprint(\"\\n⚠ Human approval required before execution\")",
              "level": "intermediate"
            }
          ]
        }
      ]
    },
    {
      "id": "module14",
      "title": "Module 15: Python for AI Projects",
      "sections": [
        {
          "id": "m14s1",
          "title": "14.1 Project Structure for AI",
          "brief": "<h4>Project Structure for AI</h4><ul><li>Separate data, models, scripts, and config</li><li><code>src/</code> for code, <code>data/</code> for datasets, <code>models/</code> for saved models</li><li><code>.env</code> for API keys — never commit secrets</li><li><code>requirements.txt</code> for reproducibility</li><li>Use git for version control from day one</li></ul>",
          "description": "<p><strong>AI projects need clear structure to manage data, code, models, and configuration.</strong> A well-organised project is reproducible, collaborative, and maintainable.</p>",
          "syntax": "# AI project structure\n# my-ai-project/\n# ├── .venv/\n# ├── .env              (API keys)\n# ├── src/\n# │   ├── train.py\n# │   ├── predict.py\n# │   └── utils.py\n# ├── data/\n# ├── models/\n# ├── requirements.txt\n# └── README.md",
          "script": "Show ideal AI project layout.\nExplain each folder's purpose.\nDemo .env for secrets.",
          "examples": [
            {
              "name": "Project Layout",
              "code": "structure = \"\"\"\nai-infra-monitor/\n├── .venv/                  ← Virtual environment\n├── .env                    ← API keys (NEVER commit)\n├── .gitignore              ← Excludes .venv, .env, data/\n├── src/\n│   ├── __init__.py\n│   ├── data_collector.py   ← Gather metrics\n│   ├── preprocessor.py     ← Clean & transform\n│   ├── model.py            ← Train & predict\n│   ├── api.py              ← Flask/FastAPI endpoint\n│   └── config.py           ← Load settings\n├── data/\n│   ├── raw/                ← Original data\n│   └── processed/          ← Cleaned data\n├── models/\n│   └── model_v1.pkl        ← Saved trained model\n├── tests/\n├── requirements.txt\n├── Dockerfile\n└── README.md\n\"\"\"\nprint(structure)",
              "level": "beginner"
            },
            {
              "name": "Config & Secrets",
              "code": "# Managing configuration and secrets\nimport os\n\n# Simulating .env file loading\n# In real code: pip install python-dotenv\n# from dotenv import load_dotenv\n# load_dotenv()\n\n# Simulate environment variables\nos.environ['OPENAI_API_KEY'] = 'sk-fake-key-for-demo'\nos.environ['DB_HOST'] = 'db-primary.internal'\nos.environ['ALERT_WEBHOOK'] = 'https://hooks.slack.com/xxx'\n\n# Access secrets safely\nconfig = {\n    'api_key': os.environ.get('OPENAI_API_KEY', ''),\n    'db_host': os.environ.get('DB_HOST', 'localhost'),\n    'webhook': os.environ.get('ALERT_WEBHOOK', ''),\n}\n\nprint(\"Configuration loaded:\")\nfor key, val in config.items():\n    # Never print full secrets!\n    display = val[:10] + '...' if len(val) > 10 else val\n    print(f\"  {key:<12}: {display}\")\n\nprint(\"\\n.gitignore should contain:\")\nprint(\"  .env\")\nprint(\"  .venv/\")\nprint(\"  data/\")\nprint(\"  models/*.pkl\")",
              "level": "intermediate"
            }
          ]
        },
        {
          "id": "m14s2",
          "title": "14.2 Building an AI Pipeline",
          "brief": "<h4>Building an AI Pipeline</h4><ul><li>Pipeline = automated sequence: collect → process → predict → act</li><li>Each step is a function or class — testable independently</li><li>Error handling at every stage</li><li>Logging for observability</li><li>Can run on schedule or trigger on events</li></ul>",
          "description": "<p><strong>An AI pipeline is an automated workflow that takes raw data through collection, processing, prediction, and action.</strong> Each stage is modular, testable, and can be monitored independently.</p>",
          "syntax": "# Pipeline pattern\ndef collect_data(): ...\ndef preprocess(data): ...\ndef predict(model, data): ...\ndef take_action(predictions): ...\n\ndef run_pipeline():\n    raw = collect_data()\n    clean = preprocess(raw)\n    results = predict(model, clean)\n    take_action(results)",
          "script": "Build a complete pipeline step by step.\nShow each stage as a function.\nDemo end-to-end execution.",
          "examples": [
            {
              "name": "Full Pipeline",
              "code": "import random\nrandom.seed(42)\n\n# Stage 1: Collect\ndef collect_metrics():\n    servers = [\"web-01\",\"web-02\",\"web-03\",\"db-01\"]\n    return [{\"host\": s, \"cpu\": random.randint(20,99), \"mem\": random.randint(30,98)} for s in servers]\n\n# Stage 2: Preprocess\ndef preprocess(metrics):\n    for m in metrics:\n        m[\"risk_score\"] = (m[\"cpu\"] * 0.6 + m[\"mem\"] * 0.4) / 100\n    return metrics\n\n# Stage 3: Predict\ndef predict_issues(metrics):\n    return [m for m in metrics if m[\"risk_score\"] > 0.75]\n\n# Stage 4: Act\ndef generate_alerts(at_risk):\n    return [{\"host\": m[\"host\"], \"action\": \"scale_up\", \"score\": f\"{m['risk_score']:.2f}\"} for m in at_risk]\n\n# Run pipeline\nprint(\"=== AI Infrastructure Pipeline ===\")\nraw = collect_metrics()\nprint(f\"\\n1. Collected {len(raw)} server metrics\")\nprocessed = preprocess(raw)\nprint(f\"2. Preprocessed — risk scores calculated\")\nat_risk = predict_issues(processed)\nprint(f\"3. Predicted {len(at_risk)} servers at risk\")\nalerts = generate_alerts(at_risk)\nprint(f\"4. Generated {len(alerts)} alerts:\")\nfor a in alerts:\n    print(f\"   → {a['host']}: {a['action']} (score: {a['score']})\")",
              "level": "beginner"
            },
            {
              "name": "Error Handling",
              "code": "# Production pipeline with error handling\nimport logging\nlogging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')\nlog = logging.getLogger()\n\ndef safe_pipeline():\n    try:\n        log.info(\"Starting pipeline...\")\n        # Stage 1\n        data = [{\"host\": \"web-01\", \"cpu\": 88}]\n        log.info(f\"Collected {len(data)} records\")\n\n        # Stage 2 - simulate error\n        if not data:\n            raise ValueError(\"No data collected\")\n        log.info(\"Preprocessing complete\")\n\n        # Stage 3\n        predictions = [{\"host\": d[\"host\"], \"risk\": \"high\"} for d in data if d[\"cpu\"] > 80]\n        log.info(f\"Predictions: {len(predictions)} high-risk\")\n\n        return {\"status\": \"success\", \"predictions\": predictions}\n\n    except Exception as e:\n        log.error(f\"Pipeline failed: {e}\")\n        return {\"status\": \"failed\", \"error\": str(e)}\n\nresult = safe_pipeline()\nprint(f\"\\nResult: {result}\")",
              "level": "intermediate"
            }
          ]
        },
        {
          "id": "m14s3",
          "title": "14.3 Deploying AI Solutions",
          "brief": "<h4>Deploying AI Solutions</h4><ul><li>Serve predictions via REST API (Flask/FastAPI)</li><li>Containerise with Docker for portability</li><li>Monitor model performance in production</li><li>Version your models alongside code</li><li>Plan for retraining as data changes over time</li></ul>",
          "description": "<p><strong>Deploying AI means making your model accessible to other systems — typically via a REST API.</strong> The model runs as a service that accepts input data and returns predictions, packaged in a container for consistent deployment.</p>",
          "syntax": "# Flask API for serving predictions\n# from flask import Flask, request, jsonify\n# import pickle\n#\n# app = Flask(__name__)\n# model = pickle.load(open('model.pkl', 'rb'))\n#\n# @app.route('/predict', methods=['POST'])\n# def predict():\n#     data = request.json\n#     result = model.predict([data['features']])\n#     return jsonify({'prediction': result[0]})",
          "script": "Show Flask API for model serving.\nExplain Docker containerisation.\nDiscuss monitoring and retraining.",
          "examples": [
            {
              "name": "Model API",
              "code": "# Simulating a deployed ML model API\nimport json\n\nclass ModelServer:\n    def __init__(self, model_name, version):\n        self.model_name = model_name\n        self.version = version\n        self.requests_served = 0\n\n    def predict(self, features):\n        self.requests_served += 1\n        # Simulated prediction logic\n        cpu, mem = features[\"cpu\"], features[\"mem\"]\n        risk = \"high\" if (cpu > 85 or mem > 90) else \"low\"\n        confidence = 0.92 if risk == \"high\" else 0.88\n        return {\"risk\": risk, \"confidence\": confidence}\n\n    def health(self):\n        return {\"status\": \"healthy\", \"model\": self.model_name, \"version\": self.version, \"served\": self.requests_served}\n\n# Deploy\nserver = ModelServer(\"infra-risk-model\", \"v2.1\")\n\n# Simulate API requests\nrequests_data = [\n    {\"cpu\": 45, \"mem\": 62},\n    {\"cpu\": 92, \"mem\": 88},\n    {\"cpu\": 30, \"mem\": 95},\n]\n\nprint(\"POST /predict responses:\")\nfor data in requests_data:\n    result = server.predict(data)\n    print(f\"  Input: {data} → {result}\")\n\nprint(f\"\\nGET /health: {json.dumps(server.health(), indent=2)}\")",
              "level": "beginner"
            },
            {
              "name": "Next Steps",
              "code": "# Your AI journey — what to learn next\nroadmap = [\n    (\"Now\",        \"Python basics, automation, first ML model\"),\n    (\"Next\",       \"pandas, scikit-learn, real datasets\"),\n    (\"Then\",       \"Deep learning (PyTorch/TensorFlow)\"),\n    (\"Advanced\",   \"LLM fine-tuning, RAG, agents\"),\n    (\"Production\", \"MLOps, monitoring, CI/CD for models\"),\n]\n\nprint(\"Your AI Learning Roadmap:\")\nprint(\"=\" * 55)\nfor stage, topics in roadmap:\n    print(f\"  {stage:<12} → {topics}\")\n\nprint(\"\\nKey resources:\")\nprint(\"  • scikit-learn.org — ML documentation\")\nprint(\"  • huggingface.co — models & datasets\")\nprint(\"  • kaggle.com — practice with real data\")\nprint(\"  • docs.python.org — language reference\")\nprint(\"\\nYou now have the foundation. Keep building! 🚀\")",
              "level": "intermediate"
            }
          ]
        }
      ]
    }
  ]
};
