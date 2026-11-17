import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const SENTIDOS = {
  CtoF: { de: '°C', para: '°F', rotulo: 'Celsius → Fahrenheit' },
  FtoC: { de: '°F', para: '°C', rotulo: 'Fahrenheit → Celsius' },
};

function formatar(numero) {
  // Até 2 casas decimais, sem zeros sobrando, com vírgula
  return String(Number(numero.toFixed(2))).replace('.', ',');
}

export default function App() {
  const [sentido, setSentido] = useState('CtoF');
  const [valor, setValor] = useState('');
  const [erro, setErro] = useState('');
  const [resultado, setResultado] = useState(null);

  function trocarSentido(novo) {
    setSentido(novo);
    setResultado(null);
    setErro('');
  }

  function converter() {
    const texto = valor.trim().replace(',', '.');

    if (texto === '') {
      setResultado(null);
      setErro('Informe a temperatura que deseja converter.');
      return;
    }

    const numero = Number(texto);
    if (Number.isNaN(numero)) {
      setResultado(null);
      setErro('Digite apenas números. Exemplo: 30 ou -5,5.');
      return;
    }

    const convertido =
      sentido === 'CtoF' ? (numero * 9) / 5 + 32 : ((numero - 32) * 5) / 9;

    setErro('');
    setResultado({
      origem: `${formatar(numero)} ${SENTIDOS[sentido].de}`,
      destino: `${formatar(convertido)} ${SENTIDOS[sentido].para}`,
    });
  }

  function limpar() {
    setValor('');
    setErro('');
    setResultado(null);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="dark" />

      <Text style={styles.titulo}>Conversor de temperatura</Text>
      <Text style={styles.subtitulo}>Converta entre Celsius e Fahrenheit.</Text>

      <Text style={styles.label}>Sentido da conversão</Text>
      <View style={styles.seletor}>
        {Object.entries(SENTIDOS).map(([chave, info]) => {
          const ativo = sentido === chave;
          return (
            <Pressable
              key={chave}
              style={[styles.opcao, ativo && styles.opcaoAtiva]}
              onPress={() => trocarSentido(chave)}
            >
              <Text style={[styles.opcaoTexto, ativo && styles.opcaoTextoAtivo]}>
                {info.rotulo}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.label, styles.espaco]}>
        Temperatura em {SENTIDOS[sentido].de}
      </Text>
      <TextInput
        style={[styles.input, erro ? styles.inputErro : null]}
        placeholder="Ex.: 30"
        placeholderTextColor="#9aa0a6"
        keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'}
        value={valor}
        onChangeText={setValor}
        onSubmitEditing={converter}
      />

      {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

      <View style={styles.botoes}>
        <Pressable
          style={({ pressed }) => [styles.botao, pressed && styles.pressionado]}
          onPress={converter}
        >
          <Text style={styles.botaoTexto}>Converter</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.botao,
            styles.botaoSecundario,
            pressed && styles.pressionado,
          ]}
          onPress={limpar}
        >
          <Text style={[styles.botaoTexto, styles.botaoSecundarioTexto]}>Limpar</Text>
        </Pressable>
      </View>

      {resultado && (
        <View style={styles.cartao}>
          <Text style={styles.cartaoOrigem}>{resultado.origem} equivale a</Text>
          <Text style={styles.cartaoDestino}>{resultado.destino}</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf4ec',
    padding: 24,
    justifyContent: 'center',
  },
  titulo: { fontSize: 28, fontWeight: '700', color: '#3a2a1c' },
  subtitulo: { fontSize: 15, color: '#7a6552', marginTop: 4, marginBottom: 24 },
  label: { fontSize: 15, fontWeight: '600', color: '#3a2a1c', marginBottom: 6 },
  espaco: { marginTop: 18 },
  seletor: {
    flexDirection: 'row',
    gap: 10,
  },
  opcao: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#e0cdb8',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  opcaoAtiva: {
    backgroundColor: '#c8561f',
    borderColor: '#c8561f',
  },
  opcaoTexto: { fontSize: 14, fontWeight: '600', color: '#7a6552' },
  opcaoTextoAtivo: { color: '#ffffff' },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e0cdb8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 18,
    color: '#3a2a1c',
  },
  inputErro: { borderColor: '#b3261e' },
  erro: { color: '#b3261e', marginTop: 8, fontSize: 14 },
  botoes: { flexDirection: 'row', gap: 12, marginTop: 20 },
  botao: {
    flex: 1,
    backgroundColor: '#c8561f',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  pressionado: { opacity: 0.8 },
  botaoTexto: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  botaoSecundario: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#c8561f',
  },
  botaoSecundarioTexto: { color: '#c8561f' },
  cartao: {
    marginTop: 28,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0cdb8',
  },
  cartaoOrigem: { fontSize: 15, color: '#7a6552' },
  cartaoDestino: { fontSize: 42, fontWeight: '700', color: '#c8561f', marginTop: 6 },
});