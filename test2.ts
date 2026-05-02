import * as cheerio from "cheerio";

async function test() {
  const res = await fetch("https://www.nhl.com/sv/news/");
  const text = await res.text();
  const $ = cheerio.load(text);
  
  const news: any[] = [];
  $('article, .nhl-c-article, .nhl-c-news__article, [class*="article"], [class*="story"]').each((i, el) => {
     const title = $(el).find('h1, h2, h3, h4, [class*="title"], [class*="headline"]').first().text().trim();
     const link = $(el).find('a').first().attr('href');
     if (title && link) {
       news.push({ title, link });
     }
  });
  console.log("Found", news.length, "items.");
  console.log(news.slice(0, 5));
}
test();
