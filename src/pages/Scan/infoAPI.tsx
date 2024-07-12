import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import { fetchProductData } from './apiUtils';

type InfoAPIProps = {
  route: {
    params: {
      scannedCode: string;
    };
  };
};

type ProductNutriments = {
  [key: string]: string;
};

type ProductType = {
  productName?: string;
  brands?: string;
  image_front_url?: string;
  other_images?: string[];
  ingredients?: string;
  nutritionFacts?: ProductNutriments;
  categories?: string[];
};

const InfoAPI = ({ route }: InfoAPIProps) => {
  const { scannedCode } = route.params;
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<ProductType>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productData = await fetchProductData(scannedCode);
        setProduct({
          productName: productData.productName,
          brands: productData.allergens?.join(', '),
          image_front_url: productData.images?.front,
          other_images: [productData.images?.ingredients?? '', productData.images?.nutrition?? '', productData.images?.packaging?? ''],
          ingredients: productData.ingredients,
          nutritionFacts: productData.nutritionFacts as ProductNutriments,
          categories: productData.ecoscore?.packaging,
        });
        setLoading(false);
      } catch (error) {
        setError('Erro ao buscar dados da API');
        setLoading(false);
      }
    };

    fetchData();
  }, [scannedCode]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#566332" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <InfoSection title="Código de Barras:" content={scannedCode} />
        <InfoSection title="Nome do Produto:" content={product.productName} />
        <InfoSection title="Marcas:" content={product.brands} />

        {product.image_front_url && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: product.image_front_url }} style={styles.image} />
          </View>
        )}
        
        {product.other_images && (
          <FlatList
            horizontal
            data={product.other_images.filter(Boolean)}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.otherImage} />
            )}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.otherImagesContainer}
          />
        )}
        
        <InfoSection title="INGREDIENTES DO PRODUTO:" content={product.ingredients} />
        
        <View style={styles.section}>
          <Text style={styles.subTitle}>NUTRIENTES:</Text>
          <View style={styles.box}>
            {product.nutritionFacts && Object.keys(product.nutritionFacts).map((key) => (
              <Text style={styles.boxText} key={key}>{key}: {product.nutritionFacts![key]}</Text>
            ))}
          </View>
        </View>
        
        <InfoSection title="CATEGORIAS:" content={product.categories?.join(', ')} />
        
        <View style={styles.section}>
          <View style={styles.validationBox}>
            <Text style={styles.validationText}>ESTE PRODUTO É SEGURO PARA SEU CONSUMO DE ACORDO COM O SEU CADASTRO</Text>
            <Text style={styles.details}>CASO QUEIRA VALIDAR OS ITENS CADASTRADOS CLIQUE AQUI</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const InfoSection = ({ title, content }: { title: string; content?: string }) => (
  <View style={styles.section}>
    <Text style={styles.text}>{title}</Text>
    <Text style={styles.boxText}>{content}</Text>
  </View>
);

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 20,
    marginBottom: 10,
  },
  details: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
    alignItems: 'center',
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  otherImagesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  otherImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginHorizontal: 5,
  },
  box: {
    width: '90%',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  boxText: {
    fontSize: 16,
    color: 'black',
  },
  validationBox: {
    padding: 20,
    backgroundColor: '#d4edda',
    borderRadius: 5,
    alignItems: 'center',
  },
  validationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#155724',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default InfoAPI;
