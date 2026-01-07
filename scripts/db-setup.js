const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🔧 Configurando base de datos con Prisma...\n')

// Leer .env.local
const envPath = path.join(process.cwd(), '.env.local')
if (!fs.existsSync(envPath)) {
  console.error('❌ No se encontró archivo .env.local')
  console.log('💡 Ejecuta primero: npm run env:dev o npm run env:prod')
  process.exit(1)
}

const envContent = fs.readFileSync(envPath, 'utf8')
const dbUrlMatch = envContent.match(/DATABASE_URL="([^"]+)"/)

if (!dbUrlMatch) {
  console.error('❌ No se encontró DATABASE_URL en .env.local')
  process.exit(1)
}

const dbUrl = dbUrlMatch[1]

// Detectar entorno
let environment = 'unknown'
if (dbUrl.includes('ep-dry-resonance')) {
  environment = 'development'
} else if (dbUrl.includes('ep-gentle-cell')) {
  environment = 'production'
}

console.log(`📊 Entorno: ${environment.toUpperCase()}`)
console.log(`🔗 Base de datos: ${dbUrl.split('@')[1]?.split('/')[0] || 'N/A'}\n`)

try {
  console.log('1️⃣ Generando cliente de Prisma...')
  execSync('npx prisma generate', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: dbUrl }
  })
  console.log('✅ Cliente de Prisma generado\n')

  console.log('2️⃣ Sincronizando esquema con la base de datos...')
  execSync('npx prisma db push', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: dbUrl }
  })
  console.log('✅ Base de datos sincronizada\n')

  console.log('✨ ¡Configuración completada exitosamente!')
  console.log('\n📝 Próximos pasos:')
  console.log('   - Ejecuta: npm run dev')
  console.log('   - Abre: http://localhost:3000')
  console.log('   - Crea premios desde el menú administrativo (⋮)')
} catch (error) {
  console.error('\n❌ Error durante la configuración:', error.message)
  process.exit(1)
}
