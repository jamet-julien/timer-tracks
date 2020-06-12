const CURRENT_DEFAULT = {
    name: null,
    progress: null,
    start: Number.MAX_SAFE_INTEGER,
    duration: Infinity
};

const prepareTrack = (start, { name, duration = Infinity }, index) => ({
    index,
    name,
    duration,
    progress: 0,
    start,
    end: start + duration
});

const computeToTrackTreat = (tracks, timeStart, startIndex) =>
    tracks.reduce(
        (g, track, i) => [
            [...g[0], prepareTrack(g[1], track, startIndex + i)],
            g[1] + track.duration
        ],
        [[], timeStart]
    )[0];

const TimerTracks = (tracks = []) => {
    let index = 0;
    let startTime = null;
    let tracksTreat = null;

    function prepareJump() {
        tracksTreat = null;
        startTime = null;
    }

    function shortenTrackTreat(position) {
        tracksTreat = tracksTreat.slice(position);
    }

    function launchTrigger(oldIndex = null, newIndex = null, jump) {
        let diff = Math.abs(oldIndex - newIndex);

        if (oldIndex == newIndex) return;

        if (diff > 1 && !jump) {
            for (let i = 0; i < diff; i++) {
                launchTrigger(oldIndex + i, oldIndex + (i + 1), false);
            }
        }

        oldIndex = !jump && newIndex == null ? tracks.length - 1 : oldIndex;

        tracks[oldIndex]?.onLeave && tracks[oldIndex].onLeave();
        tracks[newIndex]?.onEnter && tracks[newIndex].onEnter();
    }

    return {
        current: CURRENT_DEFAULT,
        goTo: function (targetName) {
            index = tracks.findIndex(({ name }) => name === targetName);
            prepareJump();

            index = index < 0 ? tracks.length : index;
        },
        prev: function () {
            index = Math.max(0, index - 1);
            prepareJump();
        },

        next: function () {
            index = Math.min(tracks.length, index + 1);
            prepareJump();
        },
        update: function (accExt) {
            let progress, nextCurrent, position;

            startTime = startTime ?? accExt;
            const hasJumped = !(accExt - startTime);

            tracksTreat =
                tracksTreat ??
                computeToTrackTreat(tracks.slice(index), startTime, index);

            position = tracksTreat.findIndex(({ end }) => end > accExt);
            nextCurrent = tracksTreat[position] || CURRENT_DEFAULT;

            progress = (accExt - nextCurrent.start) / nextCurrent.duration;
            nextCurrent.progress = Math.max(0, progress);

            nextCurrent.index && shortenTrackTreat(position);

            launchTrigger(this.current.index, nextCurrent.index, hasJumped);

            index = nextCurrent.index;
            this.current = nextCurrent;
        }
    };
};

export default TimerTracks;
export { TimerTracks };
