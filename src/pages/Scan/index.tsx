import React, { useEffect, useState, useRef } from 'react';
import { StatusBar, TouchableOpacity, Image, Modal, StyleSheet, Text, View, Platform, Linking, Pressable } from 'react-native';
import { Camera, Code, useCameraDevice, useCameraFormat, useCameraPermission, useCodeScanner, Templates } from 'react-native-vision-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Main: undefined;
  Scan: undefined;
  API: undefined;
};

type SignInScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Scan'
>;

type SignInProps = {
  navigation: SignInScreenNavigationProp;
};

export default function Scan({ navigation }: SignInProps) {
  const [flip, setFlip] = useState<'back' | 'front'>('back'); 
  const device = useCameraDevice(flip);
  const format = useCameraFormat(device, Templates.Snapchat);
  const fps = format?.maxFps ?? 30;

  const { hasPermission, requestPermission } = useCameraPermission();
  const [usandoCan, setUsandoCan] = useState<boolean>(true);
  const camera = useRef<Camera>(null);
  const [codigoScan, setCodigoScan] = useState<string | undefined>('');
  const [scanning, setScanning] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [img, setImg] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [brands, setBrands] = useState<string | null>(null);

  const zerandoDadosScan = () => {
    setCodigoScan(undefined);
    setImg('');
    setName('');
    setBrands('');
    setUsandoCan(true);
    setScanning(true);
  };

  useEffect(() => {
    (async () => {
      await requestPermission();
    })();
  }, [requestPermission]);

  useEffect(() => {
    if (format) {
      console.log('Camera format:', format);
    }
  }, [format]);

  const openSettings = () => {
    if (Platform.OS === 'android') {
      Linking.openSettings();
    } else {
      Linking.openURL('app-settings:');
    }
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['ean-8', 'ean-13'],
    onCodeScanned: (codes: Code[]) => {
      if (scanning) {
        setScanning(false);
        const scannedCode = codes[0].value;
        setCodigoScan(scannedCode);
        if (scannedCode) {
          console.log(`Código escaneado: ${scannedCode}`);
          fetchProductData(scannedCode);
        }
      }
    },
  });

  async function fetchProductData(scannedCode: string) {
    const apiURL = `https://br.openfoodfacts.org/api/v0/product/${scannedCode}.json`;

    try {
      const response = await fetch(apiURL);
      const data = await response.json();

      if (data.status === 1) {
        const product = data.product;
        setImg(product.image_front_url);
        setName(product.product_name);
        setBrands(product.brands_tags[0]);
        console.log(name, img, brands);
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Erro ao buscar dados da API:', error);
    }
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text>Dispositivo de câmera não disponível.</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <View style={styles.modalView}>
          <View style={styles.modalContent}>
            <Text style={[{ color: 'black' }]}>
              Permissão para câmera foi negada. Por favor, ative-a nas configurações.
            </Text>
            <TouchableOpacity onPress={openSettings} style={styles.retryButton}>
              <Text style={[styles.buttonText, { color: 'white' }]}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      {hasPermission && device && (
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={usandoCan}
          preview={usandoCan}
          orientation="portrait-upside-down"
          resizeMode="cover"
          format={format}
          codeScanner={codeScanner}
          fps={fps}
        />
      )}

      <TouchableOpacity
        style={styles.ScanButton}
        onPress={() => {
          console.log('Scan');
          setUsandoCan(true);
          setScanning(true);
        }}
      >
        <MaterialCommunityIcons name="barcode-scan" size={32} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.flipButton}
        onPress={() => {
          setFlip(flip === 'back' ? 'front' : 'back');
          console.log('Câmera invertida');
        }}
      >
        <MaterialCommunityIcons name="camera-flip-outline" size={34} color="white" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.text}>Nome: {name}</Text>
          <Text style={styles.text}>Marca: {brands}</Text>
          {img && <Image source={{ uri: img }} style={styles.imgStyle} />}
          <Pressable
            style={styles.button}
            onPress={() => {
              setModalVisible(!modalVisible);
              navigation.navigate('API'); // Navega para a tela de API quando fecha o modal
              zerandoDadosScan();
            }}
          >
            <Text style={styles.buttonText}>Fechar</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  flipButton: {
    position: 'absolute',
    top: 30,
    right: 20,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
  ScanButton: {
    position: 'absolute',
    top: 120,
    right: 20,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 20,
  },
  imgStyle: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#566332',
    borderRadius: 5,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  retryButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});
