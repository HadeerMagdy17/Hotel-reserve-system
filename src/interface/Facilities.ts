export interface IFacility{
    _id:string;
    name:string;
    createdBy:{
        _id:string;
        userName:string;
    };
    createdAt:string;
    updatedAt:string;
}

export interface IFacilitiesResponse{
    facilities:IFacility[];
    totalCount:number;
}