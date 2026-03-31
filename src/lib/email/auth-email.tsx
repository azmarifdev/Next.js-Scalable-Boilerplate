import { Body, Container, Head, Html, Preview, Text } from "@react-email/components";

interface AuthEmailProps {
  name: string;
}

export function AuthWelcomeEmail({ name }: AuthEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Next Starter Template</Preview>
      <Body>
        <Container>
          <Text>Hello {name},</Text>
          <Text>Welcome to Next Starter Template. Your account is ready.</Text>
        </Container>
      </Body>
    </Html>
  );
}
