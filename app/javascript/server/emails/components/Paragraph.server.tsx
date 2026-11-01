import { Text } from '@react-email/components';
import type { ReactNode } from 'react';

export function Paragraph({ children }: { children: ReactNode }) {
  return <Text className="font-sans-serif text-almost-black">{children}</Text>;
}
