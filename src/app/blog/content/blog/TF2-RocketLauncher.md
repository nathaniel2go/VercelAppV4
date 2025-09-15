---
title: "3D Modelling a Replica Weapon - Team Fortress Two's Rocket Launcher"
description: "A comprehensive guide to building your first camera kit without breaking the bank."
date: "2025-05-4"
thumbnail: "/blogs/TF2RL.jpg"
tags: ["Embedded Systems", "CAD", "3D Printing", "3D Design"]
---

The enamour and charm of Valve's Team Fortress Two is not lost on me. 700 hours of playtime deep with even <em>more</em> undocumented interaction with the community through community run servers, youtube, and the like has left an impact on my life from the very beginning. A large portion of what I enjoy in the game is the extremely depth of combat and movement, which begins with the characters and weapons.

# Jane Doe's (aka Soldier) Rocket Launcher from TF2

<figure>
    <img src="/blogs/RocketLauncherMay4.jpg"
         alt="TF2 Rocket Launcher"
         style="max-height: 80vh; width: auto;">
    <figcaption>Current Progress as of May 4th 2025. </figcaption>
</figure>

The project begins in the underbelly of the games assets. I set out to etract the originally weapon model to use as a reference when modelling. I could've easily used this model as the baseline for a 3d print, but I wished to gain experience in the modelling while also controlling the scale and measurements.
To get the model files, I used GCFScape which is used to open gcf and vpk files, the main files for most Steam developed games. Finding the model was relatively simple, crawling through the various data and config files, then I used a tool called Crowbar to unpack the model files into a usable form. The next step was taking the extracted model and making it compatible with solidworks, and to do this I imported the SMD file (or Signed Mark Data) into blender. This worked without a hitch, and I now had the rocket launcher in blender.

<figure>
    <img src="/blogs/BlenderRL.jpg"
         alt="TF2 Rocket Launcher in Blender"
         style="max-height: 80vh; width: auto;">
    <figcaption>Model of the TF2 Rocket Launcher imported to blender from an .STM file. </figcaption>
</figure>

SolidWorks cannot read the SMD file type, so exporting this model as an STL or OBJ was the next step. I chose OBJ as these retain more surface geometry data, but none of the other properties were relevant to me at the time. Importing the graphical model into SolidWorks was also simple, and soon enough I had a good graphical model in SolidWorks to begin my modelling.

<figure>
    <img src="blogs/SLRL1.jpg"
         alt="TF2 Rocket Launcher in SolidWorks"
         style="max-height: 80vh; width: auto;">
    <figcaption>Model of rocket launcher imported into SolidWorks as an .obj file. </figcaption>
</figure>

I decided to scale the model up so it wouldn't disappear in the sea of features. I also tried my best between these stages to get the proportions as life-like as possible for manufacturing later, while also keeping middle of the barrel centered around the origin. I was doing this to have a rotational extrude to do the body in one shot, which I didn't end up doing. This was still helpful as elements like the handles and various misc. parts were centered on the right and front plane which made making new planes and references very simple.

I've documented my progress across the days of the project in a googe slides presentation. I took screenshots for the day of modelling, and wrote comments about anything from the manufacturing, modelling difficulties, and others. Since the project is still in progress, I will append that journal later.
On a day to day, it consisted of modelling a part or multiple parts of the rocket launcher per day, with some days being dedicated to manufacturing processes and other post-printing procedures. The progress in the photo as of May 4th was the 11th day of the project.

### Body
As mentioned before, I was going to do an outline of the body and then use a swept boss and swept cut. I decided on using a series of surface lofts to be able to change the individual sections more finely.  (refer to the days and insert the images) I then knit the individual surfaces to eventually thicken it in to the full body.

<figure>
    <img src="/blogs/body.jpg"
         alt="TF2 Rocket Launcher body in SolidWorks"
         style="max-height: 40vh; width: auto;">
</figure>

### Front Handle
The next part was the front handle. This was a simple shape, but had a gradient on all four sides, along with some geometry on the long sides. I decided to tackle this part with a series of bosses and cuts to get the gemoetry down.

<figure>
    <img src="/blogs/fronthandle.jpg"
         alt="TF2 Rocket Launcher handle in SolidWorks"
         style="max-height: 40vh; width: auto;">
</figure>

### Back bracket
This is the first part that MUST contain non designed parts. I can't pheasibly print the fabric strap or the screw that brings the two halves together, so I left those out in the design for now. I also didn't cut a hole as I need to decide what parts I would like to use.

<figure>
    <img src="/blogs/bracket.jpg"
         alt="TF2 Rocket Launcher bracket in SolidWorks"
         style="max-height: 40vh; width: auto;">
</figure>

### Trigger Handle
This part also contains non printable parts, and is more complicated than the other handle.

<figure>
    <img src="/blogs/triggerhandle.jpg"
         alt="TF2 Rocket Launcher trigger in SolidWorks"
         style="max-height: 40vh; width: auto;">
</figure>

### Iron Sights
This was the most complicated shape by far, needing to be made of multiple individual parts. I made it out of 3 boss extrudes to include all of the slight gradients, and two cuts for the two screw holes. These holes I felt were big enough to have a nice 3d printing bolt in place, so I decided to make it an arbitrary 2cm ID (inner diameter)

<figure>
    <img src="/blogs/ironsight.jpg"
         alt="TF2 Rocket Launcher trigger in SolidWorks"
         style="max-height: 40vh; width: auto;">
</figure>

With these individual parts in place, the 3d print is ready. A small model could be feasibly done printing in place, but having a 1m model would require many, many separate prints for all of the pieces. Ideally, printing the entirety of each element listed above with the body being split up into multiple prints.