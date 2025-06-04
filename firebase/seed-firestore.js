require('dotenv').config();
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const serviceAccount = require('./service-account.json');
const enTranslations = require('../apps/client/src/locales/en.json');
const viTranslations = require('../apps/client/src/locales/vi.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

const shouldClear = process.argv.includes('--clean');
const seedOnlyTranslations = process.argv.includes('--translations-only');

async function clearCollection(collectionName) {
  const snap = await db.collection(collectionName).get();
  const batch = db.batch();
  snap.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
  console.log(`🧹 Cleared ${collectionName}`);
}

async function seedTranslations() {
  const batch = db.batch();
  
  // Seed English translations
  const enDocRef = db.collection('translations').doc('en');
  batch.set(enDocRef, enTranslations);
  
  // Seed Vietnamese translations
  const viDocRef = db.collection('translations').doc('vi');
  batch.set(viDocRef, viTranslations);
  
  await batch.commit();
  console.log('✅ Seeded translations');
}

async function seed() {
  if (shouldClear) {
    if (seedOnlyTranslations) {
      await clearCollection('translations');
    } else {
      await clearCollection('translations');
      await clearCollection('categories');
      await clearCollection('dishes');
      await clearCollection('orders');
      await clearCollection('calls');
      await clearCollection('tables');
    }
  }

  if (seedOnlyTranslations) {
    await seedTranslations();
    console.log('🔥 Translations seeded successfully');
    return;
  }

  const restaurantId = 'restScan2EatDemo';

  // 🔸 Restaurants (custom ID)
  await db.collection('restaurants').doc(restaurantId).set({
    name: 'Scan2Eat Demo Restaurant',
    defaultLang: 'en',
    ownerEmail: 'admin@scan2eat.app',
    createdAt: FieldValue.serverTimestamp()
  });

  // 🔸 Tables (auto ID)
  const tableRef = await db.collection('tables').add({
    tableNumber: 'A5',
    restaurantId,
    qrId: 'A5'
  });

  // 🔸 Categories (was 'menu')
  const categories = [
    { name: 'Noodles', sortOrder: 1 },
    { name: 'Rice Dishes', sortOrder: 2 },
    { name: 'Appetizers', sortOrder: 3 },
    { name: 'Drinks', sortOrder: 4 }
  ];

  const categoryRefs = {};
  for (const category of categories) {
    const ref = await db.collection('categories').add({
      categoryName: category.name,
      restaurantId,
      sortOrder: category.sortOrder
    });
    categoryRefs[category.name] = ref;
  }

  // 🔸 Dishes (auto ID)
  const dishes = [
    {
      name: 'Phở Bò',
      categoryId: categoryRefs['Noodles'].id,
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
      categoryId: categoryRefs['Noodles'].id,
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
    {
      name: 'Cơm Sườn',
      categoryId: categoryRefs['Rice Dishes'].id,
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
      name: 'Gỏi Cuốn',
      categoryId: categoryRefs['Appetizers'].id,
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
      name: 'Trà Đá',
      categoryId: categoryRefs['Drinks'].id,
      description: 'Iced tea',
      basePrice: 10000,
      imageUrl: 'https://example.com/trada.jpg',
      addons: [],
      translations: {
        en: { name: 'Iced Tea', description: 'Vietnamese iced tea' },
        vi: { name: 'Trà Đá', description: 'Trà đá' }
      }
    }
  ];

  const dishRefs = [];
  for (const dish of dishes) {
    const ref = await db.collection('dishes').add({
      ...dish,
      restaurantId
    });
    dishRefs.push(ref);
  }

  // 🔸 Orders
  await db.collection('orders').add({
    tableId: tableRef.id,
    language: 'en',
    isTakeaway: false,
    orderComment: 'Allergic to peanuts',
    status: 'pending',
    price: 65000,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    dishes: [
      {
        dishId: dishRefs[0].id,
        name: 'Phở Bò',
        basePrice: 55000,
        price: 65000,
        addons: [{ name: 'Extra Egg', price: 10000 }],
        comment: '',
        takeaway: false,
        status: 'pending'
      }
    ]
  });

  // 🔸 Calls
  await db.collection('calls').add({
    tableId: tableRef.id,
    timestamp: FieldValue.serverTimestamp(),
    type: 'waiter_call',
    status: 'active'
  });

  await seedTranslations();

  console.log('🔥 Firestore seeded successfully (with auto IDs + categories)');
}

seed();
