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

    Sheetsee.makeTable(tableOptions)
    Sheetsee.initiateTableFilter(tableOptions)

    // geoJSON 
    var optionsJSON = ["company","logo", "alumni","year", "city", "rowNumber"]
    var geoJSON = Sheetsee.createGeoJSON(gData, optionsJSON)

    var map = Sheetsee.loadMap("map")
    Sheetsee.addTileLayer(map, 'jllord.n7aml2bc')
    var markerLayer = Sheetsee.addMarkerLayer(geoJSON, map, "<h2 id='{{company}}'>{{ company }}</h2>", true)

    $('#details').css("display", "inline")
    $('.spotRow').live("click", function(event) {
        $('.spotRow').removeClass("selectedRow")
        var rowNumber = $(this).closest("tr").attr("id")
        $('#' + rowNumber).addClass("selectedRow")
        var dataElement = Sheetsee.getMatches(gData, rowNumber, "rowNumber")
        var selectedSpot = Sheetsee.ich.selectedSpot({
            rows: dataElement
        })
        $('#details').css("display", "none")
        $('#selectedSpot').html(selectedSpot).css("display", "inline")
        var selectedCoords = [dataElement[0].lat, dataElement[0].long]
        map.setView(selectedCoords, 9)
        $('html, body').animate({scrollTop:0}, 'slow');
    })


    markerLayer.on('click', function(e) {
        $('.spotRow').removeClass("selectedRow")

        var rowNumber = e.layer.feature.opts.rowNumber

        $('#' + rowNumber).addClass("selectedRow")
        var dataElement = Sheetsee.getMatches(gData, rowNumber.toString(), "rowNumber")
        var selectedSpot = Sheetsee.ich.selectedSpot({
            rows: dataElement
        })

        map.panTo([dataElement[0].lat, dataElement[0].long])

        $('#details').css("display", "none")
        $('#selectedSpot').html(selectedSpot).css("display", "inline")
    })


    var thestartupCount = Sheetsee.ich.thestartupCount({
        startupCount: gData.length
    })

    $('#randomButton').live("click", function(event) {
        var ranStartup = findRandomStartup(gData)
        var theranStartup = Sheetsee.ich.selectedSpot({
            rows: ranStartup
        })
        $('#details').css("display", "none")
        $('#selectedSpot').html(theranStartup).css("display", "inline")
        map.setView([ranStartup.lat, ranStartup.long], 9)
        document.getElementById("{{company}}").click();

        function findRandomStartup(data) {
            var ranNum = Math.floor(Math.random() * (data.length - 0 + 1)) + 0;
            return data[ranNum]
        }
        
    })
    map.setView([39.8283,-98.5795], 3)

    $('#thestartupCount').html(thestartupCount)

    if(window.location.hash) {
        $('#tableFilter').val(window.location.hash.substring(1)).keyup()
        $('.spotRow').first().click()
    }
}

$(document).on('keyup', '#tableFilter', function() {
    window.location.hash = $(this).val()
    $('.spotRow').first().click()
})