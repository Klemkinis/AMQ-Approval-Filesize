// ==UserScript==
// @name         AMQ Approval Filesize
// @version      0.2
// @match        https://animemusicquiz.com/admin/approveVideos
// @match        https://animemusicquiz.com/admin/approveVideos?skipMp3=true
// ==/UserScript==

var corsProxy = "https://cors-anywhere.herokuapp.com/"

var filesize = 0
var mediaDuration = 0
var songLink = getSongLink()

checkFilesize(songLink)
checkMediaDuration()

function checkFilesize(link) {
    var request = new XMLHttpRequest()
    request.onreadystatechange = function() {
        if (this.readyState != 4 || this.status != 200) {
            return
        }

        filesize = this.getResponseHeader('Content-Length')
        displayFilesize()
    }

    request.open("HEAD", corsProxy + link, true)
    request.send()
}

function checkMediaDuration() {
    var videoPlayer = getVideoPlayer()
    if (isNaN(videoPlayer.duration)) {
        setTimeout(checkMediaDuration, 1000)
        return
    }

    mediaDuration = videoPlayer.duration
    displayFilesize()
}

function displayFilesize() {
    if (mediaDuration == 0 || filesize == 0) {
        return
    }

    var filesizeInMegabytes = megabytesFrom(filesize)
    var bitrate = filesize / mediaDuration
    var bitrateInKilobits = kilobitsFrom(bitrate)

    var songInfoTable = getSongInfoTable()
    var filesizeRow = songInfoTable.insertRow()

    filesizeRow.insertCell(0).innerHTML = "Size"
	filesizeRow.insertCell(1).innerHTML = filesizeInMegabytes + " MB (Approx bitrate: " + bitrateInKilobits + " kb/s)"
}

// Bitrate
function megabytesFrom(bytes) {
    return (bytes / (1024 * 1024)).toFixed(2)
}

function kilobitsFrom(bytes) {
    return (bytes * 8 / (1024)).toFixed(2)
}

// Unwrapping helpers
function getSongLink() {
    var videoPlayer = getVideoPlayer()
    return videoPlayer.src
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
