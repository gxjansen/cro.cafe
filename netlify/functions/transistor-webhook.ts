import { Handler, HandlerEvent } from '@netlify/functions';
import { Octokit } from '@octokit/rest';
import { createHmac } from 'crypto';

interface TransistorWebhookPayload {
  event: string;
  episode: {
    id: string;
    type: 'episode';
    attributes: {
      title: string;
      status: string;
      published_at: string;
      updated_at: string;
    };
  };
}

// Initialize GitHub client
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// Verify webhook signature
function verifySignature(signature: string | undefined, body: string): boolean {
  if (!signature || !process.env.TRANSISTOR_WEBHOOK_SECRET) return false;

  const hmac = createHmac('sha256', process.env.TRANSISTOR_WEBHOOK_SECRET);
  const expectedSignature = hmac.update(body).digest('hex');

  // Use constant-time string comparison to prevent timing attacks
  if (signature.length !== expectedSignature.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < signature.length; i++) {
    result |= signature.charCodeAt(i) ^ expectedSignature.charCodeAt(i);
  }
  return result === 0;
}

export const handler: Handler = async (event: HandlerEvent) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    // Verify webhook signature
    const signature = event.headers['x-transistor-signature'];
    if (!verifySignature(signature, event.body || '')) {
      return {
        statusCode: 401,
        body: 'Invalid signature',
      };
    }

    // Parse webhook payload
    const payload = JSON.parse(event.body || '{}') as TransistorWebhookPayload;
    const { event: eventType } = payload;

    // Only process episode events
    if (!eventType.startsWith('episode.')) {
      return {
        statusCode: 200,
        body: 'Event ignored',
      };
    }

    // Trigger GitHub Action to sync episodes
    await octokit.repos.createDispatchEvent({
      owner: process.env.GITHUB_OWNER || '',
      repo: process.env.GITHUB_REPO || '',
      event_type: 'transistor-webhook',
      client_payload: {
        event: eventType,
        episode: payload.episode,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Sync triggered' }),
    };
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
