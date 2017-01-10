
$('head').append ('<script src="/astroimageviewer/publications/NGC7000Annotations.js"/>');
															
$('head').append ('<script src="/astroimageviewer/publications/imageData.js"/>');

$('head').append ('<script src="/astroimageviewer/script/utils.js"/>');
$('head').append ('<script src="/astroimageviewer/script/AnnotatedImageViewer.js"/>');



function displayImage (n)
{
	viewImage ('#osd_panel',AstroImageData, n);

}


function displayImageAsDZI (n)
{
	viewDZI ('#osd_panel', AstroImageData, n);

}

function viewNGC7000 ()
{
	viewDZIWithAnnotations( '#osd_panel', AstroImageData, 0, NGC7000Annotations);
}

