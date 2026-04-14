import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineCamera } from "react-icons/ai";
import { addPost } from "../../redux/slices/postSlice";
import api from "../../utils/axiosInstance";
import toast from "react-hot-toast";

export default function CreatePost() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption.trim() && !file) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("caption", caption);
      if (file) fd.append("image", file);
      const { data } = await api.post("/posts", fd);
      dispatch(addPost(data));
      setCaption(""); setFile(null); setPreview(null);
      toast.success("Posted!");
    } catch { toast.error("Failed to post"); }
    finally { setLoading(false); }
  };

  return (
    <div className="card mb-6">
      <div className="p-6">
        <div className="flex gap-4">
          <img
            src={user?.profilePic || `https://ui-avatars.com/api/?name=${user?.username}&background=random`}
            className="avatar flex-shrink-0"
            alt="avatar"
          />
          <form onSubmit={handleSubmit} className="flex-1">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What's on your mind?"
              rows={3}
              className="w-full text-sm resize-none border-none outline-none text-gray-800 placeholder-gray-400 bg-transparent leading-relaxed"
            />
            {preview && (
              <div className="relative mt-4 rounded-2xl overflow-hidden shadow-soft">
                <img
                  src={preview}
                  alt="preview"
                  className="w-full max-h-80 object-cover"
                />
                <button
                  type="button"
                  onClick={() => { setFile(null); setPreview(null); }}
                  className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-black/80 transition-all duration-200 hover:scale-105"
                  title="Remove image"
                >
                  ✕
                </button>
              </div>
            )}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <label className="cursor-pointer flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors duration-200 p-2 rounded-lg hover:bg-primary-50 group">
                <AiOutlineCamera size={24} className="group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-medium">Photo</span>
                <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
              </label>
              <button
                type="submit"
                disabled={loading || (!caption.trim() && !file)}
                className="btn-primary px-6 py-2 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="spinner" />
                    Posting...
                  </div>
                ) : (
                  "Share"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
