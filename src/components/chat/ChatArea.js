import React from 'react';
import MediaCard from './MediaCard';

// Demo media items to preview the card UI
const demoMedia = [
  {
    id: '1',
    title: 'Ancient African Kingdoms – Cinematic Footage',
    thumbnail: 'https://images.pexels.com/photos/3889843/pexels-photo-3889843.jpeg?auto=compress&cs=tinysrgb&w=400',
    url: 'https://www.pexels.com/video/drone-footage-of-a-green-forest-3889843/',
    previewUrl: 'https://www.pexels.com/video/drone-footage-of-a-green-forest-3889843/',
    source: 'Pexels',
    author: 'Taryn Elliott',
    type: 'video',
    license: 'Pexels License (Free)',
  },
  {
    id: '2',
    title: 'Pyramids of Giza at Golden Hour',
    thumbnail: 'https://images.pexels.com/photos/71241/pexels-photo-71241.jpeg?auto=compress&cs=tinysrgb&w=400',
    url: 'https://images.pexels.com/photos/71241/pexels-photo-71241.jpeg',
    previewUrl: 'https://images.pexels.com/photos/71241/pexels-photo-71241.jpeg',
    source: 'Unsplash',
    author: 'Spencer Davis',
    type: 'image',
    license: 'Unsplash License (Free)',
  },
  {
    id: '3',
    title: 'African Tribal Drums – Ambient Sound',
    thumbnail: null,
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Ode_to_Joy_Piano.ogg',
    previewUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Ode_to_Joy_Piano.ogg',
    source: 'Wikimedia',
    author: 'Open Source',
    type: 'audio',
    license: 'Creative Commons',
  },
];

const ChatArea = () => {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-800 p-4 md:p-8 text-gray-200">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* User Message */}
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-blue-600 shrink-0 flex items-center justify-center font-bold text-sm text-white">
            U
          </div>
          <div className="flex-1">
            <p className="font-semibold mb-1 text-gray-300">You</p>
            <p className="text-gray-300">Create a documentary about African history</p>
          </div>
        </div>

        {/* AI Assistant Message */}
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-emerald-600 shrink-0 flex items-center justify-center font-bold text-sm text-white">
            AI
          </div>
          <div className="flex-1">
            <p className="font-semibold mb-1 text-gray-300">Refly</p>
            <p className="text-gray-300 mb-4">
              I found <strong className="text-white">3 references</strong> for your documentary on African history. You can download or copy the link for any resource below.
            </p>

            {/* Media Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {demoMedia.map((item) => (
                <MediaCard key={item.id} media={item} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChatArea;

