import { Shield, Clock, Zap, HardDrive, Wifi, Users } from 'lucide-react'

export function Features() {
  const features = [
    {
      icon: <Clock className="text-green-600" size={32} />,
      title: "Uptime 99%",
      description: "Server stabil dengan jaminan uptime hingga 99% untuk kebutuhan bisnis Anda"
    },
    {
      icon: <Shield className="text-blue-600" size={32} />,
      title: "Garansi Full 30 Day",
      description: "Kepuasan pelanggan adalah prioritas utama dengan garansi penuh selama 30 hari"
    },
    {
      icon: <Shield className="text-purple-600" size={32} />,
      title: "DDoS Protection",
      description: "Perlindungan maksimal dari serangan DDoS untuk menjaga keamanan server"
    },
    {
      icon: <HardDrive className="text-orange-600" size={32} />,
      title: "Bukan VPS Abuse/Trial",
      description: "Server dedicated berkualitas tinggi, bukan VPS trial atau hasil abuse"
    },
    {
      icon: <Zap className="text-yellow-600" size={32} />,
      title: "Processor Epyc Genoa & ECC DDR5",
      description: "Hardware terdepan dengan processor AMD Epyc Genoa dan RAM ECC DDR5"
    },
    {
      icon: <Wifi className="text-indigo-600" size={32} />,
      title: "Speed Up to 2Gb/s",
      description: "Koneksi internet super cepat dan stabil hingga 2Gb/s"
    },
    {
      icon: <Users className="text-red-600" size={32} />,
      title: "Admin Panel Owner Only",
      description: "Keamanan maksimal dengan akses admin panel hanya untuk owner"
    },
    {
      icon: <Clock className="text-teal-600" size={32} />,
      title: "Bisa Diperpanjang",
      description: "Kemudahan perpanjangan service dengan akun yang sama"
    }
  ]

  return (
    <section id="features" className="py-20 px-4 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Keunggulan Kami
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Mengapa memilih Antidonasi Store? Kami memberikan yang terbaik untuk kebutuhan hosting Anda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-300 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="w-16 h-16 mx-auto mb-4 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}