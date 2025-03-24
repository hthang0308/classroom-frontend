import { Container } from '@mantine/core';
import { useState } from 'react';

import Header from './header';
import MemberList from './memberList';

export default function GroupDetail() {
  const [role, setRole] = useState<string>('');

  return (
    <Container size="lg">
      <Header role={role} />
      <MemberList role={role} setRole={setRole} />
    </Container>
  );
}
