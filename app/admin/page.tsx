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
    await update(ref(db, `requests/${id}`), { status });
  };

  const deleteRequest = async (id: string) => {
    const ok = window.confirm("هل تريد حذف هذا الطلب؟");
    if (!ok) return;
    await remove(ref(db, `requests/${id}`));
  };

  if (loading) {
    return (
      <div style={{ padding: "24px", direction: "rtl", fontFamily: "Arial" }}>
        جاري تحميل الطلبات...
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "24px",
        direction: "rtl",
        fontFamily: "Arial",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ marginBottom: "20px", fontSize: "28px" }}>
        لوحة تحكم التأمين
      </h1>

      <div
        style={{
          background: "#fff",
          padding: "16px",
          borderRadius: "14px",
          marginBottom: "20px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        <strong>عدد الطلبات:</strong> {requests.length}
      </div>

      {requests.length === 0 ? (
        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "14px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}
        >
          لا توجد طلبات حالياً
        </div>
      ) : (
        <div
          style={{
            overflowX: "auto",
            background: "#fff",
            borderRadius: "14px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={th}>الاسم</th>
                <th style={th}>الجوال</th>
                <th style={th}>الهوية</th>
                <th style={th}>لوحة المركبة</th>
                <th style={th}>نوع المركبة</th>
                <th style={th}>نوع التأمين</th>
                <th style={th}>الشركة</th>
                <th style={th}>السعر</th>
                <th style={th}>الحالة</th>
                <th style={th}>الوقت</th>
                <th style={th}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((item) => (
                <tr key={item.id}>
                  <td style={td}>{item.fullName || item.name || "-"}</td>
                  <td style={td}>{item.phone || "-"}</td>
                  <td style={td}>{item.nationalId || "-"}</td>
                  <td style={td}>{item.plateNumber || "-"}</td>
                  <td style={td}>{item.vehicleType || "-"}</td>
                  <td style={td}>{item.insuranceType || "-"}</td>
                  <td style={td}>{item.company || "-"}</td>
                  <td style={td}>{item.price || "-"}</td>
                  <td style={td}>{item.status || "جديد"}</td>
                  <td style={td}>
                    {item.createdAt
                      ? new Date(Number(item.createdAt)).toLocaleString("ar")
                      : "-"}
                  </td>
                  <td style={td}>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button style={btn} onClick={() => changeStatus(item.id, "جديد")}>
                        جديد
                      </button>
                      <button
                        style={btn}
                        onClick={() => changeStatus(item.id, "قيد المراجعة")}
                      >
                        قيد المراجعة
                      </button>
                      <button style={btn} onClick={() => changeStatus(item.id, "مكتمل")}>
                        مكتمل
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
      )}
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
