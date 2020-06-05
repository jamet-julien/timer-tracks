const CURRENT_DEFAULT = {
    name: null,
    progress: null,
    start: Number.MAX_SAFE_INTEGER,
    duration: Number.MAX_SAFE_INTEGER
};

const prepareTrack = (start, track) => ({ ...track, progress: 0, start });

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
            index = tracks.findIndex(({ name }) => name === targetName);
            this.current = tracksTreat[index] || CURRENT_DEFAULT;
            this.current.progress = 0;
            tracksTreat = null;
        },
        update: function (accExt = 0) {
            let progress = -1;
            tracksTreat =
                tracksTreat !== null
                    ? tracksTreat
                    : initializeTracks(
                          tracks.slice(index, tracks.length),
                          accExt
                      );

            index = tracksTreat.findIndex(({ start }) => start > accExt) - 1;
            this.current = tracksTreat[index] || CURRENT_DEFAULT;
            progress = (accExt - this.current.start) / this.current.duration;

            this.current.progress = Math.max(0, progress);
        }
    };
};

export default TimerTracks;
export { TimerTracks };
