import { getImage } from 'astro:assets';
import type { APIRoute } from 'astro';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import OpenGraphImage from '../../../components/common/OpenGraphImage.astro';

export const GET: APIRoute = async ({ params }) => {
  const { type, title } = params;

  if (!type || !title) {
    return new Response('Missing required parameters', { status: 400 });
  }

  try {
    // Load the OpenGraphImage component
    const svg = await satori(
      OpenGraphImage({
        title: decodeURIComponent(title),
        type: type as 'episode' | 'guest' | 'quote',
      }),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter',
            data: await fetch('https://rsms.me/inter/font-files/Inter-Regular.woff').then((res) =>
              res.arrayBuffer()
            ),
            weight: 400,
            style: 'normal',
          },
        ],
      }
    );

    // Convert SVG to PNG
    const resvg = new Resvg(svg);
    const png = resvg.render();

    return new Response(png.asPng(), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    return new Response('Failed to generate image', { status: 500 });
  }
};
