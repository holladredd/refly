import React from 'react';

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
            <div className="prose prose-invert max-w-none text-gray-300">
              <p>Create a documentary about African history</p>
            </div>
          </div>
        </div>

        {/* AI Assistant Message */}
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-emerald-600 shrink-0 flex items-center justify-center font-bold text-sm text-white">
            AI
          </div>
          <div className="flex-1">
            <p className="font-semibold mb-1 text-gray-300">Scout</p>
            <div className="prose prose-invert max-w-none text-gray-300">
              <p>I can help you build an incredible documentary about African history. Here is a proposed outline and some visual references to get you started:</p>
              
              <div className="my-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Media Card Placeholder */}
                <div className="bg-gray-700 rounded-lg overflow-hidden border border-gray-600 shadow-md">
                  <div className="h-32 bg-gray-600 flex items-center justify-center">
                    <span className="text-gray-400">Media Preview</span>
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm font-semibold truncate text-white">Ancient Kingdoms</h4>
                    <p className="text-xs text-gray-400">Pexels • Video</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ChatArea;
