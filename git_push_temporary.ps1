$gitPaths = @(
  'C:\Program Files\Git\cmd\git.exe',
  'C:\Program Files (x86)\Git\cmd\git.exe',
  'C:\Users\Miche\AppData\Local\Programs\Git\cmd\git.exe',
  'C:\Users\Miche\AppData\Local\GitHubDesktop\app-*\resources\app\git\cmd\git.exe',
  'C:\Users\Miche\AppData\Local\Programs\Git\bin\git.exe',
  'C:\Program Files\Git\bin\git.exe'
)
$git = $null
foreach ($path in $gitPaths) {
  $resolved = Get-Item $path -ErrorAction SilentlyContinue
  if ($resolved) {
    $git = $resolved[0].FullName
    break
  }
}

if (-not $git) {
  Write-Error "Git introuvable sur le système."
  exit 1
}

Write-Output "Git trouvé : $git"

& $git add .
& $git commit -m "feat: Add premium favicon to all core pages"
& $git push origin main
