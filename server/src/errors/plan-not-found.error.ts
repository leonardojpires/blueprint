class PlanNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "PlanNotFoundError";

        Object.setPrototypeOf(this, PlanNotFoundError.prototype);
    }
}

export default PlanNotFoundError;
