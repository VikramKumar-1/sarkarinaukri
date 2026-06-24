import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import fs from 'fs';
import { execSync } from 'child_process';

function remarkModifiedTime() {
  return function (tree, file) {
    const filepath = file.history[0];
    let mtime;
    try {
      // Try to get exact Git commit time first (best for production)
      const gitTime = execSync(`git log -1 --pretty="format:%cI" "${filepath}"`, { encoding: 'utf-8' }).trim();
      if (gitTime) {
        mtime = new Date(gitTime);
      } else {
        throw new Error('Not in git yet');
      }
    } catch (e) {
      // Fallback: get exact file save time on hard drive (perfect for local Keystatic saves)
      mtime = fs.statSync(filepath).mtime;
    }
    // Inject the exact time the file was saved into the website data
    file.data.astro.frontmatter.lastModified = mtime.toISOString();
  };
}

export default defineConfig({
  site: 'https://www.sarkariresult.com', /* Change this to your real domain when launching */
  output: 'hybrid',
  prefetch: true, /* Instantly preloads links when user hovers over them */
  integrations: [
    react(),
    markdoc(),
    keystatic()
  ],
  markdown: {
    remarkPlugins: [remarkModifiedTime],
  },
  redirects: {
    '/admin': '/keystatic'
  }
});
