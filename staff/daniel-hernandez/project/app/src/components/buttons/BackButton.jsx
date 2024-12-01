import { Pressable, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BackButton = () => {
   const navigation = useNavigation();

   return (
      <Pressable className="bg-palette-80 w-[36] h-[36] justify-center rounded-xl ml-[0.75rem]" onPress={() => navigation?.goBack()}>
         <Text className="text-palette-30 text-center text-4xl font-monaspace">«</Text>
      </Pressable>
   );
};

export default BackButton;
