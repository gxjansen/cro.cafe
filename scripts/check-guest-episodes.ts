import { getCollection } from 'astro:content';

async function checkGuestEpisodes() {
  console.log('Checking for episodes with Julian Kleinknecht...');
  
  // Get all German episodes
  const deEpisodes = await getCollection('de-episodes');
  console.log(`Total German episodes: ${deEpisodes.length}`);
  
  // Check each episode for mentions of Julian Kleinknecht
  for (const episode of deEpisodes) {
    const description = episode.data.attributes.description || '';
    const title = episode.data.attributes.title || '';
    
    // Check if Julian Kleinknecht is mentioned in the title or description
    if (
      title.includes('Julian') || 
      title.includes('Kleinknecht') || 
      description.includes('Julian') || 
      description.includes('Kleinknecht')
    ) {
      console.log('Found potential match:');
      console.log(`Episode ID: ${episode.id}`);
      console.log(`Title: ${title}`);
      console.log(`Description excerpt: ${description.substring(0, 100)}...`);
      console.log('---');
    }
    
    // Check guests array if it exists
    const guests = episode.data.attributes.guests || [];
    for (const guest of guests) {
      if (
        (guest.name && (
          guest.name.includes('Julian') || 
          guest.name.includes('Kleinknecht')
        )) ||
        (guest.slug && (
          guest.slug.includes('julian') || 
          guest.slug.includes('kleinknecht')
        ))
      ) {
        console.log('Found in guests array:');
        console.log(`Episode ID: ${episode.id}`);
        console.log(`Guest: ${JSON.stringify(guest)}`);
        console.log('---');
      }
    }
  }
  
  // Also check English episodes
  const enEpisodes = await getCollection('en-episodes');
  console.log(`Total English episodes: ${enEpisodes.length}`);
  
  // Check each episode for mentions of Julian Kleinknecht
  for (const episode of enEpisodes) {
    const description = episode.data.attributes.description || '';
    const title = episode.data.attributes.title || '';
    
    // Check if Julian Kleinknecht is mentioned in the title or description
    if (
      title.includes('Julian') || 
      title.includes('Kleinknecht') || 
      description.includes('Julian') || 
      description.includes('Kleinknecht')
    ) {
      console.log('Found potential match in English episodes:');
      console.log(`Episode ID: ${episode.id}`);
      console.log(`Title: ${title}`);
      console.log(`Description excerpt: ${description.substring(0, 100)}...`);
      console.log('---');
    }
    
    // Check guests array if it exists
    const guests = episode.data.attributes.guests || [];
    for (const guest of guests) {
      if (
        (guest.name && (
          guest.name.includes('Julian') || 
          guest.name.includes('Kleinknecht')
        )) ||
        (guest.slug && (
          guest.slug.includes('julian') || 
          guest.slug.includes('kleinknecht')
        ))
      ) {
        console.log('Found in guests array of English episodes:');
        console.log(`Episode ID: ${episode.id}`);
        console.log(`Guest: ${JSON.stringify(guest)}`);
        console.log('---');
      }
    }
  }
}

// Run the function
checkGuestEpisodes().catch(console.error);