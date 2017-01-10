# Astro Image Viewer Sample
This JavaScript sample allows the amateur astronomer to efficiently display ultra-high resolution wide angle images on their web site. The images can be annotated with other images; for example, deep space objects taken with more powerful telescopes or with different instruments. Images and their annotations are specified through configuration files, making it easy to integrate astronomical images into content management systems such as WordPress.

The sample builds upon various technologies including OpenSeadragon for deep zoom images, and Annotorius for image annotations.

# Example in use
An example of the sample in use can be seen at:
[http://feistyphoton.org/project/carinatour/](http://feistyphoton.org/project/carinatour/)

This image of the southern night sky includes many famous deep space objects that can only be observed from the southern hemisphere. Those deep sky objects include NGC 3372 (Carina Nebula), NGC 3532 (Wishing Well Cluster), IC 2944 (Running Chicken Nebula) and IC 2602 (Southern Pleiades). 

Each image has an article describing the object including how it was taken and how the raw data was processed. This particular image is a mosaic of 12 separate images taken with a wide field telescope (Takahashi FSQ 106 ED with an SBIG STL-11000M camera) rented from iTelescope.net  (Coonabarabran, New South Wales, Australia). Given its large size (80 megapixels), the image is an ideal candidate for rendering with OpenSeadragon!

Click the full screen button on the image’s toolbar to explore the image in more detail. Use either your mouse’s scroll button, two-fingered scroll on your touchpad or the zoom in / out buttons on the toolbar. As you zoom into the image, OpenSeadragon loads in additional image detail on demand.

Most of the deep sky objects in the image were imaged using a more powerful telescope with a narrower field of view and / or using narrow band filters.  (Taking the whole image with the more powerful telescope would have been prohibitively expensive!)  Hover over an object (for example, NGC 3372 (Carina Nebula)) in the top right corner) and click one of the additional images. The technology to display the annotations is provided by Annotorius. In this usage scenario, the user is not annotating the images but instead the annotations are added programmatically on image rendering.

Each of the images on this web site [http://feistyphoton.org](http://feistyphoton.org) are displayed using this JavaScript sample. The site was developed using WordPress with Elegant Theme’s Divi builder and theme. Where an image and its article is required (e.g. [http://feistyphoton.org/project/m45-pleiades/](http://feistyphoton.org/project/m45-pleiades/))  a simple JavaScript call inserts the required content into the page.

# Dependencies and licenses

## Sample License
This sample is distributed under the MIT license ([https://opensource.org/licenses/MIT](https://opensource.org/licenses/MIT))

## Dependencies
* **OpenSeadragon V2.2.1**
 * [https://openseadragon.github.io/](https://openseadragon.github.io/)
 * This component provides the zoomable image supported and is distributed under the New BSD license ([https://openseadragon.github.io/license/](https://openseadragon.github.io/license/)
* **Annotorius 0.6.4** 
 * [https://annotorious.github.io/](https://annotorious.github.io/)
 * This component provides the annotation support and is distributed under the MIT license ([http://annotorious.github.io/about.html](http://annotorious.github.io/about.html))
* **JQuery (compressed, production V3.1.1)**
 * [http://jquery.com/](http://jquery.com/)
 * Used in many ways – too numerous to enumerate! 
 * Released under the MIT license (see header of js file).
* **Underscore.js  (Production V1.8.3)** 
 * [http://underscorejs.org/](http://underscorejs.org/)
 * This sample uses the uniq function to remove duplicates from an array. This dependency is available under the MIT license ([http://underscorejs.org/docs/underscore.html](http://underscorejs.org/docs/underscore.html))
* **Icons provided by Google material icons**
 * [https://material.io/icons/](https://material.io/icons/)
 * The icons are made available under the Apache 2.0 license. At the time of writing  (December 21st 2016) the only attribution requirements were "We'd love attribution in your app's "about" screen, but it's not required. The only thing we ask is that you not re-sell these icons. " ([https://material.io/icons/](https://material.io/icons/))



# How to use this sample

Once you have the setup sample it should look like
[http://fesityphoton.org/astroimageviewer/example.html](http://fesityphoton.org/astroimageviewer/example.html)


## Step 1: Make a copy of this this repository on your local file system

## Step 2: Download the dependencies
Review and download the following dependencies into the appropriate folder into the folder `{DownloadLocation}\astroimageviewer\extern\script`

* OpenSeadragon: [https://openseadragon.github.io/](https://openseadragon.github.io/)
* Annotorius: [https://annotorious.github.io/](https://annotorious.github.io/)
* JQuery: [http://jquery.com/](http://jquery.com/)
* Underscore.js [http://underscorejs.org/](http://underscorejs.org/)


## Step 3: Upload the files to your web site
Copy the folder `{DownloadLocation}\astroimagerviewer` to the base directory of your web site

## Step 4:
Open the following URL in a browser
[http://yourwebsite.url/astroimageviewer/example.html](http://yourwebsite.url/astroimageviewer/example.html)

# Extending this sample
##Images
The individual images are stored in folders in `{DownloadLocation}\astroimageviewer\assets\images`

Each folder contains

* A 100 * 100 pixel thumb nail (100.jpg)
* The source image (Image.jpg)
* The HTML for the article (Article.hml). When programmatically including HTML into a web page, take care to ensure it comes from a trusted source. Future work could migrate this content to a simple database and the sanitized text rendered on demand.
* Optionally a Deep Zoom Image (DZI) version in the image stored in the DZI folder. The images in the sample were created with the Deep Zoom Composer ([https://www.microsoft.com/en-us/download/details.aspx?id=24819](https://www.microsoft.com/en-us/download/details.aspx?id=24819)). The tool is straightforward to use. On the last step (Export) the following options: Output type = Silverlight Deep Zoom, Export options = Export as a composition (single image).


## Image Data
The image data is stored in a lightweight fashion using a JavaScript function {DownloadLocation}\astroimageviewer\assets\imageData.js

This JS files contains a couple of examples with an explanation how to include other images. Again, future work could migrate this data into a database but the sample intent was to provide a simple script with minimal dependences on the target machine.


## Annotation Data

Again a lightweight structure is used – see `{DownloadLocation}\astroimageviewer\assets\NGC7000Annotations.js`

Each annotation consists of a description, an image id for the annotation and the coordinates of where to mark the annotation in the parent image.

 ``` 
 "Cygnus wall": {
        geometry: { height: 0.2788, width: 0.2747, x :0.0069, y:0.3375 },
        LeftAnnotationID: 2}
```

**Tip**: guessing the correct coordinates for the annotation will be tricky! In astroImageViewer.js set

```
var allowAnnotationCreation = true;
```

Use the UI to create the annotations, then enter the browser debug mode and at the console type

```
Anno.getAnnotations()
```

You should then be able to inspect the geometry values for the newly created annotation.


## Adding an annotation in your page

The file `{DownloadLocation}\astroimageviewer\example.html` has a stripped down minimal version of how to do this.

First, create a DIV where the image and article need to be on the page:

```
<div id = "osd_panel">

</div>
```

Next load in JQuery. **Tip:** loading JQuery from a CDN e.g. Google will speed up script execution.

```html
<script src="/astroimageviewer/extern/script/JQuery/jquery-3.1.1.min.js"></script>
```

Next load in the data and script. **Tip:** this script can be wrapped into a helper script to make it easier to integrate into your content management system

```html

<script>

$('head').append ('<script src="/astroimageviewer/script/astroImageViewer.js"/>');
$('head').append ('<script src="/astroimageviewer/assets/imageData.js"/>');
$('head').append ('<script src="/astroimageviewer/assets/NGC7000Annotations.js"/>');
viewDZIWithAnnotations( '#osd_panel', 
astroImageData, 0, NGC7000Annotations);
</script>

```

The call to viewDZIWithAnnotations requires a tag indicating where in the page to insert the image and article, the image data, the index of the image to view and the annotation data.

Alternatively if the annotations are not required, image #1 can be rendered this call
```
viewDZI('#osd_panel', astroImageData, 1);
```
If you have an image (#2) without a Deep Zoom Image then it can be rendered with

```
viewDZI('#osd_panel', astroImageData, 2);
```


# Known issues
Currently Annotorius does not support selection of the annotation on mobile. On these devices, the script enumerates the annotations into a combo box in the toolbar.

#Image Credits
The sample images were taken with iTelescope.net and processed with PixInsight, Adobe Lightroom and Adobe Photoshop.

