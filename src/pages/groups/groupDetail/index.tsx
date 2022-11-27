import { Container } from '@mantine/core';

import Header from './header';
import MemberList from './memberList';

export default function GroupDetail() {
  return (
    <Container size="lg">
      <Header />
      <MemberList />
    </Container>
  );
}
