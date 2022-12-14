import {
  Container, Skeleton, Title,
} from '@mantine/core';
import React, {
  useCallback, useEffect, useState,
} from 'react';

import { useParams } from 'react-router-dom';

import presentationApi, { PresentationWithUserCreated } from '@/api/presentation';
import userApi, { User } from '@/api/user';
import * as notificationManager from '@/pages/common/notificationManager';
import HostPresentation from '@/pages/presentation/active/hostPresentation';
import { ErrorResponse, isAxiosError } from '@/utils/axiosErrorHandler';

const useUser = () => {
  const [user, setUser] = useState<User>();
  const fetchData = async () => {
    try {
      const { data: response } = await userApi.getMe();

      setUser(response.data);
    } catch (error) {
      if (isAxiosError<ErrorResponse>(error)) {
        notificationManager.showFail('', error.response?.data.message);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { user };
};

const usePresentation = (presentationId: string) => {
  const [presentation, setPresentation] = useState<PresentationWithUserCreated>();
  const fetchData = useCallback(async () => {
    if (!presentationId) {
      return;
    }

    try {
      const { data: response } = await presentationApi.getPresentationById(presentationId);

      setPresentation(response.data);
    } catch (error) {
      if (isAxiosError<ErrorResponse>(error)) {
        notificationManager.showFail('', error.response?.data.message);
      }
    }
  }, [presentationId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { presentation };
};

export default function ActivePresentation() {
  const { presentationId = '' } = useParams<string>();
  const { user } = useUser();
  const { presentation } = usePresentation(presentationId);
  const isHost = (user?._id || 'unknown') === presentation?.userCreated._id;

  return (
    <Container fluid sx={{ height: '100%' }}>
      <Skeleton visible={user === undefined}>
        {
          isHost ? (
            <HostPresentation presentation={presentation as PresentationWithUserCreated} />
          ) : (
            <Title order={3} sx={{ textAlign: 'center' }}>You cannot start a presentation that is not yours</Title>
          )
        }
      </Skeleton>
    </Container>
  );
}
