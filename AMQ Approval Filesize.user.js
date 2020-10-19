// ==UserScript==
// @name         AMQ Approval Filesize
// @version      0.1
// @match        https://animemusicquiz.com/admin/approveVideos
// @match        https://animemusicquiz.com/admin/approveVideos?skipMp3=true
// ==/UserScript==

var corsProxy = "https://cors-anywhere.herokuapp.com/"
var songLink = getSongLink()
checkFilesize(songLink)

function checkFilesize(link) {
    var request = new XMLHttpRequest()
    request.onreadystatechange = function() {
        if (this.readyState != 4 || this.status != 200) {
            return
        }

        var filesize = this.getResponseHeader('Content-Length')
        displayFilesize(filesize)
    }

    request.open("HEAD", corsProxy + link, true)
    request.send()
}

function displayFilesize(filesize) {

    var filesizeInMegabytes = megabytesFrom(filesize)
    var bitrate = approximateBitrateFrom(filesize)
    var bitrateInKilobits = kilobitsFrom(bitrate)

    var songInfoTable = getSongInfoTable()
    var filesizeRow = songInfoTable.insertRow()

    filesizeRow.insertCell(0).innerHTML = "Size"
	filesizeRow.insertCell(1).innerHTML = filesizeInMegabytes + " MB (Approx bitrate: " + bitrateInKilobits + " kb/s)"
}

// Bitrate
function approximateBitrateFrom(filesize) {
    var videoPlayer = getVideoPlayer()
    var mediaLength = videoPlayer.duration
    return filesize / mediaLength
}

function megabytesFrom(bytes) {
    return (bytes / (1024 * 1024)).toFixed(2)
}

function kilobitsFrom(bytes) {
    return (bytes * 8 / (1024)).toFixed(2)
}

// Unwrapping helpers
function getSongLink() {
    var songInfoTable = getSongInfoTable()
    var songLink = songInfoTable.children[0].children[4].children[1].innerText // FIXME: still crashess
    if (songLink == null) {
        throw "Could not get song link from info table!"
    }
    return songInfoTable.children[0].children[4].children[1].innerText
}

function getSongInfoTable() {
    var songInfoTable = document.getElementsByClassName('table')[0]
    if (songInfoTable == null) {
        throw "Song info table is missing!"
    }
    return songInfoTable
}

function getVideoPlayer() {
    var videoPlayer = document.getElementById("avVideo")
    if (videoPlayer == null) {
        throw "Video player is missing or not loaded"
    }
    return videoPlayer
}
