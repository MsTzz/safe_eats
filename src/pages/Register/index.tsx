import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, ScrollView, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Animatable from 'react-native-animatable';
import { StackNavigationProp } from '@react-navigation/stack';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

type RootStackParamList = {
    SignIn: undefined;
    Main: undefined;
    Register: undefined;
};

type RegisterScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Register'
>;

type RegisterProps = {
    navigation: RegisterScreenNavigationProp;
};

export default function Register({ navigation }: RegisterProps) {
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [nationality, setNationality] = useState('');
    const [nationalities, setNationalities] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNationalities = async () => {
            try {
                const response = await axios.get('https://restcountries.com/v3.1/all');
                const countryNames = response.data.map((country: any) => {
                    if (country.translations && country.translations.por && country.translations.por.common) {
                        return country.translations.por.common;
                    } else if (country.name && country.name.common) {
                        return country.name.common;
                    }
                    return null;
                }).filter((name: string | null) => name !== null);

                countryNames.sort((a: string, b: string) => a.localeCompare(b)); // Ordena a lista alfabeticamente

                setNationalities(countryNames);
            } catch (error) {
                console.error('Error fetching nationalities:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNationalities();
    }, []);

    const onChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const showDatepicker = () => {
        setShow(true);
    };

    const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <View style={styles.container}>
            <Animatable.View animation="fadeInLeft" delay={500} style={styles.containerHeader}>
                <Text style={styles.message}>Cadastrar uma conta</Text>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" style={styles.containerForm}>
                <ScrollView style={styles.scrollView}>
                    <Text style={styles.title}>Primeiro nome</Text>
                    <TextInput
                        placeholder="Digite seu primeiro nome..."
                        style={styles.input}
                    />

                    <Text style={styles.title}>Último nome</Text>
                    <TextInput
                        placeholder="Digite seu último nome..."
                        style={styles.input}
                    />

                    <Text style={styles.title}>Data de Nascimento</Text>
                    <TouchableOpacity onPress={showDatepicker} style={styles.input}>
                        <Text>{formatDate(date)}</Text>
                    </TouchableOpacity>
                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode="date"
                            display="default"
                            onChange={onChange}
                        />
                    )}

                    <Text style={styles.title}>Nacionalidade</Text>
                    {loading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={nationality}
                                style={styles.picker}
                                onValueChange={(itemValue, itemIndex) => setNationality(itemValue)}
                            >
                                <Picker.Item label="Selecione sua nacionalidade" value="" />
                                {nationalities.map((nation, index) => (
                                    <Picker.Item key={index} label={nation} value={nation} />
                                ))}
                            </Picker>
                        </View>
                    )}

                    <Text style={styles.title}>Nome de Usuário</Text>
                    <TextInput
                        placeholder="Digite seu nome de usuário..."
                        style={styles.input}
                    />

                    <Text style={styles.title}>Senha</Text>
                    <TextInput
                        placeholder="Digite sua senha"
                        style={styles.input}
                        secureTextEntry
                    />

                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => navigation.navigate('Main')} // Navegar para "Main" que usa a função Routes
                    >
                        <Text style={styles.buttonText}>Cadastrar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.buttonRegister}
                        onPress={() => navigation.navigate('SignIn')} // Navegar para "SignIn" que usa a função Routes
                    >
                        <Text style={styles.registerText}>Já possui uma conta? Entre</Text>
                    </TouchableOpacity>
                </ScrollView>
            </Animatable.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#C4CEB0'
    },
    containerHeader:{
        marginTop: '14%',
        marginBottom: '8%',
        paddingStart: '5%'
    },
    message:{
        fontSize: 28,
        fontWeight: 'bold',
    },
    containerForm:{
        backgroundColor: '#FFF',
        flex: 1,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%'
    },
    scrollView: {
        flex: 1,
    },
    title:{
        fontSize: 20,
        marginTop: 28
    },
    input:{
        borderBottomWidth: 1,
        height: 40,
        marginBottom: 12,
        fontSize: 16,
        justifyContent: 'center'
    },
    pickerContainer: {
        borderBottomWidth: 1,
        marginBottom: 12
    },
    picker: {
        height: 40,
        width: '100%',
    },
    button:{
        backgroundColor: '#C4CEB0',
        width: '100%',
        borderRadius: 4,
        paddingVertical: 8,
        marginTop: 14,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText:{
        fontSize: 18,
        fontWeight: 'bold'
    },
    buttonRegister:{
        marginTop: 14,
        alignSelf: 'center'
    },
    registerText:{
        color: '#A1A1A1',
        marginBottom: 14,
    }
});
