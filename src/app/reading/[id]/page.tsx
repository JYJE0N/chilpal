import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Sparkles, Heart, Briefcase, DollarSign, Star, Lightbulb } from "lucide-react";
import ShareButton from "@/components/share/ShareButton";

// 리딩 데이터 가져오기 함수
async function getReading(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/readings/${id}?shared=true`, {
      cache: 'no-store' // 항상 최신 데이터
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching reading:', error);
    return null;
  }
}

// 동적 메타데이터 생성
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const reading = await getReading(params.id);
  
  if (!reading) {
    return {
      title: "타로 리딩을 찾을 수 없습니다 | 칠팔 타로",
      description: "요청하신 타로 리딩 결과를 찾을 수 없습니다.",
    };
  }

  const cardNames = reading.cards?.map((card: any) => card.name).join(', ') || '';
  const shortQuestion = reading.question.length > 50 
    ? `${reading.question.substring(0, 50)}...` 
    : reading.question;

  return {
    title: `"${shortQuestion}" 타로 리딩 결과 | 칠팔 타로`,
    description: `${reading.spreadType === 'one-card' ? '원카드' : '3카드'} 리딩으로 뽑힌 카드: ${cardNames}. 78장 완전한 타로 덱으로 확인한 운명의 메시지를 공유합니다.`,
    openGraph: {
      title: `"${shortQuestion}" 타로 리딩 결과`,
      description: `뽑힌 카드: ${cardNames}`,
      url: `/reading/${params.id}`,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: '칠팔 타로 리딩 결과',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `"${shortQuestion}" 타로 리딩 결과`,
      description: `뽑힌 카드: ${cardNames}`,
      images: ['/og-image.png'],
    },
  };
}

export default async function ReadingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const reading = await getReading(params.id);

  if (!reading) {
    notFound();
  }

  // 질문 유형 아이콘 가져오기
  const getQuestionTypeIcon = (type: string) => {
    const icons = {
      love: Heart,
      career: Briefcase,
      money: DollarSign,
      health: Heart,
      general: Star,
    };
    return icons[type as keyof typeof icons] || Star;
  };

  const getQuestionTypeLabel = (type: string) => {
    const labels = {
      love: "연애",
      career: "직업", 
      money: "재물",
      health: "건강",
      general: "일반",
    };
    return labels[type as keyof typeof labels] || "일반";
  };

  const getSpreadTypeLabel = (spreadType: string) => {
    const labels = {
      "one-card": "원카드 리딩",
      "three-card": "3카드 리딩",
      "celtic-cross": "켈틱크로스",
    };
    return labels[spreadType as keyof typeof labels] || spreadType;
  };

  const getCardPositionLabel = (index: number, spreadType: string): string => {
    switch (spreadType) {
      case "three-card":
        return ["과거", "현재", "미래"][index] || `카드 ${index + 1}`;
      case "one-card":
        return "답변";
      case "celtic-cross":
        return [
          "현재 상황", 
          "도전 과제", 
          "먼 과거", 
          "가까운 과거", 
          "가능한 미래", 
          "가까운 미래", 
          "당신의 접근", 
          "외부 영향", 
          "희망과 두려움", 
          "최종 결과"
        ][index] || `카드 ${index + 1}`;
      case "love-spread":
        return ["현재 감정", "상대의 마음", "관계의 장애물", "필요한 것", "연애운"][index] || `카드 ${index + 1}`;
      case "career-path":
        return ["현재 위치", "강점", "약점", "기회", "조언"][index] || `카드 ${index + 1}`;
      case "relationship":
        return ["당신", "상대방", "당신의 감정", "상대의 감정", "관계의 현재", "관계의 미래"][index] || `카드 ${index + 1}`;
      case "yes-no":
        return ["현재 상황", "선택의 결과", "고려할 점", "최선의 길"][index] || `카드 ${index + 1}`;
      default:
        return `카드 ${index + 1}`;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatInterpretation = (interpretation: string): string => {
    // 히스토리 뷰와 동일한 로직 사용
    let formatted = interpretation;
    
    const unnecessaryPatterns = [
      /질문:\s*.*?(?=\n|$)/gi,
      /문의\s*내용:\s*.*?(?=\n|$)/gi,
      /\".*?\"\에\s*대한\s*(?:답변|해석|결과)[은는:]*\s*/gi,
    ];
    
    unnecessaryPatterns.forEach(pattern => {
      formatted = formatted.replace(pattern, '');
    });
    
    const conclusionPatterns = [
      /(?:종합|결론|전체적으로|핵심|요약)[적으로]*[은는:]*\s*(.*?)$/i,
      /(?:따라서|그러므로|결국|결론적으로)\s*(.*?)$/i,
      /(?:조언|권장|제안).*?:\s*(.*?)$/i
    ];
    
    for (const pattern of conclusionPatterns) {
      const match = formatted.match(pattern);
      if (match && match[1] && match[1].trim().length > 20) {
        formatted = match[1].trim();
        break;
      }
    }
    
    formatted = formatted
      .replace(/^[\s]*[-•*]\s*/gm, '')
      .replace(/\n\s*\n/g, '\n')
      .replace(/.*?메시지.*?/gi, '')
      .trim();
    
    if (formatted.length < 30) {
      const sentences = interpretation.split(/[.!?]+/).filter(s => s.trim().length > 10);
      formatted = sentences.slice(-2).join('. ').trim();
      if (formatted) formatted += '.';
    }
    
    return formatted || interpretation;
  };

  const QuestionIcon = getQuestionTypeIcon(reading.questionType);

  return (
    <div className="min-h-screen py-8">
      <div className="container-unified">
        {/* 상단 네비게이션 */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/history"
            className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>히스토리로 돌아가기</span>
          </Link>
          
          <div className="flex items-center gap-2 text-muted text-sm">
            <Sparkles className="w-4 h-4" />
            <span>{formatDate(reading.createdAt)}</span>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="max-w-4xl mx-auto">
          {/* 헤더 정보 */}
          <div className="glass-card mb-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <span className="text-xs bg-gradient-to-r from-pink-400 to-purple-400 text-white px-3 py-1 rounded-full font-medium">
                  {getSpreadTypeLabel(reading.spreadType)}
                </span>
                <div className="flex items-center gap-1 text-secondary">
                  <QuestionIcon className="w-4 h-4" />
                  <span className="text-sm">{getQuestionTypeLabel(reading.questionType)}</span>
                </div>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-primary leading-relaxed">
                &ldquo;{reading.question}&rdquo;
              </h1>
            </div>
          </div>

          {/* 카드 결과 */}
          <div className="space-y-6 mb-8">
            {reading.cards?.map((card: any, index: number) => {
              const positionLabel = getCardPositionLabel(index, reading.spreadType);
              
              return (
                <div key={index} className="glass-card-light">
                  <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                    <div className="relative w-32 h-44 md:w-24 md:h-36 flex-shrink-0 mx-auto md:mx-0">
                      <Image
                        src={card.image_url || "/images/cards/card-back.png"}
                        alt={card.name}
                        fill
                        className={`object-cover rounded-lg shadow-lg ${
                          card.is_reversed ? "rotate-180" : ""
                        }`}
                        sizes="128px"
                      />
                      {card.is_reversed && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-3 text-center md:text-left">
                      <div>
                        {reading.spreadType !== "one-card" && (
                          <span className="text-xs font-medium text-accent bg-purple-500/20 px-2 py-1 rounded border border-purple-400/30 inline-block mb-2">
                            {positionLabel}
                          </span>
                        )}
                        <h3 className="text-xl font-semibold text-primary flex items-center justify-center md:justify-start gap-2">
                          <span>{card.name}</span>
                          {card.is_reversed && (
                            <span className="text-white text-xs bg-red-500 px-2 py-1 rounded-full font-medium">
                              역
                            </span>
                          )}
                        </h3>
                      </div>
                      
                      {card.current_keywords && card.current_keywords.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-muted mb-2">키워드</h4>
                          <div className="flex flex-wrap gap-1 justify-center md:justify-start">
                            {card.current_keywords.slice(0, 4).map((keyword: string, kidx: number) => (
                              <span
                                key={kidx}
                                className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-sm"
                              >
                                {keyword.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="text-sm font-medium text-muted mb-2">
                          {card.is_reversed ? "역방향 해석" : "정방향 해석"}
                        </h4>
                        <p className="text-secondary leading-relaxed">
                          {card.current_interpretation || card.current_meaning || "해석 정보가 없습니다."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 종합 해석 */}
          <div className="glass-card-light mb-8">
            <h2 className="font-semibold text-yellow-400 mb-4 text-lg flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              핵심결론
            </h2>
            <p className="text-secondary whitespace-pre-line leading-relaxed">
              {formatInterpretation(reading.interpretation)}
            </p>
          </div>

          {/* 공유 섹션 */}
          <div className="glass-card text-center">
            <h3 className="text-lg font-semibold text-primary mb-4">
              이 타로 리딩 결과를 공유해보세요
            </h3>
            <p className="text-secondary mb-6">
              친구들과 함께 타로의 신비로운 메시지를 나누어보세요
            </p>
            
            <ShareButton
              title={`"${reading.question}" 타로 리딩 결과`}
              text={`칠팔 타로에서 확인한 타로 리딩 결과입니다. 뽑힌 카드들이 전하는 특별한 메시지를 확인해보세요!`}
              url={typeof window !== 'undefined' ? window.location.href : ''}
              hashtags={['타로', '타로리딩', '운세', '칠팔타로', reading.questionType]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}