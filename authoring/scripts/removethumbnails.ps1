$doNotProcess = $true
$items = @()
$paths = @(
    "master:/sitecore/content/FastLaneTenant",
    "master:/sitecore/system/Settings/Feature/FastLane",
    "master:/sitecore/templates/Branches/Feature/FastLane",
    "master:/sitecore/templates/Feature/FastLane"
)
foreach ($path in $paths) {
    $items += Get-ChildItem -Path $path -Recurse
}
$brokenThumbnails = @()

foreach ($item in $items) {
    $thumbnailField = $item.Fields["__Thumbnail"]
    if ($thumbnailField -and $thumbnailField.Value) {
        $thumbnailValue = $thumbnailField.Value
        $mediaId = $null

        if ($thumbnailValue -match '^\{[0-9A-Fa-f\-]+\}$') {
            # Value is a direct GUID
            $mediaId = $thumbnailValue
        } elseif ($thumbnailValue -match 'mediaid\s*=\s*"\{([0-9A-Fa-f\-]+)\}"') {
            # Value is XML, extract mediaid attribute
            $mediaId = $matches[1]
            # Add braces to match Sitecore ID format
            $mediaId = "{$mediaId}"
        }

        if ($mediaId) {
            $mediaItem = Get-Item -Path "master:" -ID $mediaId -ErrorAction SilentlyContinue
            if (-not $mediaItem) {
                $brokenThumbnails += $item
            }
        }
    }
}

$brokenThumbnails | Select-Object Name, ID, @{Name="FullPath";Expression={ $_.Paths.FullPath }}, @{Name="__AutoThumbnails";Expression={
    $field = $_.Fields["__AutoThumbnails"]
    if ($field -and $field.Value -eq "1") { "Checked" } else { "Unchecked" }
}}

if ($doNotProcess -ne $false) {
# Clear __AutoThumbnails and __Thumbnail fields for each broken thumbnail item
    foreach ($item in $brokenThumbnails) {
        if ($item.Fields["__AutoThumbnails"]) {
            $item.Editing.BeginEdit()
            $item.Fields["__AutoThumbnails"].Value = $null
            $item.Fields["__Thumbnail"].Value = $null
            $item.Editing.EndEdit()
        }
    }
