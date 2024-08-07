import { Schema, model, Types } from 'mongoose';
const { ObjectId } = Types;

const PlaylistSchema = new Schema(
   {
      name: {
         type: String,
         required: true,
         trim: true,
         index: true
         /* match ? length limits ? */
      },
      description: {
         type: String,
         trim: true,
         maxLength: 300,
         default: ''
      },
      public: {
         type: Boolean,
         default: true
      },
      owner: {
         type: ObjectId,
         ref: 'User',
         required: true
      },
      tracks: [
         {
            type: ObjectId,
            ref: 'Track',
            index: true
         }
      ],
      followers: {
         total: {
            type: Number,
            required: true,
            default: 0
         }
      }
   },
   { timestamps: true }
);

const Playlist = model('Playlist', PlaylistSchema);
export default Playlist;