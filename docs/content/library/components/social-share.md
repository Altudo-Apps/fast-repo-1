# Social Share

**SocialShare -** The SocialShare component is a reusable UI element for the FastLane website, designed to facilitate content sharing via social media platforms. Built using Radix UI and Tailwind CSS, it displays a row of icons (e.g., email, Facebook, LinkedIn, Pinterest, X) that trigger share actions. The component is lightweight, responsive, and integrates seamlessly with the page layout.

**Description:** A horizontal layout containing social media icons for sharing content.

**Functionality:** Each icon (e.g., email, Facebook, LinkedIn, Pinterest, X) enables users to share the current page or selected content. Clicking an icon either opens a share dialog or redirects to the platform’s share intent, depending on implementation.

**Supported Items & Mapping:**

- `Facebook` → shares the current page URL.
- `LinkedIn` → shares the current page URL with title.
- `X` → uses X share under the hood to share the current page URL with title.
- `Pinterest` → requires a `Media` image URL for the pin in addition to the page URL and title.
- `Email` → opens mail client with current page URL and title.

## Field Details

**Template Name:** SocialShare
**Item Path:** `/sitecore/templates/Feature/FastLane/Renderings/SocialShare/SocialShare`

| Field Name | Sitecore Field Type | Description |
|------------|-------------------|-------------|
| SocialIcon | Image | An image or icon representing the social media platform (e.g., Facebook, Twitter) |
| Media | General Link | A URL or internal link for the shareable content for Pinterest Social Share or others |
| Title | Single Line Text | The title or label for the social share section. |

**Screenshot:**

![Social Share Component](/images/components/component-social-share.png)
