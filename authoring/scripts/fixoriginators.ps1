# List of root paths to check
$paths = @(
    "/sitecore/content/FastLaneTenant",
    "/sitecore/layout/Renderings/Feature/FastLane",
    "/sitecore/templates/Branches/Feature/FastLane",
    "/sitecore/templates/Feature/FastLane"
)

foreach ($path in $paths) {
    $rootItem = Get-Item -Path $path
    if ($null -eq $rootItem) {
        Write-Host "Root item not found: $path" -ForegroundColor Yellow
        continue
    }
    $allItems = $rootItem.Axes.GetDescendants() + $rootItem
    foreach ($item in $allItems) {
        $originatorId = $item["__Originator"]
        if (![string]::IsNullOrEmpty($originatorId)) {
            $originatorItem = Get-Item -Path "master:" -ID $originatorId -ErrorAction SilentlyContinue
            if ($null -eq $originatorItem) {
                Write-Host "Item '$($item.Paths.FullPath)' has missing originator ID: $originatorId" -ForegroundColor Red
            }
        }
    }
}
