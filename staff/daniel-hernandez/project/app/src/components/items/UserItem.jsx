import { View, Image, Text, Pressable } from 'react-native';
import { ItemIcons } from '../../../assets/images/icons';

const UserItem = ({ item, onAdd, onGeneralPress }) => (
   <Pressable key={item.id} className="py-2 flex-row items-start w-[100%] px-5" onPress={() => onGeneralPress(item)}>
      <Image source={item.profileImage ? { uri: item.profileImage } : require('../../../assets/images/extras/unknown.png')} className="w-16 h-16 rounded-full mr-3" />

      <View className="flex-1 justify-start pt-3">
         <Text className="text-palette-40 font-spacemono-bold text-sm" numberOfLines={1} ellipsizeMode="tail">
            {item.username}
         </Text>

         <Text className="text-palette-40 font-spacemono text-xs leading-tight" numberOfLines={1} ellipsizeMode="tail">
            {`${item.followers} ${parseInt(item.followers) === 0 || parseInt(item.followers) > 1 ? 'followers' : 'follower'}`}
         </Text>
      </View>

      <Pressable
         className="self-center h-5 w-5 ml-2"
         onPress={event => {
            event.stopPropagation();
            onAdd(item.id);
         }}
      >
         <Image source={item.isFollowed ? ItemIcons.checkIcon : ItemIcons.addIcon} className="self-center h-4 w-4 my-auto" resizeMode="contain" />
      </Pressable>
   </Pressable>
);

export default UserItem;
