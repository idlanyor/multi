import Link from 'next/link'
import { MessageCircle, Users, Phone } from 'lucide-react'

export function Contact() {
  return (
    <section id="contact" className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Hubungi Kami
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tim support kami siap membantu Anda 24/7. Jangan ragu untuk menghubungi kami!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link
            href="https://wa.me/62895395590009"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 group"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
              <MessageCircle className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">WhatsApp</h3>
            <p className="text-gray-600 mb-4">
              Chat langsung dengan admin untuk konsultasi dan support
            </p>
            <span className="text-green-600 font-semibold">+62 895-3955-90009</span>
          </Link>

          <Link
            href="https://chat.whatsapp.com/I5JCuQnIo4f79JsZAGCvDD"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 group"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
              <Users className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
            <p className="text-gray-600 mb-4">
              Bergabung dengan komunitas pengguna Antidonasi Store
            </p>
            <span className="text-blue-600 font-semibold">Join Group WhatsApp</span>
          </Link>
        </div>

        <div className="mt-12 p-8 bg-white rounded-xl shadow-lg max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Jam Operasional
          </h3>
          <div className="space-y-2 text-gray-600">
            <p><strong>Senin - Minggu:</strong> 08:00 - 22:00 WIB</p>
            <p><strong>Response Time:</strong> &lt; 30 menit</p>
            <p className="text-sm text-gray-500 mt-4">
              * Support darurat tersedia 24/7 melalui WhatsApp
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}