// ==UserScript==
// @name         AMQ Approval Filesize
// @version      0.4
// @match        https://animemusicquiz.com/admin/approveVideos
// @match        https://animemusicquiz.com/admin/approveVideos?skipMp3=true
// ==/UserScript==

var bitrate = getBitrate()
calculateFilesize()

function calculateFilesize() {
    var videoPlayer = getVideoPlayer()
    if (isNaN(videoPlayer.duration)) {
        setTimeout(calculateFilesize, 1000)
        return
    }
    var mediaDuration = videoPlayer.duration
    var filesizeInKilobytes = bitrate / 8 * mediaDuration
    var filesizeInMegabytes = megabytesFrom(filesizeInKilobytes)
    displayFilesize(filesizeInMegabytes)
}

function displayFilesize(filesize) {
    var bitrateCell = getBitrateCell()
    bitrateCell.innerHTML += " (Approx size: " + filesize + "MB)"
}

// Bitrate
function megabytesFrom(kilobytes) {
    return (kilobytes / 1024).toFixed(2)
}

// Unwrapping helpers
function getBitrate() {
    var bitrateCell = getBitrateCell()
    var bitrate = bitrateCell.innerHTML.split(" ")[0]
    return bitrate
}

function getBitrateCell() {
    var songInfoTable = getSongInfoTable()
    var songInfoTableBody = songInfoTable.children[0]
    if (songInfoTableBody == null) {
        throw "Missing song info table data!"
    }

    var bitrateRow = songInfoTableBody.children[8]
    if (bitrateRow == null) {
        throw "Missing bitrate in song info table!"
    }

    var bitrateCell = bitrateRow.children[1]
    if (bitrateCell == null) {
        throw "Missing bitrate value in song info table!"
    }

    return bitrateCell
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
