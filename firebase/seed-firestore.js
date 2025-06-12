require('dotenv').config();
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const serviceAccount = require('./service-account.json');
const { categories, dishes } = require('./seed-menu.const');
const { enTranslations, viTranslations } = require('./seed-translations.const');

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
    name: 'Scan2Eat',
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

  // 🔸 Categories
  const categoryRefs = {};
  for (const category of categories) {
    const ref = await db.collection('categories').add({
      categoryName: category.name,
      restaurantId,
      sortOrder: category.sortOrder
    });
    categoryRefs[category.name] = ref;
  }

  // 🔸 Dishes
  const dishRefs = [];
  for (const dish of dishes) {
    const ref = await db.collection('dishes').add({
      ...dish,
      categoryId: categoryRefs[dish.categoryName].id,
      restaurantId
    });
    dishRefs.push(ref);
  }

  // 🔸 Orders (example)
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
        name: dishes[0].name,
        basePrice: dishes[0].basePrice,
        price: 65000,
        addons: [{ name: 'Extra Egg', price: 10000 }],
        comment: '',
        takeaway: false,
        status: 'pending'
      }
    ]
  });

  // 🔸 Calls (example)
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
