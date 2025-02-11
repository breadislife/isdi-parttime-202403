import { Pressable, Image } from 'react-native';
import { ItemIcons } from '../../../assets/images/icons';

const FollowButton = ({ onPress, isFollowed }) => {
   return (
      <Pressable className="h-9 w-9 rounded-full justify-center items-center" onPress={onPress}>
         <Image source={isFollowed ? ItemIcons.checkIcon : ItemIcons.addIcon} className="h-4 w-4 my-auto" resizeMode="contain" />
      </Pressable>
   );
};

export default FollowButton;
