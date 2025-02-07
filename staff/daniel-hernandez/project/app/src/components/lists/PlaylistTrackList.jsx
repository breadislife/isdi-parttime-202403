import { View, Text, FlatList } from 'react-native';
import { PlaylistTrackItem } from '../items';

const PlaylistTrackList = ({ items, playlistId, ...props }) => {
   const renderEmptyList = () => (
      <View className="w-[90%] bg-palette-80 items-center p-4 pt-3 mt-1.5 rounded-lg self-center">
         <Text className="font-poppins-semibold text-palette-40 text-base">Dang!</Text>
         <Text className="font-poppins text-palette-40 text-sm">No tracks in this playlist.</Text>
      </View>
   );

   return <FlatList data={items} keyExtractor={item => item.id} renderItem={({ item, index }) => <PlaylistTrackItem item={item} onMore={() => {}} playlist={items} index={index} playlistId={playlistId} />} showsVerticalScrollIndicator={false} ListEmptyComponent={renderEmptyList} {...props} />;
};

export default PlaylistTrackList;
