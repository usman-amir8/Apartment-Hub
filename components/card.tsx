
import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

type CardProps = ViewProps & {
  children: React.ReactNode;
};

export default function Card({ children, style, ...props }: CardProps) {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
}



const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 18,
    marginBottom: 18,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
});

