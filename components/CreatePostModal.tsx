import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useSocial } from '../context/SocialContext';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createPost } = useSocial();

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    
    setIsSubmitting(true);
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    createPost(caption, selectedFile);
    setIsSubmitting(false);
    
    // Reset and close
    setCaption('');
    setSelectedFile(null);
    setPreviewUrl(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-dark-900 border border-dark-700 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-dark-800">
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
          <h2 className="font-semibold text-lg">New Post</h2>
          <button 
            onClick={handleSubmit}
            disabled={!selectedFile || isSubmitting}
            className={`font-semibold text-primary-500 hover:text-primary-400 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Share'}
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col space-y-4">
          <div className="flex items-center justify-center w-full">
            {previewUrl ? (
              <div className="relative w-full aspect-square rounded-lg overflow-hidden group">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-video border-2 border-dashed border-dark-700 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:bg-dark-800 hover:border-dark-600 transition-all"
              >
                <ImageIcon size={48} className="mb-2" />
                <span className="text-sm">Select photo from device</span>
              </button>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <div className="flex space-x-3">
             <img src="https://picsum.photos/seed/me/150/150" className="w-8 h-8 rounded-full" alt="Me" />
             <textarea 
               value={caption}
               onChange={(e) => setCaption(e.target.value)}
               placeholder="Write a caption..." 
               className="w-full bg-transparent resize-none outline-none text-white placeholder-gray-500 min-h-[100px]"
             />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
