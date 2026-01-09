# New Project Setup

**For teams starting a new customer project with FastLane components.**

This guide covers Sprint 0/Day 1 activities to get from zero to a production-ready FastLane-powered site for your customer project.

## Sprint 0 Overview

By the end of Sprint 0, you'll have:
- ✅ FastLane deployed to XM Cloud
- ✅ **FastLane Demo site** (showcasing components and examples)
- ✅ **FastLane Global site** (shared components and content)
- ✅ **New customer site** created from FastLane template
- ✅ Production-ready environment configured

## Day 1: Initial Deployment

### Step 1: Deploy FastLane via XM Cloud Deploy

> 📋 **Coming Soon**: Detailed XM Cloud Deploy instructions will be available soon.

**Key activities:**
1. Access XM Cloud Deploy portal
2. Deploy the FastLane project template
3. Configure environment settings
4. Verify successful deployment

**Expected outcome:** Production-ready XM Cloud environment with FastLane installed.

### Step 2: Verify Default Sites

After deployment, you should have these sites available:

**FastLane Demo Site**
- URL: `[your-instance]/demo`
- Purpose: Showcases all available FastLane components
- Use: Reference for component capabilities and examples

**FastLane Global Site**
- URL: `[your-instance]/global`
- Purpose: Shared content and components across projects
- Use: Centralized content management for multi-site scenarios

### Step 3: Create New Customer Site

**In XM Cloud Sites app:**

1. **Access XM Cloud Sites**
   - Navigate to XM Cloud portal
   - Open Sites application

2. **Create New Site**
   - Click "Create Site" or "New Site"
   - Select **"FastLane"** site template
   - Configure site settings:
     - Site name: `[customer-name]`
     - Domain/URL settings
     - Language/locale configuration

3. **Verify Site Creation**
   - Confirm site appears in Sites list
   - Access site preview/editing interface
   - Verify FastLane components are available

## Day 2-3: Project Configuration

### Configure Customer-Specific Settings

**Site Configuration:**
- [ ] Update site metadata (title, description, favicon)
- [ ] Configure customer branding/theming
- [ ] Set up content structure and navigation
- [ ] Configure user permissions and workflows

**Technical Configuration:**
- [ ] Set up environment variables for customer domain
- [ ] Configure CDN and performance settings
- [ ] Set up monitoring and analytics
- [ ] Configure backup and deployment pipelines

### Content Migration (if applicable)

**If migrating from existing site:**
- [ ] Content audit and mapping
- [ ] Media library migration
- [ ] URL structure planning
- [ ] SEO considerations (redirects, meta data)

## Team Handoff

### For Development Team

Once project setup is complete, development team can:
1. Follow the local development setup from the /headapps/nextjs-starter/README.md
2. Clone the FastLane repository
3. Configure local environment to connect to the customer site
4. Begin component customization and content development

### For Content Authors

Content team gets access to:
- XM Cloud content editing interface
- Pre-built FastLane components ready for content creation
- Demo site as reference for component capabilities
- Configured content workflows and approval processes

## Validation Checklist

Before proceeding to development:

**Infrastructure:**
- [ ] XM Cloud environment deployed successfully
- [ ] All three sites accessible (Demo, Global, Customer)
- [ ] SSL certificates configured
- [ ] Domain/DNS configured correctly

**Functionality:**
- [ ] FastLane components render correctly
- [ ] Content editing works in Experience Editor
- [ ] Site navigation functions properly
- [ ] Performance baseline established

**Team Access:**
- [ ] Development team has repository access
- [ ] Content team has XM Cloud access
- [ ] Project managers have admin access
- [ ] Stakeholders have preview access

## Common Issues & Solutions

### Deployment Issues
- **Problem**: XM Cloud Deploy fails
- **Solution**: Check deployment logs, verify prerequisites, contact Sitecore support

### Site Template Issues
- **Problem**: "FastLane" template not available
- **Solution**: Verify FastLane deployment completed, check template permissions

### Access Issues
- **Problem**: Team members can't access sites
- **Solution**: Configure user permissions in XM Cloud portal

## Next Steps

After successful project setup:

1. **Development Phase**: Team follows [Team Workflow](./team-workflow) for ongoing development
2. **Local Development**: Follow the README.md file in /headapps/nextjs-starter/README.md
3. **Content Creation**: Content team begins using FastLane components
4. **Customization**: Begin customer-specific component modifications

## Support & Resources

- **XM Cloud Documentation**: [Official Sitecore XM Cloud docs](https://doc.sitecore.com/xmc/)
- **FastLane Components**: [Component Library](../library/components/)
- **Technical Deep Dive**: [FastLane Development Guide](../for-developers/component-development/fastlane/)
- **Project Issues**: [GitHub Repository](https://github.com/altudo-dev/xmc-fast-lane)

---

> 💡 **Pro Tip**: Keep the Demo site available throughout the project as a reference for component capabilities and implementation examples. 