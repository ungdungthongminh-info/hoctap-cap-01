import { Volume2, Sparkles, Smartphone, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MascotCharacter } from '../../../shared/components';

export function SettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Cài đặt</h1>
          <p className="text-gray-600">Quản lý các tùy chọn của ứng dụng</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Giọng đọc */}
          <div
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => navigate('/tts-settings')}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Volume2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Giọng đọc</h3>
                <p className="text-sm text-gray-600">Cài đặt giọng đọc TTS</p>
              </div>
            </div>
          </div>

          {/* AI */}
          <div
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => navigate('/ai-settings')}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Cài đặt AI</h3>
                <p className="text-sm text-gray-600">Cấu hình AI chat</p>
              </div>
            </div>
          </div>

          {/* PWA */}
          <div
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => navigate('/pwa')}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Smartphone className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Ứng dụng</h3>
                <p className="text-sm text-gray-600">Cài đặt PWA</p>
              </div>
            </div>
          </div>

          {/* Hỗ trợ */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <MessageCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">Hỗ trợ</h3>
                <p className="text-sm text-gray-600 mb-4">Liên hệ hỗ trợ</p>
                <a
                  href="https://zalo.me/9892964685"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <MessageCircle className="w-4 h-4" />
                  Hỗ trợ Zalo
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <MascotCharacter size="sm" />
        </div>
      </div>
    </div>
  );
}