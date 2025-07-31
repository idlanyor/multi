import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/ProductCard'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Features } from '@/components/Features'
import { Contact } from '@/components/Contact'

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: [
      { category: 'asc' },
      { price: 'asc' }
    ]
  })

  const groupedProducts = {
    NODEJS: products.filter(p => p.category === 'NODEJS'),
    VPS: products.filter(p => p.category === 'VPS'),
    PYTHON: products.filter(p => p.category === 'PYTHON'),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main>
        <Hero />
        
        {/* Products Section */}
        <section id="products" className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Panel Pterodactyl Private
              </h2>
              <p className="text-xl text-gray-600">
                Pilih paket sesuai kebutuhan Anda
              </p>
            </div>

            {/* NodeJS Products */}
            <div className="mb-16">
              <h3 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center">
                🟢 NodeJS VIP (A1-A6)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedProducts.NODEJS.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>

            {/* VPS Products */}
            <div className="mb-16">
              <h3 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center">
                🔧 VPS (B1-B6)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedProducts.VPS.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>

            {/* Python Products */}
            <div className="mb-16">
              <h3 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center">
                🐍 Python (C1-C6)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedProducts.PYTHON.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <Features />
        <Contact />
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Antidonasi Store</h3>
          <p className="text-gray-400 mb-4">
            Panel Pterodactyl Private - Uptime 99% dengan Garansi Full 30 Day
          </p>
          <div className="flex justify-center space-x-6">
            <a 
              href="https://wa.me/62895395590009" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              📱 WhatsApp
            </a>
            <a 
              href="https://chat.whatsapp.com/I5JCuQnIo4f79JsZAGCvDD" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              👥 Community
            </a>
          </div>
          <p className="text-gray-500 mt-8">
            © 2024 Antidonasi Store. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
