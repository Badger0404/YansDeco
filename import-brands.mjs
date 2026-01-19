import brandsData from './brands.json' with { type: 'json' };

const API_URL = 'https://yansdeco-api.andrey-gaffer.workers.dev/api';

async function importBrand(brand) {
  const response = await fetch(`${API_URL}/brands`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: brand.name,
      description_ru: brand.description.ru,
      description_fr: brand.description.fr,
      description_en: brand.description.en
    })
  });

  const data = await response.json();
  console.log(`Created ${brand.name}:`, data.success ? `ID ${data.data.id}` : data.error);
  return data.success;
}

async function main() {
  console.log('Importing brands...\n');

  for (const brand of brandsData.brands) {
    await importBrand(brand);
  }

  console.log('\n✅ Import complete!');
}

main().catch(console.error);
