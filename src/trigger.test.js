import TimerTracks from "./index";

describe("onLeave / onEnter", () => {
    it("onLeave() / onEnter() on born should be called", () => {
        const onEnter_1 = jest.fn();
        const onLeave_1 = jest.fn();

        const onEnter_2 = jest.fn();
        const onLeave_2 = jest.fn();

        const tracks = [
            {
                name: "start",
                duration: 10,
                onEnter: onEnter_1,
                onLeave: onLeave_1
            },
            {
                name: "end",
                duration: 10,
                onEnter: onEnter_2,
                onLeave: onLeave_2
            }
        ];

        const timerTracks = TimerTracks(tracks);

        timerTracks.update(0);
        expect(timerTracks.current.name).toBe("start");
        expect(onEnter_1).toHaveBeenCalledTimes(1); // ok

        timerTracks.update(25);
        expect(timerTracks.current.name).toBe(null);
        expect(onLeave_2).toHaveBeenCalledTimes(1); // ok
    });

    it("onLeave() and onEnter() should be called on update changed", () => {
        const onEnter_1 = jest.fn();
        const onLeave_1 = jest.fn();

        const onEnter_2 = jest.fn();
        const onLeave_2 = jest.fn();

        const tracks = [
            { name: "intro", duration: 10 },
            {
                name: "start",
                duration: 10,
                onEnter: onEnter_1,
                onLeave: onLeave_1
            },
            {
                name: "end",
                duration: 10,
                onEnter: onEnter_2,
                onLeave: onLeave_2
            },
            { name: "outro", duration: 10 }
        ];

        const timerTracks = TimerTracks(tracks);

        timerTracks.update(0); //intro
        timerTracks.update(5); //intro

        // intro ~ start
        timerTracks.update(15); //start
        expect(timerTracks.current.name).toBe("start");
        expect(onEnter_1).toHaveBeenCalledTimes(1); // ok

        // start ~ end
        timerTracks.update(25);
        expect(timerTracks.current.name).toBe("end");
        expect(onLeave_1).toHaveBeenCalledTimes(1); // ok
        expect(onEnter_2).toHaveBeenCalledTimes(1); // ok

        //never
        expect(onLeave_2).toHaveBeenCalledTimes(0);
    });
});
