# MegaNavLinkList

**MegaNavLinkList:** MegaNav LinkList is a custom linklist component designed to display the navigation title and description for a set of links.

**Description**: A list of links under each MegaNavItem (e.g., subtopics or pages like "About Us", "Demography").

**Functionality**: Provides detailed navigation options, ensuring users can drill down to specific content. Supports multi-level nesting for complex site structures.

a. If the Link is **Internal**, component GraphQL query has been added to display the Page specific “Navigation Title” and “Navigation Description” fields from the Link.

**Example:**

In the below screenshot, “About Us” link is an internal link, hence the navigation title and navigation description are retrieved from the About Us page.

![screenshot](/images/components/component-meganavlinklist-1.png "screenshot")

![screenshot](/images/components/component-meganavlinklist-2.png "screenshot")

b. If the Link is **External**, it uses the Text and Title fields of the Link and displays the Navigation Title and Navigation Description.

Here in the below screenshot, Demography is an external link, hence the navigation title and navigation description fields are retrieved from “Alternate Text” and “Link description” fields.

![screenshot](/images/components/component-meganavlinklist-3.png "screenshot")

**Template**: It uses the OOTB Sitecore LinkList component.

**Fields:** Same as OOTB Sitecore LinkList component.

**Screenshot:**

![screenshot](/images/components/component-meganavlinklist-4.png "screenshot")
