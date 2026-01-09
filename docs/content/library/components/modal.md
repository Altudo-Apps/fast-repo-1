# Modal

### 📖 Overview
The **Modal** component is used to display information or interactive content in a popup overlay on the screen. It is triggered by a user action (typically a button click) and allows for flexible content placement via a drag-and-drop placeholder.

## 🧩 Placeholder
A **dynamic area** inside the modal where any component can be placed. The placeholder becomes visible **after the button is clicked**, allowing for flexible, on-demand content rendering within the modal.

* * *

## Field Details

**Template Name:** Modal
**Item Path:** `/sitecore/templates/Feature/FastLane/Renderings/Modal/Modal`

| Field Name | Sitecore Field Type | Description |
|------------|-------------------|-------------|
| Button Text | Single-Line Text | Text displayed on the trigger button that opens the modal |
| Title | Single-Line Text | Heading shown at the top of the modal popup once it opens |
| CTAMainLink | General Link | The primary URL or internal link for the modal's main action |

* * *

## 🎨 Styling Options:
1.  **Component Top Spacing**  
    Controls the top spacing above the component. The following options are available:
    

*   `Top Large Space`
    
*   `Top Medium Space`
    
*   `Top Low Space`
    
*   `Top No Space`
    

2.  **Component Bottom Spacing**  
    Controls the bottom spacing below the component. The following options are available:
    

*   `Bottom Large Space`
    
*   `Bottom Medium Space`
    
*   `Bottom Low Space`
    
*   `Bottom No Space`
    

### 🧠 Component Behavior
*   Clicking the configured button triggers the modal to appear.
    
*   The modal includes:
    
    *   A **header** section displaying the title.
        
    *   A **content area** below the title where other components can be inserted.
        
*   The modal overlays the main page content and typically includes a backdrop to indicate focus.
    
*   Closing behavior (such as a close icon or clicking outside) can be handled based on standard modal practices.
    

* * *

## screenshots:
BUTTON

![screenshot](/images/components/component-modal-1.png "screenshot")

On click of button title is showing with placeholder

![screenshot](/images/components/component-modal-2.png "screenshot")
