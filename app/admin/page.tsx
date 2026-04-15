"use client";

import { useEffect, useState } from "react";
import { database } from "@/lib/firebase";
import { ref, onValue, update, remove } from "firebase/database";

type RequestItem = {
  id: string;
  fullName?: string;
  phone?: string;
  nationalId?: string;
  plateNumber?: string;
  vehicleType?: string;
  insuranceType?: string;
  company?: string;
  price?: string;
  status?: string;
  createdAt?: number | string;
  [key: string]: any;
};

export default function AdminPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!database) return;
    const requestsRef = ref(database, "requests");

    const unsubscribe = onValue(requestsRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setRequests([]);
        setLoading(false);
        return;
      }

      const formatted = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));

      formatted.sort((a, b) => {
        const aTime = Number(a.createdAt || 0);
        const bTime = Number(b.createdAt || 0);
        return bTime - aTime;
      });

      setRequests(formatted);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const changeStatus = async (id: string, status: string) => {
    if (!database) return;
    await update(ref(database, `requests/${id}`), { status });
  };

  const deleteRequest = async (id: string) => {
    const ok = window.confirm("هل تريد حذف هذا الطلب؟");
    if (!ok) return;
    if (!database) return;
    await remove(ref(database, `requests/${id}`));
  };

  if (loading) {
    return (
      <div style={{ padding: "24px", direction: "rtl", fontFamily: "Arial" }}>
        ...جاري تحميل الطلبات
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", direction: "rtl", fontFamily: "Arial" }}>
      <h1 style={{ marginBottom: "16px" }}>لوحة التحكم - الطلبات</h1>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>الاسم</th>
              <th style={th}>الهاتف</th>
              <th style={th}>نوع التأمين</th>
              <th style={th}>الشركة</th>
              <th style={th}>السعر</th>
              <th style={th}>الحالة</th>
              <th style={th}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((item) => (
              <tr key={item.id}>
                <td style={td}>{item.fullName || "-"}</td>
                <td style={td}>{item.phone || "-"}</td>
                <td style={td}>{item.insuranceType || "-"}</td>
                <td style={td}>{item.company || "-"}</td>
                <td style={td}>{item.price || "-"}</td>
                <td style={td}>{item.status || "pending"}</td>
                <td style={td}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      style={{ ...btn, background: "#4caf50", color: "#fff" }}
                      onClick={() => changeStatus(item.id, "approved")}
                    >
                      قبول
                    </button>
                    <button
                      style={{ ...btn, background: "#f44336", color: "#fff" }}
                      onClick={() => changeStatus(item.id, "rejected")}
                    >
                      رفض
                    </button>
                    <button
                      style={{ ...btn, background: "#c62828", color: "#fff" }}
                      onClick={() => deleteRequest(item.id)}
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const th: React.CSSProperties = {
  borderBottom: "1px solid #ddd",
  padding: "12px",
  background: "#f3f3f3",
  textAlign: "right",
  whiteSpace: "nowrap",
};

const td: React.CSSProperties = {
  borderBottom: "1px solid #eee",
  padding: "12px",
  textAlign: "right",
  verticalAlign: "top",
  whiteSpace: "nowrap",
};

const btn: React.CSSProperties = {
  border: "none",
  padding: "8px 10px",
  borderRadius: "8px",
  cursor: "pointer",
  background: "#e0e0e0",
};
