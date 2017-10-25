document.addEventListener('DOMContentLoaded', function() {
    var gData
    var URL = "1rcXF17V1Fq_z6-7tfirM095dLtd5gLsGpLhz6yhxvBo"
        Tabletop.init({ key: URL, callback: showInfo, simpleSheet: true })
})

function showInfo(gData) {
    tableOptions = {
        "data": gData,
        "tableDiv": "#alumniTable",
        "filterDiv": "#tableFilter"
    }

    // table, and search bar
    Sheetsee.makeTable(tableOptions)
    Sheetsee.initiateTableFilter(tableOptions)

    // create geoJSON with coordinates and other
    // useful bits from the original data
    var optionsJSON = ["company","logo", "alumni","year", "city", "rowNumber"]
    var geoJSON = Sheetsee.createGeoJSON(gData, optionsJSON)

    // create map, tilelayer (map background), markers and popups
    var map = Sheetsee.loadMap("map")
    Sheetsee.addTileLayer(map, 'jllord.n7aml2bc')
    var markerLayer = Sheetsee.addMarkerLayer(geoJSON, map, "<h2>{{ company }}</h2>", true)

    // when someone clicks on a row, highlight it and
    // re-center the map
    // TODO show popup, change marker color
    $('#instructions').css("display", "inline")
    $('.spotRow').live("click", function(event) {
        $('.spotRow').removeClass("selectedRow")
        var rowNumber = $(this).closest("tr").attr("id")
        $('#' + rowNumber).addClass("selectedRow")
        var dataElement = Sheetsee.getMatches(gData, rowNumber, "rowNumber")
        var selectedSpot = Sheetsee.ich.selectedSpot({
            rows: dataElement
        })
        $('#instructions').css("display", "none")
        $('#selectedSpot').html(selectedSpot).css("display", "inline")
        var selectedCoords = [dataElement[0].lat, dataElement[0].long]
        map.setView(selectedCoords, 9)
    })


    // Add click listener to the markerLayer
    markerLayer.on('click', function(e) {
        // clear any selected rows
        $('.spotRow').removeClass("selectedRow")
        // get row number of selected marker
        var rowNumber = e.layer.feature.opts.rowNumber
        // find that row in the table and make consider it selected
        $('#' + rowNumber).addClass("selectedRow")
        // using row number, get the data for the selected spot
        var dataElement = Sheetsee.getMatches(gData, rowNumber.toString(), "rowNumber")
        // take those details and re-write the selected spot section
        var selectedSpot = Sheetsee.ich.selectedSpot({
            rows: dataElement
        })
        // center the map on the selected element
        map.panTo([dataElement[0].lat, dataElement[0].long])
        // update the spot listing
        $('#instructions').css("display", "none")
        $('#selectedSpot').html(selectedSpot).css("display", "inline")
    })


    // find total number of spots added
    var theNumberofSpots = Sheetsee.ich.theNumberofSpots({
        numberOfSpots: gData.length
    })
    $('#theNumberofSpots').html(theNumberofSpots)

    if(window.location.hash) {
        $('#tableFilter').val(window.location.hash.substring(1)).keyup()
        $('.spotRow').first().click()
    }
}

$(document).on('keyup', '#tableFilter', function() {
    window.location.hash = $(this).val()
    $('.spotRow').first().click()
})