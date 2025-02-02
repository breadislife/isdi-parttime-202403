import { View, Text, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProfileAlbumItem = ({ item }) => {
   const navigation = useNavigation();

   return (
      <Pressable className="bg-palette-80 active:opacity-70 rounded-lg p-1 mx-2 my-1.5 items-center w-36 h-44" onPress={() => navigation?.navigate('AlbumScreen', { albumId: item.id })}>
         <View className="w-32 h-32 mt-1 rounded-lg justify-center">
            <Image source={item.coverArt ? { uri: item.coverArt } : require('../../../assets/images/extras/unknown.png')} className="w-32 h-32 rounded-md" />
         </View>

         <View className="w-full px-1 pt-1">
            <Text className="text-palette-40 font-spacemono-bold text-[9px] text-start leading-tight" numberOfLines={1} ellipsizeMode="tail">
               {item.name}
            </Text>

            <Text className="text-palette-40 font-spacemono text-[8.5px] leading-tight" numberOfLines={1} ellipsizeMode="tail">
               by {item.artists[0].username}
            </Text>
         </View>
      </Pressable>
   );
};

export default ProfileAlbumItem;
