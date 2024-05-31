import React, { useEffect, useState, useRef } from 'react';
import { StatusBar, TouchableOpacity, Image, Modal, StyleSheet, Text, Pressable, View, Alert } from 'react-native';
import { Camera, Code, useCameraDevice, useCameraFormat, useCameraPermission, useCodeScanner, Templates } from 'react-native-vision-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function Scan() {

  const [flip, setFlip] = useState<'back' | 'front'>('back'); 
  const device = useCameraDevice(flip);
  const format = useCameraFormat(device, Templates.Snapchat);
  const fps = format?.maxFps ?? 30;

  const { hasPermission, requestPermission } = useCameraPermission();
  const [permission, setPermission] = useState<null | boolean>(null);

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
  }

   useEffect(() => {
    (async () => {
      const result = await requestPermission();
      setPermission(result);
    })();
  }, [requestPermission]);


  useEffect(() => {
    if (format) {
      console.log('Camera format:', format);
    }
  }, [format]);


  if (permission === false) {
    setUsandoCan(false);
    return (
      <View style={styles.container}>
        <Text>Permissão para câmera foi negada. Por favor, ative-a nas configurações.</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text style={styles.buttonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text>Dispositivo de câmera não disponível.</Text>
      </View>
    );
  }

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

  
  return (
    <View style={styles.container}>
        <StatusBar hidden />

        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={usandoCan}
          preview={usandoCan}
          orientation="portrait-upside-down"
          resizeMode="contain"
          format={format}
          codeScanner={codeScanner}
          fps={fps}
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(false);
          }}>
        </Modal>
        
               {/* <View>
                 <Image source={{ uri: img }} style={styles.imgStyle} />
                 <Text style={styles.resultText}>{name}</Text>
                 <Text style={styles.resultText}>{brands}</Text>
               </View> */}
           
           

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
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipButton: {
    position: 'absolute',
    top: 30,
    right: 20,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  ScanButton: {
    position: 'absolute',
    top: 120,
    right: 20,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 20,
  },
  resultText: {
    color: 'white',
    fontSize: 16,
    textAlign: "center",
  },
  imgStyle: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  resultadoAPI: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
