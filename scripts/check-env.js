const fs = require('fs')
const path = require('path')

function checkEnv() {
  const envPath = path.join(process.cwd(), '.env.local')
  
  if (!fs.existsSync(envPath)) {
    console.log('⚠️  No existe archivo .env.local')
    console.log('💡 Ejecuta: npm run env:dev o npm run env:prod')
    return
  }

  const envContent = fs.readFileSync(envPath, 'utf8')
  const dbUrlMatch = envContent.match(/DATABASE_URL="([^"]+)"/)
  
  if (!dbUrlMatch) {
    console.log('⚠️  No se encontró DATABASE_URL en .env.local')
    return
  }

  const dbUrl = dbUrlMatch[1]
  
  if (dbUrl.includes('ep-dry-resonance')) {
    console.log('🔵 Entorno: DESARROLLO')
    console.log(`📊 Base de datos: ep-dry-resonance-ac3splmm-pooler.sa-east-1.aws.neon.tech`)
  } else if (dbUrl.includes('ep-gentle-cell')) {
    console.log('🟢 Entorno: PRODUCCIÓN')
    console.log(`📊 Base de datos: ep-gentle-cell-ac7k8ivc-pooler.sa-east-1.aws.neon.tech`)
  } else {
    console.log('❓ Entorno: DESCONOCIDO')
    console.log(`📊 Base de datos: ${dbUrl.split('@')[1]?.split('/')[0] || 'N/A'}`)
  }
}

checkEnv()
