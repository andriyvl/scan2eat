require('dotenv').config();
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const serviceAccount = require('./service-account.json');

initializeApp({
  credential: applicationDefault(),
  projectId: serviceAccount.project_id
});

const db = getFirestore();

const translations = [
  { key: 'welcome', lang: 'en', value: 'Welcome to Scan2Eat' },
  { key: 'welcome', lang: 'vi', value: 'Chào mừng đến với Scan2Eat' },
  { key: 'order', lang: 'en', value: 'Place Order' },
  { key: 'order', lang: 'vi', value: 'Đặt món' },
];

async function seedTranslations() {
  const batch = db.batch();
  translations.forEach((t) => {
    const docRef = db.collection('translations').doc(`${t.key}_${t.lang}`);
    batch.set(docRef, t);
  });
  await batch.commit();
  console.log('✅ Seeded translations');
}

async function seed() {
  const restaurantId = 'rest_scan2eat_demo';

  await db.collection('restaurants').doc(restaurantId).set({
    name: 'Scan2Eat Demo Restaurant',
    default_lang: 'en',
    owner_email: 'admin@scan2eat.app',
    created_at: FieldValue.serverTimestamp()
  });

  await db.collection('tables').doc('A5').set({
    table_number: 'A5',
    restaurant_id: restaurantId,
    qr_id: 'A5'
  });

  await db.collection('menu').doc('noodles').set({
    category_name: 'Noodles',
    restaurant_id: restaurantId,
    sort_order: 1
  });

  await db.collection('dishes').doc('pho_bo').set({
    name: 'Phở Bò',
    category_id: 'noodles',
    restaurant_id: restaurantId,
    description: 'Vietnamese beef noodle soup',
    price: 55000,
    image_url: 'https://example.com/pho.jpg',
    addons: [
      { name: 'Extra Egg', price: 10000 },
      { name: 'No Cilantro', price: 0 }
    ],
    translations: {
      en: { name: 'Beef Pho', description: 'Vietnamese beef noodle soup' },
      vi: { name: 'Phở Bò', description: 'Phở bò truyền thống' }
    }
  });

  await db.collection('orders').add({
    table_id: 'A5',
    lang: 'en',
    is_takeaway: false,
    order_comment: 'Allergic to peanuts',
    status: 'pending',
    total_price: 65000,
    created_at: FieldValue.serverTimestamp(),
    dishes: [
      {
        dish_id: 'pho_bo',
        name: 'Phở Bò',
        base_price: 55000,
        addons: [{ name: 'Extra Egg', price: 10000 }],
        comment: '',
        takeaway: false,
        status: 'pending'
      }
    ]
  });

  await db.collection('calls').add({
    table_id: 'A5',
    timestamp: FieldValue.serverTimestamp(),
    type: 'waiter_call',
    status: 'active'
  });

  await seedTranslations();

  console.log('🔥 Firestore seeded successfully');
}

seed();
