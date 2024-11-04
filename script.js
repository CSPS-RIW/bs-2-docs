//Init vars
var indexArr = [];
var resArr = {};
var cssArr = [];
var localUrl = '';
var htmlResCounter = 0;
var htmlLoadedResCounter = 0;
var xmlManifest = '';
console.log('loading');

// 			let xmlInput = document.querySelector('#xml_input');

// 			xmlInput.value = `
// 			(XML Manifest will show here)
// COR310-DEV-EN/imsmanifest.xml
// COR101-DEV-FR/imsmanifest.xml
// FON301-DEV-FR/imsmanifest.xml
// FON304-DEV-EN/imsmanifest.xml
// 			`;
// 			console.log(xmlInput);

//Generate main index from XML data
function fGenIndex() {
    //
    xmlData = xmlManifest;
    //Generate Resources
    fGenRes(xmlData);
    //Validation

    //Parse
    xmlParser = new DOMParser();
    xmlDoc = xmlParser.parseFromString(xmlData, 'text/xml');

    //Loop through first level organisation items
    for (
        var i = 0;
        i <
        xmlDoc.getElementsByTagName('organization')[0].children[0]
            .children.length;
        i++
    ) {
        //Register Index elements
        indexArr[i] = {};
        indexArr[i].title =
            xmlDoc.getElementsByTagName(
                'organization',
            )[0].children[0].children[i].children[0].textContent; //!Make sure it targets title title tag as opposed to first one
        indexArr[i].items = [];
        indexArr[i].identifier = xmlDoc
            .getElementsByTagName('organization')[0]
            .children[0].children[i].getAttributeNode(
                'identifier',
            ).nodeValue;

        //TMP Counter
        var tCnt = 0;

        //Loop through second level organisation items
        for (
            var ii = 0;
            ii <
            xmlDoc.getElementsByTagName('organization')[0]
                .children[0].children[i].children.length;
            ii++
        ) {
            if (
                xmlDoc.getElementsByTagName('organization')[0]
                    .children[0].children[i].children[ii]
                    .nodeName == 'title'
            ) {
                //!Ignore, find better solution!
            } else if (
                xmlDoc.getElementsByTagName('organization')[0]
                    .children[0].children[i].children[ii]
                    .nodeName == 'item'
            ) {
                //Check if third level
                if (
                    xmlDoc
                        .getElementsByTagName('organization')[0]
                        .children[0].children[i].children[
                            ii
                        ].getAttributeNode('identifierref') ==
                        null &&
                    xmlDoc
                        .getElementsByTagName('organization')[0]
                        .children[0].children[i].children[
                            ii
                        ].getElementsByTagName('item').length > 0
                ) {
                    //Loop through third level organisation items
                    for (
                        var iii = 0;
                        iii <
                        xmlDoc.getElementsByTagName(
                            'organization',
                        )[0].children[0].children[i].children[ii]
                            .children.length;
                        iii++
                    ) {
                        if (
                            xmlDoc.getElementsByTagName(
                                'organization',
                            )[0].children[0].children[i].children[
                                ii
                            ].children[iii].nodeName != 'title'
                        ) {
                            //Register 3rd level
                            indexArr[i].items[tCnt] = {
                                title: xmlDoc.getElementsByTagName(
                                    'organization',
                                )[0].children[0].children[i]
                                    .children[ii].children[iii]
                                    .children[0].textContent,
                                identifier: xmlDoc
                                    .getElementsByTagName(
                                        'organization',
                                    )[0]
                                    .children[0].children[
                                        i
                                    ].children[ii].children[
                                        iii
                                    ].getAttribute('identifier'),
                                identifierref: xmlDoc
                                    .getElementsByTagName(
                                        'organization',
                                    )[0]
                                    .children[0].children[
                                        i
                                    ].children[ii].children[
                                        iii
                                    ].getAttribute('identifierref'),
                            };

                            tCnt++;
                        } else {
                            //2nLevelHolder
                        }
                    }
                } else {
                    //Register 2nd level
                    indexArr[i].items[tCnt] = {
                        title: xmlDoc.getElementsByTagName(
                            'organization',
                        )[0].children[0].children[i].children[ii]
                            .children[0].textContent,
                        identifier: xmlDoc
                            .getElementsByTagName('organization')[0]
                            .children[0].children[i].children[
                                ii
                            ].getAttributeNode('identifier')
                            .nodeValue,
                        identifierref: xmlDoc
                            .getElementsByTagName('organization')[0]
                            .children[0].children[i].children[
                                ii
                            ].getAttributeNode('identifierref')
                            .nodeValue,
                    };

                    tCnt++;
                }
            } else {
                console.log(
                    'uncatched nodeName? ' +
                        xmlDoc.getElementsByTagName(
                            'organization',
                        )[0].children[0].children[i].children[ii]
                            .nodeName,
                );
            }
        }
    }

    fGenFullList();
}

function fGenRes(xmlData) {
    //Validate

    //Parse
    xmlParser = new DOMParser();
    xmlDoc = xmlParser.parseFromString(xmlData, 'text/xml');

    //Loop through resources
    for (
        var i = 0;
        i <
        xmlDoc.getElementsByTagName('resources')[0].children.length;
        i++
    ) {
        //Alias
        resID = xmlDoc
            .getElementsByTagName('resources')[0]
            .children[i].getAttributeNode('identifier').nodeValue;

        //Assign Type
        resArr[resID] = {
            type: xmlDoc
                .getElementsByTagName('resources')[0]
                .children[i].getAttributeNode('type').nodeValue,
        };

        //Register dependencies if exists
        if (
            xmlDoc
                .getElementsByTagName('resources')[0]
                .children[i].getElementsByTagName(
                    'dependency',
                )[0] !== undefined
        ) {
            resArr[resID].dependency = xmlDoc
                .getElementsByTagName('resources')[0]
                .children[i].getElementsByTagName('dependency')[0]
                .getAttributeNode('identifierref').nodeValue;
        }

        //Register files
        resArr[resID].files = [];

        //Loop through resources inner tags and register
        for (
            var ii = 0;
            ii <
            xmlDoc.getElementsByTagName('resources')[0].children[i]
                .children.length;
            ii++
        ) {
            if (
                xmlDoc.getElementsByTagName('resources')[0]
                    .children[i].children[ii].nodeName == 'file'
            ) {
                resArr[resID].files.push(
                    xmlDoc
                        .getElementsByTagName('resources')[0]
                        .children[i].children[ii].getAttributeNode(
                            'href',
                        ).nodeValue,
                );
            } else {
                //Error handling
                console.log(
                    'uncatched nodeName? ' +
                        xmlDoc.getElementsByTagName('resources')[0]
                            .children[i].children[ii].nodeName,
                );
            }
        }
    }
}

//Generate full index and display on screen
function fGenFullList() {
    //Loop through modules
    for (var i = 0; i < indexArr.length; i++) {
        //Add checkbox for adding/removing items manually from generated list
        fOut(
            '<label><input type="checkbox" checked>' +
                indexArr[i].title,
        );
        //Loop through items
        for (var ii = 0; ii < indexArr[i].items.length; ii++) {
            //Skip items without identifierref
            if (indexArr[i].items[ii].identifierref == undefined) {
                continue;
            }
            fOut(
                '<label><input type="checkbox" checked> - ' +
                    indexArr[i].items[ii].title +
                    '</label> - [<a href="' +
                    localUrl +
                    resArr[indexArr[i].items[ii].identifierref]
                        .files[0] +
                    '" target="_blank">' +
                    resArr[indexArr[i].items[ii].identifierref]
                        .type +
                    '</a>]',
            );
            //Check for dependencies
            if (
                resArr[indexArr[i].items[ii].identifierref]
                    .dependency != undefined
            ) {
                for (
                    var iii = 0;
                    iii <
                    resArr[
                        resArr[indexArr[i].items[ii].identifierref]
                            .dependency
                    ].files.length;
                    iii++
                ) {
                    fOut(
                        '  -&gt;Dependance: <a href="' +
                            localUrl +
                            resArr[
                                resArr[
                                    indexArr[i].items[ii]
                                        .identifierref
                                ].dependency
                            ].files[iii] +
                            '" target="_blank">' +
                            resArr[
                                resArr[
                                    indexArr[i].items[ii]
                                        .identifierref
                                ].dependency
                            ].files[iii] +
                            '</a>',
                    );
                }
            }
        }
    }
}

//Generate HTML from course content
function fGenHtml() {
$('#output').remove();
for (let i = 0; i < indexArr.length; i++) {
// Keep Module Title as H1
$('#generated_content').append(`<div id="module_${i}"><h1>${indexArr[i].title}</h1></div>`);

for (let ii = 0; ii < indexArr[i].items.length; ii++) {
if (indexArr[i].items[ii].identifierref === undefined) continue;

// Each page content will be loaded with H2 as the starting point for headings
$('#generated_content #module_' + i).append(
    `<div id="item_${ii}"></div>`
);

htmlResCounter++;
fLoadHtml(
    localUrl + resArr[indexArr[i].items[ii].identifierref].files[0],
    '#generated_content #module_' + i + ' #item_' + ii
);
}
}
console.log(htmlResCounter + ' HTML files to be loaded...');
}


//Load HTML into target element
function fLoadHtml(url, target) {
var client = new XMLHttpRequest();
client.open('GET', url);
client.onreadystatechange = function () {
if (this.readyState == 4 && this.status == 200) {
var htmlBuffer = '';
var el = $('<div></div>');

// Extract body content only
if (client.responseText !== '') {
    htmlBuffer = client.responseText.substring(
        client.responseText.indexOf('<body>'),
        client.responseText.indexOf('</body>')
    );
}

// Remove <script> tags
htmlBuffer = htmlBuffer.replace(/<script[^<]*<\/script>/g, '');
htmlBuffer = htmlBuffer.replace(/<script.*<\/script>/g, '');

// Update relative src attributes
htmlBuffer = htmlBuffer.replace(
    /src="/g,
    'src="' + this.responseURL.substring(0, this.responseURL.lastIndexOf('/')) + '/'
);

el.html(htmlBuffer);

// Adjust each heading level by one, starting from H2 for page content
el.find('h1, h2, h3, h4, h5, h6').each(function () {
    const currentLevel = parseInt(this.tagName.charAt(1));
    const newLevel = Math.min(currentLevel + 1, 6);
    $(this).replaceWith(`<h${newLevel}>${$(this).text()}</h${newLevel}>`);
});

$(target).append(el);
htmlLoadedResCounter++;

fCheckIfResLoadingComplete();
}
};
client.send();
}



//Load XML manifest from input URL field
function fLoadXml() {
    localUrl =
        'imscc_files/' +
        document
            .getElementById('xml_loadurl')
            .value.replace(/imsmanifest.xml/g, '');

    //Load via XMLHttpRequest for now
    var client = new XMLHttpRequest();
    client.onload = fileLoadHandler;
    client.open('GET', localUrl + '/imsmanifest.xml');
    client.send();
}

//Handle file loading
function fileLoadHandler() {
    //Check if loading successful
    if (this.status == 200 && this.responseXML != null) {
        //Load XML into textarea
        $('#xml_input').val(this.responseText);
        //Also store it!
        xmlManifest = this.responseText;
    } else {
        alert('Unable to load XML Manifest: ');
        console.log('Unable to load XML Manifest: ' + this.status);
    }
}

//Check If all html resources loaded
function fCheckIfResLoadingComplete() {
    //Compare res. counter to loaded res. counter, if all loaded, then success!
    if (htmlResCounter == htmlLoadedResCounter) {
        //Load CSS if option checked
        if ($('#bs2d_opt_loadcss').prop('checked')) {
            for (var i = 0; i < cssArr.length; i++) {
                $('head').append(
                    '<link rel="stylesheet" href="<link rel="stylesheet" href="https://app.csps-efpc.gc.ca/shared/LCS_HTML_Templates/CSPS_Template_2021/_assets/css/styles.min.css>"',
                );
            }
        } else {
            //If CSS not to be loaded...
        }
    }
}

//Function meant to fix HTML after load (ex: show all modals, expand all accordion boxes...)
function fFixHtml() {
    //Remove collapse class to show more content (ex: transcript)
    $('*').removeClass('collapse');

    //Modify display:none list
    //Quizzes: feedback
    //Video Transcripts
    //Show-hide panels

    $('head').append(
        '<link rel="stylesheet" src="https://app.csps-efpc.gc.ca/shared/LCS_HTML_Templates/CSPS_Template_2021/_assets/css/styles.min.css"',
    );

    $('iframe').each(function () {
        if ($(this).attr('src').indexOf('https://') >= 0) {
            $(this).attr(
                'src',
                $(this)
                    .attr('src')
                    .substring(
                        $(this).attr('src').indexOf('https://'),
                    ),
            );
        }
    });

    /*$("img").each(function(){
if($(this).attr("width") && $(this).attr("width") != "" && $(this).attr("height") && $(this).attr("height") != ""){
  $(this).removeAttr("height");
}
});

$(".float-left").removeClass("float-left");
$(".float-right").removeClass("float-right");*/

    //this function replaces select tags with their option values as p tags
    //for each select tag in the page
    $('select').each(function () {
        //get all of the options in the select tag
        var listOfOptions = $(this).find('option');
        // create empty array to store the text in
        var valueString = '';
        //for each option inside the current select tag
        for (var i = 0; i < listOfOptions.length; i++) {
            //the first element is usually disabled and will sometimes say something like please choose or choisir
            //if the element is disabled then keep it but add formatting so that it is readable.
            //lots of "if" statements so I used some ternary operators
            if (listOfOptions[i].hasAttribute('disabled')) {
                //proper formatting for english vs french
                valueString =
                    document.documentElement.lang == 'en'
                        ? (valueString =
                                valueString +
                                listOfOptions[i].text +
                                ': ')
                        : (valueString =
                                valueString +
                                listOfOptions[i].text +
                                ' : ');
            } else {
                //if the current options element is the last in the array we add a period to the end.
                //if it isnt the last element, add a comma
                //we use +1 because arrays start at 0
                valueString =
                    i + 1 == listOfOptions.length
                        ? valueString + listOfOptions[i].text + '.'
                        : valueString +
                          listOfOptions[i].text +
                          ', ';
            }
        }
        //once we have created the string from all of the options we replace the select tag with a p tag containing the string
        $(this).replaceWith('<p>' + valueString + '</p>');
    });

    //display or hide answer keys
    if ($('#answerkeys').is(':checked')) {
        $('.feedback').css('display', 'block');
    } else {
        $('.feedback').css('display', 'none');
    }

    //this function fixes the branching activity html to make it readable on paper
    $('.branching-activity')
        .find('.info > ol > li > ol > li')
        .each(function () {
            var lang = document.documentElement.lang;

            //regexp for finding the number at the end of the text entry.
            //it also searches for a possible period and space so that we can format properly
            var result = $(this)
                .text()
                .match(/(\.?)(\s?)(\d+$)/);

            if (lang == 'en') {
                $(this).text(
                    $(this)
                        .text()
                        .replace(
                            /(\.?)(\s?)(\d+$)/,
                            '.\nContinue to event ' +
                                result[3] +
                                '.',
                        ),
                );
            } else if (lang == 'fr') {
                $(this).text(
                    $(this)
                        .text()
                        .replace(
                            /(\.?)(\s?)(\d+$)/,
                            ".\nContinuer à l'événement numéro " +
                                result[3] +
                                '.',
                        ),
                );
            }
        });
    //display or hide decorative images
    //this is done by checking if there is any alt text
    //decorative images should not have any alt text
    if ($('#decorativeimages').is(':checked')) {
        $('img').each(function () {
            if ($(this).attr('alt') == '') {
                $(this).css('display', 'block');
            }
        });
    } else {
        $('img').each(function () {
            if ($(this).attr('alt') == '') {
                $(this).css('display', 'none');
            }
        });
    }

    //
    //Remove system tools and UI
    $('#bs2docui').remove();
}

//Check if CSS needs to be added
function fPushCssIfNew(data, arr) {
    data = data.substring(0, data.indexOf('?'));
    var injection = true;

    //Loop through CSS already in list, false if it exists (don't want duplicates!)
    for (pi in arr) {
        if (arr[pi] == data) {
            injection = false;
            break;
        }
    }

    //Inject CSS only if required
    if (injection) {
        arr.push(data);
    } else {
        console.log('injection REJECTED');
    }
}

//Simple function to output HTML content to #output
function fOut(msg) {
    $('#output').append(msg + '<br>');
}