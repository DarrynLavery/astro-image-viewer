// Copyright (c) 2017, Darryn Lavery

// Permission is hereby granted, free of charge, to any person obtaining a copy of this
// software and associated documentation files (the "Software"), to deal in the Software
// without restriction, including without limitation the rights to use, copy, modify, merge, 
// publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
// to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial 
// portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING 
// BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


// Sample to show an astronomical mosaic with annotations 
// Using 
//   1. OpenSeadragon for rendering and zooming the panel in an efficient manner.
//      The tool Deep Zoom Composer was used to prepeare the image data.
//      https://openseadragon.github.io/     
//   2. Annotorius for the annotations. This JS library allows the annotation of
//      images in web pages.  In this case,  annotations are auto generated and 
//      the editing feature are disabled.
//      http://annotorious.github.io/
//   3. JQuery
//   4. Underscore.js
//
// The following were were useful to get started
//	- http://annotorious.github.io/demos/openseadragon-preview.html
//	- https://openseadragon.github.io/examples/ui-binding-custom-buttons/
//	- https://github.com/annotorious/annotorious/wiki/Developing-Plugins


var allowAnnotationCreation = false; // For debug purposes

var getImage = null;

var homePanelID = null;

var panelIDVisible = null;

var navigatorVisible = true;

var annotationsVisible = true;

var toolTipUI = null;

var openSeaDragonViewer = null;


var annotations = null;

var placementPosition = 'body';

var IconDir = "/astroimageviewer/icons/";

function loadScripts()
{
    $('head').append ('<script src="/astroimageviewer/extern/script/openseadragon/openseadragon-bin-2.2.1/openseadragon.min.js"></script>');
    $('head').append ('<link rel="stylesheet" href="/astroimageviewer/extern/script/annotorius/css/theme-dark/annotorious-dark.css" />');
    $('head').append ('<script src="/astroimageviewer/extern/script/annotorius/annotorious.min.js"></script>');
    $('head').append ('<link rel="stylesheet" href="/astroimageviewer/extern/css/OpenSeaDragonToolbar.css" />');
    $('head').append ('<link rel="stylesheet" href="/astroimageviewer/extern/css/annotorius_openseadragon_int.css" />');
    $('head').append ('<link rel="stylesheet" href="/astroimageviewer/script/css/OpenSeaDragon_Customization.css" />');
    $('head').append ('<script src="/astroimageviewer/extern/script/underscore/underscore-min.js"/>');
}

function isIOS()
{
    if (navigator.userAgent.match(/iPad/i) != null ||
            navigator.userAgent.match(/iPhone/i) != null)
        return true;
    else 
        return false;
}

function isAndroid()
{
    if (navigator.userAgent.match(/Android/i) != null)
        return true;
    else
        return false;
}

function isMobile()
{
    if (isIOS() == true ||  isAndroid () == true)
        return true;
    else
        return false;
}

// gcd code using Euclid's algorithm

function gcd (a,b)
{
    if (b == 0)
        return a;
    else
        return gcd (b, a % b);
}


function addContentToPlace(p, s)
{
    $(p).append(s);
}

function addContentToPage(s)
{
    $(placementPosition).append(s);
}

// Function to create a cropped width and height for an image
// TODO: a better algorithm is needed

function calculateCanvasSize(width, height)
{

    var idealWidth = window.innerWidth * .80; // Leave 20% border

    idealWidth = Math.floor (idealWidth / width) * width  ; 
    var idealHeight = idealWidth * height / width;    

    if (width <= idealWidth && height <= idealHeight)
        return [width, height];

    g = gcd (width, height);
    width = width / g;
    height = height / g;

    idealWidth = window.innerWidth * .80; // Leave 20% border
    idealWidth = Math.floor (idealWidth / width) * width  ; 
    var idealHeight = idealWidth * height / width;  

    if (idealHeight < window.innerHeight - 250)
    {
        return [idealWidth, idealHeight];
    }
    else
    {
        var fallbackHeight = Math.max (500, window.innerHeight - 250);
        fallbackHeight = Math.floor (fallbackHeight/height) * height  ; 

        var fallbackWidth = fallbackHeight * (width / height);
        return [fallbackWidth, fallbackHeight];
    }
}

// Function to make a combo box of annoations
// as a fallback for the lack of support of annotation
// selection on mobile

function makeComboBoxAnnotations (parentImage, getImageF, annotations)
{
    // First identify all of the images in the annotation collection

    var arr = [];
    for (var key in annotations) 
    {

        var annotationData = annotations[key];

        if (annotationData.LeftAnnotationID != "" && 
                    annotationData.LeftAnnotationID != undefined)
            arr.push (annotationData.LeftAnnotationID);

        if (annotationData.RightAnnotationID != "" && 
                    annotationData.RightAnnotationID != undefined)
            arr.push (annotationData.RightAnnotationID);
    }

    // Remove any duplicates and sort..

    arr = _.uniq (arr);
    arr.sort (function (n1, n2) 
    { 
        return n1 - n2;  
    });

    arr.unshift (parentImage);

    var str = '<span id = "IMGCTL_panel_selector" style = "display : inline">';
    str = str + 'Image: '
    str = str + '<select onchange  = "showPanel (this.value); " name="selector" id = "IMGCTL_selector">';
    str = str + '\n';

    arr.forEach (function (value)
    {
        str = str + '<option value=' + value + '>' + getImageF (value).Title + '</option>\n';
    });

    str = str + '</select>\n';
    str = str + '</span>';

    return str; 
}


function makeComboBoxVisible()
{
    $('#IMGCTL_panel_selector').css ('display','inline');
}

function setComboxBoxValue(idx)
{
    $("#IMGCTL_selector").val(idx);
}

// Code to handle the tool tips

function showPanel (idx)
{
    window.alert ("Function still to be intialized. Display panel " + idx);
}

function generateImageCell (label, thumbNailURL, n)
{
    return '<td><center><a href = "JavaScript:  showPanel (' + n + ')"><img  src="' + 
                thumbNailURL + '" width = "100" height = "100" id = "btn' +n  + 
                '" alt="' +      label + '"></a></center></td>';
}

function generateLabelCell (label)
{
    return '<td><center><font color = white>' + label + '</font><center></td>';
}

function generateScript (buttonNumber, targetPanel)
{
    var str = '\n';
    var str = str + '<script type="text/javascript">';
    var str = str + '\n';

    var str = str + '$("#IMGCTL_btn' + buttonNumber + '").click(function()';
    var str = str + '\n';

    var str  = str + '{';
    var str = str + '\n';
    var str = str +  'showPanel ("' + targetPanel +'")';
    var str = str + '\n';
    var str = str + '});'
  
    var str = str + '\n';
    var str = str + '</script>';
    var str = str + '\n';
  
    return str;
}


function generateTable2Elements (label1, thumbNailURL1, targetPanel1, 
                                    label2, thumbNailURL2, targetPanel2)
{

    var str = '<div id = "IMGCTL_popmenu">';
    str = str + '<table>';

    str = str + '<tr>';
    str = str + generateImageCell (label1,thumbNailURL1, targetPanel1);
    str = str + generateImageCell (label2,thumbNailURL2, targetPanel2);
    str = str + '</tr>';

    str = str + '<tr>';
    str = str + generateLabelCell (label1);
    str = str + generateLabelCell (label2);
    str = str + '</tr>';

    str = str + '</table>';
    str = str + '</div>';
    return str;

}

function generateTable1Element (label1, thumbNailURL1, targetPanel1)
{
    var str = '<div id = "IMGCTL_popmenu">';
    str = str + '<table>';

    str = str + '<tr>';
    str = str + generateImageCell (label1,thumbNailURL1, targetPanel1);
    str = str + '</tr>';

    str = str + '<tr>';
    str = str + generateLabelCell (label1);
    str = str + "</tr>";

    str = str + "</table>";
    str = str + '</div>';
  
    return str;
}

function generateTooltipUI (annotations)
{

    toolTipUI = {};

    for (var key in annotations) 
    {

        var annotationData = annotations[key];

        var UIString = null; 
        if (annotationData.LeftAnnotationID == "" || 
                annotationData.LeftAnnotationID == undefined)
        {
            UIString = ""
        }
        else
        {
            var leftAnnotation = getImage (annotationData.LeftAnnotationID);

            if (annotationData.RightAnnotationID != "" && 
                    annotationData.RightAnnotationID != undefined)
            {
                var rightAnnotation = getImage (annotationData.RightAnnotationID);
                UIString = generateTable2Elements (
                        leftAnnotation.Type, leftAnnotation.thumbNailURL, 
                            annotationData.LeftAnnotationID,
                            rightAnnotation.Type, rightAnnotation.thumbNailURL, 
                            annotationData.RightAnnotationID);

            } 
            else
            {
                UIString =  generateTable1Element (leftAnnotation.Type, 
                        leftAnnotation.thumbNailURL, annotationData.LeftAnnotationID);
            }
        }
        toolTipUI[key] = UIString;
    }
}

function annotate() 
{
    var button = document.getElementById('map-annotate-button');
    button.style.color = '#777';

    anno.activateSelector(function() {
        // Reset button style
        button.style.color = '#fff';
    });
}

// Annotorius needs a little extra help to annotate an OpenSeaDragon image.
// This function supports the user drawing an annotation. However, in this 
// scenario, the annotations are inserted programamtically.
// This code is left on for debug purposes (mainly to test to where to
// add annotations)
// Code taken from
//   http://annotorious.github.io/demos/openseadragon-preview.html

function displayAnnotator ()
{
    if (allowAnnotationCreation == true)
    {
        var s = '<a id="map-annotate-button" onclick="annotate(); return false;" href="#">Annotate the mosaic</a>';
	   addContentToPlace ('#IMGCTL_ImageViewerController',s);
    }
}

// Insert the annotations programmatically

function generateAnnotations()
{
    for (var key in annotations) 
    {
        var newAnnotation = {
            // Yes -- this is how it is referenced!
            src : "dzi://openseadragon/something", 
            text : key,
            editable:false,
            shapes : [{
                type : 'rect',
                geometry : annotations[key].geometry
                    }]
            }
        anno.addAnnotation(newAnnotation);
  	}
}


function generateTitleUI()
{
    addContentToPage('<H1><div id = "IMGCTL_title"></div></H1>\n');
}

function setTitle (str)
{
    $('#IMGCTL_title').html(str);
}


// Generate Open Sea Dragon control
// NOTE: A wrapper div needed otherwise the toolbar does not not 
// appear on exit of full screen. Rather than use the standard 
// OpenSeaDragon control a custom control is created.
// See https://openseadragon.github.io/examples/ui-binding-custom-buttons/

function generateSeaDragonControl()
{
    var str =  '<div id = "IMGCTL_ImageViewerController" >';

    str = str +  '     <div id = "IMGCTL_CustomToolbar" class="toolbar">';
    str = str +  '		<img  id="IMGCTL_home" src = "' + IconDir + 'home.png"';
    str = str +  '             alt = "home" title ="Home"/>';
    str = str +  '     <a id="full-page" href=""><img src = "' + IconDir + 'fullscreen.png" ';
    str = str +  '               alt = "Full screen" title = "Full screen" /></a> ';
    str = str +  '         <a id="IMGCTL_zoom-in" href=""><img src = "' + IconDir + 'zoom-in.png"';
    str = str +  '               alt = "Zoom in" ';
    str = str +  '               title = "Zoom in.\nTwo fingered scroll and mouse wheel supported"/></a>';
    str = str +  '         <a id="IMGCTL_zoom-out" href=""><img src = "' + IconDir + 'zoom-out.png" ';
    str = str +  '               alt = "Zoom out" ';
    str = str +  '                title = "Zoom out. Two fingered scroll and mouse wheel supported"./></a> ';   

    // Using a hyperlink will cause uncessary flickering
    str = str +  '         <img  id="IMGCTL_toggle-navigation" src = "' + IconDir + 'navigation.png"';
    str = str +  '                alt = "Toggle navation" title = "Toggle navigation controller"/>';
	
    if (annotations != null)
        str = str + generateToggleAnnotationUI();

	// Annotation UI is currently not selectable in mobile.

    if (isMobile())
        str = str +  makeComboBoxAnnotations (homePanelID, getImage, annotations);


    str = str + '</td></tr>';
    str = str + '</div>';

    // Note: position relative is really important here

    str = str +  '      <div id="openseadragoncontrol" style="position: relative; width: 750px; height: 600px;"></div> ';
 	
    addContentToPage(str);
}


function generateArticleUI()
{
    addContentToPage ('<div id="IMGCTL_panelDescription"></div>');
}

function showArticle (imageData)
{
    $('#IMGCTL_panelDescription').load (imageData.articleURL);
    
    setTitle (imageData.Title);
}


function setCallbacksForSeaDragonControl()
{
    function fillScreen()
    {
        openSeaDragonViewer.viewport.goHome();
    }

    openSeaDragonViewer.addHandler('full-page', function(data) 
    {
        if (data.fullPage == false)
            setTimeout (fillScreen, 100);

    });

    $("#IMGCTL_toggle-navigation").click(function() 
    {
        if (navigatorVisible)
            openSeaDragonViewer.navigator.element.style.display = "none";
        else
            openSeaDragonViewer.navigator.element.style.display = "inline-block";
	  	
        navigatorVisible = !navigatorVisible;
    });
	
    $("#IMGCTL_home").click(function() 
    {
        showPanel (homePanelID);
    });
}


function intializeOpenSeaDragonControl (idx)
{
    panelIDVisible = idx;

    var panelData = getImage (idx);

    var imageSize = calculateCanvasSize(panelData.width, panelData.height);

    $('#openseadragoncontrol').css("width", imageSize[0] + "px");
    $('#openseadragoncontrol').css("height",imageSize[1] + "px");

    openSeaDragonViewer = OpenSeadragon({
        id: "openseadragoncontrol",
        prefixUrl: "/astroimageviewer/extern/script/openseadragon/openseadragon-bin-2.2.1/images/",
        tileSources:  panelData.DZIURL,

        toolbar:        "IMGCTL_CustomToolbar",
        zoomInButton:   "IMGCTL_zoom-in",
        zoomOutButton:  "IMGCTL_zoom-out",
        fullPageButton: 'full-page',	
        visibilityRatio: 1.0,
        constrainDuringPan: true,
        showNavigator: true,
        navigatorPosition: "TOP_RIGHT",
        });

    showArticle (panelData);
}


function showPanel(idx)
{
    if (isNaN (idx))
        idx = 0;
	
    panelIDVisible = idx; 
    panelData = getImage (idx);

    if (annotations == null)
    {
        openSeaDragonViewer.open( panelData.DZIURL);
        return;
    }

    // TODO: Find a better way of doing this e.g. setting opacity
  
    $("div.annotorious-popup").hide(); 
    anno.destroy(); // needed unless the page is re-loaded

    openSeaDragonViewer.open( panelData.DZIURL);

    if (panelIDVisible == homePanelID)
    {
        // needed unless the page is re-loaded
        anno.makeAnnotatable(openSeaDragonViewer); 

        annotationsVisible = true;

        $("#IMGCTL_toggle-annotations").show();
   
        // needed unless the page is re-loaded
        setTimeout (generateAnnotations, 100); 
    }
    else
    {
        $("#IMGCTL_toggle-annotations").hide();
    }

    showArticle (panelData);

}

function generateToggleAnnotationUI()
{
    return '<img id="IMGCTL_toggle-annotations" ' +
                'src = "' + IconDir + 'annotations.png" ' +
                'alt = "Toggle annotations"' +
                'title = "Toggle the display of annotations."' +
                '/> ';
}


function setToggleAnnotationCallback()
{

    $("#IMGCTL_toggle-annotations").click(function() 
    {
        if (annotationsVisible)
            anno.removeAll();
        else
            generateAnnotations();    

        annotationsVisible = !annotationsVisible
    });
}

function addAnnotationPlugIn()
{
    // For more details see https://github.com/annotorious/annotorious/wiki/Developing-Plugins

    annotorious.plugin.AnnotationPlugin = function(opt_config_options) { }
    annotorious.plugin.AnnotationPlugin.prototype.initPlugin = function(anno) { }
    annotorious.plugin.AnnotationPlugin.prototype.onInitAnnotator = function(annotator) 
    {
        annotator.popup.addField(function(annotation) 
        { 
            var UI = toolTipUI [annotation.text];

            if (UI == undefined)
                return "An error has occurred.";
            else
                return UI;
        });
    }

    anno.addPlugin('AnnotationPlugin', {});
}

function intializeAnnotations ()
{
    if (annotations == null)
        return; 

    generateTooltipUI(annotations); 

    addAnnotationPlugIn();

    anno.makeAnnotatable(openSeaDragonViewer);

    generateAnnotations();

    displayAnnotator();

    setToggleAnnotationCallback();
}


function initializePanelUI(imageID)
{

    generateTitleUI();
    generateSeaDragonControl(generateToggleAnnotationUI());
    generateArticleUI ();
    intializeOpenSeaDragonControl(imageID);
    setCallbacksForSeaDragonControl();
}

function viewDZIAux(placement, images, parentImage, annotationData)
{
    if (placement != undefined && placement != "")
        placementPosition = placement;

    if (annotationData == null || annotationData == {})
        annotations = null;
    else
        annotations = annotationData ;

    getImage = images.getImage;
    homePanelID = parentImage;
    displayedPanelID = parentImage;

    loadScripts();
	
    initializePanelUI(parentImage);

    if (annotations != null)
        intializeAnnotations ();
}


function viewDZIWithAnnotations(placement, images, parentImage, annotationData)
{
    viewDZIAux(placement, images, parentImage, annotationData);
}

function viewDZI (placement, images, imageID)
{
    var imageData = images.getImage (imageID);

    if (imageData.DZI == true)
        viewDZIAux(placement, images, imageID, null);
    else 
        viewImage(placement, images, imageID);
}


function viewImage(placement, images, imageID)
{
    var imageData = images.getImage (imageID)

    addContentToPlace(placement, '<div id = "IMGCTL_title"><H1>' + imageData.Title + '</H1></div>');

    var size = calculateCanvasSize(imageData.width, imageData.height)

    var str = '<div id = "IMGCTL_ImageViewerController" >';
    str = str +	'<img  src = "' + imageData.imageURL + '" width = "' + size [0] +' " height = "' + size[1] +'"/>';
    str  = str + '</div>';

    addContentToPlace(placement, str);

    addContentToPlace (placement, '<div id="IMGCTL_panelDescription"></div>');

    $('#IMGCTL_panelDescription').load (imageData.articleURL);
}
