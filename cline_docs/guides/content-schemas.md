# Content Schemas

## Episode

- **title**: string
- **description**: string
- **date**: date
- **duration**: number (minutes)
- **audio_url**: string
- **transcript_url**: string
- **guests**: array of references to People
- **platforms**: array of references to Platforms
- **quotes**: array of references to Quotes

## Person

- **name**: string
- **role**: string
- **bio**: string
- **image_url**: string
- **social_links**: array of objects
  - platform: string
  - url: string

## Platform

- **name**: string
- **description**: string
- **url**: string
- **icon_url**: string

## Quote

- **text**: string
- **author**: reference to Person
- **episode**: reference to Episode
- **timestamp**: number (seconds)

## Brand Listener

- **name**: string
- **logo_url**: string
- **description**: string
- **website_url**: string
