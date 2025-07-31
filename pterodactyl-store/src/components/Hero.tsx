import Link from 'next/link'
import { ArrowRight, Shield, Zap, Globe } from 'lucide-react'

export function Hero() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Panel Pterodactyl
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {' '}Private
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Hosting berkualitas tinggi dengan uptime 99%, garansi full 30 hari, 
            dan DDoS protection untuk semua kebutuhan development Anda.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link
            href="#products"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
          >
            <span>Lihat Paket</span>
            <ArrowRight size={20} />
          </Link>
          <Link
            href="https://wa.me/62895395590009"
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:border-blue-600 hover:text-blue-600 transition-colors"
          >
            Hubungi Kami
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="text-green-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">99% Uptime</h3>
            <p className="text-gray-600 text-center">
              Server stabil dengan jaminan uptime hingga 99%
            </p>
          </div>

          <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Zap className="text-blue-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Performa Tinggi</h3>
            <p className="text-gray-600 text-center">
              Processor Epyc Genoa & ECC DDR5 untuk performa maksimal
            </p>
          </div>

          <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Globe className="text-purple-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Network</h3>
            <p className="text-gray-600 text-center">
              Koneksi internet stabil hingga 2Gb/s
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}