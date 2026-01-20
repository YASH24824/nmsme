"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Calendar,
  DollarSign,
  Clock,
  Phone,
  Mail,
  Video,
  MapPin,
  User,
  AlertCircle,
  CheckCircle,
  Clock as ClockIcon,
  XCircle,
  MessageSquare,
  Eye,
  Star,
  FileText,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import { getBuyerLeads } from "@/app/api/leadAPI";
import ChatDrawer from "../components/Leads/ChatDrawer";

/**
 * MyLeadsPage — Fully themed with accent palette (Solid Accent Buttons)
 * - Uses CSS variables like: --color-accent-50 ... --color-accent-900 and --color-primary
 * - Soft panel look: rounded-2xl, subtle borders using accent-50/100
 * - Primary actions use solid accent (accent-500) with hover accent-600
 */

const MyLeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [openChatLead, setOpenChatLead] = useState(null);
  const [leadName, setLeadName] = useState("");
  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await getBuyerLeads();

      if (response.data && Array.isArray(response.data.leads)) {
        setLeads(response.data.leads);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error("No Inquiries Found");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLeads();
  };

  const filteredLeads = leads
    .filter((lead) => {
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !q ||
        lead.project_title?.toLowerCase().includes(q) ||
        lead.listing?.title?.toLowerCase().includes(q) ||
        lead.listing?.seller?.business_name?.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "all" || lead.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "urgent":
          return b.is_urgent === a.is_urgent ? 0 : b.is_urgent ? -1 : 1;
        default:
          return 0;
      }
    });

  // Status configuration — using accent palette for all statuses
  const statusConfig = {
    new: {
      bg: "var(--color-accent-100)",
      text: "var(--color-accent-700)",
      border: "var(--color-accent-200)",
      iconColor: "var(--color-accent-700)",
      label: "New",
    },
    contacted: {
      bg: "var(--color-accent-100)",
      text: "var(--color-accent-700)",
      border: "var(--color-accent-200)",
      iconColor: "var(--color-accent-700)",
      label: "Contacted",
    },
    responded: {
      bg: "var(--color-accent-100)",
      text: "var(--color-accent-700)",
      border: "var(--color-accent-200)",
      iconColor: "var(--color-accent-700)",
      label: "Responded",
    },
    quoted: {
      bg: "var(--color-accent-100)",
      text: "var(--color-accent-700)",
      border: "var(--color-accent-200)",
      iconColor: "var(--color-accent-700)",
      label: "Quoted",
    },
    closed: {
      bg: "var(--color-accent-50)",
      text: "var(--color-accent-700)",
      border: "var(--color-accent-100)",
      iconColor: "var(--color-accent-700)",
      label: "Closed",
    },
    rejected: {
      bg: "rgba(255,235,238,0.9)",
      text: "#b91c1c", // keep semantic red for clarity
      border: "rgba(255,205,210,0.8)",
      iconColor: "#b91c1c",
      label: "Rejected",
    },
  };

  const budgetLabels = {
    under_1k: "Under ₹1,000",
    k_1_5: "₹1,000 - ₹5,000",
    k_5_10: "₹5,000 - ₹10,000",
    k_10_25: "₹10,000 - ₹25,000",
    k_25_50: "₹25,000 - ₹50,000",
    k_50_100: "₹50,000 - ₹100,000",
    k_100_plus: "₹100,000+",
  };

  const timelineLabels = {
    immediately: "Immediately",
    weeks_1_2: "1-2 Weeks",
    month_1: "1 Month",
    flexible: "Flexible",
  };

  const contactIcons = {
    email: Mail,
    phone: Phone,
    video_call: Video,
    in_person: MapPin,
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusConfig = (status) => statusConfig[status] || statusConfig.new;

  const getTimeAgo = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--color-accent-50)" }}
      >
        <div className="text-center">
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 9999,
              borderBottom: `4px solid var(--color-accent-500)`,
              margin: "0 auto",
              marginBottom: 12,
              animation: "spin 1s linear infinite",
            }}
          />
          <p style={{ color: "var(--color-accent-700)" }}>
            Loading your leads...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "white", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          background: "var(--color-primary)",
          borderBottom: `1px solid var(--color-accent-200)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  color: "var(--color-accent-900)",
                }}
              >
                My Inquiries
              </h1>
              <p style={{ color: "var(--color-accent-700)", marginTop: 6 }}>
                Track and manage all your service inquiries in one place
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: `1px solid var(--color-accent-100)`,
                  background: "var(--color-primary)",
                  color: "var(--color-accent-700)",
                }}
              >
                <RefreshCw
                  style={{
                    width: 16,
                    height: 16,
                    transform: refreshing ? "rotate(360deg)" : undefined,
                    transition: "transform 0.4s",
                  }}
                />
                Refresh
              </button>

              <div
                style={{
                  background: "var(--color-accent-50)",
                  border: `1px solid var(--color-accent-100)`,
                  padding: 12,
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: "var(--color-accent-700)",
                  }}
                >
                  {leads.length}
                </div>
                <div style={{ fontSize: 12, color: "var(--color-accent-700)" }}>
                  Total Leads
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={
              <FileText
                style={{
                  width: 20,
                  height: 20,
                  color: "var(--color-accent-600)",
                }}
              />
            }
            count={leads.filter((l) => l.status === "new").length}
            label="New Leads"
          />
          <StatCard
            icon={
              <CheckCircle
                style={{
                  width: 20,
                  height: 20,
                  color: "var(--color-accent-600)",
                }}
              />
            }
            count={
              leads.filter(
                (l) => l.status === "responded" || l.status === "contacted"
              ).length
            }
            label="Active"
          />
          <StatCard
            icon={
              <ClockIcon
                style={{
                  width: 20,
                  height: 20,
                  color: "var(--color-accent-600)",
                }}
              />
            }
            count={leads.filter((l) => l.is_urgent).length}
            label="Urgent"
          />
          <StatCard
            icon={
              <MessageSquare
                style={{
                  width: 20,
                  height: 20,
                  color: "var(--color-accent-600)",
                }}
              />
            }
            count={leads.reduce(
              (t, l) => t + (l._count?.conversations || 0),
              0
            )}
            label="Conversations"
          />
        </div>

        {/* Filters and Search */}
        <div
          style={{
            background: "var(--color-accent-50)",
            border: `1px solid var(--color-accent-100)`,
            borderRadius: 8,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div style={{ flex: 1, maxWidth: 560 }}>
              <div style={{ position: "relative" }}>
                <Search
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--color-accent-500)",
                  }}
                />
                <input
                  type="text"
                  placeholder="Search by project, listing, or business..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px 12px 40px",
                    borderRadius: 12,
                    border: `1px solid var(--color-accent-100)`,
                    outline: "none",
                    color: "var(--color-accent-800)",
                    background: "var(--color-primary)",
                  }}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: `1px solid var(--color-accent-100)`,
                  background: "var(--color-primary)",
                  color: "var(--color-accent-800)",
                }}
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="responded">Responded</option>
                <option value="quoted">Quoted</option>
                <option value="closed">Closed</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: `1px solid var(--color-accent-100)`,
                  background: "var(--color-primary)",
                  color: "var(--color-accent-800)",
                }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="urgent">Urgent First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Leads List */}
        <div className="space-y-6">
          {filteredLeads.length === 0 ? (
            <div
              style={{
                background: "var(--color-primary)",
                border: `1px solid var(--color-accent-50)`,
                borderRadius: 16,
                padding: 48,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 9999,
                  background: "var(--color-accent-50)",
                  margin: "0 auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 18,
                }}
              >
                <FileText
                  style={{
                    width: 44,
                    height: 44,
                    color: "var(--color-accent-400)",
                  }}
                />
              </div>
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "var(--color-accent-900)",
                }}
              >
                {searchTerm || statusFilter !== "all"
                  ? "No matching leads found"
                  : "No leads yet"}
              </h3>
              <p
                style={{
                  color: "var(--color-accent-700)",
                  marginTop: 8,
                  marginBottom: 18,
                }}
              >
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Start by sending inquiries to service providers for your projects"}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Link
                  href="/listings"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 18px",
                    borderRadius: 12,
                    background: "var(--color-accent-700)",
                    hover: "bg-var(--color-accent-900)",
                    color: "#fff",
                    fontWeight: 600,
                  }}
                >
                  Browse Services
                </Link>
              )}
            </div>
          ) : (
            filteredLeads.map((lead) => {
              const StatusIcon = getStatusConfig(lead.status).icon || ClockIcon;
              const ContactIcon = contactIcons[lead.contact_preference] || Mail;
              const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
              const sCfg = getStatusConfig(lead.status);

              return (
                <article
                  key={lead.lead_id}
                  style={{
                    background: "var(--color-accent-50)",
                    border: `1px solid var(--color-accent-100)`,
                    borderRadius: 8,
                    padding: 20,
                  }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: 12,
                        }}
                      >
                        <div>
                          <h3
                            style={{
                              fontSize: 18,
                              fontWeight: 700,
                              color: "var(--color-accent-900)",
                              marginBottom: 8,
                            }}
                          >
                            {lead.project_title}
                          </h3>

                          <div
                            style={{
                              display: "flex",
                              gap: 8,
                              alignItems: "center",
                              flexWrap: "wrap",
                            }}
                          >
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "6px 10px",
                                borderRadius: 9999,
                                fontSize: 13,
                                border: `1px solid ${sCfg.border}`,
                                background: sCfg.bg,
                                color: sCfg.text,
                              }}
                            >
                              <ClockIcon
                                style={{
                                  width: 12,
                                  height: 12,
                                  color: sCfg.iconColor,
                                }}
                              />
                              {sCfg.label}
                            </span>

                            {lead.is_urgent && (
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 6,
                                  padding: "6px 10px",
                                  borderRadius: 9999,
                                  fontSize: 13,
                                  border: `1px solid var(--color-accent-200)`,
                                  background: "var(--color-accent-300)",
                                  color: "var(--color-accent-900)",
                                }}
                              >
                                <AlertCircle
                                  style={{
                                    width: 12,
                                    height: 12,
                                    color: "var(--color-accent-700)",
                                  }}
                                />
                                Urgent
                              </span>
                            )}

                            <span
                              style={{
                                fontSize: 13,
                                color: "var(--color-accent-700)",
                              }}
                            >
                              {getTimeAgo(lead.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p
                        style={{
                          color: "var(--color-accent-700)",
                          marginTop: 12,
                          marginBottom: 12,
                        }}
                        className="line-clamp-2"
                      >
                        {lead.project_description}
                      </p>

                      {/* Quick Info */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: 16,
                            flexWrap: "wrap",
                            color: "var(--color-accent-700)",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <DollarSign
                              style={{
                                width: 16,
                                height: 16,
                                color: "var(--color-accent-600)",
                              }}
                            />
                            <span style={{ fontWeight: 600 }}>
                              Budget: {budgetLabels[lead.budget_range]}
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <Clock
                              style={{
                                width: 16,
                                height: 16,
                                color: "var(--color-accent-600)",
                              }}
                            />
                            <span style={{ fontWeight: 600 }}>
                              Timeline: {timelineLabels[lead.timeline]}
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <ContactIcon
                              style={{
                                width: 16,
                                height: 16,
                                color: "var(--color-accent-600)",
                              }}
                            />
                            <span
                              style={{
                                fontWeight: 600,
                                textTransform: "capitalize",
                              }}
                            >
                              Contact:{" "}
                              {lead.contact_preference?.replace("_", " ")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {lead.custom_requirements && (
                        <div
                          style={{
                            background: "var(--color-accent-50)",
                            padding: 12,
                            borderRadius: 10,
                            marginTop: 12,
                          }}
                        >
                          <div style={{ color: "var(--color-accent-700)" }}>
                            <strong>Additional Requirements:</strong>{" "}
                            {lead.custom_requirements}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Listing + actions */}
                    <div
                      style={{
                        minWidth: 260,
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: 12,
                          alignItems: "center",
                        }}
                      >
                        {lead.listing?.listing_media?.[0] && (
                          <div
                            style={{
                              width: 76,
                              height: 76,
                              borderRadius: 14,
                              overflow: "hidden",
                              border: `1px solid var(--color-accent-50)`,
                            }}
                          >
                            <img
                              src={`${baseUrl}${lead.listing.listing_media[0].file_path}`}
                              alt={lead.listing?.title}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                              onError={(e) =>
                                (e.target.src = "/placeholder-image.jpg")
                              }
                            />
                          </div>
                        )}

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <h4
                              style={{
                                fontWeight: 700,
                                fontSize: 16,
                                color: "var(--color-accent-900)",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {lead.listing?.title}
                            </h4>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              marginTop: 8,
                              color: "var(--color-accent-700)",
                            }}
                          >
                            <User style={{ width: 14, height: 14 }} />
                            <span style={{ fontWeight: 600 }}>
                              {lead.listing?.seller?.business_name}
                            </span>
                            {lead.listing?.seller?.overall_rating > 0 && (
                              <>
                                <Star
                                  style={{
                                    width: 14,
                                    height: 14,
                                    color: "var(--color-accent-300)",
                                  }}
                                />
                                <span>
                                  {lead.listing.seller.overall_rating}
                                </span>
                              </>
                            )}
                          </div>

                          <div
                            style={{
                              display: "flex",
                              gap: 6,
                              marginTop: 8,
                              flexWrap: "wrap",
                            }}
                          >
                            <Badge
                              label={lead.listing?.service_type?.replace(
                                "_",
                                " "
                              )}
                            />
                            <Badge
                              label={lead.listing?.pricing_model?.replace(
                                "_",
                                " "
                              )}
                            />
                            <Badge
                              label={`₹${lead.listing?.min_price?.toLocaleString()} - ₹${lead.listing?.max_price?.toLocaleString()}`}
                            />
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 10,
                        }}
                      >
                        {lead._count?.conversations > 0 ? (
                          <button
                            onClick={() => {
                              setLeadName(lead.project_title);
                              setOpenChatLead(lead);
                            }}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 8,
                              padding: "10px 14px",
                              borderRadius: 12,
                              background: "var(--color-accent-700)",
                              color: "#fff",
                              fontWeight: 600,
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            <MessageSquare style={{ width: 16, height: 16 }} />
                            View Messages ({lead._count.conversations})
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setLeadName(lead.project_title);
                              setOpenChatLead(lead);
                            }}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 8,
                              padding: "10px 14px",
                              borderRadius: 12,
                              background: "transparent",
                              color: "var(--color-accent-700)",
                              fontWeight: 600,
                              border: `1px solid var(--color-accent-100)`,
                              cursor: "pointer",
                            }}
                          >
                            <MessageSquare style={{ width: 16, height: 16 }} />
                            Start Chat
                          </button>
                        )}

                        <Link
                          href={`/listings/${lead.listing_id}`}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            padding: "10px 14px",
                            borderRadius: 12,
                            background: "transparent",
                            color: "var(--color-accent-700)",
                            fontWeight: 600,
                            border: `1px solid var(--color-accent-500)`,
                            textDecoration: "none",
                          }}
                        >
                          <Eye style={{ width: 16, height: 16 }} />
                          View Listing
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Pagination Info */}
        {filteredLeads.length > 0 && (
          <div
            style={{ marginTop: 28, display: "flex", justifyContent: "center" }}
          >
            <div
              style={{
                background: "var(--color-primary)",
                border: `1px solid var(--color-accent-50)`,
                borderRadius: 16,
                padding: "12px 20px",
              }}
            >
              <p style={{ color: "var(--color-accent-700)" }}>
                Showing {filteredLeads.length} of {leads.length} leads
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Chat Drawer */}
      {openChatLead && (
        <ChatDrawer
          key={openChatLead.lead_id}
          leadId={openChatLead.lead_id}
          onClose={() => setOpenChatLead(null)}
          leadName={leadName}
        />
      )}
    </div>
  );
};

export default MyLeadsPage;

/* ------------------ Helper subcomponents ------------------ */

function StatCard({ icon, count, label }) {
  return (
    <div
      style={{
        background: "var(--color-accent-50)",
        borderRadius: 8,
        padding: 20,
        border: `1px solid var(--color-accent-100)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            padding: 12,
            borderRadius: 12,
            background: "var(--color-accent-50)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </div>
        <div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "var(--color-accent-900)",
            }}
          >
            {count}
          </div>
          <div style={{ color: "var(--color-accent-700)" }}>{label}</div>
        </div>
      </div>
    </div>
  );
}

function Badge({ label }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 10px",
        borderRadius: 9999,
        fontSize: 12,
        background: "var(--color-accent-100)",
        color: "var(--color-accent-700)",
      }}
    >
      {label}
    </span>
  );
}

/* Simple keyframes for spinner (if your project has global CSS, you can move it there) */
const styleEl =
  typeof document !== "undefined"
    ? document.getElementById("myleads-spinner-style")
    : null;
if (typeof document !== "undefined" && !styleEl) {
  const el = document.createElement("style");
  el.id = "myleads-spinner-style";
  el.innerHTML = `@keyframes spin { to { transform: rotate(1turn); } }`;
  document.head.appendChild(el);
}
