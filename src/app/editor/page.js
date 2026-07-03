'use client';
import React, { useState } from 'react';
import styles from './editor.module.css';

export default function EditorLayout() {
  const [terminalHeight, setTerminalHeight] = useState(250);

  return (
    <div className={styles.container}>
      <div className={styles.mainArea}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <span>Explorer</span>
          </div>
          <div className={styles.fileTree}>
            <div className={styles.fileItem}>
              <span className={styles.icon}>📄</span> page.js
            </div>
            <div className={styles.fileItem}>
              <span className={styles.icon}>📄</span> layout.js
            </div>
            <div className={styles.fileItem}>
              <span className={styles.icon}>🎨</span> globals.css
            </div>
          </div>
        </aside>

        {/* Editor */}
        <main className={styles.editor}>
          <div className={styles.tabs}>
            <div className={`${styles.tab} ${styles.activeTab}`}>page.js</div>
            <div className={styles.tab}>layout.js</div>
          </div>
          <div className={styles.editorContent}>
            <pre>
              <code>
<span className={styles.comment}>{'// Welcome to the Editor'}</span>{'\n'}
<span className={styles.keyword}>function</span> <span className={styles.function}>helloWorld</span>() {'{\n'}
  console.<span className={styles.function}>log</span>(<span className={styles.string}>"Hello, World!"</span>);{'\n'}
{'}\n\n'}
<span className={styles.function}>helloWorld</span>();
              </code>
            </pre>
          </div>
        </main>
      </div>

      {/* Terminal */}
      <footer className={styles.terminal} style={{ height: terminalHeight }}>
        <div className={styles.terminalHeader}>
          <span>Terminal</span>
          <div className={styles.terminalActions}>
             <button className={styles.iconBtn}>✕</button>
          </div>
        </div>
        <div className={styles.terminalContent}>
          <div className={styles.prompt}>
            <span className={styles.path}>~/project</span>$ pnpm run dev
          </div>
          <div className={styles.output}>
            <span style={{ color: '#c3e88d' }}>ready</span> - started server on 0.0.0.0:3000, url: http://localhost:3000
          </div>
        </div>
      </footer>
    </div>
  );
}
