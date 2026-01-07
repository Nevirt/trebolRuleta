const fs = require('fs')
const path = require('path')

const ENV_FILES = {
  development: {
    DATABASE_URL: 'postgresql://neondb_owner:npg_gZWq24KcCijD@ep-dry-resonance-ac3splmm-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require'
  },
  production: {
    DATABASE_URL: 'postgresql://neondb_owner:npg_gZWq24KcCijD@ep-gentle-cell-ac7k8ivc-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require'
  }
}

function setEnv(environment) {
  if (!ENV_FILES[environment]) {
    console.error(`❌ Entorno "${environment}" no válido. Usa "development" o "production"`)
    process.exit(1)
  }

  const envPath = path.join(process.cwd(), '.env.local')
  const envContent = Object.entries(ENV_FILES[environment])
    .map(([key, value]) => `${key}="${value}"`)
    .join('\n') + '\n'

  fs.writeFileSync(envPath, envContent, 'utf8')
  console.log(`✅ Archivo .env.local configurado para entorno: ${environment}`)
  console.log(`📊 Base de datos: ${ENV_FILES[environment].DATABASE_URL.split('@')[1].split('/')[0]}`)
}

const environment = process.argv[2] || 'development'
setEnv(environment)
