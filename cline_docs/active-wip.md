## Host cards

[ ] Add a folder with 4 json files for the following podcast show hosts:
_ Guido X Jansen
_ As a cognitive psychologist and award-winning CRO specialist, Guido has worked with global e-commerce companies such as eBay, Heineken, Sara Lee, ING, Randstad, Sanoma and Jacobs Douwe Egberts to turn their data and insights into continuous business growth.
_ https://www.linkedin.com/in/gxjansen/
_ host of the NL and EN podcast
_ Ricardo Tayar
_ Flat 101 CEO, Especialista en UX, podcast host
_ https://www.linkedin.com/in/ricardotayar/en/?originalSubdomain=es
_ host of the ES podcast
_ Michael Witzenleiter
_ Michael ist CEO und Gründer von Conversion Maker, einem Technologie-Unternehmen für Conversion-Rate-Optimierung. Seit über 15 Jahren beschäftigt er sich mit Online Marketing – immer mit dem Fokus auf messbaren Ergebnissen.
_ https://de.linkedin.com/in/michael-witzenleiter-714a028
_ co-host of the DE podcast
_Yvonne Teufel
_ Als Conversion Rate Consultant unterstützte Yvonne zahlreiche Unternehmen dabei Daten auszuwerten und zu nutzen, um so das Online-Erlebnis von Kunden zu verbessern und den Geschäftserfolg nachhaltig zu steigern.
_ https://de.linkedin.com/in/yvonne-teufel-461768190
_ co-host of the DE podcast
[ ] Each host has a profile image, available in src/assets/images/hosts, add links to these in the json files
[ ] Add a new section to the homepage with the title "Meet the Hosts" and show the host cards in a row of 4
[ ] On each episode detail page, add a "Your host" section below the guest section. Use the same card layout as the guest cards.
[ ] Unlike the guests, we don't need a single detail page for each host
[ ] On the episode language pages, above the "Latest Episodes" component, add a component that shows the host information for that language. Note that in case of the German podcast, there are 2 hosts.

# Next tasks:

## Show total # episodes and # guests on homepage

## Popular Episodes (In Progress)

[ ] Get Episode statistics from Transistor
[ ] Figure out how/where to store this information
[ ] Add component to show popular episodes (on language landing pages)
[ ] add a sorting option to sort by popularity (on episode overview page)

## Transcripts (Pending)

[ ] If an episode transcript is missing, auto generate episode transcripts and upload to transistor
[ ] Show transcripts on our episode detail pages

## Episode Keywords (Pending)

[ ] Auto generate episode keywords based on transcripts
[ ] Show episode keywords on our episode detail pages

## Alternative Podcasts Component (Pending)

The CRO.CAFE podcast is in "hibernation" with reduced new episodes. To maintain value for visitors, we'll add a homepage component showing latest episodes from related podcasts:

- Experiment Nation (https://anchor.fm/s/3fc905b0/podcast/rss)
- No Hacks (https://feeds.buzzsprout.com/1677508.rss)
- From A to B (https://anchor.fm/s/e25e3fac/podcast/rss)
- Growth Minded Superheroes (https://anchor.fm/s/f9b332ac/podcast/rss)

# Next Steps:

1. Implement episode statistics from Transistor API
2. Design storage solution for popularity data
3. Create PopularEpisodes component
4. Add sorting functionality to episode overview

---
