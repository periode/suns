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
    partner_status: PARTNER_STATUS
}

export interface IModule {
    uuid: String,
    name: String,
    content: String,
    type: String,
    media: Object,
    uploads: Array<Object>,
    status: string,
}

export interface IUser {
    name: string,
    uuid: string,
}

export interface ISession {
    token: string,
    user: IUser
}