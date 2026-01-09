# Sitecore Page Rendering Audit Script
# Analyzes rendering usage across all pages in the site
# Compatible with Sitecore XP 10.1.3 and SXA

param(
    [string]$SitePath = "/sitecore/content/BSW/Sites/BSWHealth",
    [string]$OutputPath = "C:\temp\rendering-audit.csv",
    [switch]$IncludePageInfo,
    [switch]$ExportToCSV,
    [switch]$Verbose,
    [string]$SiteName = ""
)

Write-Host "Starting Page Rendering Audit..." -ForegroundColor Green
Write-Host "Site Path: $SitePath" -ForegroundColor Yellow

# Initialize collections
$renderingUsage = @{}
$pageDetails = @()
$processedPages = 0
$totalPages = 0

# Function to get all renderings from layout details
function Get-PageRenderings {
    param($item)
    
    $renderings = @()
    
    # Function to extract renderings from XML
    function Extract-RenderingsFromXml {
        param($xmlContent, $fieldName)
        
        if (-not $xmlContent) { return @() }
        
        try {
            [xml]$layoutXml = $xmlContent
            $foundRenderings = @()
            
            # Extract renderings from all devices - look for ALL <r> elements (nested anywhere)
            $layoutXml.SelectNodes("//r") | ForEach-Object {
                $rendering = $_
                
                # Try different attribute formats (Sitecore uses both regular and namespaced attributes)
                $renderingId = $rendering.GetAttribute("s:id")
                if (-not $renderingId -or $renderingId -eq "") { 
                    $renderingId = $rendering.GetAttribute("id") 
                }
                
                # Only process if we found a rendering ID (skip container elements)
                if ($renderingId -and $renderingId -ne "" -and $renderingId.Length -gt 10) {
                    $placeholderKey = $rendering.GetAttribute("ph")
                    if (-not $placeholderKey) { $placeholderKey = $rendering.GetAttribute("s:ph") }
                    
                    $datasource = $rendering.GetAttribute("ds")
                    if (-not $datasource) { $datasource = $rendering.GetAttribute("s:ds") }
                    # Get rendering item to get name
                    $renderingItem = Get-Item -Path "master:" -ID $renderingId -ErrorAction SilentlyContinue
                    if ($renderingItem) {
                        if ($Verbose) { Write-Host "        -> Added: $($renderingItem.Name)" -ForegroundColor Cyan }
                        $foundRenderings += @{
                            ID = $renderingId
                            Name = $renderingItem.Name
                            DisplayName = $renderingItem.DisplayName
                            Path = $renderingItem.Paths.FullPath
                            Placeholder = $placeholderKey
                            Datasource = $datasource
                            Template = $renderingItem.TemplateName
                            Source = $fieldName
                        }
                    } else {
                        Write-Warning "  -> Rendering ID $renderingId not found in master database (from $fieldName)"
                    }
                } else {
                    # Skip non-rendering elements (like <d> device elements, <p> placeholder elements, etc.)
                    if ($Verbose) { Write-Host "      -> Skipping non-rendering element or invalid ID: $($rendering.Name)" -ForegroundColor DarkGray }
                }
            }
            
            return $foundRenderings
        }
        catch {
            Write-Warning "Failed to parse $fieldName XML for item: $($item.Paths.FullPath) - $($_.Exception.Message)"
            return @()
        }
    }
    
    # Check __Renderings field (shared layout)
    $renderingsField = $item.Fields["__Renderings"]
    if ($renderingsField -and $renderingsField.Value) {
        if ($Verbose) { Write-Host "    -> Found __Renderings field" -ForegroundColor DarkCyan }
        $renderings += Extract-RenderingsFromXml -xmlContent $renderingsField.Value -fieldName "__Renderings"
    }
    
    # Check __Final Renderings field (final layout after personalization/testing)
    $finalRenderingsField = $item.Fields["__Final Renderings"]
    if ($finalRenderingsField -and $finalRenderingsField.Value) {
        if ($Verbose) { Write-Host "    -> Found __Final Renderings field" -ForegroundColor DarkCyan }
        $finalRenderings = Extract-RenderingsFromXml -xmlContent $finalRenderingsField.Value -fieldName "__Final Renderings"
        
        # Merge final renderings, avoiding duplicates
        foreach ($finalRendering in $finalRenderings) {
            $exists = $renderings | Where-Object { $_.ID -eq $finalRendering.ID -and $_.Placeholder -eq $finalRendering.Placeholder }
            if (-not $exists) {
                $renderings += $finalRendering
            }
        }
    }
    
    return $renderings
}

# Function to check if item is a page (has layout and is not a data item)
function Test-IsPage {
    param($item)
    
    # Exclude common data/settings paths by name pattern
    $excludePaths = @("Data", "Settings", "Media", "Dictionary", "Metadata", "Config")
    foreach ($excludePath in $excludePaths) {
        if ($item.Name -eq $excludePath -or $item.Paths.FullPath -like "*/$excludePath" -or $item.Paths.FullPath -like "*/$excludePath/*") {
            return $false
        }
    }
    
    # Exclude common data/settings templates
    $excludeTemplates = @(
        "Folder", 
        "Site Grouping", 
        "Site", 
        "Tenant",
        "Media Folder",
        "Dictionary Domain",
        "Dictionary Entry",
        "Data Folder",
        "Content Folder",
        "SXA Site",
        "SXA Tenant",
        "SXA Theme",
        "Datasource Template",
        "Reference",
        "Redirect",
        "Proxy",
        "Script"
    )
    
    if ($excludeTemplates -contains $item.TemplateName) {
        return $false
    }
    
    # Check if item has layout
    $layoutField = $item.Fields["__Renderings"]
    $finalLayoutField = $item.Fields["__Final Renderings"]
    
    if ((-not $layoutField -or -not $layoutField.Value) -and (-not $finalLayoutField -or -not $finalLayoutField.Value)) {
        return $false
    }
    
    # Include pages and SXA page templates
    $pageTemplates = @(
        "Page",
        "Standard page",
        "Article Page",
        "Landing Page",
        "Home Page",
        "Content Page",
        "App Page",
        "SXA Page"
    )
    
    # Check if it's a known page template or has layout
    return ($pageTemplates -contains $item.TemplateName) -or ($layoutField.Value -ne "") -or ($finalLayoutField.Value -ne "")
}

# Get all items under the specified path
Write-Host "Scanning for pages..." -ForegroundColor Yellow

if ($SiteName) {
    # If site name is specified, try to find the site root
    Write-Host "Searching for site: $SiteName..." -ForegroundColor Yellow
    $siteRoot = Get-ChildItem -Path "$SitePath" -Recurse | Where-Object { $_.Name -eq $SiteName } | Select-Object -First 1
    if ($siteRoot) {
        $SitePath = $siteRoot.Paths.FullPath
        Write-Host "Found site root: $SitePath" -ForegroundColor Green
    }
}

Write-Host "Starting recursive scan from: $SitePath" -ForegroundColor Yellow

# Function to recursively process items efficiently
function Process-ItemsRecursively {
    param($startPath)
    
    # Get items at current level
    $items = Get-ChildItem -Path $startPath
    
    foreach ($item in $items) {
        $script:totalPages++
        
        # Skip examining data/settings folders entirely to speed up processing
        $shouldSkip = $false
        $excludePaths = @("Data", "Settings", "Media", "Dictionary", "Metadata", "Config")
        foreach ($excludePath in $excludePaths) {
            if ($item.Name -eq $excludePath) {
                $shouldSkip = $true
                if ($Verbose) { Write-Host "Skipping data folder: $($item.Paths.FullPath)" -ForegroundColor Yellow }
                break
            }
        }
        
        if ($shouldSkip) {
            continue
        }
        
        # Show progress for items being examined (verbose mode only)
        if ($Verbose) {
            Write-Host "Examining: $($item.Paths.FullPath)" -ForegroundColor DarkGray
        }
        
        # Check if this item is a page
        if (Test-IsPage $item) {
            $script:processedPages++
            
            Write-Host "  -> Processing page: $($item.Paths.FullPath) $($item.Name) ($script:processedPages pages found so far)" -ForegroundColor Gray
            
            # Get renderings for this page
            $pageRenderings = Get-PageRenderings -item $item
            Write-Host "    -> Found $($pageRenderings.Count) renderings on this page" -ForegroundColor Green
            
            # Store page details if requested
            if ($IncludePageInfo) {
                $script:pageDetails += @{
                    PagePath = $item.Paths.FullPath
                    PageName = $item.Name
                    PageDisplayName = $item.DisplayName
                    Template = $item.TemplateName
                    RenderingCount = $pageRenderings.Count
                    Renderings = ($pageRenderings | ForEach-Object { $_.Name }) -join "; "
                }
            }
            
            # Count rendering usage
            foreach ($rendering in $pageRenderings) {
                $key = "$($rendering.Name)|$($rendering.Path)"
                
                if (-not $script:renderingUsage.ContainsKey($key)) {
                    $script:renderingUsage[$key] = @{
                        Name = $rendering.Name
                        DisplayName = $rendering.DisplayName
                        Path = $rendering.Path
                        Template = $rendering.Template
                        Count = 0
                        Pages = @()
                        Placeholders = @()
                    }
                }
                
                $script:renderingUsage[$key].Count++
                $script:renderingUsage[$key].Pages += $item.Paths.FullPath
                if ($rendering.Placeholder -and $script:renderingUsage[$key].Placeholders -notcontains $rendering.Placeholder) {
                    $script:renderingUsage[$key].Placeholders += $rendering.Placeholder
                }
            }
        }
        
        # Recursively process child items if this item has children 
        # (we already skipped data folders above with 'continue')
        if ($item.HasChildren) {
            Process-ItemsRecursively -startPath $item.Paths.FullPath
        }
    }
}

# Start the recursive processing
$totalItems = 0
Process-ItemsRecursively -startPath $SitePath

Write-Host "`nScan completed!" -ForegroundColor Green
Write-Host "Total items examined: $totalPages" -ForegroundColor Yellow
Write-Host "Pages found and processed: $processedPages" -ForegroundColor Yellow

# Generate summary report
Write-Host "`n=== RENDERING USAGE SUMMARY ===" -ForegroundColor Green
Write-Host "Total Pages Analyzed: $processedPages" -ForegroundColor Yellow
Write-Host "Unique Renderings Found: $($renderingUsage.Count)" -ForegroundColor Yellow

# Sort by usage count (descending)
$sortedRenderings = $renderingUsage.GetEnumerator() | Sort-Object { $_.Value.Count } -Descending

Write-Host "`nTop 10 Most Used Renderings:" -ForegroundColor Cyan
$sortedRenderings | Select-Object -First 10 | ForEach-Object {
    Write-Host "  $($_.Value.Name): $($_.Value.Count) occurrences" -ForegroundColor White
}

Write-Host "`nRenderings Used Only Once:" -ForegroundColor Cyan
$singleUseRenderings = $sortedRenderings | Where-Object { $_.Value.Count -eq 1 }
Write-Host "  Count: $($singleUseRenderings.Count)" -ForegroundColor White

# Display results in Sitecore PowerShell report table
Write-Host "`nPreparing report table..." -ForegroundColor Yellow

# Prepare rendering usage data for display
$reportData = @()
foreach ($rendering in $sortedRenderings) {
    $reportData += [PSCustomObject]@{
        "Rendering Name" = $rendering.Value.Name
        "Display Name" = $rendering.Value.DisplayName
        "Usage Count" = $rendering.Value.Count
        "Template" = $rendering.Value.Template
        "Placeholders" = ($rendering.Value.Placeholders | Sort-Object -Unique) -join "; "
        "Rendering Path" = $rendering.Value.Path
        "Sample Pages" = ($rendering.Value.Pages | Select-Object -First 3) -join "; "
        "Total Pages" = $rendering.Value.Pages.Count
    }
}

# Display report data in console as table
Write-Host "`n=== RENDERING USAGE REPORT ===" -ForegroundColor Green
Write-Host "Sorted by usage count (most used first):`n" -ForegroundColor Yellow

$reportData | Format-Table -Property @{
    Label="Rendering Name"; Expression={$_."Rendering Name"}; Width=25
}, @{
    Label="Usage"; Expression={$_."Usage Count"}; Width=8
}, @{
    Label="Template"; Expression={$_.Template}; Width=20
}, @{
    Label="Total Pages"; Expression={$_."Total Pages"}; Width=12
}, @{
    Label="Placeholders"; Expression={$_.Placeholders}; Width=40
} -AutoSize

# Show interactive report table
$reportData | Show-ListView -Title "Page Rendering Usage Audit" `
    -InfoTitle "Rendering Usage Analysis" `
    -InfoDescription "Total Pages Analyzed: $processedPages | Unique Renderings: $($renderingUsage.Count)" `
    -Property @{Label="Rendering Name"; Expression={$_."Rendering Name"}}, 
              @{Label="Display Name"; Expression={$_."Display Name"}}, 
              @{Label="Usage Count"; Expression={$_."Usage Count"}; Width=100}, 
              @{Label="Template"; Expression={$_.Template}; Width=150}, 
              @{Label="Placeholders"; Expression={$_.Placeholders}; Width=200}, 
              @{Label="Total Pages"; Expression={$_."Total Pages"}; Width=100} `
    -ViewName "RenderingUsage" `
    -ActionData $reportData

# Show page details table if requested
if ($IncludePageInfo) {
    Write-Host "`nPreparing page details report..." -ForegroundColor Yellow
    
    $pageDetailsReport = $pageDetails | ForEach-Object {
        [PSCustomObject]@{
            "Page Name" = $_.PageName
            "Page Path" = $_.PagePath
            "Template" = $_.Template
            "Rendering Count" = $_.RenderingCount
            "Renderings Used" = $_.Renderings
        }
    }
    
    $pageDetailsReport | Show-ListView -Title "Page Details Report" `
        -InfoTitle "Individual Page Analysis" `
        -InfoDescription "Detailed view of each page and its renderings" `
        -Property @{Label="Page Name"; Expression={$_."Page Name"}; Width=200}, 
                  @{Label="Template"; Expression={$_.Template}; Width=150}, 
                  @{Label="Rendering Count"; Expression={$_."Rendering Count"}; Width=120}, 
                  @{Label="Renderings Used"; Expression={$_."Renderings Used"}; Width=400} `
        -ViewName "PageDetails" `
        -ActionData $pageDetailsReport
}

# Export to CSV if requested
if ($ExportToCSV) {
    Write-Host "`nExporting results to CSV..." -ForegroundColor Yellow
    
    # Export rendering usage
    $reportData | Export-Csv -Path $OutputPath -NoTypeInformation -Encoding UTF8
    Write-Host "Rendering usage exported to: $OutputPath" -ForegroundColor Green
    
    # Export page details if requested
    if ($IncludePageInfo) {
        $pageDetailsPath = $OutputPath.Replace(".csv", "-page-details.csv")
        $pageDetails | ForEach-Object { [PSCustomObject]$_ } | Export-Csv -Path $pageDetailsPath -NoTypeInformation -Encoding UTF8
        Write-Host "Page details exported to: $pageDetailsPath" -ForegroundColor Green
    }
}

# Display detailed statistics
Write-Host "`n=== DETAILED STATISTICS ===" -ForegroundColor Green

$usageStats = @{
    "Unused" = ($sortedRenderings | Where-Object { $_.Value.Count -eq 0 }).Count
    "Used 1 time" = ($sortedRenderings | Where-Object { $_.Value.Count -eq 1 }).Count
    "Used 2-5 times" = ($sortedRenderings | Where-Object { $_.Value.Count -ge 2 -and $_.Value.Count -le 5 }).Count
    "Used 6-10 times" = ($sortedRenderings | Where-Object { $_.Value.Count -ge 6 -and $_.Value.Count -le 10 }).Count
    "Used 11-25 times" = ($sortedRenderings | Where-Object { $_.Value.Count -ge 11 -and $_.Value.Count -le 25 }).Count
    "Used 26+ times" = ($sortedRenderings | Where-Object { $_.Value.Count -ge 26 }).Count
}

foreach ($stat in $usageStats.GetEnumerator()) {
    Write-Host "  $($stat.Key): $($stat.Value) renderings" -ForegroundColor White
}

Write-Host "`nAudit completed successfully!" -ForegroundColor Green

# Return the data for further analysis if needed
return @{
    RenderingUsage = $renderingUsage
    PageDetails = $pageDetails
    TotalPages = $processedPages
    Summary = $usageStats
}
