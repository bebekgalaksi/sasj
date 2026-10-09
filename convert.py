import re

def convert_to_jsx(html):
    # Regex replacements for JSX
    html = re.sub(r'class=', 'className=', html)
    html = re.sub(r'for=', 'htmlFor=', html)
    html = re.sub(r'onclick="([^"]+)"', r'onClick={() => window.\1}', html)
    html = re.sub(r'onchange="([^"]+)"', r'onChange={() => window.\1}', html)
    html = re.sub(r'stroke-linecap=', 'strokeLinecap=', html)
    html = re.sub(r'stroke-linejoin=', 'strokeLinejoin=', html)
    html = re.sub(r'stroke-width=', 'strokeWidth=', html)
    html = re.sub(r'<!--(.*?)-->', r'{/*\1*/}', html, flags=re.DOTALL)
    html = re.sub(r'<br>', '<br />', html)
    html = re.sub(r'<hr>', '<hr />', html)
    # Self close img and input
    html = re.sub(r'<img([^>]+?)(?<!/)>', r'<img\1 />', html)
    html = re.sub(r'<input([^>]+?)(?<!/)>', r'<input\1 />', html)
    return html

with open('frontend_old/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract head contents
head_start = content.find('<head>') + 6
head_end = content.find('</head>')
head_content = content[head_start:head_end]

# Modify head content to remove title if it exists so we can merge cleanly
head_content = re.sub(r'<title>.*?</title>', '', head_content, flags=re.DOTALL | re.IGNORECASE)
head_content = re.sub(r'<meta charset="UTF-8".*?>', '', head_content, flags=re.IGNORECASE)
head_content = re.sub(r'<meta name="viewport".*?>', '', head_content, flags=re.IGNORECASE)

# Extract body class
body_class_match = re.search(r'<body class="([^"]*)">', content)
body_class = body_class_match.group(1) if body_class_match else "font-sans antialiased text-slate-900 bg-white"

# Extract body contents
body_start_match = re.search(r'<body[^>]*>', content)
body_start = body_start_match.end()
body_end = content.find('</body>')
body_content = content[body_start:body_end]

jsx_content = convert_to_jsx(body_content)

app_jsx = f"""import React, {{ useEffect }} from 'react';

export default function App() {{
  useEffect(() => {{
    // Add body classes
    document.body.className = "{body_class}";
    
    // Initialize apps logic
    if (window.loadPathFinder) window.loadPathFinder('P01');
    if (window.loadEntitiesAndInitCalculator) window.loadEntitiesAndInitCalculator();
    if (window.loadParameterAnalysis) window.loadParameterAnalysis();
    if (window.initDynamicVisGraph) window.initDynamicVisGraph();
  }}, []);

  return (
    <>
{jsx_content}
    </>
  );
}}
"""

with open('frontend/src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(app_jsx)

# Modify index.html of Vite
with open('frontend/index.html', 'r', encoding='utf-8') as f:
    vite_index = f.read()

# Insert head content before </head>
# Also add script tags for app.js and graph-vis.js
scripts = """
    <script src="/js/app.js"></script>
    <script src="/js/graph-vis.js"></script>
"""

new_head = head_content + scripts + "</head>"
vite_index = vite_index.replace("</head>", new_head)
vite_index = vite_index.replace("<title>Vite + React</title>", "<title>DEALGRAPH // KasirNusa Warm Intro Path Finder</title>")
# Add scroll-smooth to html tag
vite_index = vite_index.replace('<html lang="en">', '<html lang="en" class="scroll-smooth">')

with open('frontend/index.html', 'w', encoding='utf-8') as f:
    f.write(vite_index)

print("Conversion complete!")
