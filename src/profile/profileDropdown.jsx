import { useState } from "react";
import { motion } from "framer-motion";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateDoc, doc } from "firebase/firestore";
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

  // ─────────────────────────────────────────────
  // Logout
  // ─────────────────────────────────────────────
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/signin");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // ─────────────────────────────────────────────
  // Upload Profile Image
  // ─────────────────────────────────────────────
  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];

      if (!file) return;

      const storageRef = ref(
        storage,
        `profileImages/${user.uid}`
      );

      await uploadBytes(storageRef, file);

      const url = await getDownloadURL(storageRef);

      await updateDoc(
        doc(db, "users", user.uid),
        {
          photoURL: url,
        }
      );

      // Update local profile state
      if (setProfile) {
        setProfile((prev) => ({
          ...prev,
          photoURL: url,
        }));
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 bg-opacity-50 hover:bg-opacity-10 transition"
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
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-white/10 rounded-xl shadow-lg overflow-hidden z-50 p-3 flex flex-col gap-3">
          
          {/* Upload Photo */}
          <label className="cursor-pointer text-sm text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg transition">
            Upload Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          {/* Dark Mode */}
          <button
            onClick={() =>
              setDarkMode((prev) => !prev)
            }
            className={`px-3 py-2 rounded-lg text-sm font-medium transition
              ${
                darkMode
                  ? "bg-slate-700 text-yellow-300 hover:bg-slate-600"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
          >
            {darkMode
              ? "☀️ Light Mode"
              : "🌙 Dark Mode"}
          </button>

          {/* Logout */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
            style={{
              background:
                "linear-gradient(135deg, #7c3aed, #4f46e5)",
              border:
                "1px solid rgba(139,92,246,0.4)",
              boxShadow:
                "0 4px 20px rgba(124,58,237,0.25)",
            }}
          >
            Sign Out →
          </motion.button>
        </div>
      )}
    </div>
  );
}