
import { Sermon, Story, Quiz, Music, Devotional, BibleVersion, BibleVerse, IntercessoryScripture, BibleStudyPlan, Testimony } from './types';

export const INITIAL_SERMONS: Sermon[] = [
  {
    id: '1',
    title: 'Finding Purpose in the Chaos',
    content: 'A powerful message about navigating teenage years with faith and clarity. Learn how to listen for God\'s voice in a noisy world.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    author: 'Pastor John Smith',
    date: '2024-05-01'
  },
  {
    id: '2',
    title: 'Strength Through Vulnerability',
    content: 'Understanding that being open about your struggles is where true strength lies. A deep dive into Paul\'s teachings on weakness.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    author: 'Sarah Jenkins',
    date: '2024-05-10'
  }
];

export const INITIAL_MUSIC: Music[] = [
  {
    id: 'm1',
    title: 'Morning Light',
    artist: 'Zion Vibes',
    url: '#',
    thumbnailUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=400&h=400',
    category: 'Worship'
  },
  {
    id: 'm2',
    title: 'Street Wise Soul',
    artist: 'Kingdom Crew',
    url: '#',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253361-bee8a48790c3?auto=format&fit=crop&q=80&w=400&h=400',
    category: 'Hip-Hop'
  }
];

export const DAILY_DEVOTIONAL: Devotional = {
  id: 'd1',
  title: 'Walking in Boldness',
  verse: 'Joshua 1:9 - "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go."',
  content: 'Being a teen today requires a special kind of courage. It’s not about the absence of fear, but the presence of faith. When you feel overwhelmed by expectations, social pressure, or uncertainty, remember that God has already equipped you with His Spirit. You don\'t walk alone.',
  prayer: 'Father, help me to stand firm today. Let Your peace rule my heart and Your strength guide my steps. Give me the words to speak and the wisdom to know when to listen. Amen.'
};

export const BIBLE_VERSIONS: BibleVersion[] = [
  { id: 'niv', name: 'New International Version', abbreviation: 'NIV' },
  { id: 'kjv', name: 'King James Version', abbreviation: 'KJV' },
  { id: 'esv', name: 'English Standard Version', abbreviation: 'ESV' },
  { id: 'nlt', name: 'New Living Translation', abbreviation: 'NLT' }
];

export const MOCK_BIBLE_CONTENT: Record<string, BibleVerse[]> = {
  'niv': [
    { reference: 'Psalm 23:1', text: 'The Lord is my shepherd, I lack nothing.' },
    { reference: 'John 3:16', text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.' },
    { reference: 'Philippians 4:13', text: 'I can do all this through him who gives me strength.' },
    { reference: 'Isaiah 41:10', text: 'So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.' },
    { reference: 'Jeremiah 29:11', text: 'For I know the plans I have for you,” declares the Lord, “plans to prosper you and not to harm you, plans to give you hope and a future.' },
    { reference: 'Romans 8:28', text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.' },
    { reference: 'Matthew 11:28', text: 'Come to me, all you who are weary and burdened, and I will give you rest.' }
  ],
  'kjv': [
    { reference: 'Psalm 23:1', text: 'The Lord is my shepherd; I shall not want.' },
    { reference: 'John 3:16', text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.' },
    { reference: 'Philippians 4:13', text: 'I can do all things through Christ which strengtheneth me.' },
    { reference: 'Psalm 46:1', text: 'God is our refuge and strength, a very present help in trouble.' }
  ]
};

export const INTERCESSORY_SCRIPTURES: IntercessoryScripture[] = [
  { id: 'i1', theme: 'Healing', reference: 'Jeremiah 17:14', text: 'Heal me, Lord, and I will be healed; save me and I will be saved, for you are the one I praise.' },
  { id: 'i2', theme: 'Protection', reference: 'Psalm 91:1-2', text: 'Whoever dwells in the shelter of the Most High will rest in the shadow of the Almighty. I will say of the Lord, "He is my refuge and my fortress, my God, in whom I trust."' },
  { id: 'i3', theme: 'Guidance', reference: 'Proverbs 3:5-6', text: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.' }
];

// Updated to Ebuka - I will pray (Simulated URL as real CDNs for this specific track vary)
export const PRAYER_INSTRUMENTAL_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'; // Placeholder for Ebuka - I will pray

export const INITIAL_STORIES: Story[] = [
  {
    id: 's1',
    title: 'The Prodigal Return',
    description: 'A modern retelling of the classic parable. A young man finds his way back home after losing everything.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800&h=450',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    type: 'movie'
  }
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'q1',
    title: 'Biblical Wisdom Basics',
    questions: [
      {
        id: 'q1_1',
        question: 'Who led the Israelites out of Egypt?',
        options: { a: 'Abraham', b: 'Moses', c: 'David', d: 'Noah' },
        correctOption: 'b'
      }
    ]
  }
];

export const POPPING_VIDEOS = [
  'https://www.youtube.com/embed/dQw4w9WgXcQ',
  'https://www.youtube.com/embed/dQw4w9WgXcQ',
  'https://www.youtube.com/embed/dQw4w9WgXcQ'
];

export const GROWTH_CHALLENGE_TASKS = [
  "Start the day with a 5-minute prayer.",
  "Share a verse on your social media.",
  "Reach out to someone and ask how you can pray for them."
];

export const BIBLE_STUDY_PLANS: BibleStudyPlan[] = [
  {
    id: 'b1',
    level: 'Beginner',
    title: 'Foundations of Faith',
    description: 'Discover the basic building blocks of a life centered on God.',
    days: [
      { day: 1, title: 'God is Love', scripture: '1 John 4:8', focus: 'Understanding God\'s character.' },
      { day: 2, title: 'Salvation', scripture: 'Ephesians 2:8-9', focus: 'The gift of grace.' },
      { day: 3, title: 'Prayer', scripture: 'Matthew 6:9-13', focus: 'How to talk to God.' }
    ]
  },
  {
    id: 'b2',
    level: 'Intermediate',
    title: 'Fruit of the Spirit',
    description: 'A deep dive into living a life that reflects Christ through character.',
    days: [
      { day: 1, title: 'Love & Joy', scripture: 'Galatians 5:22', focus: 'The primary fruits.' },
      { day: 2, title: 'Peace & Patience', scripture: 'Galatians 5:22', focus: 'Finding rest in God.' }
    ]
  },
  {
    id: 'b3',
    level: 'Advanced',
    title: 'The Great Commission',
    description: 'Learning to lead and disciple others in the faith.',
    days: [
      { day: 1, title: 'Making Disciples', scripture: 'Matthew 28:19-20', focus: 'The mandate for believers.' },
      { day: 2, title: 'Apologetics', scripture: '1 Peter 3:15', focus: 'Defending your faith.' }
    ]
  }
];

export const INITIAL_TESTIMONIES: Testimony[] = [
  {
    id: 't1',
    userId: 'system',
    userName: 'David G.',
    title: 'Overcoming Depression',
    type: 'video',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    content: 'God pulled me out of a dark place when I thought there was no hope.',
    date: '2024-03-15'
  },
  {
    id: 't2',
    userId: 'system',
    userName: 'Mercy A.',
    title: 'Healing Grace',
    type: 'audio',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    content: 'My testimony of physical healing through the power of prayer.',
    date: '2024-04-10'
  }
];
