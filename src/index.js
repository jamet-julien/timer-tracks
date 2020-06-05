const CURRENT_DEFAULT = {
    name: null,
    progress: null,
    start: Number.MAX_SAFE_INTEGER,
    duration: Number.MAX_SAFE_INTEGER
};

const prepareTrack = (start, track) => ({
    ...track,
    progress: 0,
    start,
    end: start + track.duration
});

const initializeTracks = (tracks, timeStart) =>
    tracks.reduce(
        (g, track) => [
            [...g[0], prepareTrack(g[1], track)],
            g[1] + track.duration
        ],
        [[], timeStart]
    )[0];

const TimerTracks = (tracks = []) => {
    let index = 0;
    let tracksTreat = null;

    return {
        current: CURRENT_DEFAULT,
        goTo: function (targetName) {
            tracksTreat = null;
            index = tracks.findIndex(({ name }) => name === targetName);

            this.current = tracks[index] || CURRENT_DEFAULT;
            this.current.progress = 0;

            index = index < 0 ? tracks.length : index;
        },
        update: function (accExt) {
            let progress;

            tracksTreat =
                tracksTreat ?? initializeTracks(tracks.slice(index), accExt);

            index = tracksTreat.findIndex(({ end }) => end > accExt);
            this.current = tracksTreat[index] || CURRENT_DEFAULT;

            progress = (accExt - this.current.start) / this.current.duration;
            this.current.progress = Math.max(0, progress);
        }
    };
};

export default TimerTracks;
export { TimerTracks };
