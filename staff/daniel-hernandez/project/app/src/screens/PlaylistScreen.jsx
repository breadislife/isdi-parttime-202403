import { useEffect, useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import useNotification from '../hooks/useNotification';
import { useTrackStore } from '../store/track';
import SpinningLoader from '../components/loaders/SpinningLoader';
import RetryButton from '../components/buttons/RetryButton';
import PlaylistHeader from '../components/PlaylistHeader';
import PlaylistTrackList from '../components/lists/PlaylistTrackList';
import services from '../services';

const PlaylistScreen = ({ route }) => {
   const { playlistId } = route.params;
   const { notify, notificationTypes } = useNotification();
   const { currentTrackId } = useTrackStore();

   const [loading, setLoading] = useState(true);
   const [playlistInfo, setPlaylistInfo] = useState(null);

   useEffect(() => {
      getPlaylistInfo();
   }, [playlistId]);

   const getPlaylistInfo = useCallback(async () => {
      try {
         setLoading(true);

         const info = await services.getPlaylistInfo(playlistId);
         setPlaylistInfo(info);
      } catch {
         notify("Yeaozers couldn't get playlist...", notificationTypes.error);
         setPlaylistInfo(null);
      } finally {
         setLoading(false);
      }
   }, [playlistId, notify]);

   // TODO: create skeleton loader/placeholder ui of this screen
   return (
      <View className="flex-1 bg-palette-90">
         {!loading && playlistInfo && <PlaylistTrackList className="top-0" items={playlistInfo.tracks} contentContainerStyle={{ paddingBottom: currentTrackId ? 150 : 85 }} ListHeaderComponent={<PlaylistHeader item={playlistInfo} />} />}

         {loading && !playlistInfo && (
            <View className="flex-1 justify-center items-center">
               <SpinningLoader tintColor="#E36526" />
            </View>
         )}

         {!playlistInfo && !loading && (
            <View className="flex-1 items-center justify-center">
               <Text className="font-monaspace text-palette-40 text-[15px] mb-1.5">Something went wrong.</Text>
               <Text className="font-monaspace text-palette-40 text-[11px] leading-normal">God's in his heaven, All's right with the world.</Text>

               <RetryButton onPress={getPlaylistInfo} />
            </View>
         )}
      </View>
   );
};

export default PlaylistScreen;
