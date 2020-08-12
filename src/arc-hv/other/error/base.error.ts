import * as appConfigFile from '../../../../AppConfig.json';
import { CustomError } from './custom.error';

export interface CustomBaseError{
    AUTH_no_authorization : {
        En?: string | null;
        Fr?: string | null;
    };
    CSTM_no_data_found : {
        En?: string | null;
        Fr?: string | null;
    };
    CSTM_no_target : {
        En?: string | null;
        Fr?: string | null;
    };
    CSTM_no_element_parent : {
        En?: string | null;
        Fr?: string | null;
    };
    CSTM_no_server_access : {
        En?: string | null;
        Fr?: string | null;
    };
    CSTM_no_user_permission : {
        En?: string | null;
        Fr?: string | null;
    };
    good : {
        En?: string | null;
        Fr?: string | null;
    };
    unique_violation : {
        En?: string | null;
        Fr?: string | null;
    };
    not_null_violation : {
        En?: string | null;
        Fr?: string | null;
    };
    check_violation : {
        En?: string | null;
        Fr?: string | null;
    };
    exclusion_violation : {
        En?: string | null;
        Fr?: string | null;
    };
    fk_violation : {
        En?: string | null;
        Fr?: string | null;
    };
    restrict_violation : {
        En?: string | null;
        Fr?: string | null;
    };
    integrity_constraint_violation : {
        En?: string | null;
        Fr?: string | null;
    };
    string_data_right_truncation : {
        En?: string | null;
        Fr?: string | null;
    };
    no_data_found : {
        En?: string | null;
        Fr?: string | null;
    };
    unknown : {
        En?: string | null;
        Fr?: string | null;
    };
}

export class BaseError extends CustomError {
    private values: any;

    lang: 'Fr' | 'En' = 'Fr';

    constructor(err: any) {
        super(err);
        this.values = this.InitValues();
        super.init(this.CustomError(err, true));
    }

    public init(err: any) {
        super.init(this.CustomError(err, true));
    }
    
    private InitValues() {
        const result = {
            AUTH_no_authorization: {
                En: 'Access denied',
                Fr: `Accès rejeté`,
            },
            CSTM_no_data_found: {
                En: 'the data does not exist',
                Fr: '',
            },
            CSTM_no_target: {
                En: `No target for action`
            },
            CSTM_no_element_parent: {
                En: `one of the parent elements does not exist`
            },
            CSTM_no_server_access: {
                En: `Access to server rejected`
            },
            CSTM_no_user_permission: {
                En: `Access rejected`
            },
            good: {
                En: 'no downside'
            },
            no_data_found: {
                En: 'the data does not exist'
            },
            unique_violation: {
                En: 'the data already exists'
            },
            not_null_violation: {
                En: 'one of the properties is empty'
            },
            check_violation: {
                En: 'the condition on one of the properties was not respected'
            },
            exclusion_violation: {
                En: 'exclusion violation'
            },
            fk_violation: {
                En: 'the element is related to others. Please delete the link first.'
            },
            restrict_violation : {
                En: 'restrict violation'
            },
            integrity_constraint_violation: {
                En: 'integrity constraint violation'
            },
            string_data_right_truncation: {
                En: 'string data right truncation'
            },
            unknown: {
                En: 'unexpected error'
            }
        };
        return result;
    }
    SetValues(values: CustomBaseError): void{
        this.values = values;
    }

    private CustomError(err: any, sqlErr = true): CustomError {
        //console.log('>>>> BaseError - Message');
        this.values = this.InitValues();
        //console.log("this.values:: ");
        //console.log(this.values);
        //console.log(`err.code:: <${err.code}>`);
        //console.log(`err.name:: <${err.name}>`);
        //console.log(`err.message:: <${err.message}>`);
        let result = `No option for error`;
        let status: number = 500;
        let alert: 'warning' | 'danger' | 'success' = 'danger';
        if (Object.keys(err).length>0) {
            if(!sqlErr){
                result = this.values.unknown[this.lang] || 'unexpected error';
            } else {
                if(!err.code) {
                    result = err.message || this.values.unknown[this.lang] || 'unexpected error';
                } else if(
                    this.values &&
                    Object.keys(this.values).length >0 &&
                    Object.keys(this.values).includes(err.code)
                ) {
                    const code: string = err.code as string;
                    result = (
                        this.values[code]
                    )[this.lang] ||
                    'unexpected error';
                } else if (appConfigFile.database.connexion == 'pgsql') {
                    if (err.code == 23505){
                        result = this.values.unique_violation[this.lang]
                        || this.values.unknown[this.lang]
                        || 'unexpected error';
                    } else if (err.code == 23502){
                        console.log('------> ICI <------');
                        result = this.values.not_null_violation[this.lang]
                        || this.values.unknown[this.lang]
                        || 'unexpected error';
                        status = 411;
                        alert = 'warning';
                    } else if (err.code == 23514){
                        result = this.values.check_violation[this.lang]
                        || this.values.unknown[this.lang]
                        || 'unexpected error';
                    } else if (err.code == '23P01'){
                        result = this.values.exclusion_violation[this.lang]
                        || this.values.unknown[this.lang]
                        || 'unexpected error';
                    } else if (err.code == 23503){
                        result = this.values.fk_violation[this.lang]
                        || this.values.unknown[this.lang]
                        || 'unexpected error';
                    } else if (err.code == 23001){
                        result = this.values.restrict_violation[this.lang]
                        || this.values.unknown[this.lang]
                        || 'unexpected error';
                    } else if (err.code == 23000){
                        result = this.values.integrity_constraint_violation[this.lang]
                        || this.values.unknown[this.lang]
                        || 'unexpected error';
                    } else if (err.code == '01004'){
                        result = this.values.string_data_right_truncation[this.lang]
                        || this.values.unknown[this.lang]
                        || 'unexpected error';
                    } else if (err.code == 'P0002'){
                        result = this.values.no_data_found[this.lang]
                        || this.values.unknown[this.lang]
                        || 'unexpected error';
                    } else {
                        result = this.values.unknown[this.lang]
                        || 'unexpected error';
                    }
                } else {
                    //console.log('ICI');
                    result = this.values.unknown[this.lang] || 'unexpected error';
                }
            }
        } else {
            result = this.values.unknown[this.lang] || 'unexpected error';
        }
        //console.log(result);
        err.value = result;
        err.status = status;
        err.alert = alert;
        const finalError = new CustomError(err);
        return finalError;
    }
}
