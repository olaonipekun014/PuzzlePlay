import { Category, CategoryInfo, Difficulty, WordItem } from './types';

export const CATEGORIES: CategoryInfo[] = [
  { id: 'animals', label: 'Animals & Nature', icon: '🐾', color: 'bg-green-100 text-green-800 border-green-300' },
  { id: 'space', label: 'Space & Science', icon: '🚀', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
  { id: 'food', label: 'Food & Health', icon: '🍎', color: 'bg-red-100 text-red-800 border-red-300' },
  { id: 'ocean', label: 'Ocean & Sea Life', icon: '🐬', color: 'bg-cyan-100 text-cyan-800 border-cyan-300' },
  { id: 'colors', label: 'Colors & Shapes', icon: '🎨', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'toys', label: 'Toys & Fun', icon: '🧸', color: 'bg-pink-100 text-pink-800 border-pink-300' },
  { id: 'magic', label: 'Magic & Fantasy', icon: '🧙', color: 'bg-purple-100 text-purple-800 border-purple-300' },
];

export const WORD_BANK: Record<Exclude<Category, 'daily'>, Record<Difficulty, WordItem[]>> = {
  animals: {
    easy: [
      { word: 'CAT', hint: 'A furry pet that purrs.' },
      { word: 'BIRD', hint: 'It has feathers and can fly.' },
      { word: 'DOG', hint: 'Man\'s best friend.' },
      { word: 'FROG', hint: 'It says ribbit and jumps.' },
      { word: 'BEAR', hint: 'A large, strong animal.' }
    ],
    medium: [
      { word: 'TIGER', hint: 'A big wild cat with stripes.' },
      { word: 'MONKEY', hint: 'Loves to swing from trees.' },
      { word: 'RABBIT', hint: 'Has long ears and hops.' },
      { word: 'SNAKE', hint: 'A long animal with no legs.' },
      { word: 'HORSE', hint: 'You can ride on its back.' }
    ],
    hard: [
      { word: 'ELEPHANT', hint: 'A huge animal with a trunk.' },
      { word: 'PENGUIN', hint: 'A bird that swims and lives in the cold.' },
      { word: 'GIRAFFE', hint: 'Has a very long neck.' },
      { word: 'DOLPHIN', hint: 'A very smart animal that swims in the ocean.' },
      { word: 'CHEETAH', hint: 'The fastest land animal.' }
    ]
  },
  space: {
    easy: [
      { word: 'SUN', hint: 'The big yellow star in the sky.' },
      { word: 'STAR', hint: 'Twinkles at night.' },
      { word: 'MOON', hint: 'You see it in the night sky.' },
      { word: 'MARS', hint: 'The red planet.' }
    ],
    medium: [
      { word: 'PLANET', hint: 'A large object that orbits a star.' },
      { word: 'ROCKET', hint: 'A spaceship that blasts off.' },
      { word: 'COMET', hint: 'A icy rock with a tail in space.' },
      { word: 'ORBIT', hint: 'To go around a planet or star.' }
    ],
    hard: [
      { word: 'ASTRONAUT', hint: 'A person who travels to space.' },
      { word: 'UNIVERSE', hint: 'Everything that exists everywhere.' },
      { word: 'ASTEROID', hint: 'A huge rock floating in space.' },
      { word: 'TELESCOPE', hint: 'A tool used to look at the stars.' }
    ]
  },
  food: {
    easy: [
      { word: 'PEAR', hint: 'A green fruit shaped like a bell.' },
      { word: 'CAKE', hint: 'A sweet baked treat.' },
      { word: 'MILK', hint: 'A white drink from cows.' },
      { word: 'SOUP', hint: 'A warm liquid meal.' },
      { word: 'TACO', hint: 'A folded tortilla with yummy fillings.' }
    ],
    medium: [
      { word: 'APPLE', hint: 'A crunchy red or green fruit.' },
      { word: 'BANANA', hint: 'A long yellow fruit.' },
      { word: 'CHEESE', hint: 'Made from milk, mice love it.' },
      { word: 'CARROT', hint: 'An orange vegetable rabbits eat.' },
      { word: 'BREAD', hint: 'Used to make sandwiches.' }
    ],
    hard: [
      { word: 'BROCCOLI', hint: 'A green vegetable that looks like tiny trees.' },
      { word: 'PANCAKE', hint: 'A flat, round cake eaten for breakfast.' },
      { word: 'SANDWICH', hint: 'Food put between two slices of bread.' },
      { word: 'SPAGHETTI', hint: 'Long stringy pasta.' }
    ]
  },
  magic: {
    easy: [
      { word: 'WAND', hint: 'A stick used to cast spells.' },
      { word: 'HAT', hint: 'Worn by witches or wizards.' },
      { word: 'BOOK', hint: 'Contains magical spells.' },
      { word: 'CAPE', hint: 'Worn on the back by a hero or magician.' }
    ],
    medium: [
      { word: 'SPELL', hint: 'Words spoken to do magic.' },
      { word: 'DRAGON', hint: 'A mythical flying reptile.' },
      { word: 'POTION', hint: 'A magical liquid.' },
      { word: 'WIZARD', hint: 'A man who does magic.' },
      { word: 'CASTLE', hint: 'A big stone building where kings live.' }
    ],
    hard: [
      { word: 'UNICORN', hint: 'A magical horse with a horn.' },
      { word: 'SORCERER', hint: 'A powerful magic user.' },
      { word: 'CAULDRON', hint: 'A big pot used to mix potions.' },
      { word: 'MERMAID', hint: 'Half human, half fish.' }
    ]
  },
  ocean: {
    easy: [
      { word: 'FISH', hint: 'Swims in water and has fins.' },
      { word: 'CRAB', hint: 'Walks sideways and has claws.' },
      { word: 'SEAL', hint: 'A playful sea mammal that barks.' },
      { word: 'WAVE', hint: 'Water that rolls onto the beach.' }
    ],
    medium: [
      { word: 'SHARK', hint: 'A big ocean predator with sharp teeth.' },
      { word: 'WHALE', hint: 'The biggest animal in the sea.' },
      { word: 'CORAL', hint: 'Colorful underwater rock-like home for fish.' },
      { word: 'SQUID', hint: 'Has tentacles and shoots ink.' }
    ],
    hard: [
      { word: 'DOLPHIN', hint: 'Friendly, intelligent sea animal that jumps.' },
      { word: 'OCTOPUS', hint: 'Has eight arms and three hearts.' },
      { word: 'SEAHORSE', hint: 'A tiny fish with a horse-like head.' },
      { word: 'JELLYFISH', hint: 'Translucent creature that drifts in the ocean.' }
    ]
  },
  colors: {
    easy: [
      { word: 'RED', hint: 'The color of strawberries and fire trucks.' },
      { word: 'BLUE', hint: 'The color of the clear sky and deep ocean.' },
      { word: 'PINK', hint: 'A cheerful blend of red and white.' },
      { word: 'GOLD', hint: 'A shiny color like shiny coins or treasure.' }
    ],
    medium: [
      { word: 'GREEN', hint: 'The color of fresh grass and leaves.' },
      { word: 'WHITE', hint: 'The color of fluffy clouds and snow.' },
      { word: 'BLACK', hint: 'The darkest color of the night sky.' },
      { word: 'PURPLE', hint: 'A regal blend of blue and red.' }
    ],
    hard: [
      { word: 'RAINBOW', hint: 'An arch of many colors appearing after rain.' },
      { word: 'ORANGE', hint: 'Both a tasty citrus fruit and a bright color.' },
      { word: 'DIAMOND', hint: 'A brilliant sparkly shape and gemstone.' },
      { word: 'TRIANGLE', hint: 'A shape that has three corners and three sides.' }
    ]
  },
  toys: {
    easy: [
      { word: 'BALL', hint: 'A round toy you can bounce, throw, and kick.' },
      { word: 'KITE', hint: 'Flies high in the sky on a windy day.' },
      { word: 'DOLL', hint: 'A beloved toy figure you can dress and care for.' },
      { word: 'BIKE', hint: 'Has two wheels and pedals to ride.' }
    ],
    medium: [
      { word: 'ROBOT', hint: 'A mechanical friend that beeps and whirrs.' },
      { word: 'TRAIN', hint: 'Chugs along tracks with cars connected.' },
      { word: 'PUZZLE', hint: 'Pieces you fit together to make a picture.' },
      { word: 'SKATE', hint: 'Shoes with wheels for rolling fast.' }
    ],
    hard: [
      { word: 'DINOSAUR', hint: 'A mighty prehistoric toy reptile like T-Rex.' },
      { word: 'AIRPLANE', hint: 'A toy that zooms through the imaginary clouds.' },
      { word: 'SCOOTER', hint: 'A board on wheels with handlebars to kick and steer.' },
      { word: 'DRUMSTICK', hint: 'Used to tap rhythms on a musical toy drum.' }
    ]
  }
};

export const EMOJI_AVATARS = ['🦁', '🚀', '🎨', '🦉'];

export const PREMIUM_AVATARS = [
  { emoji: '🌟', price: 10 },
  { emoji: '🦄', price: 25 },
  { emoji: '🦖', price: 50 },
  { emoji: '🤖', price: 100 },
  { emoji: '🐉', price: 200 },
  { emoji: '👑', price: 500 }
];
