// components/SafeAreaLayout.tsx
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  children: React.ReactNode;
}

const SafeAreaLayout: React.FC<Props> = ({ children }) => (
  <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
);

export default SafeAreaLayout;
