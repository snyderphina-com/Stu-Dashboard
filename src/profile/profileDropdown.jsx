import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, auth, db } from "../firebase";
import { updateDoc, doc } from "firebase/firestore";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { motion } from "framer-motion";
import Dashboard from "../components/dashboard/Dashboard";
import {handleSignOut} from "../components/dashboard/Dashboard";

async function uploadProfilePic(file, user) {
  const storageRef = ref(storage, `profileImages/${user.uid}`);

  await uploadBytes(storageRef, file);

  const url = await getDownloadURL(storageRef);

  await updateDoc(doc(db, "users", user.uid), {
    photoURL: url,
  });

  return url;
}


export default function ProfileMenu({
  user,
  profile,
  darkMode,
  setDarkMode,
  navigate,
  setProfile
}) {
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/signin");
  };

  // 📸 upload image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `profileImages/${user.uid}`);

    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    await updateDoc(doc(db, "users", user.uid), {
      photoURL: url,
    });

    setProfile((p) => ({ ...p, photoURL: url }));
  };

  
  return (
    <div className="relative">

      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10"
      >
        <img
          src={
            profile?.photoURL ||
            user?.photoURL ||
            "https://ui-avatars.com/api/?name=" + user?.email
          }
          className="w-8 h-8 rounded-full"
        />
        <span className="text-sm text-white">▼</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-white/10 rounded-xl shadow-lg overflow-hidden z-50">

               {/* Dark mode toggle — Bonus 1 */}
        <button
          onClick={() => setDarkMode(d => !d)}
          className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200
            ${darkMode
              ? 'bg-slate-700 text-yellow-300 hover:bg-slate-600'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          aria-label="Toggle dark mode"
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>


          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={handleSignOut}
            className="px-6 py-2.5 rounded-2xl text-sm font-semibold text-white/70 transition-all"
            style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
    border: "1px solid rgba(139,92,246,0.4)",
    boxShadow: "0 4px 20px rgba(124,58,237,0.25)"}}
            aria-label="Sign out">
            Sign Out →
          </motion.button>
         
        </div>
      )}
    </div>
  );
}






