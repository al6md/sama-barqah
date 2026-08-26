'use client';

import { useState, useRef } from 'react';
import { compressImageFile } from '@/lib/imageUtils';
import {
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Trash2,
  Check,
  Star,
  Plus,
  Sparkles,
  AlertCircle,
  Eye,
  Layers,
  X,
  Loader2
} from 'lucide-react';

interface TripImageManagerProps {
  mainImage: string;
  galleryImages: string[];
  onMainImageChange: (url: string) => void;
  onGalleryImagesChange: (urls: string[]) => void;
}

// Curated high quality presets for Iraqi tourism & travel agency showcase
const PRESET_IMAGES = [
  {
    title: 'أربيل - قلعة وجبال',
    category: 'أربيل',
    url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop'
  },
  {
    title: 'السليمانية - طبيعة وشلالات',
    category: 'السليمانية',
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200&auto=format&fit=crop'
  },
  {
    title: 'دهوك - جبال وسد دهوك',
    category: 'دهوك',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop'
  },
  {
    title: 'باصات سياحية VIP فاخرة',
    category: 'النقل',
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200&auto=format&fit=crop'
  },
  {
    title: 'فنادق 5 نجوم ومنتجعات',
    category: 'الإقامة',
    url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop'
  },
  {
    title: 'شلالات بيخال وكلي علي بك',
    category: 'طبيعة',
    url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=1200&auto=format&fit=crop'
  },
  {
    title: 'جبل كورك والتلفريك',
    category: 'كردستان',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop'
  },
  {
    title: 'شط العرب والبصرة',
    category: 'البصرة',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop'
  },
  {
    title: 'بغداد التاريخ ونهر دجلة',
    category: 'بغداد',
    url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop'
  }
];

export function TripImageManager({
  mainImage,
  galleryImages,
  onMainImageChange,
  onGalleryImagesChange
}: TripImageManagerProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [urlAsMain, setUrlAsMain] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewModalImg, setPreviewModalImg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle local file conversion & optimization via Canvas compression
  const processFiles = async (files: FileList | File[]) => {
    setErrorMsg(null);
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    try {
      const validFiles = Array.from(files).filter((file) => {
        if (!file.type.startsWith('image/')) {
          setErrorMsg('يرجى اختيار ملفات صور فقط (JPG, PNG, WebP).');
          return false;
        }
        if (file.size > 25 * 1024 * 1024) {
          setErrorMsg('حجم الملف كبير جداً، يرجى اختيار صور أقل من 25 ميغابايت.');
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) {
        setIsProcessing(false);
        return;
      }

      const compressedResults: string[] = [];
      for (const file of validFiles) {
        try {
          const compressed = await compressImageFile(file, 1400, 1400, 0.82);
          if (compressed) {
            compressedResults.push(compressed);
          }
        } catch {
          // Fallback to direct read
          const reader = new FileReader();
          const readPromise = new Promise<string>((res) => {
            reader.onload = (e) => res((e.target?.result as string) || '');
            reader.onerror = () => res('');
            reader.readAsDataURL(file);
          });
          const raw = await readPromise;
          if (raw) compressedResults.push(raw);
        }
      }

      if (compressedResults.length > 0) {
        if (!mainImage) {
          onMainImageChange(compressedResults[0]);
          if (compressedResults.length > 1) {
            onGalleryImagesChange([...galleryImages, ...compressedResults.slice(1)]);
          }
        } else {
          onGalleryImagesChange([...galleryImages, ...compressedResults]);
        }
      }
    } catch {
      setErrorMsg('حدث خطأ أثناء معالجة الصور، يرجى المحاولة مجدداً.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:')) {
      setErrorMsg('يرجى إدخال رابط صورة صحيح يبدأ بـ https://');
      return;
    }

    if (urlAsMain || !mainImage) {
      onMainImageChange(trimmed);
    } else {
      if (!galleryImages.includes(trimmed)) {
        onGalleryImagesChange([...galleryImages, trimmed]);
      }
    }
    setUrlInput('');
  };

  const handleSelectPreset = (url: string) => {
    if (!mainImage) {
      onMainImageChange(url);
    } else if (!galleryImages.includes(url) && mainImage !== url) {
      onGalleryImagesChange([...galleryImages, url]);
    }
  };

  const handleSetAsMain = (url: string) => {
    if (url === mainImage) return;
    const oldMain = mainImage;
    onMainImageChange(url);
    const newGallery = galleryImages.filter((img) => img !== url);
    if (oldMain && !newGallery.includes(oldMain)) {
      newGallery.unshift(oldMain);
    }
    onGalleryImagesChange(newGallery);
  };

  const handleRemoveGalleryImage = (index: number) => {
    onGalleryImagesChange(galleryImages.filter((_, i) => i !== index));
  };

  const handleRemoveMainImage = () => {
    if (galleryImages.length > 0) {
      const nextMain = galleryImages[0];
      onMainImageChange(nextMain);
      onGalleryImagesChange(galleryImages.slice(1));
    } else {
      onMainImageChange('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#1D2D2E]/20 pb-4">
        <div>
          <h3 className="text-base font-black text-[#1D2D2E] flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#FF7E47]" />
            <span>إدارة صور ومعرض الرحلة</span>
          </h3>
          <p className="text-xs font-bold text-[#1D2D2E]/70 mt-0.5">
            يمكنك رفع ملف صورة من جهازك، إدراج رابط ويب مباشر، أو الاختيار من الصور السياحية الجاهزة.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-[#FDFFF5] p-1.5 rounded-2xl border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] self-start">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border-2 ${
              activeTab === 'upload'
                ? 'bg-[#FFD95A] text-[#1D2D2E] border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]'
                : 'border-transparent text-[#1D2D2E]/70 hover:text-[#1D2D2E]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>رفع ملف</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border-2 ${
              activeTab === 'url'
                ? 'bg-[#FFD95A] text-[#1D2D2E] border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]'
                : 'border-transparent text-[#1D2D2E]/70 hover:text-[#1D2D2E]'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>رابط صورة</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border-2 ${
              activeTab === 'presets'
                ? 'bg-[#FFD95A] text-[#1D2D2E] border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E]'
                : 'border-transparent text-[#1D2D2E]/70 hover:text-[#1D2D2E]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>مكتبة صور جاهزة</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-100 border-2 border-rose-600 text-rose-800 text-xs font-black flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tab 1: File Upload (Drag & Drop) */}
      {activeTab === 'upload' && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!isProcessing) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => {
            if (!isProcessing) fileInputRef.current?.click();
          }}
          className={`border-[3px] border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
            isProcessing
              ? 'border-[#FF7E47] bg-[#FFD95A]/20 cursor-wait'
              : isDragging
              ? 'border-[#FF7E47] bg-[#FFD95A]/30 scale-[0.99]'
              : 'border-[#1D2D2E] bg-[#FDFFF5] hover:bg-[#FFD95A]/20 shadow-[3px_3px_0px_#1D2D2E]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            disabled={isProcessing}
            onChange={handleFileInputChange}
            className="hidden"
          />
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center py-2">
              <div className="w-12 h-12 rounded-2xl bg-[#FF7E47] text-white border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] flex items-center justify-center mx-auto mb-3 animate-spin">
                <Loader2 className="w-6 h-6" />
              </div>
              <div className="font-black text-[#1D2D2E] text-sm">
                جاري معالجة وضغط الصور وتحسين الجودة...
              </div>
              <p className="text-xs font-bold text-[#1D2D2E]/70 mt-1">
                يتم ضغط الصورة تلقائياً لسرعة فائقة وضمان الحفظ الفوري
              </p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-[#FFD95A] border-2 border-[#1D2D2E] text-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <div className="font-black text-[#1D2D2E] text-xs sm:text-sm">
                انقر لاختيار ملف صورة من جهازك، أو اسحب الصورة وأفلتها هنا
              </div>
              <p className="text-xs font-bold text-[#1D2D2E]/70 mt-1">
                يدعم صيغ JPG, PNG, WEBP بدقة عالية وسرعة فائقة (يمكنك اختيار أكثر من صورة معاً)
              </p>
            </>
          )}
        </div>
      )}

      {/* Tab 2: Direct Web Link */}
      {activeTab === 'url' && (
        <div className="p-4 rounded-2xl bg-[#FDFFF5] border-2 border-[#1D2D2E] shadow-[3px_3px_0px_#1D2D2E] space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-[#1D2D2E] text-xs font-mono text-[#1D2D2E] focus:ring-2 focus:ring-[#FF7E47] placeholder:text-gray-400 font-bold"
                dir="ltr"
              />
              <LinkIcon className="w-4 h-4 text-[#1D2D2E]/60 absolute left-3 top-3" />
            </div>

            <button
              type="button"
              onClick={handleAddUrl}
              className="px-5 py-2.5 rounded-xl bg-[#FFD95A] hover:bg-[#fcd34d] text-[#1D2D2E] border-2 border-[#1D2D2E] shadow-[2px_2px_0px_#1D2D2E] font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة الصورة</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs font-black text-[#1D2D2E]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="urlType"
                checked={urlAsMain}
                onChange={() => setUrlAsMain(true)}
                className="text-[#FF7E47] focus:ring-[#FF7E47]"
              />
              <span>تعيين كصورة غلاف رئيسية</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="urlType"
                checked={!urlAsMain}
                onChange={() => setUrlAsMain(false)}
                className="text-[#FF7E47] focus:ring-[#FF7E47]"
              />
              <span>إضافة إلى معرض الصور الإضافية</span>
            </label>
          </div>
        </div>
      )}

      {/* Tab 3: Presets Library */}
      {activeTab === 'presets' && (
        <div className="space-y-2">
          <p className="text-xs font-black text-[#1D2D2E]">
            انقر على أي صورة لإضافتها مباشرة للرحلة:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 max-h-56 overflow-y-auto p-1">
            {PRESET_IMAGES.map((preset, idx) => {
              const isSelected = mainImage === preset.url || galleryImages.includes(preset.url);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset.url)}
                  className={`group relative rounded-xl overflow-hidden border-2 aspect-video text-right transition-all cursor-pointer ${
                    isSelected ? 'border-[#FF7E47] ring-2 ring-[#FF7E47] shadow-[2px_2px_0px_#1D2D2E]' : 'border-[#1D2D2E] hover:scale-102'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preset.url}
                    alt={preset.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                    <span className="text-[10px] font-bold text-white line-clamp-1">
                      {preset.title}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="absolute top-1 left-1 w-5 h-5 rounded-full bg-[#FFD95A] border border-[#1D2D2E] text-[#1D2D2E] flex items-center justify-center text-[10px] font-black shadow-md">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Visual Showcase: Main Image & Gallery */}
      <div className="space-y-4 pt-2">
        {/* Main Cover Image Display */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-[#1D2D2E] flex items-center gap-1.5">
              <Star className="w-4 h-4 text-[#FF7E47] fill-[#FF7E47]" />
              <span>صورة الغلاف الرئيسية (Main Cover):</span>
            </span>
            {mainImage && (
              <button
                type="button"
                onClick={handleRemoveMainImage}
                className="text-xs text-rose-600 hover:text-rose-700 font-black flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>حذف الصورة الرئيسية</span>
              </button>
            )}
          </div>

          {mainImage ? (
            <div className="relative rounded-3xl overflow-hidden border-[3px] border-[#1D2D2E] bg-white max-h-72 aspect-video sm:aspect-[21/9] group shadow-[4px_4px_0px_#1D2D2E]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mainImage}
                alt="Main Trip Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-white border-2 border-[#1D2D2E] text-[#1D2D2E] text-xs font-black flex items-center gap-1.5 shadow-[2px_2px_0px_#1D2D2E]">
                <Star className="w-3.5 h-3.5 fill-[#FF7E47] text-[#FF7E47]" />
                <span>الصورة الرئيسية للبطاقة والموقع</span>
              </div>

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewModalImg(mainImage)}
                  className="p-2.5 rounded-xl bg-white text-[#1D2D2E] border-2 border-[#1D2D2E] hover:bg-[#FFD95A] transition-all font-black text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_#1D2D2E] cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>معاينة مكبرة</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl border-[3px] border-dashed border-[#1D2D2E] bg-[#FDFFF5] text-center space-y-1">
              <ImageIcon className="w-8 h-8 text-gray-400 mx-auto" />
              <p className="text-xs text-[#1D2D2E] font-black">لم يتم تحديد صورة رئيسية للرحلة بعد</p>
              <p className="text-[11px] text-gray-600 font-bold">اختر صورة عبر رفع ملف أو رابط أو من المكتبة الجاهزة أعلاه</p>
            </div>
          )}
        </div>

        {/* Gallery Images List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-[#1D2D2E] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#1D2D2E]" />
              <span>معرض الصور الإضافية للرحلة ({galleryImages.length} صور):</span>
            </span>
          </div>

          {galleryImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {galleryImages.map((imgUrl, index) => (
                <div
                  key={index}
                  className="group relative rounded-2xl overflow-hidden border-2 border-[#1D2D2E] bg-white aspect-video shadow-[3px_3px_0px_#1D2D2E] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgUrl}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay Controls on Hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setPreviewModalImg(imgUrl)}
                        className="p-1 rounded-lg bg-white border border-[#1D2D2E] text-[#1D2D2E] hover:bg-[#FFD95A] cursor-pointer"
                        title="معاينة"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(index)}
                        className="p-1 rounded-lg bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
                        title="حذف الصورة"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSetAsMain(imgUrl)}
                      className="w-full py-1 px-2 rounded-lg bg-[#FFD95A] hover:bg-[#fcd34d] text-[#1D2D2E] border border-[#1D2D2E] font-black text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-sm"
                    >
                      <Star className="w-2.5 h-2.5" />
                      <span>تعيين كرئيسية</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-600 font-bold bg-[#FDFFF5] p-3 rounded-2xl border-2 border-[#1D2D2E]">
              لا توجد صور إضافية في المعرض. يمكنك رفع أو إضافة صور ليتصفحها العميل في تفاصيل الرحلة.
            </p>
          )}
        </div>
      </div>

      {/* Fullscreen Preview Modal */}
      {previewModalImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
          onClick={() => setPreviewModalImg(null)}
        >
          <div
            className="relative max-w-4xl max-h-[85vh] w-full rounded-3xl overflow-hidden bg-white border-[3px] border-[#1D2D2E] p-2 shadow-[8px_8px_0px_#1D2D2E] animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewModalImg(null)}
              className="absolute top-4 left-4 z-10 p-2 rounded-full bg-white border-2 border-[#1D2D2E] text-[#1D2D2E] hover:bg-[#FFD95A] cursor-pointer shadow-[2px_2px_0px_#1D2D2E]"
            >
              <X className="w-5 h-5" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewModalImg}
              alt="Preview Full"
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}
