# My Portfolio

JAM stack app.

## About This Project

This project was made with Next js and Strapi for manage the content. Because I'm the only editor of this page I use Strapi and I do the Next js build locally in my computer. I created a script to save the images in the Next js app from Strapi at build time, so I don't need to serve the images from a external server.

The page have an 3d interactive background. The architectonic part of the 3d model was made with Blender and is rendered in the page with Three js . The pure shapes was made directly with Three js. The scrolling camera animation was done with Gsap ScrollTrigger and all the physic simulation works with Cannon-es thats runs in a worker thread (for better performance).

[Here you can visit the page.](https://nicolasdeheza.com)

## Built With

- Next js
- Strapi
- Three js
- Cannon-es
- Gsap
