require('dotenv').config();
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const serviceAccount = require('./service-account.json');
const { restaurants, categories, dishes, addons, tags, qrCodes } = require('./seed-menu.const');
const { enTranslations, viTranslations } = require('./seed-translations.const');
const { languageLocales } = require('./seed-languages.const');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

const shouldClear = process.argv.includes('--clean');
console.log('shouldClear', shouldClear);
const seedOnlyTranslations = process.argv.includes('--translations-only');

async function clearCollection(collectionName) {
  // Get documents
  const snap = await db.collection(collectionName).get();
  console.log(`Found ${snap.size} documents in ${collectionName}`);
  
  if (snap.empty) {
    console.log(`${collectionName} is already empty`);
    return;
  }
  
  // Delete them
  const batch = db.batch();
  snap.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
  
  // Verify deletion with server data
  const verifySnap = await db.collection(collectionName).get({ source: 'server' });
  console.log(`🧹 Cleared ${collectionName} - ${snap.size} deleted, ${verifySnap.size} remaining`);
}

async function seedLanguages() {
  const languagesCollection = db.collection('languages');
  console.log('Seeding languages...');
  const batch = db.batch();
  for (const locale of languageLocales) {
    const docRef = languagesCollection.doc(locale.id);
    batch.set(docRef, locale);
    console.log(`  Seeded language: ${locale.name} (${locale.id})`);
  }
  await batch.commit();
  console.log('✅ Languages seeding complete.');
}

async function seedTranslations() {
  const batch = db.batch();
  // Seed English translations
  const enDocRef = db.collection('translations').doc('en-US');
  batch.set(enDocRef, enTranslations);
  // Seed Vietnamese translations
  const viDocRef = db.collection('translations').doc('vi-VN');
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
      await clearCollection('qrCodes');
      await clearCollection('tags');
      await clearCollection('addons');
      await clearCollection('restaurants');
      await clearCollection('languages');
    }
  }

  if (seedOnlyTranslations) {
    await seedTranslations();
    console.log('🔥 Translations seeded successfully');
    return;
  }

  await seedLanguages();

  // Pre-generate all IDs
  const restaurantIds = {};
  const categoryIds = {};
  const addonIds = {};
  const tagIds = {};
  const dishIds = {};

  // Generate restaurant IDs
  for (const restaurant of restaurants) {
    restaurantIds[restaurant.key] = db.collection('restaurants').doc().id;
  }

  // Generate category IDs
  for (const category of categories) {
    categoryIds[category.key] = db.collection('categories').doc().id;
  }

  // Generate addon IDs
  for (const addon of addons) {
    addonIds[addon.key] = db.collection('addons').doc().id;
  }

  // Generate tag IDs
  for (const tag of tags) {
    tagIds[tag.key] = db.collection('tags').doc().id;
  }

  // Generate dish IDs
  for (const dish of dishes) {
    dishIds[dish.key] = db.collection('dishes').doc().id;
  }

  // Now create documents with pre-generated IDs
  const batch = db.batch();

  // 🔸 Create Restaurants
  for (const restaurant of restaurants) {
    const docRef = db.collection('restaurants').doc(restaurantIds[restaurant.key]);
    batch.set(docRef, {
      key: restaurant.key,
      name: restaurant.name,
      defaultLang: restaurant.defaultLang,
      ownerEmail: restaurant.ownerEmail,
      createdAt: FieldValue.serverTimestamp()
    });
  }

  // 🔸 Create Categories
  for (const category of categories) {
    const docRef = db.collection('categories').doc(categoryIds[category.key]);
    batch.set(docRef, {
      key: category.key,
      name: category.name,
      restaurantId: restaurantIds['scan2eat_demo'], // Use the pre-generated restaurant ID
      sortOrder: category.sortOrder
    });
  }

  // 🔸 Create Tags
  for (const tag of tags) {
    const docRef = db.collection('tags').doc(tagIds[tag.key]);
    batch.set(docRef, {
      key: tag.key
    });
  }

  // 🔸 Create Addons
  for (const addon of addons) {
    const docRef = db.collection('addons').doc(addonIds[addon.key]);
    batch.set(docRef, {
      key: addon.key,
      price: addon.price,
      restaurantId: restaurantIds['scan2eat_demo']
    });
  }

  // 🔸 Create Dishes with proper category mapping
  const categoryKeyToDishKey = {
    'noodles': ['pho_bo', 'bun_cha'],
    'rice_dishes': ['com_suon', 'com_ga'],
    'appetizers': ['goi_cuon', 'cha_gio'],
    'drinks': ['tra_da', 'ca_phe_sua_da'],
    'desserts': ['che_ba_mau', 'banh_flan'],
    'burgers': ['beef_burger', 'chicken_burger'],
    'salads': ['papaya_salad', 'caesar_salad']
  };

  for (const dish of dishes) {
    // Find which category this dish belongs to
    let categoryKey = null;
    for (const [catKey, dishKeys] of Object.entries(categoryKeyToDishKey)) {
      if (dishKeys.includes(dish.key)) {
        categoryKey = catKey;
        break;
      }
    }

    if (!categoryKey) {
      console.warn(`⚠️ No category found for dish: ${dish.key}`);
      continue;
    }

    // Create dish key to addon keys mapping
    const dishKeyToAddonKeys = {
      'pho_bo': ['extra_egg', 'extra_noodles'],
      'bun_cha': ['extra_egg', 'extra_pork'],
      'com_suon': ['extra_egg'],
      'com_ga': ['extra_chicken'],
      'beef_burger': ['extra_chicken'],
      'chicken_burger': ['extra_chicken'],
      'papaya_salad': ['no_cilantro'],
      'caesar_salad': ['no_cilantro'],
      'goi_cuon': ['no_cilantro'],
      'cha_gio': ['no_cilantro'],
      'tra_da': [],
      'ca_phe_sua_da': [],
      'che_ba_mau': [],
      'banh_flan': []
    };

    // Map addon keys to IDs for this dish
    const addonOptionIds = (dishKeyToAddonKeys[dish.key] || [])
      .map(addonKey => addonIds[addonKey])
      .filter(Boolean);
    
    const docRef = db.collection('dishes').doc(dishIds[dish.key]);
    batch.set(docRef, {
      key: dish.key,
      basePrice: dish.basePrice,
      imageUrl: dish.imageUrl,
      categoryId: categoryIds[categoryKey], // Use pre-generated category ID
      restaurantId: restaurantIds['scan2eat_demo'],
      tags: dish.tags, // Keep as array of strings
      addonIds: addonOptionIds
    });
  }

  // 🔸 Create QrCodes
  for (const qrCode of qrCodes) {
    const docRef = db.collection('qrCodes').doc();
    batch.set(docRef, {
      tableNumber: qrCode.tableNumber,
      restaurantId: restaurantIds[qrCode.restaurantId],
      qrId: qrCode.qrId
    });
  }

  // Commit all documents
  await batch.commit();

  // 🔸 Create example Order (separate transaction since we need dish ID)
  await db.collection('orders').add({
    qrId: qrCodes[0].qrId,
    language: 'en',
    isTakeaway: false,
    orderComment: 'Allergic to peanuts',
    restaurantId: restaurantIds['scan2eat_demo'],
    status: 'pending',
    price: 65000,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    dishes: [
      {
        dishId: dishIds['pho_bo'],
        basePrice: 55000,
        price: 65000,
        addons: [{ id: addonIds['extra_egg'], price: 10000 }],
        comment: '',
        takeaway: false,
        status: 'awaiting'
      }
    ]
  });

  // 🔸 Create example Call
  await db.collection('calls').add({
    qrId: qrCodes[0].qrId,
    timestamp: FieldValue.serverTimestamp(),
    type: 'waiter_call',
    status: 'active',
    restaurantId: restaurantIds['scan2eat_demo']
  });

  await seedTranslations();

  console.log('🔥 Firestore seeded successfully with pre-generated IDs');
  console.log(`📊 Created: ${restaurants.length} restaurants, ${categories.length} categories, ${dishes.length} dishes, ${addons.length} addons, ${tags.length} tags`);
}

seed().catch(console.error);