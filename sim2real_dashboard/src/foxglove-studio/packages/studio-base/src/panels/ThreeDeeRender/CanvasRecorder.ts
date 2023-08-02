// @ts-nocheck
import React from 'react'
import saveAs from 'file-saver'

interface CanvasRecorder {
    start: <T extends HTMLCanvasElement>(canvas: T) => void
    stop: () => void
}

/* eslint-disable */
const CanvasRecorder = (): CanvasRecorder => {
    const start = startRecording
    const stop = stopRecording
    let stream
    var recordedBlobs = []
    var supportedType = null
    var mediaRecorder = null
    let createdBlob = null

    function startRecording(canvas) {
        stream = canvas.captureStream(30) // 30 FPS
        let types = [
            'video/webm;codecs=avc1',
            'video/webm;codecs=vp9',
            'video/webm;codecs=vp8',
            'video/webm',
        ]
        for (let i in types) {
            if (MediaRecorder.isTypeSupported(types[i])) {
                supportedType = types[i]
                break
            }
        }
        console.log('Selected MediaRecorder type:', supportedType)
        if (supportedType == null) {
            console.log('No supported type found for MediaRecorder')
        }
        let options = {
            mimeType: supportedType,
            videoBitsPerSecond: 25e6, // 2.5Mbps
        }
        recordedBlobs = []
        try {
            mediaRecorder = new MediaRecorder(stream, options)
        } catch (e) {
            console.error('Exception while creating MediaRecorder:', e)
            alert('MediaRecorder is not supported by this browser.')
            return
        }
        mediaRecorder.onstop = handleStop
        mediaRecorder.ondataavailable = handleDataAvailable
        mediaRecorder.start() // collect 100ms of data blobs
    }
    function handleDataAvailable(event) {
        if (event.data && event.data.size > 0) {
            recordedBlobs.push(event.data)
        }
    }
    function handleStop(event) {
        createdBlob = new Blob(recordedBlobs, { type: supportedType })
        let formatter = Intl.DateTimeFormat('de-DE',
            {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }
        );

        download('recording_' + formatter.format(new Date()).replace(', ', '_').replaceAll(':', '.') + '.webm')
    }

    function stopRecording() {
        mediaRecorder.stop()
    }

    function download(file_name) {
        return new Promise((resolve, reject) => {
            if (!createdBlob) {
                reject('No blob created')
            }
            saveAs(createdBlob, file_name)
            resolve()
        });
    }
    return {
        start,
        stop
    }
}
export default CanvasRecorder()