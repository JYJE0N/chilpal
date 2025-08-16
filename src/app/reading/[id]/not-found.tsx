import Link from "next/link";
import { Sparkles, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md">
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-primary">
            타로 리딩을 찾을 수 없습니다
          </h1>
          <p className="text-secondary leading-relaxed">
            요청하신 타로 리딩 결과가 존재하지 않거나 
            <br />
            삭제되었을 수 있습니다.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/history">
            <button className="btn-primary w-full flex items-center justify-center gap-3">
              <ArrowLeft className="w-5 h-5" />
              히스토리로 돌아가기
            </button>
          </Link>
          
          <Link href="/reading">
            <button className="btn-secondary w-full flex items-center justify-center gap-3">
              <Sparkles className="w-5 h-5" />
              새로운 타로 보기
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}