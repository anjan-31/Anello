# Script to push all environment variables to Vercel
# Run: .\set-vercel-env.ps1

$envVars = @{
    "MONGODB_URI"                    = "mongodb+srv://admin:anello2025@anello.gszbntp.mongodb.net/anello"
    "GMAIL_USER"                     = "worldanello@gmail.com"
    "GMAIL_APP_PASSWORD"             = "bywi vkas zjqo szpj"
    "NEXT_PUBLIC_SITE_URL"           = "https://anello-anjan-singhs-projects.vercel.app"
    "CLOUDINARY_CLOUD_NAME"          = "dhc6iqrbh"
    "CLOUDINARY_API_KEY"             = "115421833643611"
    "CLOUDINARY_API_SECRET"          = "oqVmUycAMSebop4Aj8zi0uU18qA"
    "NEXT_PUBLIC_GOOGLE_CLIENT_ID"   = "204949567229-pnarriabutrpk9gakbk8m60ao300bsne.apps.googleusercontent.com"
    "WHATSAPP_NUMBER"                = "919545457711"
    "NEXT_PUBLIC_RECAPTCHA_SITE_KEY" = "6Ld-mock-site-key-here-xxxx"
    "RECAPTCHA_SECRET_KEY"           = "6Ld-mock-secret-key-here-xxxx"
}

foreach ($key in $envVars.Keys) {
    $value = $envVars[$key]
    Write-Host "Adding $key ..." -ForegroundColor Cyan
    # Add to all environments: production, preview, development
    echo $value | npx vercel env add $key production --force 2>&1
    echo $value | npx vercel env add $key preview --force 2>&1
    echo $value | npx vercel env add $key development --force 2>&1
}

Write-Host "`n✅ All environment variables added to Vercel!" -ForegroundColor Green
Write-Host "Now triggering a redeployment..." -ForegroundColor Yellow
npx vercel --prod
