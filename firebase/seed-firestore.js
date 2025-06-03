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
    await clearCollection('translations');
    await clearCollection('categories');
    await clearCollection('dishes');
    await clearCollection('orders');
    await clearCollection('calls');
    await clearCollection('tables');
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
  const categoryRef = await db.collection('categories').add({
    categoryName: 'Noodles',
    restaurantId,
    sortOrder: 1
  });

  // 🔸 Dishes (auto ID)
  const dishRef = await db.collection('dishes').add({
    name: 'Phở Bò',
    categoryId: categoryRef.id,
    restaurantId,
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
  });

  // 🔸 Orders
  await db.collection('orders').add({
    tableId: tableRef.id,
    language: 'en',
    isTakeaway: false,
    orderComment: 'Allergic to peanuts',
    status: 'pending',
    totalPrice: 65000,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    dishes: [
      {
        dishId: dishRef.id,
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
