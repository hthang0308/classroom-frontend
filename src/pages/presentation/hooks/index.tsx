import {
  useCallback, useEffect, useState,
} from 'react';

import presentationApi, { PresentationWithUserInfo } from '@/api/presentation';
import userApi, { User } from '@/api/user';
import * as notificationManager from '@/pages/common/notificationManager';
import { ErrorResponse, isAxiosError } from '@/utils/axiosErrorHandler';

export const useUser = () => {
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

export const usePresentation = (presentationId?: string) => {
  const [presentation, setPresentation] = useState<PresentationWithUserInfo>();
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
