import { Handler } from '@netlify/functions';
import { Octokit } from '@octokit/rest';
import { TransistorEpisodeSchema, convertTransistorEpisode } from '../../src/utils/transistor-api';
import { slugify } from '../../src/utils/utils';

const SHOW_LANGUAGES: Record<string, string> = {
  'cro-cafe': 'en',
  'cro-cafe-nl': 'nl',
  'cro-cafe-deutsch': 'de',
  'cro-cafe-es': 'es',
};

const GITHUB_REPO = {
  owner: 'gxjansen',
  repo: 'cro.cafe',
};

const handler: Handler = async (event) => {
  // Verify webhook signature (you should implement this)
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No body provided' }),
    };
  }

  try {
    const payload = JSON.parse(event.body);
    const episode = TransistorEpisodeSchema.parse(payload.data);
    const showId = episode.relationships.show.data.id;
    const language = SHOW_LANGUAGES[showId];

    if (!language) {
      throw new Error(`Unknown show ID: ${showId}`);
    }

    // Convert episode to our format
    const convertedEpisode = convertTransistorEpisode(episode);
    const episodeSlug = slugify(convertedEpisode.title);
    const filePath = `src/content/${language}-episodes/${episodeSlug}.json`;
    const content = JSON.stringify(convertedEpisode, null, 2);

    // Initialize Octokit
    if (!process.env.GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN environment variable is required');
    }
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    // Get the current commit SHA
    const { data: ref } = await octokit.git.getRef({
      ...GITHUB_REPO,
      ref: 'heads/main',
    });
    const commitSha = ref.object.sha;

    // Create or update the file in GitHub
    await octokit.repos.createOrUpdateFileContents({
      ...GITHUB_REPO,
      path: filePath,
      message: `${payload.event_type} episode: ${convertedEpisode.title}`,
      content: Buffer.from(content).toString('base64'),
      branch: 'main',
      sha: commitSha,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Episode updated successfully',
        episode: episodeSlug,
      }),
    };
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
    };
  }
};

export { handler };
