"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  ThumbsUp,
  MessageSquare,
  MapPin,
  Calendar
} from "lucide-react";
import Panel from "@/components/Panel";
import Button from "@/components/Button";
import { useToast } from "@/components/Toast";
import {
  getCommunityReports,
  addCommunityReport,
  voteCommunityReport,
  getReportVotesMap,
  addReportComment,
  CommunityReport
} from "@/components/ProgressTracker";

const CATEGORIES = ["UPI Fraud", "Courier Scam", "WhatsApp Scam", "Fake Internship", "Fake SMS", "Fraud Attempt"];

export default function CommunityPage() {
  const { showToast } = useToast();

  // Reports states
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [votesMap, setVotesMap] = useState<Record<string, boolean>>({});

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  // Comments states
  const [expandedCommentsId, setExpandedCommentsId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState("");

  const reloadData = () => {
    setReports(getCommunityReports());
    setVotesMap(getReportVotesMap());
  };

  useEffect(() => {
    setTimeout(() => {
      reloadData();
    }, 0);
    window.addEventListener("safesteps_progress_changed", reloadData);
    return () => {
      window.removeEventListener("safesteps_progress_changed", reloadData);
    };
  }, []);

  // Form submission
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      showToast("Please fill in the title and description.", "warning");
      return;
    }

    addCommunityReport({
      category,
      title,
      description,
      location: location || undefined,
      date: new Date().toISOString().split("T")[0]
    });

    setTitle("");
    setDescription("");
    setLocation("");
    setShowForm(false);
    showToast("Scam report submitted for community verification!", "success");
  };

  // Upvote report
  const handleVote = (id: string) => {
    voteCommunityReport(id);
    showToast(votesMap[id] ? "Removed helpful vote" : "Marked report as helpful!", "success");
  };

  // Add Comment
  const handleAddComment = (reportId: string) => {
    if (!newCommentText.trim()) return;
    addReportComment(reportId, newCommentText.trim());
    setNewCommentText("");
    showToast("Comment posted!", "success");
  };

  // Group reports for threat library counts
  const categoryCounts = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = reports.filter((r) => r.category === cat).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-6 gap-4">
        <div>
          <h1 className="font-outfit text-3xl md:text-4xl font-extrabold text-white">Community Alert Desk</h1>
          <p className="text-on-surface-variant text-sm mt-1 font-inter">
            Submit suspicious activities or browse verified reports to keep yourself and others aware.
          </p>
        </div>

        <Button
          variant="action"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel Report" : "Report a Scam"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Column (8/12): Form & Reports Feed */}
        <div className="lg:col-span-8 space-y-6">

          {/* Submit Report Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <Panel title="Report Suspicious Activity" idTag="NEW REPORT" noHoverAnim={true} topBorderColor="cyan">
                  <form onSubmit={handleSubmitReport} className="space-y-4 font-inter text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-white font-bold block">Scam Category:</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full bg-cyber-bg border border-white/10 px-3.5 py-2.5 rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-xs"
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-white font-bold block">Location (Optional):</label>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g. New Delhi, Online"
                          className="w-full bg-cyber-bg border border-white/10 px-3.5 py-2.5 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-white font-bold block">Title:</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. WhatsApp code phishing scam under relative's name"
                        className="w-full bg-cyber-bg border border-white/10 px-3.5 py-2.5 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-xs"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-white font-bold block">Details / Description:</label>
                      <textarea
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe what happened: what email address/phone number was used? What links or codes were sent? Let the community know the clues."
                        className="w-full bg-cyber-bg border border-white/10 px-3.5 py-2.5 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-xs leading-relaxed"
                        required
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Button variant="action" type="submit">
                        Submit Alert
                      </Button>
                    </div>
                  </form>
                </Panel>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reports feed */}
          <div className="space-y-4">
            <h2 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest pl-1">
              Active Scam Feed
            </h2>

            {reports.length === 0 ? (
              <div className="text-center py-12 border border-white/5 bg-white/[0.01] rounded-2xl text-on-surface-variant text-xs">
                No scams reported yet. Be the first to share one!
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => {
                  const hasVoted = votesMap[report.id];
                  const isCommentsExpanded = expandedCommentsId === report.id;

                  return (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-white/10 bg-white/[0.01] hover:bg-white/[0.02] p-5 rounded-2xl space-y-4 transition-all"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-outfit font-bold text-white text-base">
                              {report.title}
                            </span>
                            <span className="font-mono text-[8px] bg-red-950/20 px-2 py-0.5 border border-red-500/20 text-red-400 font-bold uppercase rounded">
                              {report.category}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-3 text-[10px] text-on-surface-variant/60 font-mono pt-1">
                            {report.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-cyan-400" />
                                <span>{report.location}</span>
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-cyan-400" />
                              <span>{report.date}</span>
                            </span>
                          </div>
                        </div>

                        <span className={`text-[9px] font-mono font-bold uppercase px-2.5 py-0.5 border rounded ${report.status === "Verified"
                            ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-400"
                            : report.status === "Pending"
                              ? "border-amber-500/30 bg-amber-950/20 text-amber-400 animate-pulse"
                              : "border-white/10 bg-white/5 text-white/40"
                          }`}>
                          {report.status}
                        </span>
                      </div>

                      <p className="text-on-surface-variant text-[12.5px] font-inter leading-relaxed">
                        {report.description}
                      </p>

                      {/* Interactive Buttons */}
                      <div className="flex gap-4 pt-2 border-t border-white/5 font-mono text-[10px]">
                        <button
                          onClick={() => handleVote(report.id)}
                          className={`flex items-center gap-1.5 transition-colors cursor-pointer ${hasVoted ? "text-cyan-400 font-bold" : "text-on-surface-variant hover:text-white"
                            }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{report.votes} Helpful</span>
                        </button>

                        <button
                          onClick={() => setExpandedCommentsId(isCommentsExpanded ? null : report.id)}
                          className="flex items-center gap-1.5 text-on-surface-variant hover:text-white transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{report.commentsCount} Comments</span>
                        </button>
                      </div>

                      {/* Expandable comments */}
                      <AnimatePresence>
                        {isCommentsExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-black/25 border border-white/5 p-4 rounded-xl space-y-3 font-inter text-xs overflow-hidden"
                          >
                            <span className="font-mono text-[9px] text-cyan-400 font-bold uppercase tracking-wider block">
                              Comments ({report.comments.length})
                            </span>

                            {report.comments.length === 0 ? (
                              <p className="text-on-surface-variant/40 italic">No comments yet. Add yours below.</p>
                            ) : (
                              <div className="space-y-2.5">
                                {report.comments.map((comment, idx) => (
                                  <div key={idx} className="bg-white/[0.01] p-2.5 rounded-lg border border-white/5 text-on-surface-variant leading-relaxed">
                                    {comment}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Comment Input */}
                            <div className="flex gap-2 pt-2">
                              <input
                                type="text"
                                value={newCommentText}
                                onChange={(e) => setNewCommentText(e.target.value)}
                                placeholder="Type a helpful verification comment..."
                                className="flex-1 bg-cyber-bg border border-white/10 px-3 py-2 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleAddComment(report.id);
                                }}
                              />
                              <Button variant="action" className="py-2 text-[10px]" onClick={() => handleAddComment(report.id)}>
                                Post
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4/12): Threat Library Summary */}
        <div className="lg:col-span-4 space-y-6">
          <h2 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest pl-1">
            Threat Library Archive
          </h2>

          <Panel title="Scams Database Categories" idTag="THREAT LIBRARY" noHoverAnim={true} topBorderColor="cyan">
            <div className="space-y-4 py-2 font-inter text-xs">
              <p className="text-on-surface-variant text-[11px] leading-relaxed">
                scams grouped automatically by reported database tags. Use these numbers to see what vectors are active.
              </p>

              <div className="space-y-2.5 font-mono text-[11px]">
                {CATEGORIES.map((cat) => {
                  const count = categoryCounts[cat] || 0;
                  return (
                    <div key={cat} className="flex justify-between items-center p-3 border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] rounded-xl transition-all">
                      <span className="text-white font-bold">{cat}</span>
                      <span className="font-bold text-cyan-400 bg-cyan-950/20 px-2.5 py-0.5 border border-cyan-400/20 rounded">
                        {count} {count === 1 ? "report" : "reports"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Panel>
        </div>

      </div>
    </div>
  );
}
