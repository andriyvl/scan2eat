exports.categories = [
  { name: 'Noodles', sortOrder: 1 },
  { name: 'Rice Dishes', sortOrder: 2 },
  { name: 'Appetizers', sortOrder: 3 },
  { name: 'Drinks', sortOrder: 4 },
  { name: 'Desserts', sortOrder: 5 },
  { name: 'Burgers', sortOrder: 6 },
  { name: 'Salads', sortOrder: 7 }
];

exports.dishes = [
  // Noodles
  {
    name: 'Phở Bò',
    categoryName: 'Noodles',
    description: 'Vietnamese beef noodle soup',
    basePrice: 55000,
    imageUrl: 'https://example.com/pho.jpg',
    addons: [
      { name: 'Extra Egg', price: 10000 },
      { name: 'No Cilantro', price: 0 }
    ],
    translations: {
      en: { name: 'Beef Pho', description: 'Vietnamese beef noodle soup' },
      vi: { name: 'Phở Bò', description: 'Phở bò truyền thống' }
    }
  },
  {
    name: 'Bún Chả',
    categoryName: 'Noodles',
    description: 'Grilled pork with rice vermicelli',
    basePrice: 45000,
    imageUrl: 'https://example.com/buncha.jpg',
    addons: [
      { name: 'Extra Pork', price: 15000 },
      { name: 'Extra Noodles', price: 10000 }
    ],
    translations: {
      en: { name: 'Bun Cha', description: 'Grilled pork with rice vermicelli' },
      vi: { name: 'Bún Chả', description: 'Bún chả Hà Nội' }
    }
  },
  // Rice Dishes
  {
    name: 'Cơm Sườn',
    categoryName: 'Rice Dishes',
    description: 'Grilled pork chop with rice',
    basePrice: 40000,
    imageUrl: 'https://example.com/comsuon.jpg',
    addons: [
      { name: 'Extra Pork', price: 15000 },
      { name: 'Extra Rice', price: 5000 }
    ],
    translations: {
      en: { name: 'Com Suon', description: 'Grilled pork chop with rice' },
      vi: { name: 'Cơm Sườn', description: 'Cơm sườn nướng' }
    }
  },
  {
    name: 'Cơm Gà Hải Nam',
    categoryName: 'Rice Dishes',
    description: 'Hainanese chicken rice',
    basePrice: 42000,
    imageUrl: 'https://example.com/comga.jpg',
    addons: [
      { name: 'Extra Chicken', price: 12000 }
    ],
    translations: {
      en: { name: 'Hainanese Chicken Rice', description: 'Hainanese chicken rice' },
      vi: { name: 'Cơm Gà Hải Nam', description: 'Cơm gà Hải Nam' }
    }
  },
  // Appetizers
  {
    name: 'Gỏi Cuốn',
    categoryName: 'Appetizers',
    description: 'Fresh spring rolls',
    basePrice: 35000,
    imageUrl: 'https://example.com/goicuon.jpg',
    addons: [
      { name: 'Extra Peanut Sauce', price: 5000 }
    ],
    translations: {
      en: { name: 'Goi Cuon', description: 'Fresh spring rolls' },
      vi: { name: 'Gỏi Cuốn', description: 'Gỏi cuốn tôm thịt' }
    }
  },
  {
    name: 'Chả Giò',
    categoryName: 'Appetizers',
    description: 'Fried spring rolls',
    basePrice: 30000,
    imageUrl: 'https://example.com/chagio.jpg',
    addons: [],
    translations: {
      en: { name: 'Fried Spring Rolls', description: 'Fried spring rolls' },
      vi: { name: 'Chả Giò', description: 'Chả giò chiên giòn' }
    }
  },
  // Drinks
  {
    name: 'Trà Đá',
    categoryName: 'Drinks',
    description: 'Iced tea',
    basePrice: 10000,
    imageUrl: 'https://example.com/trada.jpg',
    addons: [],
    translations: {
      en: { name: 'Iced Tea', description: 'Vietnamese iced tea' },
      vi: { name: 'Trà Đá', description: 'Trà đá' }
    }
  },
  {
    name: 'Cà Phê Sữa Đá',
    categoryName: 'Drinks',
    description: 'Vietnamese iced coffee with milk',
    basePrice: 25000,
    imageUrl: 'https://example.com/caphe.jpg',
    addons: [],
    translations: {
      en: { name: 'Iced Milk Coffee', description: 'Vietnamese iced coffee with milk' },
      vi: { name: 'Cà Phê Sữa Đá', description: 'Cà phê sữa đá Việt Nam' }
    }
  },
  // Desserts
  {
    name: 'Chè Ba Màu',
    categoryName: 'Desserts',
    description: 'Three-color dessert with beans, jelly, and coconut milk',
    basePrice: 25000,
    imageUrl: 'https://example.com/chebamau.jpg',
    addons: [],
    translations: {
      en: { name: 'Three Color Dessert', description: 'Three-color dessert with beans, jelly, and coconut milk' },
      vi: { name: 'Chè Ba Màu', description: 'Chè ba màu truyền thống' }
    }
  },
  {
    name: 'Bánh Flan',
    categoryName: 'Desserts',
    description: 'Vietnamese caramel flan',
    basePrice: 20000,
    imageUrl: 'https://example.com/flan.jpg',
    addons: [],
    translations: {
      en: { name: 'Caramel Flan', description: 'Vietnamese caramel flan' },
      vi: { name: 'Bánh Flan', description: 'Bánh flan caramel' }
    }
  },
  // Burgers
  {
    name: 'Classic Beef Burger',
    categoryName: 'Burgers',
    description: 'Juicy beef patty with lettuce, tomato, and cheese',
    basePrice: 60000,
    imageUrl: 'https://example.com/beefburger.jpg',
    addons: [
      { name: 'Extra Cheese', price: 10000 },
      { name: 'Bacon', price: 12000 }
    ],
    translations: {
      en: { name: 'Classic Beef Burger', description: 'Juicy beef patty with lettuce, tomato, and cheese' },
      vi: { name: 'Bánh Mì Bò', description: 'Bánh mì kẹp thịt bò, rau xà lách, cà chua, phô mai' }
    }
  },
  {
    name: 'Chicken Burger',
    categoryName: 'Burgers',
    description: 'Crispy chicken fillet with mayo and pickles',
    basePrice: 55000,
    imageUrl: 'https://example.com/chickenburger.jpg',
    addons: [
      { name: 'Spicy Sauce', price: 5000 }
    ],
    translations: {
      en: { name: 'Chicken Burger', description: 'Crispy chicken fillet with mayo and pickles' },
      vi: { name: 'Bánh Mì Gà', description: 'Bánh mì kẹp gà chiên giòn, sốt mayonnaise, dưa leo' }
    }
  },
  // Salads
  {
    name: 'Green Papaya Salad',
    categoryName: 'Salads',
    description: 'Shredded green papaya with herbs, peanuts, and tangy dressing',
    basePrice: 35000,
    imageUrl: 'https://example.com/papaya-salad.jpg',
    addons: [],
    translations: {
      en: { name: 'Green Papaya Salad', description: 'Shredded green papaya with herbs, peanuts, and tangy dressing' },
      vi: { name: 'Gỏi Đu Đủ', description: 'Gỏi đu đủ xanh, rau thơm, đậu phộng, nước trộn chua ngọt' }
    }
  },
  {
    name: 'Chicken Caesar Salad',
    categoryName: 'Salads',
    description: 'Grilled chicken, romaine, croutons, and Caesar dressing',
    basePrice: 45000,
    imageUrl: 'https://example.com/caesar-salad.jpg',
    addons: [
      { name: 'Extra Chicken', price: 15000 }
    ],
    translations: {
      en: { name: 'Chicken Caesar Salad', description: 'Grilled chicken, romaine, croutons, and Caesar dressing' },
      vi: { name: 'Salad Gà Caesar', description: 'Salad gà nướng, xà lách Romaine, bánh mì nướng, sốt Caesar' }
    }
  }
]; 