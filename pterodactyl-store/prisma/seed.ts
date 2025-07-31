import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const products = [
  // NodeJS VIP (A1-A6)
  { 
    name: "NodeJS Kroco", 
    description: "🟢 A1 - NodeJS Kroco - 3GB, 100% CPU", 
    category: "NODEJS", 
    ram: 3, 
    cpu: 100, 
    price: 5000, 
    emoji: "🟢" 
  },
  { 
    name: "NodeJS Karbit", 
    description: "🟡 A2 - NodeJS Karbit - 5GB, 150% CPU", 
    category: "NODEJS", 
    ram: 5, 
    cpu: 150, 
    price: 7500, 
    emoji: "🟡" 
  },
  { 
    name: "NodeJS Standar", 
    description: "🟠 A3 - NodeJS Standar - 7GB, 200% CPU", 
    category: "NODEJS", 
    ram: 7, 
    cpu: 200, 
    price: 10000, 
    emoji: "🟠" 
  },
  { 
    name: "NodeJS Sepuh", 
    description: "🔴 A4 - NodeJS Sepuh - 11GB, 250% CPU", 
    category: "NODEJS", 
    ram: 11, 
    cpu: 250, 
    price: 12500, 
    emoji: "🔴" 
  },
  { 
    name: "NodeJS Suhu", 
    description: "🟣 A5 - NodeJS Suhu - 13GB, 300% CPU", 
    category: "NODEJS", 
    ram: 13, 
    cpu: 300, 
    price: 15000, 
    emoji: "🟣" 
  },
  { 
    name: "NodeJS Pro Max", 
    description: "💎 A6 - NodeJS Pro Max - 16GB, 400% CPU", 
    category: "NODEJS", 
    ram: 16, 
    cpu: 400, 
    price: 20000, 
    emoji: "💎" 
  },

  // VPS (B1-B6)
  { 
    name: "VPS Kroco", 
    description: "🟢 B1 - VPS Kroco - 3GB, 100% CPU", 
    category: "VPS", 
    ram: 3, 
    cpu: 100, 
    price: 7500, 
    emoji: "🟢" 
  },
  { 
    name: "VPS Karbit", 
    description: "🟡 B2 - VPS Karbit - 5GB, 150% CPU", 
    category: "VPS", 
    ram: 5, 
    cpu: 150, 
    price: 10000, 
    emoji: "🟡" 
  },
  { 
    name: "VPS Standar", 
    description: "🟠 B3 - VPS Standar - 7GB, 200% CPU", 
    category: "VPS", 
    ram: 7, 
    cpu: 200, 
    price: 15000, 
    emoji: "🟠" 
  },
  { 
    name: "VPS Sepuh", 
    description: "🔴 B4 - VPS Sepuh - 9GB, 250% CPU", 
    category: "VPS", 
    ram: 9, 
    cpu: 250, 
    price: 20000, 
    emoji: "🔴" 
  },
  { 
    name: "VPS Suhu", 
    description: "🟣 B5 - VPS Suhu - 11GB, 300% CPU", 
    category: "VPS", 
    ram: 11, 
    cpu: 300, 
    price: 25000, 
    emoji: "🟣" 
  },
  { 
    name: "VPS Pro Max", 
    description: "💎 B6 - VPS Pro Max - 13GB, 350% CPU", 
    category: "VPS", 
    ram: 13, 
    cpu: 350, 
    price: 35000, 
    emoji: "💎" 
  },

  // Python (C1-C6)
  { 
    name: "Python Kroco", 
    description: "🟢 C1 - Python Kroco - 3GB, 100% CPU", 
    category: "PYTHON", 
    ram: 3, 
    cpu: 100, 
    price: 3000, 
    emoji: "🟢" 
  },
  { 
    name: "Python Karbit", 
    description: "🟡 C2 - Python Karbit - 5GB, 150% CPU", 
    category: "PYTHON", 
    ram: 5, 
    cpu: 150, 
    price: 5000, 
    emoji: "🟡" 
  },
  { 
    name: "Python Standar", 
    description: "🟠 C3 - Python Standar - 7GB, 150% CPU", 
    category: "PYTHON", 
    ram: 7, 
    cpu: 150, 
    price: 7500, 
    emoji: "🟠" 
  },
  { 
    name: "Python Sepuh", 
    description: "🔴 C4 - Python Sepuh - 9GB, 200% CPU", 
    category: "PYTHON", 
    ram: 9, 
    cpu: 200, 
    price: 10000, 
    emoji: "🔴" 
  },
  { 
    name: "Python Suhu", 
    description: "🟣 C5 - Python Suhu - 11GB, 250% CPU", 
    category: "PYTHON", 
    ram: 11, 
    cpu: 250, 
    price: 12500, 
    emoji: "🟣" 
  },
  { 
    name: "Python Pro Max", 
    description: "💎 C6 - Python Pro Max - 13GB, 300% CPU", 
    category: "PYTHON", 
    ram: 13, 
    cpu: 300, 
    price: 17500, 
    emoji: "💎" 
  }
]

async function main() {
  console.log('Start seeding...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@antidonasi.store' },
    update: {},
    create: {
      email: 'admin@antidonasi.store',
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN',
      fullName: 'Administrator',
      whatsapp: '62895395590009'
    }
  })

  console.log('Created admin user:', admin)

  // Create products
  for (const product of products) {
    const existingProduct = await prisma.product.findFirst({
      where: { name: product.name }
    })
    
    if (!existingProduct) {
      const createdProduct = await prisma.product.create({
        data: product
      })
      console.log('Created product:', createdProduct.name)
    } else {
      console.log('Product already exists:', product.name)
    }
  }

  // Create settings
  const settings = await prisma.settings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      pterodactylUrl: process.env.PTERODACTYL_URL || 'https://your-panel.com',
      pterodactylApiKey: process.env.PTERODACTYL_API_KEY || 'ptla_your-api-key-here',
      clientApiKey: process.env.PTERODACTYL_CLIENT_KEY || 'ptlc_your-client-key-here',
      qrisImage: process.env.QRIS_IMAGE_URL || '/qris.png',
      paymentInfo: process.env.PAYMENT_INFO || 'Transfer ke: 085123456789 (Dana/OVO/GoPay)',
      whatsappNumber: process.env.WHATSAPP_NUMBER || '62895395590009'
    }
  })

  console.log('Created settings:', settings)
  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })