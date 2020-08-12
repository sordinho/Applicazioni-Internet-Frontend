export class SnackbarMessage {
    message: string
    action: string

    constructor(message: string = '', action: string = undefined) {
        this.message = message
        this.action = action
    }

    toString(): string {
        return this.message + ' (action: ' + this.action + ')'
    }
}
