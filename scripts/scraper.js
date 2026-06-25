import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import TurndownService from 'turndown';
import { tables } from 'turndown-plugin-gfm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const turndownService = new TurndownService({ headingStyle: 'atx' });
turndownService.use(tables);

// Using Sarkari Result's Secret RSS Feed instead of HTML
const RSS_FEED_URL = 'https://www.sarkariresult.com/feed/';
const JOBS_DIR = path.join(__dirname, '../src/content/jobs/latest');

if (!fs.existsSync(JOBS_DIR)) {
  fs.mkdirSync(JOBS_DIR, { recursive: true });
}

export async function scrapeLatestJobs() {
  console.log('Fetching Latest Jobs from Sarkari Result RSS Feed...');
  try {
    const { data } = await axios.get(RSS_FEED_URL);
    // Parse the RSS XML cleanly
    const $ = cheerio.load(data, { xmlMode: true });

    const jobLinks = [];
    $('item').each((i, el) => {
      const link = $(el).find('link').text();
      // Ensure it's a real job post, not a generic page
      if (link && link.includes('sarkariresult.com/')) {
        jobLinks.push(link);
      }
    });

    if (jobLinks.length === 0) {
      console.log('No jobs found in feed.');
      return { success: true, added: 0, skipped: 0, message: 'No jobs found in feed.' };
    }

    // Grab the 3 most recent absolute latest jobs
    const latestThree = jobLinks.slice(0, 3);
    let added = 0;
    let skipped = 0;
    
    for (const link of latestThree) {
      const status = await scrapeJobDetails(link);
      if (status === 'added') {
        added++;
      } else if (status === 'skipped') {
        skipped++;
      }
    }

    return { success: true, added, skipped };

  } catch (error) {
    console.error('Error fetching RSS feed:', error.message);
    return { success: false, error: error.message };
  }
}

export async function scrapeJobDetails(url) {
  console.log(`Scraping Job Data: ${url}`);
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const title = $('title').text().split('|')[0].trim() || 'New Job Post';
    
    let slug = url.split('/').filter(Boolean).pop().replace('.php', '') + '.md';
    if (!slug || slug === '.md') {
      slug = `job-${Date.now()}.md`;
    }

    const filePath = path.join(JOBS_DIR, slug);
    if (fs.existsSync(filePath)) {
      console.log(`Job already exists: ${slug}, skipping...`);
      return 'skipped';
    }

    // WordPress tables extraction
    let allTablesHtml = '';
    $('table').each((i, el) => {
       allTablesHtml += `<table>${$(el).html()}</table><br/>`;
    });
    
    let markdownContent = '';
    if (allTablesHtml.length > 10) {
      markdownContent = turndownService.turndown(allTablesHtml);
    } else {
      markdownContent = "Could not parse table content automatically. Please review and copy manually if needed.";
    }

    // --- SMART TEMPLATES SYSTEM ---
    const templates = [
      `The official notification for ${title} has been released. Candidates can apply online starting from the dates mentioned below. Please read the full notification before applying.`,
      `Are you looking for ${title} jobs? The recruitment process has officially started. Check the eligibility, vacancy details, and application fees in the tables below.`,
      `A new recruitment drive for ${title} is now active. All interested and eligible candidates are advised to check the important dates and apply online.`,
      `Good news for job seekers! The application process for ${title} has begun. Make sure to review the age limits and vacancy details before submitting your form.`,
      `Complete details for the ${title} recruitment are now available. Review the syllabus, application fee, and important dates below to start your application.`
    ];
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

    const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
postDate: "${new Date().toISOString().split('T')[0]}"
shortInfo: "${randomTemplate.replace(/"/g, '\\"')}"
category: "latest-jobs"
---

> **Note:** This job was automatically fetched from ${url}.

${markdownContent}
`;

    fs.writeFileSync(filePath, frontmatter, 'utf-8');
    console.log(`Successfully saved: ${slug}`);
    return 'added';

  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    throw error;
  }
}

// Only auto-execute if run directly from the CLI
const isMain = process.argv[1] && __filename === path.resolve(process.argv[1]);
if (isMain) {
  scrapeLatestJobs();
}
