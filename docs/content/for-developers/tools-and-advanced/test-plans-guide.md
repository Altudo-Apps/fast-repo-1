# Creating Test Plans in Azure DevOps

Complete guide for creating and managing test plans in Azure DevOps for FastLane projects.

## Prerequisites

Before creating a test plan, ensure you have:

- ✅ **Access to Azure DevOps project**: "Fastlane AI Accelerator"
- ✅ **Test Plans License**: 
  - Visual Studio Enterprise subscription, OR
  - Visual Studio Test Professional subscription, OR
  - Basic + Test Plans access level
- ✅ **Required Permissions**: Ability to create and manage test plans in the project

## Method 1: Create Test Plan via Azure DevOps UI

### Step 1: Navigate to Test Plans

1. **Open Azure DevOps**: Navigate to `https://dev.azure.com/Altudodemo`
2. **Select Project**: Choose "Fastlane AI Accelerator" project
3. **Open Test Plans**: Click **Test Plans** from the left navigation menu

### Step 2: Create New Test Plan

1. **Click "New Test Plan"** button (top right or + New dropdown)
2. **Fill in Details**:
   - **Name**: Descriptive name for your test plan (e.g., "FastLane Component Regression Tests")
   - **Area Path**: Select the area path (e.g., "Fastlane AI Accelerator")
   - **Iteration**: Select the iteration/sprint (e.g., "Fastlane AI Accelerator\Sprint 1")
   - **Description**: (Optional) Add description of test plan purpose
3. **Click "Create"** to finalize

### Step 3: Organize with Test Suites

Within your test plan, add test suites to organize test cases:

**Click "+ New"** dropdown and choose suite type:

#### Static Suite
- Manual grouping of test cases
- Use for: Organized test case collections
- **Steps**:
  1. Select "Static Suite"
  2. Name your suite (e.g., "Component Tests", "Integration Tests")
  3. Add test cases manually

#### Requirement-based Suite
- Links test cases to user stories/backlog items
- Use for: Traceability to requirements
- **Steps**:
  1. Select "Requirement-based Suite"
  2. Link to work items (User Stories, Tasks, etc.)
  3. Test cases associated with those work items appear automatically

#### Query-based Suite
- Dynamically includes test cases based on query
- Use for: Automatic test case collection based on criteria
- **Steps**:
  1. Select "Query-based Suite"
  2. Define query criteria (tags, states, assigned to, etc.)
  3. Test cases matching query are automatically included

### Step 4: Add Test Cases

Within each test suite:

1. **Click "+ New Test Case"** or **"+ Add Existing Test Case"**
2. **For New Test Cases**:
   - Enter test case title
   - Define test steps:
     - Action: What to do
     - Expected Result: Expected outcome
   - Assign to tester (optional)
   - Add attachments, links, etc.
3. **For Existing Test Cases**:
   - Search or browse test cases
   - Select test cases to add
   - Click "Add"

### Step 5: Configure Test Settings

1. **Click "Configurations"** tab in test plan
2. **Add Test Configurations**:
   - Browser types (Chrome, Firefox, Edge)
   - Operating systems (Windows, macOS, Linux)
   - Device types (Desktop, Mobile, Tablet)
   - Environment (Dev, QA, Staging, Production)

### Step 6: Execute Tests

1. **Navigate to "Execute" tab**
2. **Select test cases** to run
3. **Choose execution method**:
   - **Run for web application**: For browser-based testing
   - **Run for desktop application**: For desktop app testing
4. **Execute and log results**:
   - Mark tests as Pass/Fail/Blocked/Not Applicable
   - Add comments and attachments
   - Create bugs directly from failed tests

## Method 2: Using Azure DevOps REST API

While there's no direct MCP tool to create test plans, you can use the Azure DevOps REST API programmatically.

### API Endpoint

```http
POST https://dev.azure.com/{organization}/{project}/_apis/testplan/plans?api-version=7.0
```

### Required Headers

```http
Authorization: Basic {base64(personal_access_token)}
Content-Type: application/json
```

### Request Body Example

```json
{
  "name": "FastLane Component Test Plan",
  "description": "Comprehensive test plan for FastLane components",
  "area": {
    "name": "Fastlane AI Accelerator"
  },
  "iteration": {
    "name": "Fastlane AI Accelerator\\Sprint 1"
  },
  "startDate": "2025-11-01T00:00:00Z",
  "endDate": "2025-11-30T23:59:59Z"
}
```

### cURL Example

```bash
curl -X POST \
  'https://dev.azure.com/Altudodemo/Fastlane%20AI%20Accelerator/_apis/testplan/plans?api-version=7.0' \
  -H 'Authorization: Basic {YOUR_PAT}' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "FastLane Component Test Plan",
    "description": "Test plan for FastLane component validation",
    "area": {
      "name": "Fastlane AI Accelerator"
    },
    "iteration": {
      "name": "Fastlane AI Accelerator\\Sprint 1"
    }
  }'
```

### Response Example

```json
{
  "id": 123,
  "name": "FastLane Component Test Plan",
  "url": "https://dev.azure.com/Altudodemo/_apis/testplan/Plans/123",
  "project": {
    "id": "a7ccd3d9-7d9d-4f85-ba69-84fa434183ff",
    "name": "Fastlane AI Accelerator"
  },
  "area": {
    "name": "Fastlane AI Accelerator"
  },
  "iteration": {
    "name": "Fastlane AI Accelerator\\Sprint 1"
  }
}
```

## Method 3: Using PowerShell Script

You can create a PowerShell script to automate test plan creation:

```powershell
# Azure DevOps Test Plan Creation Script
$organization = "Altudodemo"
$project = "Fastlane AI Accelerator"
$pat = "YOUR_PERSONAL_ACCESS_TOKEN"
$base64AuthInfo = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(":$pat"))

$headers = @{
    Authorization = "Basic $base64AuthInfo"
    'Content-Type' = 'application/json'
}

$body = @{
    name = "FastLane Component Test Plan"
    description = "Comprehensive test plan for FastLane components"
    area = @{
        name = "Fastlane AI Accelerator"
    }
    iteration = @{
        name = "Fastlane AI Accelerator\Sprint 1"
    }
} | ConvertTo-Json -Depth 10

$uri = "https://dev.azure.com/$organization/$([uri]::EscapeDataString($project))/_apis/testplan/plans?api-version=7.0"

$response = Invoke-RestMethod -Uri $uri -Method Post -Headers $headers -Body $body

Write-Host "Test Plan Created:"
Write-Host "ID: $($response.id)"
Write-Host "Name: $($response.name)"
Write-Host "URL: $($response.url)"
```

## Available MCP Tools for Test Plans

Once a test plan is created (via UI or API), you can use these MCP tools:

### Running Tests
- **`mcp_azure-devops_runAutomatedTests`**: Execute automated test suites
  - Requires: `testPlanId` (from created test plan)
  - Optional: `testSuiteId`, `testEnvironment`, `parallelExecution`

### Test Optimization
- **`mcp_azure-devops_runTestOptimization`**: Optimize test execution
  - Requires: `testPlanId`, `optimizationGoal` (time/coverage/reliability)

### Monitoring & Analysis
- **`mcp_azure-devops_getTestAutomationStatus`**: Check test run status
- **`mcp_azure-devops_getTestHealthDashboard`**: View overall test health
- **`mcp_azure-devops_getTestFlakiness`**: Analyze test flakiness
- **`mcp_azure-devops_getTestGapAnalysis`**: Identify coverage gaps
- **`mcp_azure-devops_runTestImpactAnalysis`**: Determine which tests to run

## Best Practices

### Test Plan Organization

1. **Naming Convention**: Use descriptive names
   - Format: `{Project/Feature} - {Type} - {Sprint/Version}`
   - Example: `FastLane Components - Regression - Sprint 1`

2. **Area Path Strategy**: Align with project structure
   - Match with work item area paths
   - Enables better traceability

3. **Iteration Planning**: Link to sprints/releases
   - Use iteration paths for timeline tracking
   - Align with development cycles

### Test Suite Organization

1. **Static Suites**: Use for feature-based grouping
   - Component Tests
   - Integration Tests
   - E2E Tests

2. **Requirement-based Suites**: Use for traceability
   - Link to User Stories
   - Track requirement coverage

3. **Query-based Suites**: Use for dynamic grouping
   - By priority
   - By component
   - By test type

### Test Case Management

1. **Clear Test Steps**: 
   - Action: What to do
   - Expected Result: What should happen
   - Use parameters for data-driven tests

2. **Proper Tagging**: 
   - Component tags (e.g., `component:dropdown`)
   - Test type tags (e.g., `test:unit`, `test:integration`)
   - Priority tags (e.g., `priority:p1`)

3. **Maintenance**: 
   - Review and update regularly
   - Remove obsolete test cases
   - Keep descriptions current

## Troubleshooting

### Issue: "New Test Plan" button is missing

**Solutions**:
1. Check your license (requires VS Enterprise, Test Professional, or Basic + Test Plans)
2. Verify project permissions
3. Contact Azure DevOps administrator

### Issue: Cannot create test plan via API

**Solutions**:
1. Verify Personal Access Token (PAT) has correct permissions:
   - Scope: `Test Plans (Read & Write)`
2. Check API version (use `api-version=7.0` or later)
3. Verify area path and iteration path exist

### Issue: Test cases not appearing in suite

**Solutions**:
1. For query-based suites: Verify query criteria
2. For requirement-based suites: Check work item links
3. Verify test cases are in correct state

## Related Work Items

- **Work Item #17**: "Run Test Plan Execution"
  - Status: To Do
  - Purpose: Execute test plans once created

## Next Steps

1. ✅ Create test plan using UI or API
2. ✅ Organize test suites (static/requirement-based/query-based)
3. ✅ Add test cases to suites
4. ✅ Configure test environments
5. ✅ Use MCP tools to execute and monitor tests

## References

- [Azure DevOps Test Plans Documentation](https://learn.microsoft.com/en-us/azure/devops/test/create-a-test-plan)
- [Azure DevOps REST API - Test Plans](https://learn.microsoft.com/en-us/rest/api/azure/devops/testplan/plans)
- [Test Plans Pricing](https://azure.microsoft.com/en-us/pricing/details/devops/azure-devops-services/)

---

**Note**: Test plan creation must be done via Azure DevOps UI or REST API, as there's currently no direct MCP tool for creating test plans. Once created, you can use MCP tools to execute and manage test plans.

