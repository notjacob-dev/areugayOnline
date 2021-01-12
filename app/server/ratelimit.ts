export class Ratelimit {
    private count: number
    private readonly ms: number
    constructor(count: number, ms: number) {
        this.count = count
        this.ms = ms
    }
    public get getCount() {
        return this.count
    }
    public get getMs() {
        return this.ms 
    }
    public add() {
        this.count++
    }
}