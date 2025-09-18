'use client';

import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../lib/firebase/clientApp';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Image from 'next/image';
import Button from '../../components/Button';
import { CameraIcon } from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && user) {
      const file = e.target.files[0];
      const storageRef = ref(storage, `profile-pictures/${user.uid}`);
      setIsUploading(true);
      setError(null);

      try {
        await uploadBytes(storageRef, file);
        const photoURL = await getDownloadURL(storageRef);
        // Note: You would typically update the user's profile in your database
        // with this new photoURL. For this example, we'll just log it.
        console.log('Uploaded new profile picture:', photoURL);
        // Force a reload to see the new picture (in a real app, you'd update the state)
        window.location.reload(); 
      } catch (err) {
        setError('Failed to upload profile picture.');
        console.error(err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Your Profile
        </h1>
        
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 flex flex-col items-center md:flex-row md:items-start space-y-8 md:space-y-0 md:space-x-10 border border-gray-700">
          <div className="relative">
            <Image
              src={user?.photoURL || '/placeholder-avatar.svg'}
              alt="Profile Picture"
              width={150}
              height={150}
              className="rounded-full border-4 border-gray-600 shadow-lg"
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <Button 
              onClick={handleUploadClick} 
              className="absolute bottom-2 right-2 !p-3 !rounded-full" 
              disabled={isUploading}
            >
              {isUploading ? '...' : <CameraIcon className="h-6 w-6" />}
            </Button>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2">{user?.displayName || 'Anonymous User'}</h2>
            <p className="text-gray-400 text-lg mb-6">{user?.email}</p>
            
            {error && <p className="text-red-500 mt-4">{error}</p>}

            <div className="mt-8 border-t border-gray-700 pt-6">
              <h3 className="text-2xl font-semibold mb-4">More Information</h3>
              <p className="text-gray-500">More profile settings and information will be available here in the future.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
