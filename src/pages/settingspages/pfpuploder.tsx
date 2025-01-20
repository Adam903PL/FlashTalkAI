import React, { useEffect, useState } from "react";
import { PhotographIcon } from "@heroicons/react/solid";
import { toast } from "react-toastify";

const ProfilePictureUploader: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setSelectedImage(file);
    }
  };
  const handleUpload = async () => {
    if (selectedImage) {
      const profilePicture = new FormData();
      profilePicture.append("profilePicture", selectedImage); // Zmień klucz na "profilePicture"
      profilePicture.append("userid", "12345"); // Przykładowe ID użytkownika
  
      try {
        const response = await fetch("http://localhost:4444/upload-profile-picture", {
          credentials: "include",
          method: "POST",
          body: profilePicture, // Nie ustawiaj ręcznie Content-Type
        }).then(resp=>resp.json())
        .then((data)=>{
          if(data.success){
            toast.success("The profile picture has been successfully changed")
          }
        })
      } catch (error) {
        console.error("Upload error:", error);
        alert("An error occurred while uploading the image.");
      }
    } else {
      alert("Please select an image first.");
    }
  };
  
  return (
    <div className="w-full flex justify-center items-center py-6">
      <div className="flex flex-col items-center bg-gray-800 p-6 rounded-lg shadow-lg space-y-4 w-96">
        {/* Profile Picture Section */}
        <div className="w-32 h-32 bg-gray-700 rounded-full flex justify-center items-center text-white text-3xl">
          {selectedImage ? (
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <PhotographIcon className="w-16 h-16" />
          )}
        </div>

        {/* Profile picture upload text */}
        <p className="text-xl text-gray-300">Upload Profile Picture</p>

        {/* File input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="fileInput"
        />

        {/* Upload button */}
        <label
          htmlFor="fileInput"
          className="w-full bg-blue-500 hover:bg-blue-600 transition-colors p-3 rounded-md text-white font-semibold flex justify-center items-center gap-2 cursor-pointer"
        >
          <PhotographIcon className="w-5 h-5" />
          Choose File
        </label>

        {/* Upload button */}
        <button
          onClick={handleUpload}
          className="w-full bg-green-500 hover:bg-green-600 transition-colors p-3 rounded-md text-white font-semibold flex justify-center items-center gap-2 mt-4"
        >
          Upload Image
        </button>
      </div>
    </div>
  );
};

export default ProfilePictureUploader;
