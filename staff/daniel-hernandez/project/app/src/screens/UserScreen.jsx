import { View } from 'react-native';

const UserScreen = ({ route }) => {
   const { userId } = route.params;

   return <View className="flex-1 bg-palette-90"></View>;
};

export default UserScreen;
