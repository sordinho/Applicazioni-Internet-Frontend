export class SnackbarMessage {
    message: string
    action: string
    actionFunction: () => void

    constructor(message: string = '', action: string = undefined, actionFunction: () => void = undefined) {
        this.message = message
        this.action = action
        this.actionFunction = actionFunction
    }

    toString(): string {
        return this.message + ' (action: ' + this.action + ')'
    }
}
