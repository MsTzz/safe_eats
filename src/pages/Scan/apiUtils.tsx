interface ProductNutriments {
  energy_value?: string;
  proteins?: string;
  fat?: string;
  saturated_fat?: string;
  trans_fat?: string;
  carbohydrates?: string;
  sugars?: string;
  fiber?: string;
  salt?: string;
  sodium?: string;
  calcium?: string;
}

interface ProductInfo {
  productName: string;
  nutritionFacts?: ProductNutriments;
  ingredients?: string;
  allergens?: string[];
  ecoscore?: {
    grade?: string;
    score?: string;
    packaging?: string[];
    productionSystem?: string[];
  };
  images?: {
    front?: string;
    ingredients?: string;
    nutrition?: string;
    packaging?: string;
  };
}

export async function fetchProductData(scannedCode: string): Promise<ProductInfo> {
  const apiURL = `https://br.openfoodfacts.org/api/v0/product/${scannedCode}.json`;

  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    
    if (data.status !== 1) {
      throw new Error('Product not found or data unavailable');
    }

    return {
      productName: data.product.product_name_pt ?? data.product.product_name ?? "Product name not available",
      nutritionFacts: mapOptional(data.product.nutriments, {
        energy_value: '',
        proteins: '',
        fat: '',
        saturated_fat: '',
        trans_fat: '',
        carbohydrates: '',
        sugars: '',
        fiber: '',
        salt: '',
        sodium: '',
        calcium: ''
      }),
      ingredients: data.product.ingredients_text ?? '',
      allergens: data.product.allergens_tags ?? [],
      ecoscore: {
        grade: data.product.ecoscore_grade ?? '',
        score: data.product.ecoscore_score ?? '',
        packaging: data.product.packaging_tags ?? [],
        productionSystem: data.product.production_system_tags ?? []
      },
      images: {
        front: data.product.image_front_url ?? '',
        ingredients: data.product.image_ingredients_url ?? '',
        nutrition: data.product.image_nutrition_url ?? '',
        packaging: data.product.image_packaging_url ?? ''
      }
    };
  } catch (error) {
    console.error('Error fetching product data:', error);
    throw error;
  }
}

// Função utilitária para mapear valores opcionais
function mapOptional<T extends Record<string, unknown>>(obj: T | undefined, defaultValue: T): T {
  return obj ? { ...defaultValue, ...obj } : defaultValue;
}
