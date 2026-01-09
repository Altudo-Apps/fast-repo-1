param(
    [Parameter(Mandatory = $true)]
    [string]$Environment
)

# Paths
$buildJsonPath = Join-Path $PSScriptRoot './xmcloud.build.json'
$userJsonPath = Join-Path $PSScriptRoot './.sitecore/user.json'

# Parse xmcloud.build.json
$buildJson = Get-Content $buildJsonPath -Raw | ConvertFrom-Json
$modules = $buildJson.postActions.actions.scsModules.modules
if (-not $modules -or $modules.Count -eq 0) {
    Write-Error 'No modules found in xmcloud.build.json at postActions.actions.scsModules.modules.'
    exit 1
}

# Parse user.json
$userJson = Get-Content $userJsonPath -Raw | ConvertFrom-Json
$endpoints = $userJson.endpoints.PSObject.Properties.Name
if ($endpoints -notcontains $Environment) {
    Write-Error "Environment '$Environment' not found in user.json endpoints."
    exit 1
}

# Build the modules argument
$modulesArg = $modules -join ' '

# Run the dotnet command
$cmd = "dotnet sitecore ser push -n $Environment -i $modulesArg"
Write-Host "Running: $cmd"
Invoke-Expression $cmd

