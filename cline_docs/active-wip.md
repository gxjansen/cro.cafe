# Recently Completed:

## Episode Detail Page ✓

[x] Implemented separate divs for summary and clean_description
[x] Added conditional rendering to only show fields with content
[x] Improved layout and spacing

## Episode Cards ✓

[x] Fixed outline issues on click
[x] Made all cards same height using flex layout
[x] Improved focus states for better accessibility

## Guest Integration ✓

[x] Connected guest data from src/content/[lang]-guests/[guest].json
[x] Added guest extraction from episode descriptions
[x] Created GuestCard component for consistent display
[x] Added guest section to episode detail pages
[x] Created guest detail pages at /guest/[slug]
[x] Implemented guest pages with:
_ Name, role, bio, and profile picture
_ Social links
_ List of episodes featuring the guest
_ English-only pages without language prefix

# Current Focus:

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
