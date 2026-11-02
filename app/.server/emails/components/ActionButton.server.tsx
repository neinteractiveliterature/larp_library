import { Button } from '@react-email/components';

export type ActionButtonProps = {
  href: string;
  children: string;
};

export function ActionButton({ href, children }: ActionButtonProps) {
  return (
    <Button href={href} className="box-border rounded bg-primary px-6 py-3 text-center font-sans-serif text-white">
      {children}
    </Button>
  );
}
