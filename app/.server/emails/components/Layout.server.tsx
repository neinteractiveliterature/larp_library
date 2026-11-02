import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Tailwind, Text } from '@react-email/components';
import type { ReactNode } from 'react';
import { emailTheme } from '~/.server/emails/theme';

export type LayoutProps = {
  previewText: string;
  children: ReactNode;
};

export function Layout({ previewText, children }: LayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind config={emailTheme}>
        <Body className="bg-light-grey font-sans-serif">
          <Container className="mx-auto my-8 max-w-[480px] bg-white px-8 py-6">
            <Heading as="h1" className="m-0 text-center text-2xl text-almost-black">
              Larp Library
            </Heading>
            <Section>{children}</Section>
            <Hr className="my-6 border-light-grey" />
            <Text className="text-center text-xs text-almost-black">
              <a href="https://www.larplibrary.org" className="text-primary">
                larplibrary.org
              </a>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
