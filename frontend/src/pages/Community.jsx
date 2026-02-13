import { useState, useEffect } from "react";
import { communityAPI } from "../api/services";
import toast from "react-hot-toast";

const CAT_COLORS = { issue: "#E53935", alert: "#FFA000", pricing: "#1565C0", safety: "#43A047", general: "#7B1FA2" };

export default function Community({ onBack }) {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: "", content: "", category: "general" });
  const [showForm, setShowForm] = useState(false);
  const [commentText, setCommentText] = useState({});

  const load = async () => {
    try { const r = await communityAPI.getFeed(); setPosts(r.data.data); }
    catch { setPosts([]); }
  };
  useEffect(() => { load(); }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    try { await communityAPI.createPost(form); toast.success("Posted!"); setShowForm(false); setForm({ title: "", content: "", category: "general" }); load(); }
    catch { toast.error("Failed"); }
  };

  const handleVote = async (id) => {
    try { const r = await communityAPI.vote({ postId: id }); setPosts(p => p.map(x => x._id === id ? { ...x, votes: r.data.votes } : x)); }
    catch {}
  };

  const handleComment = async (postId) => {
    const content = commentText[postId]; if (!content?.trim()) return;
    try { await communityAPI.addComment({ postId, content }); toast.success("Replied"); setCommentText(c => ({ ...c, [postId]: "" })); load(); }
    catch {}
  };

  return (
    <div style={{ background: "#F5F5F5", minHeight: "100%" }}>
      <div className="app-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <span className="title">My Group</span>
        <button className="sound-btn" onClick={() => setShowForm(s => !s)}>✏️</button>
      </div>

      {showForm && (
        <form onSubmit={handlePost} style={{ background: "white", margin: 16, borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            style={{ width: "100%", borderBottom: "1px solid #eee", padding: "8px 0", fontSize: 15, marginBottom: 8 }} required />
          <textarea placeholder="Share with your group..." value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
            style={{ width: "100%", border: "none", fontSize: 14, resize: "none", minHeight: 60, marginBottom: 8 }} required />
          <div style={{ display: "flex", gap: 8 }}>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
              style={{ flex: 1, border: "1px solid #eee", borderRadius: 8, padding: "8px", fontSize: 13 }}>
              {["issue", "alert", "pricing", "safety", "general"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button type="submit" className="btn btn-green" style={{ padding: "8px 20px" }}>Post</button>
          </div>
        </form>
      )}

      <div style={{ padding: "8px 16px" }}>
        {posts.length === 0 ? (
          <div style={{ textAlign: "center", color: "#aaa", padding: 40 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
            <div style={{ fontWeight: 700 }}>No posts yet</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Be the first to post in your group!</div>
          </div>
        ) : posts.map(post => (
          <div key={post._id} style={{ background: "white", borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <span style={{ background: (CAT_COLORS[post.category] || "#7B1FA2") + "22", color: CAT_COLORS[post.category] || "#7B1FA2", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10 }}>{post.category}</span>
                <div style={{ fontWeight: 700, fontSize: 15, marginTop: 4 }}>{post.title}</div>
              </div>
              <button onClick={() => handleVote(post._id)} style={{ background: "#F0F4FF", border: "none", borderRadius: 20, padding: "6px 12px", fontWeight: 700, color: "#1565C0", fontSize: 13 }}>▲ {post.votes}</button>
            </div>
            <p style={{ color: "#555", fontSize: 13, marginBottom: 8 }}>{post.content}</p>
            <p style={{ color: "#aaa", fontSize: 11 }}>by {post.vendor?.name || "Vendor"} · {new Date(post.createdAt).toLocaleDateString("en-IN")}</p>
            {post.comments?.length > 0 && (
              <div style={{ borderTop: "1px solid #f5f5f5", paddingTop: 8, marginTop: 8 }}>
                {post.comments.map(c => (
                  <div key={c._id} style={{ fontSize: 13, padding: "4px 0" }}>
                    <span style={{ fontWeight: 700, color: "#1565C0" }}>{c.author?.name}</span>
                    <span style={{ color: "#555" }}> {c.content}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <input placeholder="Reply..." value={commentText[post._id] || ""} onChange={e => setCommentText(c => ({ ...c, [post._id]: e.target.value }))}
                style={{ flex: 1, background: "#F5F5F5", border: "none", borderRadius: 20, padding: "8px 14px", fontSize: 13 }}
                onKeyDown={e => e.key === "Enter" && handleComment(post._id)} />
              <button onClick={() => handleComment(post._id)} style={{ background: "#1565C0", color: "white", border: "none", borderRadius: 20, padding: "8px 14px", fontSize: 13, fontWeight: 700 }}>→</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
