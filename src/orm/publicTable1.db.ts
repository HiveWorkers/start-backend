import { Entity } from "../arc-hv/db/entity";
import { CModel, Model } from "../arc-hv/db/model";

export interface PublicTable1{
    id?: string;
    code?: string;
    date_added?: string;
    date_updated?: string;
    intitule?: string;
    description?: string | null;
    priorite?: number;
    activated?: boolean
}

class PublicTable1Entity extends Entity<PublicTable1>{
    protected id?: string;
    protected code?: string;
    protected date_added?: string;
    protected date_updated?: string;
    protected intitule?: string;
    protected description?: string | null;
    protected priorite?: number;
    protected activated?: boolean;

    constructor (argsPublicTable1?: PublicTable1) {
        super();
        if(argsPublicTable1){
            this.id = argsPublicTable1.id;
            this.code = argsPublicTable1.code;
            this.date_added = argsPublicTable1.date_added;
            this.date_updated = argsPublicTable1.date_updated;
            this.intitule = argsPublicTable1.intitule;
            this.description = argsPublicTable1.description;
            this.priorite = argsPublicTable1.priorite;
            this.activated = argsPublicTable1.activated;
        }
    }

    Init (argsPublicTable1?: PublicTable1) {
        if(argsPublicTable1){
            this.id = argsPublicTable1.id;
            this.code = argsPublicTable1.code;
            this.date_added = argsPublicTable1.date_added;
            this.date_updated = argsPublicTable1.date_updated;
            this.intitule = argsPublicTable1.intitule;
            this.description = argsPublicTable1.description;
            this.priorite = argsPublicTable1.priorite;
            this.activated = argsPublicTable1.activated;
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
    table : "public.table1",
    nullable : ["description"],
    fillable : ["id","code","date_added","date_updated","intitule","description","priorite","activated"],
    hash_member : [],
    secure_member : [],
})
class PublicTable1Model  extends CModel<PublicTable1Entity, PublicTable1>
{
    constructor(EntityType: new (argsEntity?: PublicTable1 | undefined) => PublicTable1Entity){
        super(EntityType);
    }
}

export const publicTable1Model:PublicTable1Model = new PublicTable1Model(PublicTable1Entity);