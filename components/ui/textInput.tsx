import React from 'react';
import {
    TextInput as RNTextInput,
    StyleSheet,
    Text,
    TextInputProps,
    View,
} from 'react-native';

interface TextInputPropsExtended extends TextInputProps {
  error?: string | boolean;
}

export default function TextInput({
  style,
  error,
  ...props
}: TextInputPropsExtended) {
  return (
    <View style={styles.container}>
      <RNTextInput
        style={[
          styles.input,
          error ? styles.errorBorder : null,
          style,
        ]}
        placeholderTextColor="#999"
        {...props}
      />
      {error && typeof error === 'string' && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 16,
    color: '#1c1c1e',
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  errorBorder: {
    borderColor: '#d32f2f',
    backgroundColor: '#fff0f0',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 13,
    marginTop: 6,
    marginLeft: 4,
  },
});
