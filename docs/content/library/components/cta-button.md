# CTA Button

## 🔘 Description
The **Button Component** is a versatile UI element that supports different styles and behaviors based on content and design needs. It uses the **ShadCN Button** component under the hood for consistency and accessibility.

## Field Details

**Template Name:** CTAButton  
**Item Path:** `/sitecore/templates/Feature/FastLane/Renderings/CTAButton/CTAButton`

| Field Name | Sitecore Field Type | Description |
|------------|-------------------|-------------|
| ButtonImage | Image | Optional icon/image to display alongside the button |
| ButtonLink | General Link | The target URL or internal link for the button |

## Advanced Styling Options

### 1. Variant
- We currently support only the `default` variant of button.
    

#### 2. Button Style
This controls the visual appearance of the button:

| Style | Description |
|-------|-------------|
| Link | Renders the button visually as a hyperlink (no background or border). |
| Outline | Displays a transparent background with a themed border. Ideal for secondary actions. |
| Primary | Uses the **primary theme color** for the background. The text color adjusts automatically based on background for readability. |
| Secondary | Uses the **secondary theme color** for the background. The text color adjusts automatically for contrast and accessibility. |

* * *

## Styling Options

### 1. Component Top Spacing
Controls the top spacing above the component. The following options are available:

- Top Large Space
- Top Medium Space
- Top Low Space
- Top No Space

### 2. Component Bottom Spacing
Controls the bottom spacing below the component. The following options are available:

- Bottom Large Space
- Bottom Medium Space
- Bottom Low Space
- Bottom No Space

### 3. Content Alignment
Controls the alignment of the button and on the basis of alignment the style will be change(position of image and text). The following are available options:

- Left
- center
- Right
    

Screenshot for left align
    ![screenshot](/images/components/component-cta-button-left-align.png "screenshot")

Screenshot for center align
    ![screenshot](/images/components/component-cta-button-center-align.png "screenshot")

Screenshot for right align
    ![screenshot](/images/components/component-cta-button-right-align.png "screenshot")

* * *

### Screenshots:
1.  Default Button style:
    ![screenshot](/images/components/component-cta-button-default.png "screenshot")
    
2.  Link Style:  
    ![screenshot](/images/components/component-cta-button-link.png "screenshot")
    
3.  Outline Style:  
    ![screenshot](/images/components/component-cta-button-outline.png "screenshot")
    
4.  Primary Style:  
    ![screenshot](/images/components/component-cta-button-primary.png "screenshot")
    
5.  Secondary Style:
    ![screenshot](/images/components/component-cta-button-secondary.png "screenshot")
