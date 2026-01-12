import { Loader2 } from "lucide-react";
import React from "react";

const AuthButton = ({ btnText, loading }) => {
  return (
    <button
      disabled={loading}
      className="w-full bg-moss bg-[#3d4d40] text-white py-4 rounded-xl font-bold shadow-lg shadow-moss/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 cursor-pointer hover:scale-105"
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Setting up your desk...
        </>
      ) : (
        btnText
      )}
    </button>
  );
};

export default AuthButton;
