import React, { useState } from 'react';
import { FiDownload, FiLink, FiExternalLink, FiBookmark, FiPlay, FiImage, FiMusic } from 'react-icons/fi';
import Swal from 'sweetalert2';

const MediaCard = ({ media }) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const {
    title = 'Untitled',
    thumbnail,
    previewUrl,
    url,
    source,
    author,
    type = 'image',
    license,
    description,
    duration,
    views,
  } = media || {};

  // Derive the resource URL — previewUrl for display, url for download/copy
  const resourceUrl = url || previewUrl || '#';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(resourceUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Copy Failed',
        text: 'Could not copy link. Please copy it manually.',
        background: '#1f2937',
        color: '#f3f4f6',
      });
    }
  };

  const handleDownload = async () => {
    try {
      // Open in new tab as a fallback for cross-origin media
      const link = document.createElement('a');
      link.href = resourceUrl;
      link.download = title;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Download Failed',
        text: 'Could not download this resource. Try opening it directly.',
        background: '#1f2937',
        color: '#f3f4f6',
      });
    }
  };

  const handleSave = () => {
    setSaved((prev) => !prev);
    // TODO: Persist to backend in Milestone 5
  };

  const TypeIcon = {
    video: FiPlay,
    image: FiImage,
    audio: FiMusic,
  }[type] || FiImage;

  return (
    <div className="bg-gray-700 rounded-xl overflow-hidden border border-gray-600 shadow-md hover:shadow-lg hover:border-gray-500 transition-all group flex flex-col">
      {/* Thumbnail / Preview */}
      <div className="relative h-36 bg-gray-800 overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <TypeIcon className="text-4xl" />
          </div>
        )}

        {/* Type Badge */}
        <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
          <TypeIcon className="text-xs" />
          <span className="capitalize">{type}</span>
        </div>

        {/* Save / Bookmark */}
        <button
          onClick={handleSave}
          title={saved ? 'Saved' : 'Save'}
          className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm transition-colors ${
            saved ? 'bg-blue-600 text-white' : 'bg-black/60 text-white hover:bg-blue-600'
          }`}
        >
          <FiBookmark className={`text-sm ${saved ? 'fill-white' : ''}`} />
        </button>
      </div>

        {/* Info */}
      <div className="p-3 flex-1 flex flex-col">
        <h4 className="text-sm font-semibold text-white line-clamp-2 mb-1" title={title}>
          {title}
        </h4>

        {/* AI-generated description */}
        {description && (
          <p className="text-xs text-blue-300/80 italic mb-2 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
          <span className="truncate font-medium">{source || 'Unknown Source'}</span>
          {author && <span className="truncate ml-2 text-gray-500">by {author}</span>}
        </div>

        {/* Duration / Views for videos */}
        {(duration || views) && (
          <div className="flex gap-3 text-[10px] text-gray-600 mb-2">
            {duration && <span>⏱ {duration}</span>}
            {views && <span>👁 {Number(views).toLocaleString()} views</span>}
          </div>
        )}

        {license && (
          <p className="text-[10px] text-gray-600 mb-2 truncate">📜 {license}</p>
        )}

        {/* Actions */}
        <div className="mt-auto flex items-center gap-2">
          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            title="Copy Link"
            className={`flex-1 flex items-center justify-center gap-1.5 text-xs py-1.5 px-2 rounded-lg border transition-colors ${
              copied
                ? 'border-green-500 bg-green-500/10 text-green-400'
                : 'border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white'
            }`}
          >
            <FiLink className="text-xs shrink-0" />
            {copied ? 'Copied!' : 'Copy Link'}
          </button>

          {/* Download */}
          <button
            onClick={handleDownload}
            title="Download"
            className="flex items-center justify-center gap-1.5 text-xs py-1.5 px-2 rounded-lg border border-gray-600 hover:border-blue-500 hover:bg-blue-500/10 text-gray-300 hover:text-blue-400 transition-colors"
          >
            <FiDownload className="text-xs shrink-0" />
            Download
          </button>

          {/* Open Source */}
          <a
            href={resourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open Source"
            className="p-1.5 rounded-lg border border-gray-600 hover:border-gray-400 text-gray-400 hover:text-white transition-colors"
          >
            <FiExternalLink className="text-xs" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default MediaCard;
