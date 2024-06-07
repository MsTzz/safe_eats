
export async function fetchProductData(scannedCode: string): Promise<{ image_front_url?: string; brands: string; name: string }> {
    const apiURL = `https://br.openfoodfacts.org/api/v0/product/${scannedCode}.json`;
  
    try {
      const response = await fetch(apiURL);
      const data = await response.json();
      if (data.status === 1) {
        return {
          image_front_url: data.product.image_front_url,
          brands: (data.product.brands_tags[0]),
          name: data.product.product_name
        };
      } else {
        throw new Error('Produto não encontrado');
      }
    } catch (error) {
      throw new Error('Erro ao buscar dados da API');
    }
  }
  