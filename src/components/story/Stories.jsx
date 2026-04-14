import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AiOutlinePlus } from "react-icons/ai";
import api from "../../utils/axiosInstance";
import toast from "react-hot-toast";

export default function Stories() {
  const { user } = useSelector((s) => s.auth);
  const [groups, setGroups] = useState([]);
  const [viewing, setViewing] = useState(null);
  const [viewIdx, setViewIdx] = useState(0);

  useEffect(() => {
    api.get("/stories").then(({ data }) => setGroups(data)).catch(() => {});
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("image", file);
    try {
      await api.post("/stories", fd);
      toast.success("Story posted!");
      const { data } = await api.get("/stories");
      setGroups(data);
    } catch { toast.error("Failed to post story"); }
  };

  const openStory = (group) => {
    setViewing(group);
    setViewIdx(0);
    api.put(`/stories/view/${group.stories[0]._id}`).catch(() => {});
  };

  const nextStory = () => {
    if (viewing && viewIdx < viewing.stories.length - 1) {
      setViewIdx(viewIdx + 1);
      api.put(`/stories/view/${viewing.stories[viewIdx + 1]._id}`).catch(() => {});
    } else {
      setViewing(null);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-4 mb-6 shadow-soft">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex-shrink-0 flex flex-col items-center gap-2">
            <label className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 border-2 border-dashed border-primary-300 flex items-center justify-center cursor-pointer hover:border-primary-500 hover:from-primary-200 hover:to-accent-200 transition-all duration-200 group">
              <AiOutlinePlus size={24} className="text-primary-600 group-hover:scale-110 transition-transform duration-200" />
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </label>
            <span className="text-xs text-gray-500 font-medium truncate w-16 text-center">Your story</span>
          </div>
          {groups.map((g) => (
            <div
              key={g.user._id}
              onClick={() => openStory(g)}
              className="flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer group"
            >
              <div className="w-16 h-16 rounded-full ring-3 ring-gradient-primary ring-offset-2 overflow-hidden group-hover:ring-offset-4 transition-all duration-200">
                <img
                  src={g.user.profilePic || `https://ui-avatars.com/api/?name=${g.user.username}&background=random`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  alt={g.user.username}
                />
              </div>
              <span className="text-xs text-gray-600 font-medium truncate w-16 text-center group-hover:text-primary-600 transition-colors duration-200">
                {g.user.username}
              </span>
            </div>
          ))}
        </div>
      </div>

      {viewing && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in" onClick={nextStory}>
          <div className="relative max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex gap-1 mb-4 px-2">
              {viewing.stories.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    i < viewIdx ? "bg-white" : i === viewIdx ? "bg-gradient-to-r from-primary-400 to-accent-400" : "bg-white/30"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-3 mb-4 px-2">
              <img
                src={viewing.user.profilePic || `https://ui-avatars.com/api/?name=${viewing.user.username}&background=random`}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20"
                alt=""
              />
              <span className="text-white text-sm font-semibold">{viewing.user.username}</span>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={viewing.stories[viewIdx].image}
                className="w-full rounded-2xl object-cover max-h-[70vh]"
                alt="story"
              />
              <button
                onClick={nextStory}
                className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl bg-black/20 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/40 transition-all duration-200"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
