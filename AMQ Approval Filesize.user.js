// ==UserScript==
// @name         AMQ Approval Filesize
// @version      0.2
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

function calculateFilesize() {
    var songInfoTable = getSongInfoTable()
    var bitrateRow = songInfoTable.children[0].children[7]
    var bitrate = bitrateRow.children[1].innerHTML.split(" ")[0]
    return (bitrate / 8 * getVideoPlayer().duration / 1024).toFixed(2)
}

function displayFilesize(filesize) {
    var filesizeInMegabytes = megabytesFrom(filesize)
    var songInfoTable = getSongInfoTable()
    var bitrateRow = songInfoTable.children[0].children[7]
    bitrateRow.children[1].innerHTML += " (Approx size: " + calculateFilesize() + "MB) (Real size: " + filesizeInMegabytes + "MB)"
}

// Bitrate
function megabytesFrom(bytes) {
    return (bytes / (1024 * 1024)).toFixed(2)
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
