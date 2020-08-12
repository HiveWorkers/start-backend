import * as NodeCache from 'node-cache';

export class FileStorage {
    private stdTTL: number = 0;
    private checkPeriod: number = 600;
    private useClones: boolean = true;
    private deleteOnExpire: boolean = true;
    private enableLegacyCallbacks: boolean = false;
    private maxKeys: number = -1;
    private myCache: NodeCache;
    constructor(
        stdTTL: number = 0,
        checkPeriod: number = 600,
        useClones: boolean = true,
        deleteOnExpire: boolean = true,
        enableLegacyCallbacks: boolean = false,
        maxKeys: number = -1
    ) {
        this.stdTTL = stdTTL;
        this.checkPeriod = checkPeriod;
        this.useClones = useClones;
        this.deleteOnExpire = deleteOnExpire;
        this.enableLegacyCallbacks = enableLegacyCallbacks;
        this.maxKeys = maxKeys;

        this.myCache = new NodeCache({
            stdTTL : this.stdTTL,
            checkperiod: this.checkPeriod as number,
            useClones : this.useClones,
            deleteOnExpire : this.deleteOnExpire,
            enableLegacyCallbacks : this.enableLegacyCallbacks,
            maxKeys : this.maxKeys
        });
    }

    Get(key: string){
        return this.myCache.get(key);
    }
    MGet(key: Array<any>){//[...]
        return this.myCache.mget(key);
    }
    Set(key: string, val: any, ttl = this.stdTTL){
        this.myCache.set(key, val, ttl);
    }
    MSet(arrayCache: Array<any>){//[{...}, {...}]
        this.myCache.mset(arrayCache);
    }
    Del(keys: any){//[...] || '...'
        this.myCache.del(keys);
    }
    Has(key: string){
        return this.myCache.has(key);
    }
}