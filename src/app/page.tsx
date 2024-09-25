/* eslint-disable @next/next/no-img-element */
"use client";

import LoginForm from "@/components/LoginForm";
import axios from "axios";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

// import { IProduct } from "@/lib/Types/Product";
import { useState } from "react";
import QRCode from "react-qr-code";
// import QRCodeScanner from "./scanCode/CodeScanner";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const session = useSession();
  console.log(session);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string); // Preview the image locally
      };
      reader.readAsDataURL(file); // Convert the file to Base64
    }
  };

  // Upload the image to the API route
  const handleImageUpload = async () => {
    if (!selectedImage) return;

    setLoading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;

      try {
        const response = await axios.post("/api/image/upload", {
          data: base64String, // Sending the base64 string directly
        });

        // setUploadUrl(response.data.url); // The Cloudinary image URL
        const updatedImageUrl = response.data.url;

        session.update({
          ...session.data, // Spread the existing session data
          user: {
            ...session.data?.user, // Spread the existing user data
            image: updatedImageUrl, // Update the image URL
          },
        });
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(selectedImage); // Convert file to Base64
  };

  return (
    <div className="flex justify-center items-center h-screen flex-col">
      {session.data ? (
        <div className="flex w-full">
          <div className="flex-1 flex flex-col justify-center items-center">
            <div>
              <h2>Upload Profile Picture</h2>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

              {imagePreview && (
                <div>
                  <h4>Image Preview:</h4>
                  <img src={imagePreview} alt="Image Preview" width="200" />
                </div>
              )}

              <button
                onClick={handleImageUpload}
                disabled={loading}
                className="bg-green-800 text-white font-semibold rounded-xl mt-4 px-4 py-2"
              >
                {loading ? "Uploading..." : "Upload Image"}
              </button>
            </div>
            <h1 className="text-xl mt-10">{session?.data?.user?.name}</h1>
            <div className="my-4 rounded-full overflow-hidden w-96 h-96 max-w-96">
              <Image
                src={session?.data?.user?.image as string}
                height={200}
                width={200}
                className="h-full w-full object-cover"
                alt="profile"
              />
            </div>
            <h1>Logged in with google</h1>
            <button
              className="bg-red-800 text-white font-semibold rounded-xl mt-4 px-4 py-2"
              onClick={() => signOut({ callbackUrl: `/` })}
            >
              Log out
            </button>
          </div>
          <div className="text-4xl flex-1">
            <h2>QR Code</h2>

            <div>
              <QRCode value="http://localhost:3000/" size={256} />
            </div>

            <div>
              {/* <QRCodeScanner /> */}
            </div>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-2xl">You are not logged in</h1>
          <LoginForm />
          <button
            className="bg-green-800 text-white font-semibold rounded-xl mt-4 px-4 py-2"
            onClick={() => signIn("google")}
          >
            Login with Google
          </button>
        </>
      )}
    </div>
  );
}
