# Her gun calisir: degisiklik varsa commit atip GitHub'a push eder.
Set-Location -Path $PSScriptRoot

$durum = git status --porcelain
if ($durum) {
    git add -A
    git commit -m ("Gunluk guncelleme: " + (Get-Date -Format "yyyy-MM-dd"))
    git push
    Write-Host "Degisiklikler GitHub'a gonderildi."
} else {
    Write-Host "Yeni degisiklik yok, push atlandi."
}
