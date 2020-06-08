const CURRENT_DEFAULT = {
    name: null,
    progress: null,
    start: Number.MAX_SAFE_INTEGER,
    duration: Infinity
};

const prepareTrack = (start, { name, duration = Infinity }) => ({
    name,
    duration,
    progress: 0,
    start,
    end: start + duration
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

    function setInitCurrent(index) {
        tracksTreat = null;
        this.current = tracks[index] || CURRENT_DEFAULT;
        this.current.progress = 0;
    }

    function updateTrackTreat(index) {
        tracksTreat = tracksTreat.slice(index);
    }

    return {
        current: CURRENT_DEFAULT,
        goTo: function (targetName) {
            index = tracks.findIndex(({ name }) => name === targetName);
            setInitCurrent.call(this, index);

            index = index < 0 ? tracks.length : index;
        },
        prev: function () {
            index = Math.max(0, index - 1);
            setInitCurrent.call(this, index);
        },

        next: function () {
            index = Math.min(tracks.length, index + 1);
            setInitCurrent.call(this, index);
        },
        update: function (accExt) {
            let progress, indexTreat, current;

            tracksTreat =
                tracksTreat ?? initializeTracks(tracks.slice(index), accExt);

            indexTreat = tracksTreat.findIndex(({ end }) => end > accExt);

            current = tracksTreat[indexTreat] || CURRENT_DEFAULT;
            progress = (accExt - current.start) / current.duration;
            current.progress = Math.max(0, progress);

            indexTreat && updateTrackTreat(indexTreat);

            while (indexTreat > 0) {
                indexTreat--;

                tracks[index]?.onLeave && tracks[index].onLeave();
                index++;
                tracks[index]?.onEnter && tracks[index].onEnter();
            }

            this.current = current;
        }
    };
};

export default TimerTracks;
export { TimerTracks };
