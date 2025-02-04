import { Pressable, Image } from 'react-native';
import { ControlIcons } from '../../../assets/images/icons';

const PlayButton = ({ onPress }) => (
   <Pressable onPress={onPress} className="bg-palette-70">
      <Image source={ControlIcons.playIcon} resizeMode="contain" className="w-7 h-7" />
   </Pressable>
);

export default PlayButton;
