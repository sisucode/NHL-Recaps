import { parse } from "url";
async function test() {
  try {
    const res = await fetch("https://api-web.nhle.com/v1/search/news?culture=sv-se");
    if (!res.ok) {
       console.log("NOT OK", res.status);
       const res2 = await fetch("https://www.nhl.com/sv/news/");
       const text = await res2.text();
       console.log(text.substring(0, 500));
       return;
    }
    const data = await res.json();
    console.log(data);
  } catch (e) {
    console.error(e);
  }
}
test();
