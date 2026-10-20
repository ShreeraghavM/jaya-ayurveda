import fs from 'fs';

const sthanas = [
  { name: 'Sutra Sthana', url: 'https://www.carakasamhitaonline.com/index.php?title=Sutra_Sthana', id: 'sutra-sthana' },
  { name: 'Nidana Sthana', url: 'https://www.carakasamhitaonline.com/index.php?title=Nidana_Sthana', id: 'nidana-sthana' },
  { name: 'Vimana Sthana', url: 'https://www.carakasamhitaonline.com/index.php?title=Vimana_Sthana', id: 'vimana-sthana' },
  { name: 'Sharira Sthana', url: 'https://www.carakasamhitaonline.com/index.php?title=Sharira_Sthana', id: 'sharira-sthana' },
  { name: 'Indriya Sthana', url: 'https://www.carakasamhitaonline.com/index.php?title=Indriya_Sthana', id: 'indriya-sthana' },
  { name: 'Chikitsa Sthana', url: 'https://www.carakasamhitaonline.com/index.php?title=Chikitsa_Sthana', id: 'chikitsa-sthana' },
  { name: 'Kalpa Sthana', url: 'https://www.carakasamhitaonline.com/index.php?title=Kalpa_Sthana', id: 'kalpa-sthana' },
  { name: 'Siddhi Sthana', url: 'https://www.carakasamhitaonline.com/index.php?title=Siddhi_Sthana', id: 'siddhi-sthana' },
];

async function analyzeAll() {
  const results = [];
  for (const s of sthanas) {
    try {
      console.log(`Fetching ${s.name}...`);
      const res = await fetch(s.url);
      const html = await res.text();
      
      // Extract headlines/sections
      const headlines = [...html.matchAll(/<span class="mw-headline"[^>]*>(.*?)<\/span>/gi)]
        .map(m => m[1].replace(/<[^>]+>/g, '').trim())
        .filter(h => !['References', 'See also', 'External links'].includes(h));

      // Extract first few paragraphs (lead summary)
      const paragraphs = [...html.matchAll(/<p>([\s\S]*?)<\/p>/gi)]
        .map(m => m[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim())
        .filter(p => p.length > 40);

      const leadSummary = paragraphs.slice(0, 3).join(' ');

      results.push({
        id: s.id,
        name: s.name,
        url: s.url,
        headlines,
        leadSummary: leadSummary.slice(0, 800)
      });
    } catch (err) {
      console.error(`Error fetching ${s.name}:`, err.message);
    }
  }

  fs.writeFileSync('scripts/sthana_analysis.json', JSON.stringify(results, null, 2));
  console.log('Analysis completed! Saved to scripts/sthana_analysis.json');
}

analyzeAll().catch(console.error);
