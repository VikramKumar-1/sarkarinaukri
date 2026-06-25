import type { APIRoute } from 'astro';

export const prerender = false;

// POST request handles the actual scraping trigger
export const POST: APIRoute = async () => {
  // The scraper relies on Node.js built-in modules (fs, path, url) and is only supported locally
  if (!import.meta.env.DEV) {
    return new Response(
      JSON.stringify({
        success: false,
        message: 'The RSS Scraper can only be run locally in development mode (npm run dev).',
      }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const scraperPath = '../../../scripts/scraper.js';
    // Dynamic import with @vite-ignore prevents the bundler from packaging the Node script into Cloudflare Workers
    const { scrapeLatestJobs } = await import(/* @vite-ignore */ scraperPath);
    const result = await scrapeLatestJobs();
    
    if (result.success) {
      const added = result.added ?? 0;
      const skipped = result.skipped ?? 0;
      
      let message = 'Scraping completed successfully.';
      if (added > 0 || skipped > 0) {
        message = `Successfully completed scraping! Added ${added} new job posts, and skipped ${skipped} duplicate posts.`;
      } else if (result.message) {
        message = result.message;
      }
      
      return new Response(
        JSON.stringify({
          success: true,
          message,
          added,
          skipped,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: result.error || 'Failed to complete job scraping operation.',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || 'An unexpected error occurred during the scraping process.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

// GET request support as a fallback trigger
export const GET = POST;
