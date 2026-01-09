# Sitecore Page Template Audit Script
# Analyzes page template usage across all pages in the site
# Compatible with Sitecore XP 10.1.3 and SXA

param(
    [string]$SitePath = "/sitecore/content/BSW/Sites/BSWHealth",
    [string]$OutputPath = "C:\temp\template-audit.csv",
    [switch]$IncludePageInfo,
    [switch]$ExportToCSV,
    [switch]$Verbose,
    [string]$SiteName = ""
)

Write-Host "Starting Page Template Audit..." -ForegroundColor Green
Write-Host "Site Path: $SitePath" -ForegroundColor Yellow

# Initialize collections
$templateUsage = @{}
$pageDetails = @()
$processedPages = 0
$totalPages = 0

# Function to get template information from a page
function Get-PageTemplate {
    param($item)
    
    # Get template information
    $templateInfo = @{
        ID = $item.TemplateID
        Name = $item.TemplateName
        DisplayName = $item.Template.DisplayName
        Path = $item.Template.Paths.FullPath
        BaseTemplates = @()
    }
    
    # Get base templates if available
    try {
        $baseTemplates = $item.Template.BaseTemplates
        if ($baseTemplates) {
            foreach ($baseTemplate in $baseTemplates) {
                if ($baseTemplate.Name -ne "Standard template") {  # Exclude the root Standard template
                    $templateInfo.BaseTemplates += $baseTemplate.Name
                }
            }
        }
    }
    catch {
        if ($Verbose) { Write-Warning "Could not retrieve base templates for $($item.Paths.FullPath)" }
    }
    
    return $templateInfo
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
            
            # Get template information for this page
            $pageTemplate = Get-PageTemplate -item $item
            Write-Host "    -> Template: $($pageTemplate.Name)" -ForegroundColor Green
            
            # Store page details if requested
            if ($IncludePageInfo) {
                $script:pageDetails += @{
                    PagePath = $item.Paths.FullPath
                    PageName = $item.Name
                    PageDisplayName = $item.DisplayName
                    Template = $pageTemplate.Name
                    TemplateID = $pageTemplate.ID
                    TemplatePath = $pageTemplate.Path
                    BaseTemplates = ($pageTemplate.BaseTemplates -join "; ")
                }
            }
            
            # Count template usage
            $key = "$($pageTemplate.Name)|$($pageTemplate.Path)"
            
            if (-not $script:templateUsage.ContainsKey($key)) {
                $script:templateUsage[$key] = @{
                    Name = $pageTemplate.Name
                    DisplayName = $pageTemplate.DisplayName
                    ID = $pageTemplate.ID
                    Path = $pageTemplate.Path
                    BaseTemplates = $pageTemplate.BaseTemplates
                    Count = 0
                    Pages = @()
                }
            }
            
            $script:templateUsage[$key].Count++
            $script:templateUsage[$key].Pages += $item.Paths.FullPath
            if ($Verbose) { Write-Host "        -> Added to template count: $($pageTemplate.Name)" -ForegroundColor Cyan }
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
Write-Host "`n=== TEMPLATE USAGE SUMMARY ===" -ForegroundColor Green
Write-Host "Total Pages Analyzed: $processedPages" -ForegroundColor Yellow
Write-Host "Unique Templates Found: $($templateUsage.Count)" -ForegroundColor Yellow

# Sort by usage count (descending)
$sortedTemplates = $templateUsage.GetEnumerator() | Sort-Object { $_.Value.Count } -Descending

Write-Host "`nTop 10 Most Used Templates:" -ForegroundColor Cyan
$sortedTemplates | Select-Object -First 10 | ForEach-Object {
    Write-Host "  $($_.Value.Name): $($_.Value.Count) pages" -ForegroundColor White
}

Write-Host "`nTemplates Used Only Once:" -ForegroundColor Cyan
$singleUseTemplates = $sortedTemplates | Where-Object { $_.Value.Count -eq 1 }
Write-Host "  Count: $($singleUseTemplates.Count)" -ForegroundColor White

# Display results in Sitecore PowerShell report table
Write-Host "`nPreparing report table..." -ForegroundColor Yellow

# Prepare template usage data for display
$reportData = @()
foreach ($template in $sortedTemplates) {
    $reportData += [PSCustomObject]@{
        "Template Name" = $template.Value.Name
        "Display Name" = $template.Value.DisplayName
        "Usage Count" = $template.Value.Count
        "Template ID" = $template.Value.ID
        "Base Templates" = ($template.Value.BaseTemplates | Sort-Object -Unique) -join "; "
        "Template Path" = $template.Value.Path
        "Sample Pages" = ($template.Value.Pages | Select-Object -First 3) -join "; "
        "Total Pages" = $template.Value.Pages.Count
    }
}

# Display report data in console as table
Write-Host "`n=== TEMPLATE USAGE REPORT ===" -ForegroundColor Green
Write-Host "Sorted by usage count (most used first):`n" -ForegroundColor Yellow

$reportData | Format-Table -Property @{
    Label="Template Name"; Expression={$_."Template Name"}; Width=25
}, @{
    Label="Usage"; Expression={$_."Usage Count"}; Width=8
}, @{
    Label="Display Name"; Expression={$_."Display Name"}; Width=20
}, @{
    Label="Total Pages"; Expression={$_."Total Pages"}; Width=12
}, @{
    Label="Base Templates"; Expression={$_."Base Templates"}; Width=30
} -AutoSize

# Show interactive report table
$reportData | Show-ListView -Title "Page Template Usage Audit" `
    -InfoTitle "Template Usage Analysis" `
    -InfoDescription "Total Pages Analyzed: $processedPages | Unique Templates: $($templateUsage.Count)" `
    -Property @{Label="Template Name"; Expression={$_."Template Name"}}, 
              @{Label="Display Name"; Expression={$_."Display Name"}}, 
              @{Label="Usage Count"; Expression={$_."Usage Count"}; Width=100}, 
              @{Label="Template ID"; Expression={$_."Template ID"}; Width=200}, 
              @{Label="Base Templates"; Expression={$_."Base Templates"}; Width=200}, 
              @{Label="Total Pages"; Expression={$_."Total Pages"}; Width=100} `
    -ViewName "TemplateUsage" `
    -ActionData $reportData

# Show page details table if requested
if ($IncludePageInfo) {
    Write-Host "`nPreparing page details report..." -ForegroundColor Yellow
    
    $pageDetailsReport = $pageDetails | ForEach-Object {
        [PSCustomObject]@{
            "Page Name" = $_.PageName
            "Page Path" = $_.PagePath
            "Template" = $_.Template
            "Template ID" = $_.TemplateID
            "Base Templates" = $_.BaseTemplates
        }
    }
    
    $pageDetailsReport | Show-ListView -Title "Page Details Report" `
        -InfoTitle "Individual Page Analysis" `
        -InfoDescription "Detailed view of each page and its template" `
        -Property @{Label="Page Name"; Expression={$_."Page Name"}; Width=200}, 
                  @{Label="Template"; Expression={$_.Template}; Width=150}, 
                  @{Label="Template ID"; Expression={$_."Template ID"}; Width=200}, 
                  @{Label="Base Templates"; Expression={$_."Base Templates"}; Width=300} `
        -ViewName "PageDetails" `
        -ActionData $pageDetailsReport
}

# Export to CSV if requested
if ($ExportToCSV) {
    Write-Host "`nExporting results to CSV..." -ForegroundColor Yellow
    
    # Export template usage
    $reportData | Export-Csv -Path $OutputPath -NoTypeInformation -Encoding UTF8
    Write-Host "Template usage exported to: $OutputPath" -ForegroundColor Green
    
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
    "Unused" = ($sortedTemplates | Where-Object { $_.Value.Count -eq 0 }).Count
    "Used 1 time" = ($sortedTemplates | Where-Object { $_.Value.Count -eq 1 }).Count
    "Used 2-5 times" = ($sortedTemplates | Where-Object { $_.Value.Count -ge 2 -and $_.Value.Count -le 5 }).Count
    "Used 6-10 times" = ($sortedTemplates | Where-Object { $_.Value.Count -ge 6 -and $_.Value.Count -le 10 }).Count
    "Used 11-25 times" = ($sortedTemplates | Where-Object { $_.Value.Count -ge 11 -and $_.Value.Count -le 25 }).Count
    "Used 26+ times" = ($sortedTemplates | Where-Object { $_.Value.Count -ge 26 }).Count
}

foreach ($stat in $usageStats.GetEnumerator()) {
    Write-Host "  $($stat.Key): $($stat.Value) templates" -ForegroundColor White
}

Write-Host "`nAudit completed successfully!" -ForegroundColor Green

# Return the data for further analysis if needed
return @{
    TemplateUsage = $templateUsage
    PageDetails = $pageDetails
    TotalPages = $processedPages
    Summary = $usageStats
}
