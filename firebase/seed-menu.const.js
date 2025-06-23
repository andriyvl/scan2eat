exports.restaurants = [
  {
    key: 'scan2eat_demo',
    name: 'Scan2Eat',
    defaultLang: 'en',
    ownerEmail: 'admin@scan2eat.app'
  }
];

exports.categories = [
  { key: 'noodles', name: 'Noodles', sortOrder: 1 },
  { key: 'rice_dishes', name: 'Rice Dishes', sortOrder: 2 },
  { key: 'appetizers', name: 'Appetizers', sortOrder: 3 },
  { key: 'drinks', name: 'Drinks', sortOrder: 4 },
  { key: 'desserts', name: 'Desserts', sortOrder: 5 },
  { key: 'burgers', name: 'Burgers', sortOrder: 6 },
  { key: 'salads', name: 'Salads', sortOrder: 7 }
];

exports.tables = [
  { tableNumber: 'A1', restaurantId: 'scan2eat_demo', qrId: 'A1A' },
  { tableNumber: 'A1', restaurantId: 'scan2eat_demo', qrId: 'A1B' },
  { tableNumber: 'A1', restaurantId: 'scan2eat_demo', qrId: 'A1C' },
  { tableNumber: 'A1', restaurantId: 'scan2eat_demo', qrId: 'A1D' },
  { tableNumber: 'A2', restaurantId: 'scan2eat_demo', qrId: 'A2A' },
  { tableNumber: 'A2', restaurantId: 'scan2eat_demo', qrId: 'A2B' },
  { tableNumber: 'A2', restaurantId: 'scan2eat_demo', qrId: 'A2C' },
  { tableNumber: 'A2', restaurantId: 'scan2eat_demo', qrId: 'A2D' },
  { tableNumber: 'A3', restaurantId: 'scan2eat_demo', qrId: 'A3A' },
  { tableNumber: 'A3', restaurantId: 'scan2eat_demo', qrId: 'A3B' },
  { tableNumber: 'A3', restaurantId: 'scan2eat_demo', qrId: 'A3C' },
  { tableNumber: 'A3', restaurantId: 'scan2eat_demo', qrId: 'A3D' },
];

exports.dishes = [
  // Noodles
  {
    key: 'pho_bo',
    categoryId: '', // Will be populated during seeding
    basePrice: 55000,
    imageUrl: 'https://example.com/pho.jpg',
    tags: ['popular', 'hot'],
    addonOptions: [], // Will be populated with addon IDs during seeding
  },
  {
    key: 'bun_cha',
    categoryId: '', // Will be populated during seeding
    basePrice: 45000,
    imageUrl: 'https://example.com/buncha.jpg',
    tags: ['popular'],
    addonOptions: [], // Will be populated with addon IDs during seeding
  },
  // Rice Dishes
  {
    key: 'com_suon',
    categoryId: '', // Will be populated during seeding
    basePrice: 40000,
    imageUrl: 'https://example.com/comsuon.jpg',
    tags: ['popular'],
    addonOptions: [], // Will be populated with addon IDs during seeding
  },
  {
    key: 'com_ga',
    categoryId: '', // Will be populated during seeding
    basePrice: 42000,
    imageUrl: 'https://example.com/comga.jpg',
    tags: [],
    addonOptions: [], // Will be populated with addon IDs during seeding
  },
  // Appetizers
  {
    key: 'goi_cuon',
    categoryId: '', // Will be populated during seeding
    basePrice: 35000,
    imageUrl: 'https://example.com/goicuon.jpg',
    tags: ['vegetarian'],
    addonOptions: [], // Will be populated with addon IDs during seeding
  },
  {
    key: 'cha_gio',
    categoryId: '', // Will be populated during seeding
    basePrice: 30000,
    imageUrl: 'https://example.com/chagio.jpg',
    tags: [],
    addonOptions: [],
  },
  // Drinks
  {
    key: 'tra_da',
    categoryId: '', // Will be populated during seeding
    basePrice: 10000,
    imageUrl: 'https://example.com/trada.jpg',
    tags: [],
    addonOptions: [],
  },
  {
    key: 'ca_phe_sua_da',
    categoryId: '', // Will be populated during seeding
    basePrice: 25000,
    imageUrl: 'https://example.com/caphe.jpg',
    tags: [],
    addonOptions: [],
  },
  // Desserts
  {
    key: 'che_ba_mau',
    categoryId: '', // Will be populated during seeding
    basePrice: 25000,
    imageUrl: 'https://example.com/chebamau.jpg',
    tags: ['vegetarian', 'sweet'],
    addonOptions: [],
  },
  {
    key: 'banh_flan',
    categoryId: '', // Will be populated during seeding
    basePrice: 20000,
    imageUrl: 'https://example.com/flan.jpg',
    tags: ['vegetarian', 'sweet'],
    addonOptions: [],
  },
  // Burgers
  {
    key: 'beef_burger',
    categoryId: '', // Will be populated during seeding
    basePrice: 60000,
    imageUrl: 'https://example.com/beefburger.jpg',
    tags: ['popular'],
    addonOptions: [], // Will be populated with addon IDs during seeding
  },
  {
    key: 'chicken_burger',
    categoryId: '', // Will be populated during seeding
    basePrice: 55000,
    imageUrl: 'https://example.com/chickenburger.jpg',
    tags: [],
    addonOptions: [], // Will be populated with addon IDs during seeding
  },
  // Salads
  {
    key: 'papaya_salad',
    categoryId: '', // Will be populated during seeding
    basePrice: 35000,
    imageUrl: 'https://example.com/papaya-salad.jpg',
    tags: ['vegetarian', 'spicy'],
    addonOptions: [],
  },
  {
    key: 'caesar_salad',
    categoryId: '', // Will be populated during seeding
    basePrice: 45000,
    imageUrl: 'https://example.com/caesar-salad.jpg',
    tags: [],
    addonOptions: [], // Will be populated with addon IDs during seeding
  }
];

exports.addons = [
  { key: 'extra_egg', price: 10000 },
  { key: 'no_cilantro', price: 0 },
  { key: 'extra_chicken', price: 15000 },
  { key: 'extra_noodles', price: 10000 },
  { key: 'extra_pork', price: 15000 },
];

exports.tags = [
  { key: 'vegetarian' },
  { key: 'vegan' },
  { key: 'gluten-free' },
  { key: 'halal' },
  { key: 'kosher' },
  { key: 'organic' },
  { key: 'sustainable' },
  { key: 'local' },
  { key: 'seasonal' },
  { key: 'spicy' },
  { key: 'sweet' },
  { key: 'salty' },
  { key: 'sour' },
  { key: 'bitter' },
  { key: 'umami' },
  { key: 'savory' },
  { key: 'popular' },
  { key: 'hot' }
];