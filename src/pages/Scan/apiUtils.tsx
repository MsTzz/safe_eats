export interface ProductInfo {
  image_front_url?: string;
  brands: string[];
  name: string;
  ingredientes?: string[];
  nutrientes?: { [key: string]: string };
  categorias?: string[];
  [key: string]: any; 
}

// Função fetchProductData para buscar dados do produto
export async function fetchProductData(scannedCode: string): Promise<ProductInfo> {
  const apiURL = `https://br.openfoodfacts.org/api/v0/product/${scannedCode}.json`;

  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    
    if (data.status === 1) {
      const product: ProductInfo = {
        ...data.product, 
        image_front_url: data.product.image_front_url,
        brands: data.product.brands_tags[0],
        name: data.product.product_name,
        ingredientes: data.product.ingredients_text.split(',').map((ingredient: string) => ingredient.trim()),
        nutrientes: data.product.nutriments,
        categorias: data.product.categories_tags.map((category: string) => category.replace(/^en:/, '')),
        
      };
      console.log(data.product.brands_tags[0])
      console.log(product.brands)

      return product;
    } else {
      throw new Error('Produto não encontrado');
    }
  } catch (error) {
    throw new Error('Erro ao buscar dados da API');
  }
}
