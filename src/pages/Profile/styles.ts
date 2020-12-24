import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Container = styled.ScrollView`
  flex: 1;
  padding: 0 30px ${Platform.OS === 'android' ? 150 : 40}px;
`;

export const Content = styled.View`
  align-items: center;
  justify-content: center;
`;

export const Title = styled.Text`
  font-size: 20px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 24px 0;
`;

export const BackButton = styled.TouchableOpacity`
  margin-top: 40px;
`;

export const UserAvatarButton = styled.TouchableOpacity`
  margin-top: 32px;
`;

export const UserAvatar = styled.Image`
  width: 186px;
  height: 186px;
  border-radius: 98px;
  align-self: center;
`;

export const SignOutButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  margin: 32px 0;
  flex-direction: row;
`;

export const SignOutButtonText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  color: #ef3601;
  font-size: 18px;
  margin-left: 10px;
`;
