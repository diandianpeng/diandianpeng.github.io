#!/usr/bin/env node
// Render cv/cv-print.html -> files/CV.pdf via headless Chrome + DevTools Protocol.
// The CDP route (rather than `chrome --print-to-pdf`) is what lets us add a custom
// running footer with "Page X of Y" on every page. Fonts embed automatically from
// Google Fonts, so run with a network connection.
//
// Usage:  node tools/render-cv.mjs [output.pdf]
//   default output: files/CV.pdf   (paths resolve from the repo root)

import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const HTML = `file://${ROOT}/cv/cv-print.html`;
const OUT = process.argv[2] ? resolve(process.argv[2]) : `${ROOT}/files/CV.pdf`;
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9223;
const PROFILE = `${ROOT}/tools/.chrome-cv-profile`;

const FOOTER = `<div style="font-size:8px;color:#5d6b7c;width:100%;margin:0 0.72in;
  display:flex;justify-content:space-between;font-family:Arial,Helvetica,sans-serif;">
  <span>Diandian Peng &middot; Curriculum Vitae</span>
  <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
</div>`;

const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  `--user-data-dir=${PROFILE}`, `--remote-debugging-port=${PORT}`,
], { stdio: 'ignore' });

try {
  // Wait for the DevTools endpoint.
  let version;
  for (let i = 0; i < 60; i++) {
    try { version = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json(); break; }
    catch { await sleep(200); }
  }
  if (!version) throw new Error('Chrome DevTools endpoint did not come up');

  const ws = new WebSocket(version.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

  let id = 0;
  const pending = new Map();
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
  };
  const send = (method, params = {}, sessionId) =>
    new Promise((res) => { const _id = ++id; pending.set(_id, res); ws.send(JSON.stringify({ id: _id, method, params, sessionId })); });

  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  await send('Page.enable', {}, sessionId);
  await send('Page.navigate', { url: HTML }, sessionId);
  await sleep(3000); // let webfonts load and lay out

  const { data } = await send('Page.printToPDF', {
    paperWidth: 8.5, paperHeight: 11,
    marginTop: 0.55, marginBottom: 0.6, marginLeft: 0.72, marginRight: 0.72,
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: FOOTER,
    preferCSSPageSize: false,
  }, sessionId);

  writeFileSync(OUT, Buffer.from(data, 'base64'));
  ws.close();
  console.log(`Wrote ${OUT}`);
} finally {
  chrome.kill();
  try { rmSync(PROFILE, { recursive: true, force: true }); } catch {}
}
