export class CustomError extends Error {
    code: string | number;
    status: number = 500;
    value: string | undefined = undefined;
    true_value: string | undefined = undefined;
    alert: 'warning' | 'danger' | 'success' | undefined = 'danger';
    author: string | undefined = undefined;

    constructor(
        error: any
    ) {
        super((error.message) ? error.message : 'unexpected error');

        this.code = (error.code) ? error.code : undefined;
        this.init(error);
    }
    protected init(error: any) {
        this.code = (error.code) ? error.code : undefined;
        this.name = (error.name) ? error.name : this.value;
        this.message = (error.message) ? error.message : this.message;
        this.true_value = (error.message) ? error.message : this.message;
        this.stack = (error.stack) ? error.stack : this.stack;
        this.status = (error.status) ? error.status : this.status;
        this.alert = (error.alert) ? error.alert : this.alert;
        this.value = (error.value) ? error.value : this.value;
        this.author = (error.author) ? error.author : undefined;
    }
}