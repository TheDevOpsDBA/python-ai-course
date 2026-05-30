function getDiagramSVG(type, label) {

    const svgs = {

        "ai-landscape": `<svg viewBox="0 0 600 180" width="100%" height="180">
            <defs><marker id="m1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#7fdbca"/></marker></defs>
            <rect x="20" y="30" width="120" height="50" rx="10" fill="#533483"/>
            <text x="80" y="60" fill="white" font-size="13" text-anchor="middle">Machine</text>
            <text x="80" y="75" fill="#7fdbca" font-size="11" text-anchor="middle">Learning</text>
            <rect x="160" y="30" width="120" height="50" rx="10" fill="#533483"/>
            <text x="220" y="60" fill="white" font-size="13" text-anchor="middle">Deep</text>
            <text x="220" y="75" fill="#7fdbca" font-size="11" text-anchor="middle">Learning</text>
            <rect x="300" y="30" width="120" height="50" rx="10" fill="#533483"/>
            <text x="360" y="60" fill="white" font-size="13" text-anchor="middle">NLP / LLMs</text>
            <rect x="440" y="30" width="140" height="50" rx="10" fill="#533483"/>
            <text x="510" y="60" fill="white" font-size="13" text-anchor="middle">Computer</text>
            <text x="510" y="75" fill="#7fdbca" font-size="11" text-anchor="middle">Vision</text>
            <rect x="150" y="100" width="300" height="50" rx="10" fill="#e94560"/>
            <text x="300" y="130" fill="white" font-size="16" text-anchor="middle">Python — The Common Language</text>
            <line x1="80" y1="80" x2="200" y2="100" stroke="#7fdbca" stroke-width="2"/>
            <line x1="220" y1="80" x2="260" y2="100" stroke="#7fdbca" stroke-width="2"/>
            <line x1="360" y1="80" x2="340" y2="100" stroke="#7fdbca" stroke-width="2"/>
            <line x1="510" y1="80" x2="400" y2="100" stroke="#7fdbca" stroke-width="2"/>
            <text x="300" y="172" fill="#aaa" font-size="12" text-anchor="middle">${label}</text>
        </svg>`,

        "python-infra": `<svg viewBox="0 0 600 180" width="100%" height="180">
            <defs><marker id="m2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#7fdbca"/></marker></defs>
            <rect x="200" y="15" width="200" height="45" rx="10" fill="#533483"/>
            <text x="300" y="43" fill="white" font-size="15" text-anchor="middle">Python Script</text>
            <line x1="200" y1="60" x2="80" y2="90" stroke="#7fdbca" stroke-width="2" marker-end="url(#m2)"/>
            <line x1="300" y1="60" x2="300" y2="90" stroke="#7fdbca" stroke-width="2" marker-end="url(#m2)"/>
            <line x1="400" y1="60" x2="520" y2="90" stroke="#7fdbca" stroke-width="2" marker-end="url(#m2)"/>
            <rect x="20" y="90" width="120" height="50" rx="8" fill="#0f3460" stroke="#7fdbca" stroke-width="1.5"/>
            <text x="80" y="112" fill="white" font-size="12" text-anchor="middle">Cloud APIs</text>
            <text x="80" y="128" fill="#7fdbca" font-size="10" text-anchor="middle">boto3 / azure</text>
            <rect x="240" y="90" width="120" height="50" rx="8" fill="#0f3460" stroke="#7fdbca" stroke-width="1.5"/>
            <text x="300" y="112" fill="white" font-size="12" text-anchor="middle">Networking</text>
            <text x="300" y="128" fill="#7fdbca" font-size="10" text-anchor="middle">netmiko</text>
            <rect x="460" y="90" width="120" height="50" rx="8" fill="#0f3460" stroke="#7fdbca" stroke-width="1.5"/>
            <text x="520" y="112" fill="white" font-size="12" text-anchor="middle">Monitoring</text>
            <text x="520" y="128" fill="#7fdbca" font-size="10" text-anchor="middle">prometheus</text>
            <text x="300" y="168" fill="#aaa" font-size="12" text-anchor="middle">${label}</text>
        </svg>`,

        "automation-roi": `<svg viewBox="0 0 600 180" width="100%" height="180">
            <rect x="30" y="40" width="110" height="55" rx="10" fill="#e94560"/>
            <text x="85" y="63" fill="white" font-size="12" text-anchor="middle">Manual</text>
            <text x="85" y="80" fill="white" font-size="14" text-anchor="middle">30 min</text>
            <rect x="160" y="40" width="40" height="55" rx="8" fill="#533483"/>
            <text x="180" y="73" fill="white" font-size="20" text-anchor="middle">→</text>
            <rect x="220" y="40" width="110" height="55" rx="10" fill="#7fdbca"/>
            <text x="275" y="63" fill="#1a1a2e" font-size="12" text-anchor="middle">Automated</text>
            <text x="275" y="80" fill="#1a1a2e" font-size="14" text-anchor="middle">5 sec</text>
            <rect x="370" y="25" width="210" height="85" rx="10" fill="#0f3460" stroke="#7fdbca" stroke-width="1.5"/>
            <text x="475" y="50" fill="#7fdbca" font-size="12" text-anchor="middle">Benefits</text>
            <text x="475" y="68" fill="white" font-size="11" text-anchor="middle">✓ Speed — 360x faster</text>
            <text x="475" y="83" fill="white" font-size="11" text-anchor="middle">✓ Consistency — zero drift</text>
            <text x="475" y="98" fill="white" font-size="11" text-anchor="middle">✓ Scale — 1 to 1000 hosts</text>
            <text x="300" y="168" fill="#aaa" font-size="12" text-anchor="middle">${label}</text>
        </svg>`,

        "variables-assign": `<svg viewBox="0 0 600 180" width="100%" height="180">
            <defs><marker id="va" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#7fdbca"/></marker></defs>
            <rect x="30" y="35" width="160" height="50" rx="10" fill="#533483"/>
            <text x="110" y="56" fill="#7fdbca" font-size="12" text-anchor="middle">name =</text>
            <text x="110" y="74" fill="white" font-size="15" text-anchor="middle">server_name</text>
            <rect x="230" y="35" width="50" height="50" rx="8" fill="#e94560"/>
            <text x="255" y="66" fill="white" font-size="22" text-anchor="middle">=</text>
            <rect x="320" y="35" width="160" height="50" rx="10" fill="#0f3460" stroke="#7fdbca" stroke-width="2"/>
            <text x="400" y="56" fill="#7fdbca" font-size="12" text-anchor="middle">value</text>
            <text x="400" y="74" fill="white" font-size="15" text-anchor="middle">"web-01"</text>
            <line x1="480" y1="60" x2="530" y2="60" stroke="#7fdbca" stroke-width="2" marker-end="url(#va)"/>
            <rect x="530" y="40" width="55" height="40" rx="6" fill="#16213e" stroke="#7fdbca" stroke-width="1.5"/>
            <text x="557" y="56" fill="#7fdbca" font-size="9" text-anchor="middle">Memory</text>
            <text x="557" y="70" fill="white" font-size="10" text-anchor="middle">0x3f2</text>
            <rect x="30" y="105" width="550" height="40" rx="8" fill="#16213e" stroke="#533483" stroke-width="1"/>
            <text x="55" y="128" fill="#7fdbca" font-size="12">host</text>
            <text x="105" y="128" fill="white" font-size="12">= "web-01"</text>
            <text x="210" y="128" fill="#7fdbca" font-size="12">port</text>
            <text x="250" y="128" fill="white" font-size="12">= 443</text>
            <text x="330" y="128" fill="#7fdbca" font-size="12">active</text>
            <text x="385" y="128" fill="white" font-size="12">= True</text>
            <text x="470" y="128" fill="#7fdbca" font-size="12">latency</text>
            <text x="530" y="128" fill="white" font-size="12">= 12.5</text>
            <text x="300" y="170" fill="#aaa" font-size="12" text-anchor="middle">${label}</text>
        </svg>`,

        "data-types": `<svg viewBox="0 0 600 180" width="100%" height="180">
            <rect x="20" y="25" width="120" height="55" rx="10" fill="#533483"/>
            <text x="80" y="48" fill="#7fdbca" font-size="11" text-anchor="middle">str</text>
            <text x="80" y="67" fill="white" font-size="14" text-anchor="middle">"hello"</text>
            <rect x="155" y="25" width="100" height="55" rx="10" fill="#e94560"/>
            <text x="205" y="48" fill="white" font-size="11" text-anchor="middle">int</text>
            <text x="205" y="67" fill="white" font-size="14" text-anchor="middle">42</text>
            <rect x="270" y="25" width="100" height="55" rx="10" fill="#0f3460" stroke="#7fdbca" stroke-width="1.5"/>
            <text x="320" y="48" fill="#7fdbca" font-size="11" text-anchor="middle">float</text>
            <text x="320" y="67" fill="white" font-size="14" text-anchor="middle">3.14</text>
            <rect x="385" y="25" width="100" height="55" rx="10" fill="#16213e" stroke="#e94560" stroke-width="1.5"/>
            <text x="435" y="48" fill="#e94560" font-size="11" text-anchor="middle">bool</text>
            <text x="435" y="67" fill="white" font-size="14" text-anchor="middle">True</text>
            <rect x="500" y="25" width="80" height="55" rx="10" fill="#16213e" stroke="#533483" stroke-width="1.5"/>
            <text x="540" y="48" fill="#aaa" font-size="11" text-anchor="middle">None</text>
            <text x="540" y="67" fill="#aaa" font-size="14" text-anchor="middle">∅</text>
            <rect x="100" y="105" width="400" height="40" rx="8" fill="#0f3460" stroke="#7fdbca" stroke-width="1.5"/>
            <text x="300" y="120" fill="#7fdbca" font-size="11" text-anchor="middle">Type Conversion</text>
            <text x="300" y="136" fill="white" font-size="12" text-anchor="middle">int("88") → 88    float("3.14") → 3.14    str(42) → "42"</text>
            <text x="300" y="170" fill="#aaa" font-size="12" text-anchor="middle">${label}</text>
        </svg>`,

        "input-output": `<svg viewBox="0 0 600 180" width="100%" height="180">
            <defs><marker id="io" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#7fdbca"/></marker></defs>
            <rect x="20" y="40" width="130" height="55" rx="10" fill="#533483"/>
            <text x="85" y="63" fill="#7fdbca" font-size="11" text-anchor="middle">input()</text>
            <text x="85" y="80" fill="white" font-size="13" text-anchor="middle">User / Data</text>
            <line x1="150" y1="67" x2="200" y2="67" stroke="#7fdbca" stroke-width="3" marker-end="url(#io)"/>
            <rect x="200" y="30" width="200" height="75" rx="12" fill="#0f3460" stroke="#7fdbca" stroke-width="2"/>
            <text x="300" y="58" fill="#7fdbca" font-size="11" text-anchor="middle">Python Script</text>
            <text x="300" y="78" fill="white" font-size="13" text-anchor="middle">Process & Format</text>
            <text x="300" y="95" fill="#aaa" font-size="10" text-anchor="middle">f"CPU: {cpu:.1f}%"</text>
            <line x1="400" y1="67" x2="450" y2="67" stroke="#e94560" stroke-width="3" marker-end="url(#io)"/>
            <rect x="450" y="40" width="130" height="55" rx="10" fill="#e94560"/>
            <text x="515" y="63" fill="white" font-size="11" text-anchor="middle">print()</text>
            <text x="515" y="80" fill="white" font-size="13" text-anchor="middle">Console</text>
            <rect x="100" y="120" width="400" height="30" rx="6" fill="#111827"/>
            <text x="300" y="140" fill="#7fdbca" font-size="12" text-anchor="middle" font-family="monospace">f"{host:<12} {cpu:>6.1f}% {status}"</text>
            <text x="300" y="170" fill="#aaa" font-size="12" text-anchor="middle">${label}</text>
        </svg>`,

        "lists": `<svg viewBox="0 0 600 180" width="100%" height="180">
            <text x="300" y="22" fill="#7fdbca" font-size="12" text-anchor="middle">servers = ["web-01", "web-02", "db-01", "cache-01", "backup-01"]</text>
            <rect x="30" y="35" width="95" height="55" rx="8" fill="#533483"/>
            <text x="77" y="57" fill="#7fdbca" font-size="10" text-anchor="middle">[0]</text>
            <text x="77" y="75" fill="white" font-size="12" text-anchor="middle">web-01</text>
            <rect x="135" y="35" width="95" height="55" rx="8" fill="#533483"/>
            <text x="182" y="57" fill="#7fdbca" font-size="10" text-anchor="middle">[1]</text>
            <text x="182" y="75" fill="white" font-size="12" text-anchor="middle">web-02</text>
            <rect x="240" y="35" width="95" height="55" rx="8" fill="#e94560"/>
            <text x="287" y="57" fill="white" font-size="10" text-anchor="middle">[2]</text>
            <text x="287" y="75" fill="white" font-size="12" text-anchor="middle">db-01</text>
            <rect x="345" y="35" width="95" height="55" rx="8" fill="#533483"/>
            <text x="392" y="57" fill="#7fdbca" font-size="10" text-anchor="middle">[3]</text>
            <text x="392" y="75" fill="white" font-size="12" text-anchor="middle">cache-01</text>
            <rect x="450" y="35" width="95" height="55" rx="8" fill="#533483"/>
            <text x="497" y="57" fill="#7fdbca" font-size="10" text-anchor="middle">[4]</text>
            <text x="497" y="75" fill="white" font-size="12" text-anchor="middle">backup</text>
            <rect x="30" y="105" width="250" height="40" rx="8" fill="#0f3460" stroke="#7fdbca" stroke-width="1.5"/>
            <text x="155" y="129" fill="white" font-size="11" text-anchor="middle">.append() .remove() .pop() .sort()</text>
            <rect x="300" y="105" width="250" height="40" rx="8" fill="#16213e" stroke="#e94560" stroke-width="1.5"/>
            <text x="425" y="129" fill="white" font-size="11" text-anchor="middle">Mutable • Ordered • Indexed</text>
            <text x="300" y="168" fill="#aaa" font-size="12" text-anchor="middle">${label}</text>
        </svg>`,

        "tuples": `<svg viewBox="0 0 600 180" width="100%" height="180">
            <text x="300" y="22" fill="#7fdbca" font-size="12" text-anchor="middle">endpoint = ("10.0.1.45", 443, "https")</text>
            <rect x="60" y="38" width="140" height="55" rx="8" fill="#533483" stroke="#e94560" stroke-width="2"/>
            <text x="130" y="60" fill="#7fdbca" font-size="10" text-anchor="middle">[0] ip</text>
            <text x="130" y="78" fill="white" font-size="13" text-anchor="middle">10.0.1.45</text>
            <rect x="220" y="38" width="140" height="55" rx="8" fill="#533483" stroke="#e94560" stroke-width="2"/>
            <text x="290" y="60" fill="#7fdbca" font-size="10" text-anchor="middle">[1] port</text>
            <text x="290" y="78" fill="white" font-size="13" text-anchor="middle">443</text>
            <rect x="380" y="38" width="140" height="55" rx="8" fill="#533483" stroke="#e94560" stroke-width="2"/>
            <text x="450" y="60" fill="#7fdbca" font-size="10" text-anchor="middle">[2] protocol</text>
            <text x="450" y="78" fill="white" font-size="13" text-anchor="middle">https</text>
            <rect x="60" y="110" width="200" height="35" rx="6" fill="#e94560"/>
            <text x="160" y="132" fill="white" font-size="12" text-anchor="middle">🔒 Immutable — cannot change</text>
            <rect x="290" y="110" width="230" height="35" rx="6" fill="#0f3460" stroke="#7fdbca" stroke-width="1.5"/>
            <text x="405" y="132" fill="white" font-size="11" text-anchor="middle">ip, port, proto = endpoint</text>
            <text x="300" y="168" fill="#aaa" font-size="12" text-anchor="middle">${label}</text>
        </svg>`,

        "dicts": `<svg viewBox="0 0 600 180" width="100%" height="180">
            <text x="300" y="20" fill="#7fdbca" font-size="12" text-anchor="middle">server = {"name": "web-01", "cpu": 72, "online": True}</text>
            <rect x="30" y="32" width="160" height="48" rx="8" fill="#533483"/>
            <text x="70" y="55" fill="#7fdbca" font-size="11">"name"</text>
            <text x="70" y="71" fill="white" font-size="12">→ "web-01"</text>
            <rect x="210" y="32" width="160" height="48" rx="8" fill="#e94560"/>
            <text x="250" y="55" fill="white" font-size="11">"cpu"</text>
            <text x="250" y="71" fill="white" font-size="12">→ 72</text>
            <rect x="390" y="32" width="180" height="48" rx="8" fill="#0f3460" stroke="#7fdbca" stroke-width="1.5"/>
            <text x="430" y="55" fill="#7fdbca" font-size="11">"online"</text>
            <text x="430" y="71" fill="white" font-size="12">→ True</text>
            <rect x="30" y="95" width="540" height="50" rx="8" fill="#16213e" stroke="#533483" stroke-width="1"/>
            <text x="55" y="115" fill="#7fdbca" font-size="11">Access:</text>
            <text x="140" y="115" fill="white" font-size="11">server["name"]</text>
            <text x="290" y="115" fill="#7fdbca" font-size="11">Safe:</text>
            <text x="370" y="115" fill="white" font-size="11">server.get("port", 80)</text>
            <text x="55" y="135" fill="#7fdbca" font-size="11">Iterate:</text>
            <text x="160" y="135" fill="white" font-size="11">for key, val in server.items()</text>
            <text x="400" y="135" fill="#7fdbca" font-size="11">O(1) lookup</text>
            <text x="300" y="168" fill="#aaa" font-size="12" text-anchor="middle">${label}</text>
        </svg>`,

        "arithmetic": `<svg viewBox="0 0 600 180" width="100%" height="180">
            <rect x="30" y="30" width="75" height="45" rx="8" fill="#533483"/>
            <text x="67" y="58" fill="white" font-size="18" text-anchor="middle">+</text>
            <rect x="115" y="30" width="75" height="45" rx="8" fill="#533483"/>
            <text x="152" y="58" fill="white" font-size="18" text-anchor="middle">−</text>
            <rect x="200" y="30" width="75" height="45" rx="8" fill="#e94560"/>
            <text x="237" y="58" fill="white" font-size="18" text-anchor="middle">×</text>
            <rect x="285" y="30" width="75" height="45" rx="8" fill="#e94560"/>
            <text x="322" y="58" fill="white" font-size="18" text-anchor="middle">÷</text>
            <rect x="370" y="30" width="75" height="45" rx="8" fill="#0f3460" stroke="#7fdbca" stroke-width="1.5"/>
            <text x="407" y="58" fill="white" font-size="18" text-anchor="middle">//</text>
            <rect x="455" y="30" width="55" height="45" rx="8" fill="#0f3460" stroke="#7fdbca" stroke-width="1.5"/>
            <text x="482" y="58" fill="white" font-size="18" text-anchor="middle">%</text>
            <rect x="520" y="30" width="55" height="45" rx="8" fill="#16213e" stroke="#e94560" stroke-width="1.5"/>
            <text x="547" y="58" fill="white" font-size="16" text-anchor="middle">**</text>
            <rect x="30" y="95" width="540" height="50" rx="8" fill="#16213e" stroke="#533483" stroke-width="1"/>
            <text x="55" y="115" fill="#7fdbca" font-size="11">Example:</text>
            <text x="140" y="115" fill="white" font-size="12">used = 340</text>
            <text x="260" y="115" fill="white" font-size="12">total = 500</text>
            <text x="400" y="115" fill="white" font-size="12">pct = (used / total) * 100</text>
            <text x="55" y="135" fill="#7fdbca" font-size="11">Result:</text>
            <text x="140" y="135" fill="#e94560" font-size="12">68.0%</text>
            <text x="260" y="135" fill="#7fdbca" font-size="11">Augmented:</text>
            <text x="380" y="135" fill="white" font-size="12">count += 1   total -= used</text>
            <text x="300" y="168" fill="#aaa" font-size="12" text-anchor="middle">${label}</text>
        </svg>`,

        "comparison": `<svg viewBox="0 0 600 180" width="100%" height="180">
            <rect x="30" y="30" width="80" height="40" rx="8" fill="#533483"/>
            <text x="70" y="55" fill="white" font-size="16" text-anchor="middle">==</text>
            <rect x="120" y="30" width="80" height="40" rx="8" fill="#533483"/>
            <text x="160" y="55" fill="white" font-size="16" text-anchor="middle">!=</text>
            <rect x="210" y="30" width="80" height="40" rx="8" fill="#e94560"/>
            <text x="250" y="55" fill="white" font-size="16" text-anchor="middle">&gt;</text>
            <rect x="300" y="30" width="80" height="40" rx="8" fill="#e94560"/>
            <text x="340" y="55" fill="white" font-size="16" text-anchor="middle">&lt;</text>
            <rect x="390" y="30" width="80" height="40" rx="8" fill="#0f3460" stroke="#7fdbca" stroke-width="1.5"/>
            <text x="430" y="55" fill="white" font-size="16" text-anchor="middle">&gt;=</text>
            <rect x="480" y="30" width="80" height="40" rx="8" fill="#0f3460" stroke="#7fdbca" stroke-width="1.5"/>
            <text x="520" y="55" fill="white" font-size="16" text-anchor="middle">&lt;=</text>
            <rect x="80" y="85" width="200" height="40" rx="8" fill="#16213e" stroke="#7fdbca" stroke-width="1.5"/>
            <text x="180" y="110" fill="white" font-size="12" text-anchor="middle">cpu > 85  →  True / False</text>
            <rect x="310" y="85" width="230" height="40" rx="8" fill="#16213e" stroke="#e94560" stroke-width="1.5"/>
            <text x="425" y="110" fill="white" font-size="12" text-anchor="middle">0 &lt;= value &lt;= 100  (chained)</text>
            <rect x="80" y="135" width="430" height="25" rx="5" fill="#0f3460"/>
            <text x="295" y="152" fill="#7fdbca" font-size="11" text-anchor="middle">All comparisons return bool → used in if/elif/while conditions</text>
            <text x="300" y="175" fill="#aaa" font-size="12" text-anchor="middle">${label}</text>
        </svg>`,

        "logical": `<svg viewBox="0 0 600 180" width="100%" height="180">
            <rect x="30" y="25" width="160" height="55" rx="10" fill="#533483"/>
            <text x="110" y="48" fill="#7fdbca" font-size="12" text-anchor="middle">and</text>
            <text x="110" y="67" fill="white" font-size="11" text-anchor="middle">Both must be True</text>
            <rect x="220" y="25" width="160" height="55" rx="10" fill="#e94560"/>
            <text x="300" y="48" fill="white" font-size="12" text-anchor="middle">or</text>
            <text x="300" y="67" fill="white" font-size="11" text-anchor="middle">At least one True</text>
            <rect x="410" y="25" width="160" height="55" rx="10" fill="#0f3460" stroke="#7fdbca" stroke-width="1.5"/>
            <text x="490" y="48" fill="#7fdbca" font-size="12" text-anchor="middle">not</text>
            <text x="490" y="67" fill="white" font-size="11" text-anchor="middle">Inverts boolean</text>
            <rect x="30" y="95" width="540" height="55" rx="8" fill="#16213e" stroke="#533483" stroke-width="1"/>
            <text x="55" y="115" fill="#7fdbca" font-size="11">Alert rule:</text>
            <text x="55" y="135" fill="white" font-size="12">if cpu > 90 and mem > 85:  →  CRITICAL (both high)</text>
            <text x="320" y="115" fill="#7fdbca" font-size="11">Escalation:</text>
            <text x="320" y="135" fill="white" font-size="12">if cpu > 95 or disk > 95:  →  PAGE (either critical)</text>
            <text x="300" y="172" fill="#aaa" font-size="12" text-anchor="middle">${label}</text>
        </svg>`,

        "if-else": `<svg viewBox="0 0 600 200" width="100%" height="200">
            <rect x="225" y="5" width="150" height="38" rx="8" fill="#0f3460" stroke="#7fdbca" stroke-width="2"/>
            <text x="300" y="29" fill="white" font-size="13" text-anchor="middle">Evaluate Condition</text>
            <line x1="300" y1="43" x2="300" y2="60" stroke="#7fdbca" stroke-width="2"/>
            <polygon points="300,60 250,100 350,100" fill="#533483" stroke="#7fdbca" stroke-width="2"/>
            <text x="300" y="86" fill="white" font-size="12" text-anchor="middle">cpu > 85?</text>
            <line x1="350" y1="80" x2="480" y2="80" stroke="#7fdbca" stroke-width="2"/>
            <text x="415" y="73" fill="#7fdbca" font-size="11" text-anchor="middle">True</text>
            <rect x="430" y="95" width="140" height="38" rx="8" fill="#e94560"/>
            <text x="500" y="118" fill="white" font-size="12" text-anchor="middle">ALERT: Warning</text>
            <line x1="250" y1="100" x2="120" y2="100" stroke="#7fdbca" stroke-width="2"/>
            <text x="185" y="93" fill="#7fdbca" font-size="11" text-anchor="middle">False</text>
            <rect x="30" y="95" width="140" height="38" rx="8" fill="#16213e" stroke="#7fdbca" stroke-width="1.5"/>
            <text x="100" y="118" fill="white" font-size="12" text-anchor="middle">Status: OK</text>
            <line x1="100" y1="133" x2="100" y2="155" stroke="#7fdbca" stroke-width="1.5"/>
            <line x1="500" y1="133" x2="500" y2="155" stroke="#7fdbca" stroke-width="1.5"/>
            <line x1="100" y1="155" x2="500" y2="155" stroke="#7fdbca" stroke-width="1.5"/>
            <rect x="250" y="148" width="100" height="25" rx="5" fill="#0f3460"/>
            <text x="300" y="165" fill="white" font-size="11" text-anchor="middle">Continue</text>
            <text x="300" y="192" fill="#aaa" font-size="12" text-anchor="middle">${label}</text>
        </svg>`,

        "loops": `<svg viewBox="0 0 600 200" width="100%" height="200">
            <rect x="200" y="5" width="200" height="35" rx="8" fill="#0f3460" stroke="#7fdbca" stroke-width="2"/>
            <text x="300" y="27" fill="white" font-size="12" text-anchor="middle">for server in servers:</text>
            <line x1="300" y1="40" x2="300" y2="55" stroke="#7fdbca" stroke-width="2"/>
            <polygon points="300,55 255,90 345,90" fill="#533483" stroke="#7fdbca" stroke-width="2"/>
            <text x="300" y="78" fill="white" font-size="11" text-anchor="middle">more items?</text>
            <line x1="345" y1="72" x2="470" y2="72" stroke="#7fdbca" stroke-width="2"/>
            <text x="408" y="65" fill="#7fdbca" font-size="10" text-anchor="middle">Yes</text>
            <rect x="420" y="85" width="150" height="40" rx="8" fill="#e94560"/>
            <text x="495" y="100" fill="white" font-size="11" text-anchor="middle">Process item</text>
            <text x="495" y="115" fill="white" font-size="10" text-anchor="middle">check_health(server)</text>
            <line x1="495" y1="125" x2="495" y2="145" stroke="#7fdbca" stroke-width="2"/>
            <line x1="495" y1="145" x2="300" y2="145" stroke="#7fdbca" stroke-width="2"/>
            <line x1="300" y1="145" x2="300" y2="90" stroke="#7fdbca" stroke-width="2" marker-end="url(#m1)"/>
            <text x="400" y="155" fill="#7fdbca" font-size="10" text-anchor="middle">next iteration</text>
            <line x1="255" y1="90" x2="120" y2="90" stroke="#7fdbca" stroke-width="2"/>
            <text x="187" y="83" fill="#7fdbca" font-size="10" text-anchor="middle">No (done)</text>
            <rect x="40" y="80" width="120" height="35" rx="8" fill="#16213e" stroke="#7fdbca" stroke-width="1.5"/>
            <text x="100" y="102" fill="white" font-size="11" text-anchor="middle">Exit loop</text>
            <defs><marker id="m1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#7fdbca"/></marker></defs>
            <text x="300" y="190" fill="#aaa" font-size="12" text-anchor="middle">${label}</text>
        </svg>`,

        "range-fn": `<svg viewBox="0 0 600 180" width="100%" height="180">
            <rect x="30" y="20" width="540" height="40" rx="8" fill="#0f3460" stroke="#7fdbca" stroke-width="1.5"/>
            <text x="300" y="35" fill="#7fdbca" font-size="11" text-anchor="middle">range(start, stop, step) — generates integers lazily (memory efficient)</text>
            <text x="300" y="52" fill="white" font-size="12" text-anchor="middle">range(0, 5, 1)  →  0, 1, 2, 3, 4</text>
            <rect x="30" y="75" width="80" height="40" rx="6" fill="#533483"/>
            <text x="70" y="100" fill="white" font-size="14" text-anchor="middle">0</text>
            <rect x="120" y="75" width="80" height="40" rx="6" fill="#533483"/>
            <text x="160" y="100" fill="white" font-size="14" text-anchor="middle">1</text>
            <rect x="210" y="75" width="80" height="40" rx="6" fill="#533483"/>
            <text x="250" y="100" fill="white" font-size="14" text-anchor="middle">2</text>
            <rect x="300" y="75" width="80" height="40" rx="6" fill="#e94560"/>
            <text x="340" y="100" fill="white" font-size="14" text-anchor="middle">3</text>
            <rect x="390" y="75" width="80" height="40" rx="6" fill="#533483"/>
            <text x="430" y="100" fill="white" font-size="14" text-anchor="middle">4</text>
            <rect x="480" y="75" width="80" height="40" rx="6" fill="#16213e" stroke="#e94560" stroke-width="1.5" stroke-dasharray="4"/>
            <text x="520" y="100" fill="#e94560" font-size="12" text-anchor="middle">stop=5</text>
            <rect x="30" y="130" width="540" height="25" rx="5" fill="#16213e"/>
            <text x="120" y="147" fill="white" font-size="11" text-anchor="middle">range(5)</text>
            <text x="280" y="147" fill="white" font-size="11" text-anchor="middle">range(1, 6)</text>
            <text x="440" y="147" fill="white" font-size="11" text-anchor="middle">range(0, 50, 10)</text>
            <text x="300" y="175" fill="#aaa" font-size="12" text-anchor="middle">${label}</text>
        </svg>`,

        "def-function": `<svg viewBox="0 0 600 180" width="100%" height="180">
            <defs><marker id="fn1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#7fdbca"/></marker></defs>
            <rect x="30" y="25" width="540" height="35" rx="8" fill="#0f3460" stroke="#7fdbca" stroke-width="1.5"/>
            <text x="300" y="47" fill="white" font-size="13" text-anchor="middle" font-family="monospace">def check_health(host, threshold=85):</text>
            <rect x="30" y="75" width="120" height="45" rx="8" fill="#533483"/>
            <text x="90" y="93" fill="#7fdbca" font-size="11" text-anchor="middle">def keyword</text>
            <text x="90" y="108" fill="white" font-size="10" text-anchor="middle">declares function</text>
            <rect x="170" y="75" width="120" height="45" rx="8" fill="#e94560"/>
            <text x="230" y="93" fill="white" font-size="11" text-anchor="middle">name</text>
            <text x="230" y="108" fill="white" font-size="10" text-anchor="middle">check_health</text>
            <rect x="310" y="75" width="120" height="45" rx="8" fill="#16213e" stroke="#7fdbca" stroke-width="1.5"/>
            <text x="370" y="93" fill="#7fdbca" font-size="11" text-anchor="middle">parameters</text>
            <text x="370" y="108" fill="white" font-size="10" text-anchor="middle">(host, threshold)</text>
            <rect x="450" y="75" width="120" height="45" rx="8" fill="#533483"/>
            <text x="510" y="93" fill="white" font-size="11" text-anchor="middle">return</text>
            <text x="510" y="108" fill="white" font-size="10" text-anchor="middle">sends value back</text>
            <rect x="30" y="135" width="540" height="25" rx="5" fill="#16213e"/>
            <text x="300" y="152" fill="#7fdbca" font-size="11" text-anchor="middle">Call: result = check_health("web-01")  →  reusable, testable, readable</text>
            <text x="300" y="175" fill="#aaa" font-size="12" text-anchor="middle">${label}</text>
        </svg>`,

        "arguments": `<svg viewBox="0 0 600 180" width="100%" height="180">
            <defs><marker id="fn2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#7fdbca"/></marker></defs>
            <rect x="30" y="20" width="160" height="50" rx="8" fill="#533483"/>
            <text x="110" y="40" fill="#7fdbca" font-size="11" text-anchor="middle">Positional</text>
            <text x="110" y="58" fill="white" font-size="12" text-anchor="middle">connect("host", 443)</text>
            <rect x="210" y="20" width="180" height="50" rx="8" fill="#e94560"/>
            <text x="300" y="40" fill="white" font-size="11" text-anchor="middle">Keyword</text>
            <text x="300" y="58" fill="white" font-size="12" text-anchor="middle">connect(host="h", port=443)</text>
            <rect x="410" y="20" width="160" height="50" rx="8" fill="#0f3460" stroke="#7fdbca" stroke-width="1.5"/>
            <text x="490" y="40" fill="#7fdbca" font-size="11" text-anchor="middle">Default</text>
            <text x="490" y="58" fill="white" font-size="12" text-anchor="middle">def f(port=443)</text>
            <rect x="30" y="85" width="250" height="50" rx="8" fill="#16213e" stroke="#533483" stroke-width="1.5"/>
            <text x="155" y="105" fill="#7fdbca" font-size="11" text-anchor="middle">*args (variable positional)</text>
            <text x="155" y="123" fill="white" font-size="12" text-anchor="middle">def total(*values): sum(values)</text>
            <rect x="300" y="85" width="270" height="50" rx="8" fill="#16213e" stroke="#e94560" stroke-width="1.5"/>
            <text x="435" y="105" fill="#e94560" font-size="11" text-anchor="middle">**kwargs (variable keyword)</text>
            <text x="435" y="123" fill="white" font-size="12" text-anchor="middle">def log(**ctx): ctx.items()</text>
            <text x="300" y="168" fill="#aaa" font-size="12" text-anchor="middle">${label}</text>
        </svg>`,

        "lambda": `<svg viewBox="0 0 600 180" width="100%" height="180">
            <rect x="30" y="20" width="540" height="38" rx="8" fill="#0f3460" stroke="#7fdbca" stroke-width="1.5"/>
            <text x="300" y="35" fill="#7fdbca" font-size="11" text-anchor="middle">Lambda — anonymous single-expression function</text>
            <text x="300" y="50" fill="white" font-size="13" text-anchor="middle" font-family="monospace">lambda parameters: expression</text>
            <rect x="30" y="72" width="260" height="45" rx="8" fill="#533483"/>
            <text x="160" y="90" fill="#7fdbca" font-size="11" text-anchor="middle">Sort key</text>
            <text x="160" y="107" fill="white" font-size="12" text-anchor="middle">sorted(data, key=lambda s: s["cpu"])</text>
            <rect x="310" y="72" width="260" height="45" rx="8" fill="#e94560"/>
            <text x="440" y="90" fill="white" font-size="11" text-anchor="middle">Filter</text>
            <text x="440" y="107" fill="white" font-size="12" text-anchor="middle">filter(lambda s: s["cpu"] > 80, data)</text>
            <rect x="30" y="130" width="540" height="25" rx="5" fill="#16213e"/>
            <text x="300" y="147" fill="#7fdbca" font-size="11" text-anchor="middle">Use for short, inline functions. For anything complex → use def</text>
            <text x="300" y="175" fill="#aaa" font-size="12" text-anchor="middle">${label}</text>
        </svg>`,

        "try-except": `<svg viewBox="0 0 600 185" width="100%" height="185">
            <rect x="200" y="10" width="200" height="40" rx="10" fill="#0f3460" stroke="#7fdbca" stroke-width="2"/>
            <text x="300" y="35" fill="white" font-size="13" text-anchor="middle">try: risky_operation()</text>
            <line x1="300" y1="50" x2="300" y2="65" stroke="#7fdbca" stroke-width="2"/>
            <polygon points="300,65 260,95 340,95" fill="#533483" stroke="#7fdbca" stroke-width="1.5"/>
            <text x="300" y="84" fill="white" font-size="10" text-anchor="middle">Exception?</text>
            <line x1="260" y1="95" x2="100" y2="95" stroke="#e94560" stroke-width="2"/>
            <text x="180" y="88" fill="#e94560" font-size="10" text-anchor="middle">Yes</text>
            <rect x="20" y="100" width="160" height="40" rx="8" fill="#e94560"/>
            <text x="100" y="115" fill="white" font-size="11" text-anchor="middle">except ValueError as e:</text>
            <text x="100" y="131" fill="white" font-size="10" text-anchor="middle">handle specific error</text>
            <line x1="340" y1="80" x2="480" y2="80" stroke="#7fdbca" stroke-width="2"/>
            <text x="410" y="73" fill="#7fdbca" font-size="10" text-anchor="middle">No</text>
            <rect x="420" y="100" width="160" height="40" rx="8" fill="#16213e" stroke="#7fdbca" stroke-width="1.5"/>
            <text x="500" y="125" fill="white" font-size="11" text-anchor="middle">Success path ✓</text>
            <rect x="180" y="150" width="240" height="25" rx="5" fill="#0f3460"/>
            <text x="300" y="167" fill="#7fdbca" font-size="11" text-anchor="middle">Always catch specific exceptions</text>
            <text x="300" y="183" fill="#aaa" font-size="11" text-anchor="middle">${label}</text>
        </svg>`,

        "finally-raise": `<svg viewBox="0 0 600 185" width="100%" height="185">
            <rect x="30" y="10" width="160" height="55" rx="8" fill="#0f3460" stroke="#7fdbca" stroke-width="2"/>
            <text x="110" y="32" fill="#7fdbca" font-size="11" text-anchor="middle">try:</text>
            <text x="110" y="50" fill="white" font-size="11" text-anchor="middle">execute code</text>
            <rect x="220" y="10" width="160" height="55" rx="8" fill="#e94560"/>
            <text x="300" y="32" fill="white" font-size="11" text-anchor="middle">except:</text>
            <text x="300" y="50" fill="white" font-size="11" text-anchor="middle">handle error</text>
            <rect x="410" y="10" width="160" height="55" rx="8" fill="#533483"/>
            <text x="490" y="32" fill="#7fdbca" font-size="11" text-anchor="middle">finally:</text>
            <text x="490" y="50" fill="white" font-size="11" text-anchor="middle">ALWAYS runs</text>
            <line x1="190" y1="37" x2="220" y2="37" stroke="#7fdbca" stroke-width="2"/>
            <line x1="380" y1="37" x2="410" y2="37" stroke="#7fdbca" stroke-width="2"/>
            <rect x="30" y="80" width="540" height="45" rx="8" fill="#16213e" stroke="#e94560" stroke-width="1.5"/>
            <text x="55" y="98" fill="#e94560" font-size="11">raise</text>
            <text x="130" y="98" fill="white" font-size="11">— deliberately trigger an exception</text>
            <text x="55" y="116" fill="white" font-size="11" font-family="monospace">raise ValueError(f"Port must be 1-65535, got {port}")</text>
            <rect x="30" y="138" width="540" height="25" rx="5" fill="#0f3460"/>
            <text x="300" y="155" fill="#7fdbca" font-size="11" text-anchor="middle">finally: cleanup (close files, release locks) | raise: enforce preconditions</text>
            <text x="300" y="180" fill="#aaa" font-size="11" text-anchor="middle">${label}</text>
        </svg>`,

        "read-files": `<svg viewBox="0 0 600 180" width="100%" height="180">
            <defs><marker id="rf" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#7fdbca"/></marker></defs>
            <rect x="30" y="30" width="150" height="55" rx="10" fill="#0f3460" stroke="#7fdbca" stroke-width="2"/>
            <text x="105" y="52" fill="#7fdbca" font-size="11" text-anchor="middle">File on Disk</text>
            <text x="105" y="70" fill="white" font-size="12" text-anchor="middle">server.log</text>
            <line x1="180" y1="57" x2="230" y2="57" stroke="#7fdbca" stroke-width="3" marker-end="url(#rf)"/>
            <rect x="230" y="25" width="200" height="65" rx="10" fill="#533483"/>
            <text x="330" y="48" fill="#7fdbca" font-size="11" text-anchor="middle">with open() as f:</text>
            <text x="330" y="65" fill="white" font-size="12" text-anchor="middle">f.read()</text>
            <text x="330" y="80" fill="white" font-size="10" text-anchor="middle">f.readlines() | for line in f</text>
            <line x1="430" y1="57" x2="480" y2="57" stroke="#7fdbca" stroke-width="3" marker-end="url(#rf)"/>
            <rect x="480" y="30" width="100" height="55" rx="10" fill="#e94560"/>
            <text x="530" y="52" fill="white" font-size="11" text-anchor="middle">Python</text>
            <text x="530" y="70" fill="white" font-size="12" text-anchor="middle">str / list</text>
            <rect x="30" y="105" width="540" height="40" rx="8" fill="#16213e" stroke="#533483" stroke-width="1"/>
            <text x="55" y="122" fill="#7fdbca" font-size="11">Best practice:</text>
            <text x="180" y="122" fill="white" font-size="11">Always use with statement (auto-closes file)</text>
            <text x="55" y="138" fill="#7fdbca" font-size="11">Encoding:</text>
            <text x="180" y="138" fill="white" font-size="11">encoding='utf-8' — explicit, cross-platform</text>
            <text x="300" y="170" fill="#aaa" font-size="12" text-anchor="middle">${label}</text>
        </svg>`,

        "write-csv": `<svg viewBox="0 0 600 180" width="100%" height="180">
            <defs><marker id="wc" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#7fdbca"/></marker></defs>
            <rect x="30" y="25" width="150" height="55" rx="10" fill="#533483"/>
            <text x="105" y="47" fill="#7fdbca" font-size="11" text-anchor="middle">Python Data</text>
            <text x="105" y="65" fill="white" font-size="12" text-anchor="middle">[{dict}, {dict}]</text>
            <line x1="180" y1="52" x2="230" y2="52" stroke="#7fdbca" stroke-width="3" marker-end="url(#wc)"/>
            <rect x="230" y="20" width="180" height="65" rx="10" fill="#0f3460" stroke="#7fdbca" stroke-width="2"/>
            <text x="320" y="42" fill="#7fdbca" font-size="11" text-anchor="middle">csv.DictWriter</text>
            <text x="320" y="58" fill="white" font-size="11" text-anchor="middle">writeheader()</text>
            <text x="320" y="73" fill="white" font-size="11" text-anchor="middle">writerows(data)</text>
            <line x1="410" y1="52" x2="460" y2="52" stroke="#7fdbca" stroke-width="3" marker-end="url(#wc)"/>
            <rect x="460" y="25" width="120" height="55" rx="10" fill="#e94560"/>
            <text x="520" y="47" fill="white" font-size="11" text-anchor="middle">report.csv</text>
            <text x="520" y="65" fill="white" font-size="10" text-anchor="middle">host,cpu,status</text>
            <rect x="30" y="100" width="540" height="48" rx="8" fill="#16213e" stroke="#533483" stroke-width="1"/>
            <text x="55" y="118" fill="#7fdbca" font-size="11">Output:</text>
            <text x="130" y="118" fill="white" font-size="11" font-family="monospace">host,cpu,status</text>
            <text x="130" y="136" fill="white" font-size="11" font-family="monospace">web-01,45,online</text>
            <text x="350" y="118" fill="#7fdbca" font-size="11">Tip:</text>
            <text x="350" y="136" fill="white" font-size="11">newline='' on Windows</text>
            <text x="300" y="170" fill="#aaa" font-size="12" text-anchor="middle">${label}</text>
        </svg>`,

        "json-process": `<svg viewBox="0 0 600 180" width="100%" height="180">
            <defs><marker id="jp" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#7fdbca"/></marker></defs>
            <rect x="30" y="20" width="130" height="60" rx="10" fill="#0f3460" stroke="#7fdbca" stroke-width="2"/>
            <text x="95" y="42" fill="#7fdbca" font-size="11" text-anchor="middle">JSON String</text>
            <text x="95" y="58" fill="white" font-size="10" text-anchor="middle">{"host":"web-01"</text>
            <text x="95" y="70" fill="white" font-size="10" text-anchor="middle"> "cpu": 88}</text>
            <line x1="160" y1="50" x2="200" y2="50" stroke="#7fdbca" stroke-width="2" marker-end="url(#jp)"/>
            <rect x="200" y="25" width="100" height="50" rx="8" fill="#e94560"/>
            <text x="250" y="45" fill="white" font-size="11" text-anchor="middle">loads()</text>
            <text x="250" y="60" fill="white" font-size="9" text-anchor="middle">parse</text>
            <line x1="300" y1="50" x2="340" y2="50" stroke="#7fdbca" stroke-width="2" marker-end="url(#jp)"/>
            <rect x="340" y="20" width="130" height="60" rx="10" fill="#533483"/>
            <text x="405" y="42" fill="#7fdbca" font-size="11" text-anchor="middle">Python dict</text>
            <text x="405" y="58" fill="white" font-size="10" text-anchor="middle">data["host"]</text>
            <text x="405" y="70" fill="white" font-size="10" text-anchor="middle">→ "web-01"</text>
            <line x1="470" y1="50" x2="510" y2="50" stroke="#e94560" stroke-width="2" marker-end="url(#jp)"/>
            <rect x="490" y="25" width="90" height="50" rx="8" fill="#e94560"/>
            <text x="535" y="45" fill="white" font-size="11" text-anchor="middle">dumps()</text>
            <text x="535" y="60" fill="white" font-size="9" text-anchor="middle">serialise</text>
            <rect x="30" y="100" width="540" height="48" rx="8" fill="#16213e" stroke="#533483" stroke-width="1"/>
            <text x="55" y="118" fill="#7fdbca" font-size="11">Type mapping:</text>
            <text x="55" y="136" fill="white" font-size="11">dict↔object  list↔array  str↔string  True↔true  None↔null</text>
            <text x="400" y="118" fill="#7fdbca" font-size="11">Pretty print:</text>
            <text x="400" y="136" fill="white" font-size="11">json.dumps(obj, indent=2)</text>
            <text x="300" y="170" fill="#aaa" font-size="12" text-anchor="middle">${label}</text>
        </svg>`,

        "install-python": `<svg viewBox="0 0 600 180" width="100%" height="180">
            <defs><marker id="ip1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#7fdbca"/></marker></defs>
            <rect x="20" y="30" width="130" height="55" rx="10" fill="#533483"/>
            <text x="85" y="52" fill="#7fdbca" font-size="11" text-anchor="middle">Step 1</text>
            <text x="85" y="70" fill="white" font-size="12" text-anchor="middle">Download</text>
            <line x1="150" y1="57" x2="180" y2="57" stroke="#7fdbca" stroke-width="2" marker-end="url(#ip1)"/>
            <rect x="180" y="30" width="130" height="55" rx="10" fill="#e94560"/>
            <text x="245" y="52" fill="white" font-size="11" text-anchor="middle">Step 2</text>
            <text x="245" y="70" fill="white" font-size="12" text-anchor="middle">Install + PATH ✓</text>
            <line x1="310" y1="57" x2="340" y2="57" stroke="#7fdbca" stroke-width="2" marker-end="url(#ip1)"/>
            <rect x="340" y="30" width="130" height="55" rx="10" fill="#0f3460" stroke="#7fdbca" stroke-width="1.5"/>
            <text x="405" y="52" fill="#7fdbca" font-size="11" text-anchor="middle">Step 3</text>
            <text x="405" y="70" fill="white" font-size="12" text-anchor="middle">Verify</text>
            <line x1="470" y1="57" x2="500" y2="57" stroke="#7fdbca" stroke-width="2" marker-end="url(#ip1)"/>
            <rect x="500" y="30" width="80" height="55" rx="10" fill="#7fdbca"/>
            <text x="540" y="52" fill="#1a1a2e" font-size="11" text-anchor="middle">Ready</text>
            <text x="540" y="70" fill="#1a1a2e" font-size="12" text-anchor="middle">✓</text>
            <rect x="20" y="105" width="560" height="40" rx="8" fill="#16213e" stroke="#533483" stroke-width="1"/>
            <text x="45" y="122" fill="#7fdbca" font-size="11">python.org</text>
            <text x="150" y="122" fill="white" font-size="11">→ Add to PATH ☑</text>
            <text x="310" y="122" fill="white" font-size="11">→ python --version</text>
            <text x="480" y="122" fill="#7fdbca" font-size="11">→ pip --version</text>
            <text x="45" y="138" fill="#aaa" font-size="10">Always Python 3.x | Includes pip | Works on Win/Mac/Linux</text>
            <text x="300" y="170" fill="#aaa" font-size="12" text-anchor="middle">${label}</text>
        </svg>`,

        "venv-diagram": `<svg viewBox="0 0 600 180" width="100%" height="180">
            <rect x="20" y="15" width="180" height="70" rx="10" fill="#e94560"/>
            <text x="110" y="38" fill="white" font-size="11" text-anchor="middle">Project A / .venv</text>
            <text x="110" y="55" fill="white" font-size="10" text-anchor="middle">requests==2.28</text>
            <text x="110" y="70" fill="white" font-size="10" text-anchor="middle">flask==2.3</text>
            <rect x="220" y="15" width="180" height="70" rx="10" fill="#533483"/>
            <text x="310" y="38" fill="#7fdbca" font-size="11" text-anchor="middle">Project B / .venv</text>
            <text x="310" y="55" fill="white" font-size="10" text-anchor="middle">requests==2.31</text>
            <text x="310" y="70" fill="white" font-size="10" text-anchor="middle">django==5.0</text>
            <rect x="420" y="15" width="160" height="70" rx="10" fill="#0f3460" stroke="#7fdbca" stroke-width="1.5"/>
            <text x="500" y="38" fill="#7fdbca" font-size="11" text-anchor="middle">System Python</text>
            <text x="500" y="55" fill="white" font-size="10" text-anchor="middle">Clean — no packages</text>
            <text x="500" y="70" fill="#aaa" font-size="10" text-anchor="middle">stays untouched</text>
            <rect x="20" y="100" width="560" height="50" rx="8" fill="#16213e" stroke="#533483" stroke-width="1"/>
            <text x="45" y="118" fill="#7fdbca" font-size="11">Create:</text>
            <text x="110" y="118" fill="white" font-size="11">python -m venv .venv</text>
            <text x="310" y="118" fill="#7fdbca" font-size="11">Activate:</text>
            <text x="390" y="118" fill="white" font-size="11">.venv\\Scripts\\activate</text>
            <text x="45" y="138" fill="#7fdbca" font-size="11">Save:</text>
            <text x="110" y="138" fill="white" font-size="11">pip freeze > requirements.txt</text>
            <text x="360" y="138" fill="#7fdbca" font-size="11">Restore:</text>
            <text x="430" y="138" fill="white" font-size="11">pip install -r requirements.txt</text>
            <text x="300" y="172" fill="#aaa" font-size="12" text-anchor="middle">${label}</text>
        </svg>`,

        "vscode-portal": `<svg viewBox="0 0 600 180" width="100%" height="180">
            <rect x="20" y="20" width="180" height="65" rx="10" fill="#533483"/>
            <text x="110" y="42" fill="#7fdbca" font-size="12" text-anchor="middle">VS Code</text>
            <text x="110" y="58" fill="white" font-size="10" text-anchor="middle">Extensions + Terminal</text>
            <text x="110" y="72" fill="white" font-size="10" text-anchor="middle">Debugging + IntelliSense</text>
            <rect x="220" y="20" width="180" height="65" rx="10" fill="#0f3460" stroke="#7fdbca" stroke-width="1.5"/>
            <text x="310" y="42" fill="#7fdbca" font-size="12" text-anchor="middle">This Portal</text>
            <text x="310" y="58" fill="white" font-size="10" text-anchor="middle">Browser-based Python</text>
            <text x="310" y="72" fill="white" font-size="10" text-anchor="middle">Zero setup • Instant</text>
            <rect x="420" y="20" width="160" height="65" rx="10" fill="#16213e" stroke="#e94560" stroke-width="1.5"/>
            <text x="500" y="42" fill="#e94560" font-size="12" text-anchor="middle">Terminal REPL</text>
            <text x="500" y="58" fill="white" font-size="10" text-anchor="middle">python / python3</text>
            <text x="500" y="72" fill="white" font-size="10" text-anchor="middle">Quick tests</text>
            <rect x="150" y="100" width="300" height="50" rx="10" fill="#e94560"/>
            <text x="300" y="122" fill="white" font-size="14" text-anchor="middle">Same Python — Same Output</text>
            <text x="300" y="140" fill="white" font-size="11" text-anchor="middle">Code is portable across all environments</text>
            <line x1="110" y1="85" x2="200" y2="100" stroke="#7fdbca" stroke-width="2"/>
            <line x1="310" y1="85" x2="300" y2="100" stroke="#7fdbca" stroke-width="2"/>
            <line x1="500" y1="85" x2="400" y2="100" stroke="#7fdbca" stroke-width="2"/>
            <text x="300" y="172" fill="#aaa" font-size="12" text-anchor="middle">${label}</text>
        </svg>`,

        "generic": `<svg viewBox="0 0 600 180" width="100%" height="180">
            <rect x="30" y="57" width="150" height="65" rx="12" fill="#533483"/>
            <text x="105" y="95" fill="white" font-size="16" text-anchor="middle">Concept</text>
            <line x1="180" y1="89" x2="230" y2="89" stroke="#7fdbca" stroke-width="4"/>
            <rect x="230" y="57" width="140" height="65" rx="12" fill="#e94560"/>
            <text x="300" y="95" fill="white" font-size="16" text-anchor="middle">Practice</text>
            <line x1="370" y1="89" x2="420" y2="89" stroke="#7fdbca" stroke-width="4"/>
            <rect x="420" y="57" width="150" height="65" rx="12" fill="#0f3460" stroke="#7fdbca" stroke-width="2"/>
            <text x="495" y="95" fill="white" font-size="16" text-anchor="middle">Apply</text>
            <text x="300" y="160" fill="#aaa" font-size="13" text-anchor="middle">${label}</text>
        </svg>`
    };

    return svgs[type] || svgs["generic"];
}

// Maps section IDs to diagram types
const sectionDiagramTypes = {
    "m0s1": "install-python",  // Installing Python
    "m0s2": "venv-diagram",    // Virtual Environments
    "m0s3": "vscode-portal",   // VS Code & This Portal
    "m1s1": "ai-landscape",    // AI is Not Optional
    "m1s2": "python-infra",    // Python in Infrastructure
    "m1s3": "automation-roi",  // Automation Benefits
    "m2s1": "variables-assign",// Variables
    "m2s2": "data-types",      // Data Types
    "m2s3": "input-output",    // Input and Output
    "m3s1": "lists",           // Lists
    "m3s2": "tuples",          // Tuples
    "m3s3": "dicts",           // Dictionaries
    "m4s1": "arithmetic",      // Arithmetic Operators
    "m4s2": "comparison",      // Comparison Operators
    "m4s3": "logical",         // Logical Operators
    "m5s1": "if-else",         // If Else
    "m5s2": "loops",           // Loops
    "m5s3": "range-fn",        // Range Function
    "m6s1": "def-function",    // Creating Functions
    "m6s2": "arguments",       // Arguments
    "m6s3": "lambda",          // Lambda Functions
    "m7s1": "try-except",      // Try Except
    "m7s2": "finally-raise",   // Finally and Raise
    "m8s1": "read-files",      // Reading Files
    "m8s2": "write-csv",       // Writing CSV
    "m8s3": "json-process",     // JSON Processing
    "m9s1": "generic",          // Importing Modules
    "m9s2": "generic",          // Installing Packages
    "m9s3": "generic",          // Creating Your Own Modules
    "m10s1": "generic",         // Classes & Objects
    "m10s2": "generic",         // Inheritance
    "m10s3": "generic",         // Encapsulation
    "m11s1": "generic",         // Working with APIs
    "m11s2": "generic",         // Task Scheduling
    "m11s3": "generic",         // Infrastructure Automation
    "m12s1": "generic",         // What is AI & ML
    "m12s2": "generic",         // Data Preparation
    "m12s3": "generic",         // First ML Model
    "m13s1": "generic",         // What is Gen AI
    "m13s2": "generic",         // LLM APIs
    "m13s3": "generic",         // Building AI Tools
    "m14s1": "generic",         // Project Structure
    "m14s2": "generic",         // AI Pipeline
    "m14s3": "generic"          // Deploying AI
};