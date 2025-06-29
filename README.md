# 🌿 EcoTherapy Hackathon Project: Eco4Life

Hello! We’re **Team TECHnical difficulties**, consisting of **Ryan Lin, Raymond Chen, Danial Armiyaev, and Benson Zhang**, and we are addressing the problem for ***Ecotherapy***.

---
## Our Inspiration

We found inspiration for this project through the experiences we’ve faced in our day-to-day lives.  


In high school, many students find themselves needing to balance coursework, extracurricular activities, and familial responsibilities. As a result, people can feel **burnt out** from long hours of work, leading to **isolation** from the outside world.


With the era of technology on the rise, it's easy to forget our roots: **nature**. Nature is peaceful, tranquil, and embracing it can be a great form of escaping all the mess and clutter life throws at people. However, a **lack of motivation** and **limited awareness** of nearby nature spots are preventing people from connecting with the natural world.


These challenges led to the inspiration for our project: **Eco4Life**
> A **therapeutic AI companion** that motivates people to step outside, paired with an app and website that display routes to nearby nature-filled areas.


Eco4Life helps people combat loneliness, burnout, and disconnection, slowly guiding them back to the healing power of nature.

---
## What It Does


Eco4Life is a web-based platform designed to help individuals reconnect with nature and their communities through the support of AI and modern mapping technologies.


Our solution offers:

- **Therapeutic AI Assistant: Sarah**:  
  A therapeutic virtual companion that engages users in meaningful conversations. Sarah provides emotional support when they feel down or lonely and encourages users to take the step to embrace nature for healing.


- **Nature Route Finder** (Google Maps API Integration):  
  When the user feels ready, our project can guide them to local nature-rich locations such as **parks and community gardens**. Users can access a list of nearby outdoor spaces, which makes nature more accessible, even in urban areas.


- **Mental Wellness Focus**:  
  The platform is designed to break the cycle of isolation and depression by offering users a **safe and supportive environment** and a tangible path back to the natural world.


- **Community Connection**:  
  Beyond just therapy, the site connects users back with their community, giving them a sense of worth and belonging.


By merging **mental wellness support** with **nature accessibility**, our platform not only addresses emotional needs but also promotes healing through nature.

---


## How We Built It

Our project, consisting of the App and website, is entirely built with **Next.js**, **React**,  **TypeScript**, **Javascript**, and **CSS**. We utilized [Google Maps API](https://developers.google.com/maps/documentation/geocoding/get-api-key) for our mapping system and [Llama AI](https://llama.developer.meta.com/docs/features/compatibility) for our therapeutic AI Assistant.


We find the user's location by using the Geolocation API in the browser if they allow us access to their location. If access is not granted, we use the IPInfo API, which estimates their latitude and longitude based on their IP address. Then, we use Google's Map API with our API key to calculate a walking route from the user's location to a nature spot, returning the distance, duration, and route path.

---

## Challenges We Ran Into

One of the major challenges we faced during development was the incompatibility between certain React components, particularly when attempting to render server components alongside client components. Integrating server-side rendering with dynamic functionality proved difficult, especially when extracting data from APIs and trying to import specific libraries that were not optimized for server-side execution.


These conflicts often resulted in runtime errors or required significant refactoring to maintain consistency across the application. Balancing the performance benefits of server components with the interactivity of client-side features was a process that demanded a deeper understanding of Next.js rendering methods.

---

## Accomplishments That We're Proud Of and What We Learned

One of our proudest accomplishments was gaining hands-on experience with React and learning how to effectively track and use geolocation data in a real-world project. We successfully created both a functional website and an accompanying app that not only look polished but also integrates meaningful features, like our therapeutic AI assistant. This assistant provides users with emotional support and practical suggestions, guiding them toward nature-based destinations.

Bringing together front-end design, API integration, and AI interaction in a seamless user experience was both challenging and rewarding. It gave us valuable insight into building responsive, user-friendly web applications that serve a real purpose and can positively impact people’s lives.

---

## What's Next


Looking ahead, we plan to expand our platform by developing an app to gamify going outside. One feature we plan on implementing is an **Achievements** page, which will gamify the experience by rewarding users with badges and milestones for active engagement, such as visiting nature spots and chatting with our AI Bot, Sarah. We also aim to enhance the AI assistant’s capabilities with more personalized support and integrate user feedback to refine the platform.


Our goal is to continue making nature and mental wellness more accessible, engaging, and impactful for everyone.
