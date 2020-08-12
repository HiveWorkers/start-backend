import { FileStorage } from "./file.storage";


export class SessionStorage extends FileStorage {
    constructor(
        useClones = true,
        deleteOnExpire = true,
        enableLegacyCallbacks = false,
        maxKeys = -1
    ) {
        var stdTTL = 180;
        var checkPeriod = 180;
        super(stdTTL,checkPeriod,useClones,deleteOnExpire,enableLegacyCallbacks,maxKeys);
    } 
}