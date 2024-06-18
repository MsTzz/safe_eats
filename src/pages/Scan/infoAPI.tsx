import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native';
import { fetchProductData } from './apiUtils'; // Importe a função fetchProductData

type InfoAPIProps = {
  route: {
    params: {
      scannedCode: string;
    };
  };
};

export default function InfoAPI({ route }: InfoAPIProps) {
  const { scannedCode } = route.params;
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<{ name?: string; brands: string[]; image_front_url?: string }>({
    name: undefined,
    brands: [],
    image_front_url: undefined,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedProduct = await fetchProductData(scannedCode);
        setProduct({
          name: fetchedProduct.name,
          brands: fetchedProduct.brands,
          image_front_url: fetchedProduct.image_front_url,
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
    <View style={styles.container}>
      <Text style={styles.text}>Nome: {product.name}</Text>
      <Text style={styles.text}>Marca: {product.brands}</Text>
      {product.image_front_url && (
        <Image source={{ uri: product.image_front_url }} style={styles.image} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});
