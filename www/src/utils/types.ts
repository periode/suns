//--------
//-- enums
//--------
export enum ENTRYPOINT_STATUS {
    EntrypointPending = "pending",
    EntrypointCompleted = "completed",
    EntrypointOpen = "open",
}

export enum PARTNER_STATUS {
    PartnerNone = "none",
    PartnerPartial = "partial",
    PartnerFull = "full",
}

//--------
//-- types
//--------
export interface ICluster {
    uuid: string,
    name: string,
    entrypoints: Array<IEntrypoint>
}

export interface IEntrypoint {
    uuid: string,
    name: string,
    status: ENTRYPOINT_STATUS,
    content: String,
    current_module: number,
    status_module: string,
    modules: Array<IModule>,
    users: Array<IUser>
    max_users: number,
    user_completed: Array<number>,
    partner_status: PARTNER_STATUS,
    lat: number,
    lng: number
}

export interface IUpload {
    user_uuid: string,
    url: string,
}

export interface IModule {
    ID: string,
    uuid: String,
    name: String,
    content: String,
    type: String,
    uploads: Array<IUpload>,
    status: string,
    media: {
        type: string,
        url: string,
    }
}

export interface IUser {
    name: string,
    uuid: string,
}

export interface ISession {
    token: string,
    user: IUser
}