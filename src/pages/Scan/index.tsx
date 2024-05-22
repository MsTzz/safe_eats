import React, { useEffect, useState, useRef, useMemo } from 'react';
import { View, StyleSheet, Text, StatusBar, TouchableOpacity, Button, Image } from 'react-native';
import { Camera, Code, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';




export default function Scan() {

  const [flip, setFlip] = useState<'back' | 'front'>('back'); 
  const device = useCameraDevice(flip)

  const { hasPermission, requestPermission } = useCameraPermission();
  const [permission, setPermission] = useState<null | boolean>(null);

  const [usandoCan, setUsandoCan] = useState<boolean>(true);
  const camera = useRef<Camera>(null);
  const bottomSheetref = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["30%", "75%"], []);
  const [codigoScan, setCodigoScan] = useState<string | undefined>('');

  const apiURL = (`https://br.openfoodfacts.org/api/v0/product/${codigoScan}.json`);
  const [img, setImg] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [brands, setBrands] = useState<string | null>(null);


  const zerandoDadosScan = () => {
    setCodigoScan(undefined);
    setImg('');
    setName('');
    setBrands('');
  }

  const handleCloseAction = () => {
    
    bottomSheetref.current?.close();
    zerandoDadosScan();
    
  };

  
  useEffect(() => {
    (async () => {
      const result = await requestPermission();
      setPermission(result);
    })();
  }, [requestPermission]);

  if (permission === false) {
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
      
      setCodigoScan(codes[0].value);
      
      
      if (codigoScan != undefined) {
        setUsandoCan(false);
        console.log(`Código escaneado: ${codigoScan}`);
        //fetchProductData();
        

        
      }
         
    },
    
  });

  async function fetchProductData() {
    
    try{
      
      const response = await fetch(apiURL);
      const data = await response.json();

      if (data.status === 1){
        const product = data.product; 
        setImg(product.image_front_url); 
        setName(product.product_name);
        setBrands(product.brands_tags[0]);
        handleOpenAction();
        
      }

      console.log(name, img, brands);
      
    }
    catch (error) {
      console.error('Erro ao buscar dados da API:', error);  
    }
  }

  const handleOpenAction = () => {
    
    
    bottomSheetref.current?.expand()
  
  };


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      
      <View style={styles.container}>
      
        <StatusBar hidden />

        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={usandoCan}
          orientation="portrait-upside-down"
          resizeMode="contain"
          codeScanner={codeScanner}
          
        />
       
        <BottomSheet
          ref={bottomSheetref}
          index={-1}
          snapPoints={snapPoints}
          backgroundStyle={{ backgroundColor: '#c4ceb0'}}
          enablePanDownToClose={true}
          onClose={() => {
            setUsandoCan(true);
            zerandoDadosScan();
          }}
        >
          
          <View style={styles.resultadoAPI}>
              
            {img ? ( 
              <View>
                <Image
                  source={{ uri: img }}
                  style={styles.imgStyle}
                />
                <Text style={styles.resultText}>{name}</Text>
                <Text style={styles.resultText}>{brands}</Text>
              </View>
            ) : (
              <Text>Imagem não disponível</Text> 
            )}

            <Button title="Fechar" onPress={() => {

              setUsandoCan(true);
              handleCloseAction();

            }} />

          </View>

        </BottomSheet>

        <TouchableOpacity
          style={styles.ScanButton}
          onPress={() => {
          console.log('Scan'); 
          setUsandoCan(true);
          handleCloseAction();


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
    </GestureHandlerRootView>
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

  }
});
