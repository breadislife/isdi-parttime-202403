import { useState, useEffect } from 'react';
import { View, Pressable, Text } from 'react-native';
import { useAuthStore } from '../store/auth';
import useNotification from '../hooks/useNotification';
import extractPayload from '../utils/extractPayload';

const ProfileButtonSet = ({ onFollowPress, item }) => {
   const { userToken } = useAuthStore();
   const { notify, notificationTypes } = useNotification();
   const [currentUserId, setCurrentUserId] = useState(null);

   useEffect(() => {
      try {
         const { sub } = extractPayload(userToken);
         setCurrentUserId(sub);
      } catch {
         notify("well.. that's not supposed to happen", notificationTypes.error);
      }
   }, [userToken]);

   return (
      <View className="bg-palette-90 w-full mt-1.5">
         <View className="bg-palette-80 mx-5 rounded-3xl p-3 flex-row justify-between">
            <Pressable
               onPress={event => {
                  event.stopPropagation();
                  onFollowPress(item.id);
               }}
               disabled={item?.id === currentUserId}
               className={`border-[1.2px] rounded-full h-7 w-auto px-4 justify-center bg-palette-80 ${item?.id === currentUserId ? 'border-palette-60' : 'border-palette-40'}`}
            >
               <Text disabled={true} className={`text-center font-spacemono-bold text-sm opacity-100 ${item?.id === currentUserId ? 'text-palette-60' : 'text-palette-40'}`}>
                  {item?.id === currentUserId ? '[~]' : item?.isFollowed ? 'Following' : 'Follow'}
               </Text>
            </Pressable>
         </View>
      </View>
   );
};

export default ProfileButtonSet;
