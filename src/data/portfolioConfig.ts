export interface PortfolioImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface PortfolioPageConfig {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  heroImage?: string;
  category: string;
  date?: string;
  location?: string;
  equipment?: string[];
  images: PortfolioImage[];
  gridLayout?: 'masonry' | 'grid' | 'slider';
  showImageNumbers?: boolean;
  showCaptions?: boolean;
  backgroundColor?: string;
  imageCount?: number;
}

// Portfolio configurations - easy to edit and duplicate
export const portfolioConfigs: Record<string, PortfolioPageConfig> = {
  lifestyle: {
    id: 'lifestyle',
    title: 'Lifestyle Photography',
    subtitle: 'Authentic Life Moments',
    description: 'Capturing genuine moments and natural beauty in everyday life, from quiet morning rituals to family connections.',
    category: 'Lifestyle',
    date: '2024',
    location: 'Various locations',
    equipment: ['Canon EOS R6', '35mm f/1.4', '85mm f/1.8'],
    gridLayout: 'masonry',
    showImageNumbers: false,
    showCaptions: false,
    images: [
      {
        id: 'lifestyle-1',
        src: 'https://picsum.photos/400/500?random=40',
        alt: 'Morning Coffee',
        caption: 'Quiet moments of daily ritual',
        width: 400,
        height: 500
      },
      {
        id: 'lifestyle-2',
        src: 'https://picsum.photos/400/600?random=41',
        alt: 'Family Time',
        caption: 'Authentic connections at home',
        width: 400,
        height: 600
      },
      {
        id: 'lifestyle-3',
        src: 'https://picsum.photos/400/450?random=42',
        alt: 'Urban Explorer',
        caption: 'City life and personal style',
        width: 400,
        height: 450
      },
      {
        id: 'lifestyle-4',
        src: 'https://picsum.photos/400/550?random=43',
        alt: 'Weekend Escape',
        caption: 'Leisure and natural beauty',
        width: 400,
        height: 550
      },
      {
        id: 'lifestyle-5',
        src: 'https://picsum.photos/400/480?random=44',
        alt: 'Creative Process',
        caption: 'Artists in their element',
        width: 400,
        height: 480
      },
      {
        id: 'lifestyle-6',
        src: 'https://picsum.photos/400/520?random=45',
        alt: 'Golden Hour',
        caption: 'Natural light and genuine emotion',
        width: 400,
        height: 520
      }
    ]
  },

  weddings: {
    id: 'weddings',
    title: 'Wedding Photography',
    subtitle: 'Love Stories Captured',
    description: 'Documenting the most important day of your life with emotion, elegance, and timeless beauty.',
    heroImage: 'https://picsum.photos/1200/600?random=wedding-hero',
    category: 'Weddings',
    date: '2023-2024',
    location: 'Multiple venues',
    equipment: ['Canon EOS R5', '24-70mm f/2.8', '85mm f/1.4', '70-200mm f/2.8'],
    gridLayout: 'masonry',
    showImageNumbers: false,
    showCaptions: true,
    backgroundColor: '#fefefe',
    images: [
      {
        id: 'wedding-1',
        src: 'https://picsum.photos/600/800?random=50',
        alt: 'Bridal portrait',
        caption: 'Beautiful bridal portrait in natural light',
        width: 600,
        height: 800
      },
      {
        id: 'wedding-2',
        src: 'https://picsum.photos/800/600?random=51',
        alt: 'Ceremony moment',
        caption: 'The moment of "I do"',
        width: 800,
        height: 600
      },
      {
        id: 'wedding-3',
        src: 'https://picsum.photos/500/700?random=52',
        alt: 'Wedding rings',
        caption: 'Symbol of eternal love',
        width: 500,
        height: 700
      },
      {
        id: 'wedding-4',
        src: 'https://picsum.photos/700/900?random=53',
        alt: 'First dance',
        caption: 'Dancing into forever',
        width: 700,
        height: 900
      },
      {
        id: 'wedding-5',
        src: 'https://picsum.photos/600/400?random=54',
        alt: 'Wedding party',
        caption: 'Surrounded by love and laughter',
        width: 600,
        height: 400
      },
      {
        id: 'wedding-6',
        src: 'https://picsum.photos/800/700?random=55',
        alt: 'Reception celebration',
        caption: 'Celebrating love with family and friends',
        width: 800,
        height: 700
      }
    ]
  },

  sports: {
    id: 'sports',
    title: 'Sports Photography',
    subtitle: 'Athletic Excellence',
    description: 'Capturing the intensity, emotion, and peak moments of athletic performance across various sports.',
    category: 'Sports',
    gridLayout: 'grid',
    showImageNumbers: true,
    showCaptions: true,
    images: [
      {
        id: 'sports-1',
        src: 'https://picsum.photos/800/600?random=60',
        alt: 'Basketball action',
        caption: 'Game-winning shot in the final seconds',
        width: 800,
        height: 600
      },
      {
        id: 'sports-2',
        src: 'https://picsum.photos/600/800?random=61',
        alt: 'Soccer player',
        caption: 'Precision and power in motion',
        width: 600,
        height: 800
      },
      {
        id: 'sports-3',
        src: 'https://picsum.photos/700/500?random=62',
        alt: 'Tennis serve',
        caption: 'Perfect form captured at the decisive moment',
        width: 700,
        height: 500
      },
      {
        id: 'sports-4',
        src: 'https://picsum.photos/900/600?random=63',
        alt: 'Swimming competition',
        caption: 'Breaking through the water with determination',
        width: 900,
        height: 600
      }
    ]
  }
};