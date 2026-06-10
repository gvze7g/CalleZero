import React from "react";

const UserAvatar = ({ image, label }) => {
  if (image) {
    return (
      <img
        src={image}
        alt={label || "Producto"}
        className="h-11 w-11 rounded-full object-cover border border-white/10"
      />
    );
  }

  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-600 text-[12px] font-bold text-white">
      {(label || "?").charAt(0).toUpperCase()}
    </div>
  );
};

export default UserAvatar;