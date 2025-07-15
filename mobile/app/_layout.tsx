import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider } from '../contexts/AuthContext';
import { LanguageProvider } from '../contexts/LanguageContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <PaperProvider>
      <AuthProvider>
        <LanguageProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="auth/login" options={{ title: '로그인' }} />
            <Stack.Screen name="auth/register" options={{ title: '회원가입' }} />
            <Stack.Screen name="content/[id]" options={{ title: '학습하기' }} />
            <Stack.Screen name="profile" options={{ title: '프로필' }} />
            <Stack.Screen name="vocabulary" options={{ title: '단어장' }} />
            <Stack.Screen name="notes" options={{ title: '학습 노트' }} />
            <Stack.Screen name="community" options={{ title: '커뮤니티' }} />
          </Stack>
        </LanguageProvider>
      </AuthProvider>
    </PaperProvider>
  );
} 