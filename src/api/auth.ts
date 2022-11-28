import axiosClient from '@/utils/axiosClient';

interface SignInResponseType {
  data: {
    token: string
    user: {
      id: string
      email: string
      name: string
      isLoggedInWithGoogle: false
    }
  }
  message: string
}

interface SignUpResponseType {
  data: {
    id: string
    email: string
  }
  message: string
}

const authApi = {
  signIn: (email: string, password: string) => (
    axiosClient.post<SignInResponseType>('/auth/sign-in', {
      email,
      password,
    })
  ),
  signUp: (email: string, password: string, name: string) => (
    axiosClient.post<SignUpResponseType>('/auth/sign-up', {
      email,
      password,
      name,
    })
  ),
};

export default authApi;
