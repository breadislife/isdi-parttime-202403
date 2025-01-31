import { View, Text, Image, FlatList, Pressable, Dimensions } from 'react-native';
import { useTrackStore } from '../../store/track';
import usePlayerHandlers from '../../hooks/usePlayerHandlers';
import SpinningLoader from '../loaders/SpinningLoader';
import formatSeconds from '../../utils/formatSeconds';

const ProfileTrackList = ({ items }) => {
   const { currentTrackId } = useTrackStore();
   const { handlePlay } = usePlayerHandlers();

   const renderTrackItem = ({ item }) => (
      <Pressable onPress={() => handlePlay(item)} className="bg-palette-80 active:opacity-70 rounded-lg p-1 mx-2 my-1.5 items-center w-36 h-44">
         <View className="w-32 h-32 mt-1 rounded-lg justify-center">
            {currentTrackId === item.id && <SpinningLoader className="absolute" tintColor="#E36526" />}

            <Image source={item.coverArt ? { uri: item.coverArt } : require('../../../assets/images/extras/unknown.png')} className="w-32 h-32 rounded-md" />
            {currentTrackId === item.id && <View className="absolute top-0 left-0 w-full h-full bg-palette-100 opacity-50 rounded-sm" />}
         </View>

         <View className="w-full px-1 pt-1">
            <Text className="text-palette-40 font-spacemono-bold text-[9px] text-start leading-tight" numberOfLines={1} ellipsizeMode="tail">
               {item.name}
            </Text>

            <View className="flex-row justify-between">
               <Text className="text-palette-40 font-spacemono text-[8.5px] leading-tight flex-1" numberOfLines={1} ellipsizeMode="tail">
                  {item?.artists?.length > 2
                     ? `${item?.artists
                          .slice(0, 2)
                          .map(artist => artist?.username)
                          .join(', ')}...`
                     : item?.artists.map(artist => artist?.username).join(', ')}
               </Text>

               <Text className="text-palette-40 font-spacemono text-[8.5px] leading-tight ml-1" numberOfLines={1}>{`${formatSeconds(parseInt(item.duration))}`}</Text>
            </View>
         </View>
      </Pressable>
   );

   const renderEmptyList = type => (
      <View className="w-[90%] bg-palette-80 items-center p-4 pt-3 mt-1.5 rounded-lg self-center">
         <Text className="font-poppins-semibold text-palette-40 text-base">Woah... 😳</Text>
         <Text className="font-poppins text-palette-40 text-sm"> {type === 'popular' ? "This user doesn't have any popular tracks yet." : "This user hasn't added any recent tracks."}</Text>
      </View>
   );

   return (
      <View className="bg-palette-90 w-full mt-1.5">
         <Text className="text-palette-40 font-spacemono-bold text-base mx-5 mt-1.5">« Popular Tracks »</Text>
         {items.popular.length === 0 ? (
            renderEmptyList('popular')
         ) : (
            <FlatList data={items.popular} renderItem={renderTrackItem} keyExtractor={item => item.id} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }} initialNumToRender={5} maxToRenderPerBatch={5} />
         )}

         <Text className="text-palette-40 font-spacemono-bold text-base mx-5 mt-1">« Recent Tracks »</Text>
         {items.recent.length === 0 ? (
            renderEmptyList('recent')
         ) : (
            <FlatList data={items.recent} renderItem={renderTrackItem} keyExtractor={item => item.id} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }} initialNumToRender={5} maxToRenderPerBatch={5} />
         )}
      </View>
   );
};

export default ProfileTrackList;
