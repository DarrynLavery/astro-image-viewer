// Copyright (c) 2016, Darryn Lavery

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


var astroImageData = (function()
{

    var basePath = "/astroimageviewer/assets/images/"

    var Images = 
    {
        0: { // ID corresponding to the directory name
                ShortCode: "NGC 7000", 
                Title: "NGC 7000 in Synthetic Color",
                Type: "Synthetic Color",
                width: 2652,  // width
                height: 1768, // height
                DZI: true // Set false if you do not have a DZI
            },

        1: {
                ShortCode: "Cygnus Wall",
                Title: "Cygnus Wall in Synthetic Color",
                Type: "Synthetic Color",
                width: 1964, 
                height: 2946,
                DZI: true
            },
        
        2: {
                ShortCode: "IC 5070",
                Title: "IC 5070 in Synthetic Color",
                Type: "Synthetic Color",
                width: 1937, 
                height: 2951,
                DZI: true
            }
    }

    function numberToString (n)
    {
        var str = "0000000" + n;
        return str.substr (str.length-8);
    }

    function getImage (id)
    {
        var s = Images [id];

        if (s == undefined)
        {
            id = "Error";

            s = 
            {
                Title: "An error has occurred",
                Type: "Unknown",
                width: 500,
                height: 500,
                DZI: false
            }

        }   

        if (s.imageURL == undefined)
            s.imageURL = basePath + numberToString(id) + "/Image.jpg"

        if (s.articleURL == undefined)
            s.articleURL = basePath + numberToString(id) + "/Article.html"

        if (s.thumbNailURL == undefined)
            s.thumbNailURL = basePath + numberToString(id) + "/100.jpg"
    
        if (s.DZIURL == undefined && s.DZI == true)
            s.DZIURL = basePath + numberToString(id) + "/DZI/dzc_output.xml"
            
        return s;

    }

    return { "getImage": getImage}
} ())
