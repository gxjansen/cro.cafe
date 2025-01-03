# Initial Project briefing

In the workspace, you find an Astro 5.0 website, with a template (based on Tailwind).

My end goal is to migrate 4 different websites to a single website. Your challanges, as very experienced website architect is to create an plan for a junior software developer to implement this project. You will add your implementation-plan.md file to the /project folder. This document should contain an overview of the implementation steps as a checklist divided into sections. Each sections should show verifiable (by the user of through software tests) validation checks that are required to complete the section. For each section you can create an additional specialist file with detailed information and instructions for the junior developer.

Use the MCP tools at your disposal to do research, mainly 'astro-docs'

## General information about the CRO.CAFE podcast:
* Each language podcast has it's own unique RSS feed we can use to pull episode data from (see above). The descriptions are all in their native language.
* The content is mostly interviews with people from the CRO.CAFE community. Each episode has one or 2 different guests.
* Each feed consists of unique content, these are not translations of the same episodes (maybe something we can offer in the future, but not now)

### The 4 websites & podcast shows:
* https://www.cro.cafe/ (English) - https://feeds.transistor.fm/cro-cafe - https://www.cro.cafe/sitemap.xml
* https://nl.cro.cafe/ (Dutch) - https://feeds.transistor.fm/cro-cafe-nl - https://nl.cro.cafe/sitemap.xml
* https://de.cro.cafe/ (German) - https://feeds.transistor.fm/cro-cafe-deutsch - https://de.cro.cafe/sitemap.xml
* https://es.cro.cafe/ (Spanish) - https://feeds.transistor.fm/cro-cafe-es - https://es.cro.cafe/sitemap.xml

## Similarities between the current websites:
* Design and structure:
  - Homepage 
  - Episodes
  - Guests
  - Subscribe
* Search functionality to search through episode descriptions
* Host(s): feature a short intro of the podcast host on each episode page
* Quotes: section on the homepage, featuring quotes from listeners. There is overlap in between the sites: some quotes have been translated, but are essentially the same quote.
* Brand listeners: the (people from) brands that listen to the podcast. There is overlap in between the sites: we show the same brands across different languages.

## Differences between the current websites and podcast feeds/languages:
* Language: Each website is in it's own native language
* Hosts: Each podcast show is hosted by a different person. For all episodes within a langiage show, this is mostly the same person or persons (2 hosts max), but there can be different hosts for different episodes.
* Guests: Each language version has different guests. Some guests can appear in multiple episodes and even in multiple shows.
* Platforms: The Podcast apps people can use to subscribe to. For each of the 4 shows, there can be up to 24 different apps, each with their own unique landingpage for each show. E.g.: for Spotify, we will have 4 different links that people can use to subscribe to each language feed opf the podcast. This needs to presented in a way that makes sense to the user, and is easy to find.
* The English variant of the current website also featured an events and books section, that can be ignored and will not be transferred to the new website.

## Data
* The current website data can be found in project/current site data, each language/show has it's own folder.
* There will be overlap in data between the RSS feed and the data in project/current site data like the title and description of the episode. I think moving forward, we can use the RSS feed data as the base, and add the extra data from the project/current site data.

## Follow the standards set out for this project:
* project/design-standards.md
* project/accessibility-checklist.md

## Project challenges we need to figure out before implementation:
* How to merge the different websites into one project? How to merge 4 languages and 4 separate podcast shows into a single interface/overview that makes sense to users? Some users might only be interested in one language, while others might be interested in two or even more language feeds.
* In some of the CSV files, there are columns for pictures/images URLs. We need those pictures, but we can't keep fetching them from those URLs, so these will all need to be imported into the project.
* Should we show all podcast shows/episodes in a single feed on an English page? Or create separate landingpages for each website? Or do both? We need to think of what makes sense to both the users and Search Engines.
* How to transfer the data from the different websites?
* Do we still want to create unique pages for each episode and fro each guest? We do have that on the current website, it's great for SEO and findability, but potentially also a lot of work to transfer and link to the right RSS feed episode and guest. Basically the RSS feed information can form the basis of the episode page, but we need to figure out if and how to enrich that with the guest information and potential extra episode information that is not available through the RSS feed
* If we merge all feeds (that are in 4 different languages) into a single overview, how to handle the different languages? Should we do translations?
* How to handle redirects from these 4 sites to the new site? If we use landing pages for each language, do we put those on the same www. domain, or do we but them each on their own subdomain (as they are now)? We can use Netlify services for redirects.
* Should we use the default embed player from the podcast host (Transistor.FM) or should we create our own player?

## Other relevant information:
* No need to worry about timelines, transition period or analytics & tracking. I'm the owner of the podcast, so I can do that myself and we can switch the sites whenever we are ready.
* No need to worry about a Content management afterwards, but of course we do need to figure out how to handle multiple languages and translations (if we decide to do that)
* This project will be deployed to Netlify as a static site
* If we can somehow cache the data from the RSS feeds, that would be great. Episodes come out maybe once a week, so we really don't need realtime updates.