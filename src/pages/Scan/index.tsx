import React, { useEffect, useState, useRef } from 'react';
import { StatusBar, TouchableOpacity, Image, Modal, StyleSheet, Text, View, Platform, Linking, Pressable, ActivityIndicator, Dimensions } from 'react-native';
import { Camera, Code, useCameraDevice, useCameraFormat, useCameraPermission, useCodeScanner, Templates } from 'react-native-vision-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { fetchProductData } from './apiUtils';

type RootStackParamList = {
  Main: undefined;
  Scan: undefined;
  API: { scannedCode: string };
};

type SignInScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Scan'>;

type SignInProps = {
  navigation: SignInScreenNavigationProp;
};

const Scan: React.FC<SignInProps> = ({ navigation }) => {
  const [flip, setFlip] = useState<'back' | 'front'>('back');
  const device = useCameraDevice(flip);
  const format = useCameraFormat(device, Templates.Snapchat);
  const fps = format?.maxFps ?? 30;

  const { hasPermission, requestPermission } = useCameraPermission();
  const camera = useRef<Camera>(null);

  const [loading, setLoading] = useState(false);
  const [codigoScan, setCodigoScan] = useState<string | undefined>();
  const [scanning, setScanning] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [productImage, setProductImage] = useState<string | undefined>();
  const [productBrands, setProductBrands] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const zerarDadosScan = () => {
    setCodigoScan(undefined);
    setScanning(true);
    setProductImage(undefined);
    setProductBrands(undefined);
    setError(undefined);
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
    const settingsUrl = Platform.OS === 'android' ? 'app-settings:' : 'app-settings:';
    Linking.openURL(settingsUrl);
  };

  const handleCodeScanned = async (codes: Code[]) => {
    if (scanning) {
      setScanning(false);
      const scannedCode = codes[0]?.value;
      setCodigoScan(scannedCode);
      if (scannedCode) {
        console.log(`Código escaneado: ${scannedCode}`);
        setModalVisible(true);
        try {
          setLoading(true);
          const { image_front_url, brands } = await fetchProductData(scannedCode);
          setProductImage(image_front_url);
          setProductBrands(brands);
        } catch (error) {
          setError('Erro ao buscar dados da API');
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['ean-8', 'ean-13'],
    onCodeScanned: handleCodeScanned,
  });

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
            <Text style={[styles.modalText, { color: 'black' }]}>
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
      
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={styles.flipButton}
          onPress={() => {
            setFlip(flip === 'back' ? 'front' : 'back');
            console.log('Câmera invertida');
          }}
        >
          <MaterialCommunityIcons name="camera-flip-outline" size={34} color="white" />
        </TouchableOpacity>
        <View style={styles.infoBorda}>
          <Text style={styles.infoScan}>Escaneie um código para iniciar!</Text>
        </View>
      </View>

      {/* Componente da câmera */}
      {hasPermission && device && (
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          preview={true}
          orientation="portrait-upside-down"
          resizeMode="cover"
          format={format}
          codeScanner={codeScanner}
          fps={fps}
        />
      )}

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          zerarDadosScan();
        }}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, styles.modalContent]}>
            <View>
              {loading ? (
                <ActivityIndicator size="large" color="#566332" />
              ) : (
                <>
                  {productImage && (
                    <Image source={{ uri: productImage }} style={styles.productImage} />
                  )}
                  {productBrands && (
                    <Text style={styles.productBrands}>Nome do produto: {productBrands}</Text>
                  )}
                  {error && (
                    <Text style={styles.errorText}>{error}</Text>
                  )}
                </>
              )}
            </View>
            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setModalVisible(false);
                  zerarDadosScan();
                }}
              >
                <Text style={styles.buttonText}>Fechar</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => {
                  setModalVisible(false);
                  if (codigoScan) {
                    navigation.navigate('API', { scannedCode: codigoScan });
                    zerarDadosScan();
                  }
                }}
              >
                <Text style={styles.buttonText}>Ver Mais</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 10,
    zIndex: 1,
    backgroundColor: 'rgba(12, 12, 12, 0.9)',
  },
  infoScan: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 8,
  },
  infoBorda: {
    backgroundColor: '#c4ceb0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginLeft: 15,
  },
  flipButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    maxHeight: '70%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    minWidth: 100,
  },
  buttonOpen: {
    backgroundColor: '#566332',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  productImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  productBrands: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginTop: 10,
  },
  retryButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  modalContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default Scan;

