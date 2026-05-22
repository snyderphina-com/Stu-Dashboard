import { useState } from "react";
import { motion,AnimatePresence } from "framer-motion";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc,setDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

import { storage, auth, db } from "../firebase";

export default function ProfileMenu({
  user,
  profile,
  darkMode,
  setDarkMode,
  navigate,
  setProfile,
}) {

  const [open, setOpen] = useState(false);
const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);



  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/signin");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };


const handleImageUpload = async (e) => {
  try {
    console.log("UPLOAD STARTED");

    const file = e.target.files[0];

    console.log("FILE:", file);

    if (!file) return;

    if (!user) {
      console.log("NO USER FOUND");
      return;
    }

    console.log("USER:", user);

    const storageRef = ref(
      storage,
      `profileImages/${user.uid}/${file.name}`
    );

    console.log("STORAGE REF CREATED");

    // Upload image
    await uploadBytes(storageRef, file);

    console.log("UPLOAD SUCCESS");

    // Get image URL
    const url = await getDownloadURL(storageRef);

    console.log("DOWNLOAD URL:", url);

    // Save to Firestore
    await setDoc(
      doc(db, "users", user.uid),
      {
        photoURL: url,
      },
      { merge: true }
    );

    console.log("FIRESTORE UPDATED");

    // Update local UI instantly
    if (setProfile) {
      setProfile((prev) => ({
        ...prev,
        photoURL: url,
      }));
    }

  } catch (error) {
    console.error("UPLOAD ERROR:", error);
  }
};

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 bg-opacity-25"
      >
        <img
          src={
            profile?.photoURL ||
            user?.photoURL ||
            `https://ui-avatars.com/api/?name=${user?.email}`
          }
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover"
        />
      </button>

      {/* Dropdown */}
     <AnimatePresence>
  {open && (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.3,
        y: -10,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        scale: 0.3,
        y: -10,
      }}
      transition={{
        duration: 0.22,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        transformOrigin: "top right",
      }}
      className="absolute right-0 mt-2 w-56 bg-blue-900/20 border border-purple-500/50 rounded-xl shadow-lg overflow-hidden z-50 p-5 flex flex-col gap-5"
    >
      {/* Upload Photo */}
      <motion.label 
       whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      className="cursor-pointer text-sm text-white bg-purple-300 hover:bg-slate-700 px-3 py-2 rounded-lg transition" 
       style={{
          background:
            "linear-gradient(135deg, #7c3aed, #4f46e5)",
          border:
            "1px solid rgba(139,92,246,0.4)",
          boxShadow:
            "0 4px 20px rgba(124,58,237,0.25)",
        }}
      >
        👤 Upload Photo
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </motion.label>

      {/* Dark Mode */}
      <motion.button
       whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
         style={{
          background:
            "linear-gradient(135deg, #7c3aed, #4f46e5)",
          border:
            "1px solid rgba(139,92,246,0.4)",
          boxShadow:
            "0 4px 20px rgba(124,58,237,0.25)",
        }}
        onClick={() => setDarkMode((prev) => !prev)}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition
        ${
          darkMode
            ? "bg-slate-700 text-yellow-300 hover:bg-slate-600"
            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
        }`}
      >
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </motion.button>

      {/* Logout */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
       onClick={() => setShowLogoutConfirm(true)}
        className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
        style={{
          background:
            "linear-gradient(135deg, #ed3a70, #bb282f)",
          border:
            "1px solid rgba(139,92,246,0.4)",
          boxShadow:
            "0 4px 20px rgba(124,58,237,0.25)",
        }}
      >
        Sign Out →
      </motion.button>
    </motion.div>
  )}
</AnimatePresence>

<AnimatePresence>
  {showLogoutConfirm && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.7,
          y: 20,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.7,
          y: 20,
        }}
        transition={{
          duration: 0.2,
        }}
        className="
          w-[90%] max-w-sm
          rounded-2xl
          bg-blue-500/40
          backdrop-blur-xl
          border border-purple-500/50
          p-6
          shadow-2xl
        "
      >
        <div className="flex flex-col gap-5">
          
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-red-500/30 border border-red-500/40 flex items-center justify-center text-2xl">
            ⚠️
          </div>

          {/* Text */}
          <div>
            <h2 className="text-white text-lg font-semibold">
              Confirm Logout
            </h2>

            <p className="text-white/50 text-sm mt-1">
              Are you sure you want to sign out of your account?
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            
            <button
              onClick={() =>
                setShowLogoutConfirm(false)
              }
              className="
                px-4 py-2 rounded-xl
                bg-white/5
                hover:bg-white/10
                border border-white/10
                text-white text-sm
                transition
              "
            >
              Cancel
            </button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLogout}
              className="
                px-4 py-2 rounded-xl
                text-sm font-semibold
                text-white
              "
              style={{
                background:
                  "linear-gradient(135deg, #ef4444, #dc2626)",
              }}
            >
              Logout
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

      
    </div>
  );
}