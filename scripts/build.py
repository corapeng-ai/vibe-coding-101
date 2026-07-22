#!/usr/bin/env python3
"""
Slide Deck Builder Script
Assembles modular slide files from `slides/*.html` into `index.html`.
"""

import os
import glob

TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Vibe Coding 101 — Lunatechs Singapore</title>
  <meta name="description" content="Building Your First App with AI Starts Here">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" id="theme" href="css/theme.css">
  <link rel="stylesheet" href="css/deck.css">
</head>
<body>
  <div id="stage">
    <div class="bg" id="bg"></div>
    <div class="grain"></div>
    <div class="motes" id="motes"></div>
    <div class="confetti" id="confetti"></div>
    <div class="deck">
{SLIDES_CONTENT}
    </div>
    <div class="brandmark"><span class="wm"><span style="color:#fff">luna</span><span style="color:var(--blue)">techs</span></span></div>
    <button class="fab" id="fab" aria-label="Deck controls"></button>
    <div class="menu" id="menu">
      <div class="wm"><span style="color:#fff">luna</span><span style="color:var(--blue)">techs</span> &middot; Vibe Coding 101</div>
      <div class="prog"><div class="bar"><span id="barfill"></span></div><div class="count" id="count">1 / 1</div></div>
      <div class="acts">
        <button class="act" data-act="prev" aria-label="Previous">&lsaquo;</button>
        <button class="act" data-act="next" aria-label="Next">&rsaquo;</button>
        <button class="act" data-act="edit" aria-label="Edit text" title="Edit text (E)">&#x270E;</button>
        <button class="act" data-act="full" aria-label="Fullscreen">&#x26F6;</button>
        <button class="act" data-act="print" aria-label="Print">&#x2399;</button>
      </div>
      <div class="nav" id="nav"></div>
    </div>
  </div>

  <script src="js/deck.js"></script>
</body>
</html>
"""

def build_deck():
    project_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    slides_dir = os.path.join(project_dir, 'slides')
    output_file = os.path.join(project_dir, 'index.html')

    slide_files = sorted(glob.glob(os.path.join(slides_dir, '*.html')))
    slides_html = []

    for sf in slide_files:
        with open(sf, 'r', encoding='utf-8') as f:
            slides_html.append(f.read().strip())

    slides_combined = '\n\n'.join(slides_html)
    final_html = TEMPLATE.replace('{SLIDES_CONTENT}', slides_combined)

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(final_html + '\n')

    print(f"Successfully assembled {len(slide_files)} slides into index.html ({len(final_html)} bytes)")

if __name__ == '__main__':
    build_deck()
