import type { ReactNode } from 'react';

type CrmLayoutProps = {
  children: ReactNode;
};

export default function CrmLayout({ children }: CrmLayoutProps) {
  return <section>{children}</section>;
}
