import names from './names.json' with { type: 'json' };

const API_URL = 'https://yansdeco-api.andrey-gaffer.workers.dev/api';

async function deleteAllCategories() {
  console.log('🗑️  Deleting existing categories...');
  
  try {
    // Direct D1 delete via wrangler exec would be better, but using API
    const response = await fetch(`${API_URL}/categories`);
    const data = await response.json();
    
    if (data.success && data.data.length > 0) {
      for (const cat of data.data) {
        await fetch(`${API_URL}/categories/${cat.id}`, { method: 'DELETE' });
        console.log(`  Deleted: ${cat.name_fr || cat.slug}`);
      }
    }
    console.log('✅ All categories deleted');
  } catch (error) {
    console.error('Error deleting categories:', error);
  }
}

const SLUG_MAP = {
  'Peinture & Finition': 'peinture-finition',
  'Colles & Mastics': 'colles-mastics',
  "Outillage Peintre": 'outillage-peintre',
  "Outillage Carreleur": 'outillage-carreleur',
  'Préparation des sols': 'preparation-sols',
  'Fixation & Visserie': 'fixation-visserie'
};

async function createCategory(category) {
  const slug = SLUG_MAP[category.fr] || category.fr.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  const response = await fetch(`${API_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      slug,
      name_ru: category.ru,
      name_fr: category.fr,
      name_en: category.en
    })
  });
  
  const data = await response.json();
  console.log(`Created ${category.fr}:`, data.success ? data.data?.id : data.error);
  return data.data?.id;
}

async function createSubcategory(sub, parentId) {
  const slug = sub.fr.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50);
  
  const response = await fetch(`${API_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      slug,
      name_ru: sub.ru,
      name_fr: sub.fr,
      name_en: sub.en,
      parent_id: parentId
    })
  });
  
  const data = await response.json();
  console.log(`  - Created ${sub.fr}:`, data.success ? data.data?.id : data.error);
}

async function main() {
  await deleteAllCategories();
  
  for (const category of names.categories) {
    const id = await createCategory(category);
    if (id && category.subcategories) {
      for (const sub of category.subcategories) {
        await createSubcategory(sub, id);
      }
    }
  }
  console.log('✅ Import complete!');
}

main().catch(console.error);
