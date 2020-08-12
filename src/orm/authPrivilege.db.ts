import { Entity } from "../arc-hv/db/entity";
import { CModel, Model } from "../arc-hv/db/model";

export interface AuthPrivilege{
    id?: string;
    code?: string;
    date_added?: string;
    date_updated?: string;
    intitule?: string;
    description?: string | null;
    priorite?: number;
    activated?: boolean
}

class AuthPrivilegeEntity extends Entity<AuthPrivilege>{
    protected id?: string;
    protected code?: string;
    protected date_added?: string;
    protected date_updated?: string;
    protected intitule?: string;
    protected description?: string | null;
    protected priorite?: number;
    protected activated?: boolean;

    constructor (argsAuthPrivilege?: AuthPrivilege) {
        super();
        if(argsAuthPrivilege){
            this.id = argsAuthPrivilege.id;
            this.code = argsAuthPrivilege.code;
            this.date_added = argsAuthPrivilege.date_added;
            this.date_updated = argsAuthPrivilege.date_updated;
            this.intitule = argsAuthPrivilege.intitule;
            this.description = argsAuthPrivilege.description;
            this.priorite = argsAuthPrivilege.priorite;
            this.activated = argsAuthPrivilege.activated;
        }
    }

    Init (argsAuthPrivilege?: AuthPrivilege) {
        if(argsAuthPrivilege){
            this.id = argsAuthPrivilege.id;
            this.code = argsAuthPrivilege.code;
            this.date_added = argsAuthPrivilege.date_added;
            this.date_updated = argsAuthPrivilege.date_updated;
            this.intitule = argsAuthPrivilege.intitule;
            this.description = argsAuthPrivilege.description;
            this.priorite = argsAuthPrivilege.priorite;
            this.activated = argsAuthPrivilege.activated;
        }
        
        return this;
    }
    
    
    GetId (): string | undefined {
        return this.id;
    }
    SetId (id: string | undefined = undefined): void {
        this.id = id;
    }

    GetCode (): string | undefined {
        return this.code;
    }
    SetCode (code: string | undefined = undefined): void {
        this.code = code;
    }

    GetDate_added (): string | undefined {
        return this.date_added;
    }
    SetDate_added (date_added: string | undefined = undefined): void {
        this.date_added = date_added;
    }

    GetDate_updated (): string | undefined {
        return this.date_updated;
    }
    SetDate_updated (date_updated: string | undefined = undefined): void {
        this.date_updated = date_updated;
    }

    GetIntitule (): string | undefined {
        return this.intitule;
    }
    SetIntitule (intitule: string | undefined = undefined): void {
        this.intitule = intitule;
    }

    GetDescription (): string | null | undefined {
        return this.description;
    }
    SetDescription (description: string | null | undefined = undefined): void {
        this.description = description;
    }

    GetPriorite (): number | undefined {
        return this.priorite;
    }
    SetPriorite (priorite: number | undefined = undefined): void {
        this.priorite = priorite;
    }

    GetActivated (): boolean | undefined {
        return this.activated;
    }
    SetActivated (activated: boolean | undefined = undefined): void {
        this.activated = activated;
    }
}

@Model({
    table : "auth.privilege",
    nullable : ["description"],
    fillable : ["id","code","date_added","date_updated","intitule","description","priorite","activated"],
    hash_member : [],
    secure_member : [],
})
class AuthPrivilegeModel  extends CModel<AuthPrivilegeEntity, AuthPrivilege>
{
    constructor(EntityType: new (argsEntity?: AuthPrivilege | undefined) => AuthPrivilegeEntity){
        super(EntityType);
    }
}

export const authPrivilegeModel:AuthPrivilegeModel = new AuthPrivilegeModel(AuthPrivilegeEntity);