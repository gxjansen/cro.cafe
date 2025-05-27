import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';

export const prerender = false;

interface OpenGraphImageProps {
  title: string;
  subtitle?: string;
  type: 'episode' | 'guest' | 'quote';
}

// Create JSX element for Satori without TypeScript JSX issues
const createOpenGraphImage = ({ title, subtitle = '', type }: OpenGraphImageProps) => {
  return {
    type: 'div',
    props: {
      style: {
        width: '1200px',
        height: '630px',
        background: '#1a1a1a',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        padding: '60px',
        position: 'relative',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    height: '40px',
                    width: '120px',
                    background: '#ff6b35',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '18px',
                  },
                  children: 'CRO.CAFE',
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    marginLeft: '20px',
                    paddingLeft: '20px',
                    borderLeft: '2px solid #666',
                  },
                  children: {
                    type: 'span',
                    props: {
                      style: {
                        textTransform: 'uppercase',
                        color: '#666',
                        fontSize: '16px',
                      },
                      children: type,
                    },
                  },
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: {
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            },
            children: [
              {
                type: 'h1',
                props: {
                  style: {
                    fontSize: '64px',
                    lineHeight: 1.2,
                    margin: 0,
                    fontWeight: 'bold',
                  },
                  children: title,
                },
              },
              ...(subtitle
                ? [
                    {
                      type: 'p',
                      props: {
                        style: {
                          fontSize: '32px',
                          margin: '20px 0 0',
                          color: '#666',
                        },
                        children: subtitle,
                      },
                    },
                  ]
                : []),
            ],
          },
        },
      ],
    },
  };
};

export const get = async ({ params }: { params: { type: string; title: string } }) => {
  const { type, title } = params;

  if (!type || !title) {
    return new Response('Missing required parameters', { status: 400 });
  }

  try {
    // Generate SVG using Satori
    const svg = await satori(
      createOpenGraphImage({
        title: decodeURIComponent(title),
        type: type as 'episode' | 'guest' | 'quote',
      }) as any,
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
    console.error('Failed to generate OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
};
